import Model from './Model.js';

export default class EditProfileModel extends Model {
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
	setEditListener(callback) {
		this.onEdit = callback;
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

	updateUser(id, data) {
		const url = this.service.getAPI('USER', { id });
		this.service.put(url, data, {}, 
			(data) => {
				if (data?.success === true) {
					this.onEdit(true);
				} else {
					this.onEdit(false);
				}
			},

			(error, response) => {
				this.onEdit(false);
			}
		)
	}
}