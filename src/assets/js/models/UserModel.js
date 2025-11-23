import Model from './Model.js';
import validators from './../utils/validators.js';

export default class UserModel extends Model {
	/**
	 * 
	 */
	constructor() {
		super();

		this.user = {};
	}

	/**
	 * 
	 * @param {string} email 
	 * @param {string} password 
	 * @returns 
	 */
	login(email, password) {
		// Basic validation
		if (!email || !password) {
			this.onError({ message: 'Member ID and Password are required.' });
			return;
		}

		if (!validators.isValidEmail(email)) {
			this.onError({ message: 'Invalid email address' });
			return;
		}

		if (!validators.isValidPassword(password)) {
			this.onError({ message: 'Invalid password. Ensure you password is at least 8 characters long, contains a number, and uppercase letter, and a lowercase letter.' });
			return;
		}

		this.service.post(this.service.apis.LOGIN, { 'email' : email, 'password': password }, {},
			(data) => {
				this.user = data.data;
				this.onSuccess(this.user);
			},
			(error, response) => {
				error = response?.responseData?.message || error;
				this.onError(error);
			}
		);
	}
}