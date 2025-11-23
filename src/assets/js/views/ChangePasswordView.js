import EditProfileModel from './../models/EditProfileModel.js';
import utils from './../utils/utils.js';
import validators from './../utils/validators.js';
import View from './View.js';

export default class ChangePasswordView extends View {
	/**
	 * Loads the template upon initialization
	 * 
	 * @override
	 */
	constructor() {
		super();

		this.id 			= 'change_password';		// ID name of the element to render in to
		this.viewName 		= 'ChangePasswordView';
		this.templateID 	= `${this.id}_tmpl`;	// Use this if the template is already on the page
		this.templateName 	= this.id;				// Use this to load the template file
		this.events 		= {
			'onSubmit .signup-form': 'onChangePasswordFormSubmit',
			'click .btn-submit': 'onChangePasswordFormSubmit'
		}
		this.model 			= new EditProfileModel();
		this.isProcessing 	= false;

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
		this.addBackButton('my-account');
	}

	/**
	 * 
	 * @param {string} message 
	 */
	showError(message) {
		utils.removeLoadingIcon($('.signup-form', this.$el));

		const $el = $('.error', this.$el);
		$el.html(message).show();
		setTimeout(() => {
			$el.hide();
		}, 5000);
	}

	/**
	 * 
	 * @param {boolean} success 
	 */
	handleEdit(success) {
		this.isProcessing = false;

		if (success) {
			$('.signup-form', this.$el)[0].reset();
			this.showError('Password updated successfully!');
		} else {
			this.showError('Unable to update your password, please try again shortly.');
		}
	}

	/**
	 * Gets the form input, validates it, then calls the editProfile method
	 */
	onChangePasswordFormSubmit(e) {
		e.preventDefault();

		if (this.isProcessing) return;
		this.isProcessing = true;

		const form 		= $('.signup-form', this.$el);
		const formData 	= new FormData(form[0]);
		const data 		= {};

		for (let [ key, value ] of formData.entries()) {
			data[key] = value.trim();
		}

		let error 				= '';
		const password 			= data['password'];
		const newPassword 		= data['new_password'];
		const confirmPassword 	= data['confirm_password']

		if (!password || !newPassword || !confirmPassword) {
			error = 'All fields must have a value';

		} else if (!validators.isValidPassword(password)) {
			error = '<strong>Current password is missing the following:</strong>';
			error += validators.validatePassword(password).map(item => `<br />${item}`);

		} else if (!validators.isValidPassword(newPassword)) {
			error = '<strong>New password is missing the following:</strong>';
			error += validators.validatePassword(newPassword).map(item => `<br />${item}`);

		} else if (newPassword !== confirmPassword) {
			error = 'New password and confirm password do not match.';

		} else if (password === newPassword) {
			error = 'Your current password and new password cannot be the same.'
		}

		if (error) {
			this.showError(error);
			this.isProcessing = false;
			return;
		}

		utils.addLoadingIcon($('.signup-form', this.$el));
		this.model.updateUser(App.user.id, { ...App.user, ...data });
	}
};