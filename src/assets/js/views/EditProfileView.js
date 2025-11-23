import EditProfileModel from './../models/EditProfileModel.js';
import Modal from './../utils/Modal.js';
import utils from './../utils/utils.js';
import validators from './../utils/validators.js';
import View from './View.js';

export default class EditProfileView extends View {
	/**
	 * Loads the template upon initialization
	 * 
	 * @override
	 */
	constructor() {
		super();

		this.id 			= 'edit_profile';		// ID name of the element to render in to
		this.viewName 		= 'EditProfileView';
		this.templateID 	= `${this.id}_tmpl`;	// Use this if the template is already on the page
		this.templateName 	= this.id;				// Use this to load the template file
		this.events 		= {
			'onSubmit .edit-form': 'onEditFormSubmit',
			'click .btn-submit': 'onEditFormSubmit'
		}
		this.model 			= new EditProfileModel();
		this.isProcessing 	= false;

		this.model.setSuccessListener(this.showAccount.bind(this));
		this.model.setErrorListener(this.showError.bind(this));
		this.model.setEditListener(this.handleEdit.bind(this));

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
		this.addBackButton('my-account');
	}

	/**
	 * 
	 * @param {JSON} account 
	 */
	showAccount(account) {
		utils.removeLoadingIcon($('.account_details', this.$el));

		// Get the account details template
		const template = this.templateManager.getTemplate('partials/edit_profile.html');
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

		this.router.navigate('account/my-account/edit-profile');
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	onEditClick(e) {
		e.preventDefault();
		const _this = this;

		if (this.isProcessing) return;
		this.isProcessing = true;

		utils.addLoadingIcon($('.account_details', this.$el));

		const modal 	= new Modal();
		const modalId 	= 'modal_delete_account';
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
	handleEdit(success) {
		this.isProcessing = false;

		if (success) {
			this.showError('Profile updated successfully!');
		} else {
			this.showError('Unable to update your profile, please try again shortly.');
		}
	}

	/**
	 * Gets the form input, validates it, then calls the editProfile method
	 */
	onEditFormSubmit(e) {
		e.preventDefault();

		if (this.isProcessing) return;
		this.isProcessing = true;

		const form 		= $('.edit-form', this.$el);
		const formData 	= new FormData(form[0]);
		const data 		= {};

		for (let [ key, value ] of formData.entries()) {
			data[key] = value.trim();
		}

		let error 	= '';
		const name 	= data['name'];
		const email = data['email'];

		if (!name || !email) {
			error = 'All fields are required';

		} else if (!validators.isValidEmail(email)) {
			error = 'Email is invalid';
		}

		if (error) {
			this.showError(error);
			this.isProcessing = false;
			return;
		}

		this.model.updateUser(App.user.id, data);
	}
};