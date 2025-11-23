import Service from './../service/Service.js';

export default class Model {
	constructor() {
		this.service = new Service();
		this.pageSize = 100;
	}

	/**
	 * 
	 * @param {Function} callback 
	 */
	setSuccessListener(callback) {
		this.onSuccess = callback;
	}

	/**
	 * 
	 * @param {Function} callback 
	 */
	setErrorListener(callback) {
		this.onError = callback;
	}
}