import Model from './Model.js';

export default class AccountModel extends Model {
	/**
	 * 
	 */
	constructor() {
		super();
		this.account = {};
	}

	/**
	 * 
	 * @param {Function} callback 
	 */
	setDeleteListener(callback) {
		this.onDelete = callback;
	}

	/**
	 * 
	 * @param {int} id 
	 */
	fetchAccount(id) {
		const url = this.service.getAPI('USER', { id });
		this.service.get(url, {}, {},
			(data) => {
				this.account = data;
				this.onSuccess(this.account);
			},

			(error, response) => {
				error = response?.responseData?.message || error;
				this.onError(error);
			}
		);
	}

	/**
	 * 
	 * @param {int} id 
	 */
	deleteAccount(id) {
		if (!this?.onDelete) {
			console.error('You must set the delete listener (callback) function.');
			return;
		}

		const url = this.service.getAPI('USER', { id });
		this.service.delete(url, {}, {}, 
			(data) => {
				console.log(data);

				if (data?.success === true) {
					this.onDelete(true);
					return;
				}
				this.onDelete(false);
			},

			(error, response) => {
				this.onDelete(false);
			}
		)
	}
}