import AccountModel from './../models/AccountModel.js';
import Modal from './../utils/Modal.js';
import utils from './../utils/utils.js';
import View from './View.js';

export default class MyAccountView extends View {
	/**
	 * Loads the template upon initialization
	 * 
	 * @override
	 */
	constructor() {
		super();

		this.id 			= 'my_account';			// ID name of the element to render in to
		this.viewName 		= 'MyAccountView';
		this.templateID 	= `${this.id}_tmpl`;	// Use this if the template is already on the page
		this.templateName 	= this.id;				// Use this to load the template file
		this.model 			= new AccountModel();
		this.isProcessing 	= false
		this.events 		= {
			'click .btn-edit': 'onEditClick',
			'click .btn-change-password': 'onChangePasswordClick',
			'click .btn-delete': 'onDeleteClick'
		}

		this.model.setSuccessListener(this.showAccount.bind(this));
		this.model.setErrorListener(this.showError.bind(this));
		this.model.setDeleteListener(this.handleDelete.bind(this));

		super.init();
	}

	/**
	 * Renders the template on to the page
	 * 
	 * @override
	 * @returns {View}
	 */
	render() {
		super.render();

		// Lazy-load the template
		this.loadTemplate(function (success) {
			if (success) {
				this.addViewToDOM();

				// Set the selected tab
				App.setSelectedTab('my-account');

				if (this.isViewEmpty) {
					this.populateView();
				}
			}
		}.bind(this));

		return this;
	}

	/**
	 * 
	 */
	populateView() {
		utils.addLoadingIcon($('.account_details', this.$el));
		this.model.fetchAccount(App.user.id);
	}

	/**
	 * 
	 * @param {JSON} account 
	 */
	showAccount(account) {
		utils.removeLoadingIcon($('.account_details', this.$el));

		// Get the account details template
		const template = this.templateManager.getTemplate('partials/account_details.html');
		$('.account_details', this.$el).append(_.template(template)({ account: account.data }));
	}

	/**
	 * 
	 * @param {string} message 
	 */
	showError(message) {
		utils.removeLoadingIcon($('.account_details', this.$el));

		const $el = $('.error', this.$el);
		$el.html(message).show();
		setTimeout(() => {
			$el.hide();
		}, 5000);
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	onEditClick(e) {
		e.preventDefault();

		this.router.navigate('my-account/edit-profile');
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	onChangePasswordClick(e) {
		e.preventDefault();

		this.router.navigate('my-account/change-password');
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	onDeleteClick(e) {
		e.preventDefault();
		const _this = this;

		if (this.isProcessing) return;
		this.isProcessing = true;

		utils.addLoadingIcon($('.account_details', this.$el));

		const modal = new Modal();
		const modalId = 'modal_delete_account';
		modal.show(modalId, { class: 'info', title: "Delete My Account", body: '<p>Deleting your account cannot be undone and you will no longer be able to log back in.</p><p><strong>Are you sure you wish to continue?</strong></p>', closeButton: true, actionButtonText: 'Delete' });
		
		// Capture modal close event
		$(`#${modalId}`).on('hidden.bs.modal', (e) => {
			_this.isProcessing = false;
			utils.removeLoadingIcon($('.account_details', _this.$el));
		});

		// Capture modal primary button click event
		$(`#${modalId} .btn-primary`).on('click', (e) => {
			_this.model.deleteAccount(App.user.id);
			modal.hide(modalId);
		});
	}

	/**
	 * 
	 * @param {boolean} success 
	 */
	handleDelete(success) {
		if (success) {
			App.logout();
		} else {
			this.showError('Unable to delete your account, please try again shortly.');
		}
	}
};