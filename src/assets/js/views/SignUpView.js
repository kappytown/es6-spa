import validators from '../utils/validators.js';
import SignUpModel from './../models/SignUpModel.js';
import utils from './../utils/utils.js';
import View from './View.js';

export default class OrderView extends View {
	/**
	 * Loads the template upon initialization
	 * 
	 * @override
	 */
	constructor() {
		super();

		this.id 			= 'sign_up';			// ID name of the element to render in to
		this.viewName 		= 'SignUpView';			// Could replace with this.constructor.name
		this.templateID 	= `${this.id}_tmpl`;	// Use this if the template is already on the page
		this.templateName 	= this.id;				// Use this to load the template file
		this.model 			= new SignUpModel();
		this.isProcessing 	= false;
		this.events 		= {
			'onSubmit .signup-form': 'onSignUpFormSubmit',
			'click .btn-submit': 'onSignUpFormSubmit'
		}
		
		this.model.setSuccessListener(this.onSignupComplete.bind(this));
		this.model.setErrorListener(this.showError.bind(this));

		super.init();
	}

	/**
	 * Renders the template on to the page
	 * 
	 * @override
	 * @returns {View}
	 */
	render(params) {
		super.render(params);

		// Lazy-load the template
		this.loadTemplate(function (success) {
			if (success) {
				this.addViewToDOM();

				App.setSelectedTab('sign-up');

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
	populateView() {}

	/**
	 * 
	 * @param {string} message 
	 */
	showError(message) {
		utils.removeLoadingIcon($('.account_details', this.$el));
		this.isProcessing = false;

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
	onSignupComplete(success) {
		utils.removeLoadingIcon($('.signup-form', this.$el));
		this.isProcessing = false;

		if (success) {
			this.showError('User created successfully! You will be redirected to the Login page shortly.');
			$('.signup-form', this.$el)[0].reset();
			setTimeout(() => {
				this.router.navigate('login');
			}, 5000);
		} else {
			this.showError('Unable to create user, please try again.');
		}
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	onSignUpFormSubmit(e) {
		e.preventDefault();

		if (this.isProcessing) return;
		this.isProcessing = true;

		const form 		= $('.signup-form', this.$el);
		const formData 	= new FormData(form[0]);
		const data 		= {};

		for (let [ key, value ] of formData.entries()) {
			data[key] = value.trim();
		}

		let error 		= '';
		const name 		= data['name'];
		const email 	= data['email'];
		const password 	= data['password'];

		if (!name || !email || !password) {
			error = 'All fields are required';

		} else if (!validators.isValidEmail(email)) {
			error = 'Email is invalid';
		
		} else if (!validators.isValidPassword(password)) {
			const errors = validators.validatePassword(password);
			error = `<strong>Password must contain:</strong>${errors.map(e => `<div>${e}</div>`).join('')}`;
		}

		if (error) {
			this.showError(error);
			this.isProcessing = false;
			return;
		}

		utils.addLoadingIcon($('.signup-form', this.$el));
		this.model.createUser(data);
	}
};