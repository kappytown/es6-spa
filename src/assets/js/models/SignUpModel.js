import Model from './Model.js';

export default class SignUpModel extends Model {
	/**
	 * 
	 */
	constructor() {
		super();
	}

	/**
	 * 
	 * @param {int} id 
	 */
	createUser(user) {
		// fetch products from the server
		const url = this.service.getAPI('CREATE');
		this.service.post(url, user, {},
			(data) => {
				if (data?.status === 200);
				this.onSuccess(true);
			},
			(error, response) => {
				error = response?.responseData?.message || error;
				this.onError(error);
			}
		);
	}
}