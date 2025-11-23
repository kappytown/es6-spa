import Model from './Model.js';
import validators from './../utils/validators.js';

export default class ContactUsModel extends Model {
	/**
	 * 
	 */
	constructor() {
		super();

		this.user = {};
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {string} email 
	 * @param {string} message 
	 * @returns {boolean}
	 */
	sendMail(name, email, message) {
		const url = this.service.getAPI('SEND_MAIL');
		this.service.post(url, { name, email, message }, {}, 
			(data) => {
				console.log(data);
				if (data?.success === true) {
					this.onSuccess(true);
				} else {
					this.onError('Unable to send mail at this time, please try again later');
				}
			},

			(error, response) => {
				console.log(error, response);
				this.onError('Unable to send mail at this time, please try again later.');
			}
		)
	}
}