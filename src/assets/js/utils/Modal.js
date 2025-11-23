import templateManager from './TemplateManager.js';

export default class Modal {
	#modal;

	constructor() {
		$.fn.modal.Constructor.prototype.setScrollbar = function () { };
	}

	/**
	 * Shows the modal view
	 * Examples: 
	 * 	To capture the modal hidden event: 
	 * 		document.getElementById(id).addEventListener('hidden.bs.modal', (e) => { // code here... });
	 * 	To capture the click event on secondary button:
	 * 		document.querySelector('.modal-footer .btn-primary').addEventListener('click', (e) => { modal.hide(id); // code here... });
	 * 
	 * @param {string} id 
	 * @param {JSON} settings  
	 */
	show(id, settings) {
		const _this = this;
		let $el = $(`#${id}`);
		if ($el.length) {
			this.hide(id);
		}

		let defaults = { backdrop: 'static', keyboard: false };
		$.extend(true, defaults, settings);

		// Append the modal content to the body
		$('body').append(this.#getModalView(id, defaults));

		// Get a reference to it
		$el = $(`#${id}`);

		// Show the modal
		this.#modal = new bootstrap.Modal($el, defaults);
		this.#modal.show();

		// Listen for the hidden event to remove the content
		$el.on('hidden.bs.modal', function () {
			_this.hide(id);
		});
	}

	/**
	 * 
	 * @param {string} id 
	 * @param {JSON} settings 
	 * @returns {string}
	 * @private
	 */
	#getModalView(id, settings) {
		return templateManager.getContent('partials/modal.html', { modal: {...settings, id }});
	}

	/**
	 * 
	 * @param {string} id
	 */
	hide(id) {
		let $el = $(`#${id}`);
		if ($el.length) {
			$('body').removeClass('modal-open');
			this.#modal.hide();
			$el.remove();
			$('.modal-backdrop').remove();
		}
	}

	/**
	 * 
	 * @param {string} id 
	 * @returns {int} 0 if not found
	 */
	isVisible(id) {
		const $el = $(`#${id}`);
		return $el.length;
	}
};