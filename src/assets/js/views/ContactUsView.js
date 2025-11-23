import validators from '../utils/validators.js';
import ContactUsModel from './../models/ContactUsModel.js';
import Modal from './../utils/Modal.js';
import utils from './../utils/utils.js';
import View from './View.js';

export default class ContactUsView extends View {
	/**
	 * Loads the template upon initialization
	 * 
	 * @override
	 */
	constructor() {
		super();

		this.id 			= 'contact_us';			// ID name of the element to render in to
		this.viewName 		= 'ContactUsView';
		this.templateID 	= `${this.id}_tmpl`;	// Use this if the template is already on the page
		this.templateName 	= this.id;				// Use this to load the template file
		this.model 			= new ContactUsModel();
		this.events 		= {
			'click .show-faqs': 'onShowFAQsClick',
			'click .submit': 'onSubmit',
			'submit #contact-form': 'onSubmit'
		};

		this.model.setSuccessListener(this.onSuccess.bind(this));
		this.model.setErrorListener(this.showError.bind(this));

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
				App.setSelectedTab('contact-us');
			}
		}.bind(this));

		return this;
	}

	/**
	 * 
	 */
	onSuccess() {
		const $error = $('.error', this.$el);
	}

	/**
	 * Display the specified error message
	 * 
	 * @param {string} message 
	 */
	showError(message) {
		utils.removeLoadingIcon($('.error', this.$el));
		this.isProcessing = false;

		const $el = $('.error', this.$el);
		$el.html(message).show();
		setTimeout(() => {
			$el.hide();
		}, 5000);
	}

	/**
	 * Click handler 
	 * 
	 * @param {Event} e 
	 */
	onShowFAQsClick(e) {
		const modal = new Modal();
		const body 	= this.templateManager.getContent('modals/contact_us_faqs.html');
		
		modal.show('modal_contact_us_faq_details', { class: 'info', title: "Frequently Asked Questions", body: body, closeButton: true, actionButtonText: null });
	}

	/**
	 * 
	 * @param {Event} e 
	 * @returns 
	 */
	onSubmit(e) {
		e.preventDefault();

		if (this.isProcessing) return;
		this.isProcessing = true;

		const formData 	= new FormData($('#contact-form')[0]);
		const data 		= {};
		
		for (let [ key, value ] of formData.entries()) {
			data[key] = value.trim();
		}

		$('.error', this.$el).addClass('hidden');

		let error 		= '';
		const name 		= data['name'];
		const email 	= data['email'];
		const message 	= data['message'];

		if (!name || !email || !message) {
			error = 'All fields are required';
			
		} else if (!validators.isValidEmail(email)) {
			error = 'Email is invalid';
		}

		if (error) {
			this.showError(error);
			return false;
		}

		utils.addLoadingIcon($('.signup-form', this.$el));
		this.model.sendMail(name, email, message);
	}
};
