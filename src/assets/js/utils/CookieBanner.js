import Service from './../service/Service.js';
import Modal from './../utils/Modal.js';
import templateManager from './../utils/TemplateManager.js';
import Storage from './Storage.js';

const uuidv4 = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char) {
		const randomNumber = Math.random() * 16 | 0;
		const digit = char === 'x' ? randomNumber : (randomNumber & 0x3 | 0x8);
		return digit.toString(16);
	});
}

class CookieBanner {
	#hasAccepted 	= false;
	#storage 		= new Storage();
	#service 		= new Service();

	/**
	 * 
	 * @returns Singleton Instance
	 */
	constructor() {
		if (!CookieBanner.instance) {
			CookieBanner.instance = this;
		}
		return CookieBanner.instance;
	}

	/**
	 * Gets the consent id from storage or creates a new one
	 * 
	 * @private
	 */
	#getConsentId() {
		let id = this.#storage.get('userConsentId');

		if (!id) {
			id = uuidv4();
		}
		return id;
	}

	/**
	 * Check if the user has already accepted cookies
	 * If not, show the cookie consent banner.
	 */
	checkCookieConsent() {
		const consent = this.#storage.get('cookieConsent');
		if (consent !== 'accepted') {
			this.#showBanner();
		}
	}

	/**
	 * Removes the consent then shows the banner
	 */
	showCookieConsent() {
		this.#storage.remove('cookieConsent');
		this.#showBanner();
	}

	/**
	 * Shows the cookie consent banner
	 * 
	 * @private
	 */
	#showBanner() {
		let $consent = $('#cookieConsentBanner');

		// If the consent banner is not already in the DOM, load and append it
		if (!$consent.length) {
			const body = templateManager.getContent('partials/cookie_banner.html', {});
			$('body').append(body);

			$consent = $('#cookieConsentBanner');
		}

		$consent.removeClass('hidden');

		$('#acceptCookiesBtn').on('click', this.#handleAcceptCookies.bind(this));
		$('#viewFullPolicyLink').on('click', this.#handleViewFullPolicy.bind(this));
	}

	/**
	 * Hides the consent banner
	 * 
	 * @private
	 */
	#hideBanner() {
		$('#cookieConsentBanner').addClass('hidden');
	}

	/**
	 * Sets the acceptance of the cookie policy and hides the banner
	 * 
	 * @param {Event} e 
	 * @private
	 */
	#handleAcceptCookies(e) {
		e.preventDefault();
		this.#storage.set('cookieConsent', 'accepted');

		// This is just a stub, API not set
		// this should store the user's consent
		const data = {
			user_id: 		this.#getConsentId(),
			consent_status: 'accepted_essential',
			consent_method: 'banner_click',
			policy_version: '1.0',
			timestamp: 		(new Date()).toISOString()
		};

		this.#service.post(this.#service.apis.COOKIE_CONSENT, data);

		this.#hideBanner();
	}

	/**
	 * Handle the viewing of the full cookie policy
	 * 
	 * @param {Event} e 
	 * @private
	 */
	#handleViewFullPolicy(e) {
		e.preventDefault();
		const modal 	= new Modal();
		const modalId 	= 'modal_policy';
		const body 		= templateManager.getContent('modals/cookies.html', {});

		modal.show(modalId, { class: 'info', title: 'Cookie Policy', body: body, closeButton: true });
	};
}

const instance = new CookieBanner();
Object.freeze(instance);

export default instance;