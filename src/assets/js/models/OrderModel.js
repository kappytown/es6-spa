import Model from './Model.js';

export default class OrderModel extends Model {
	/**
	 * 
	 */
	constructor() {
		super();

		this.order = {};
	}

	/**
	 * 
	 * @param {int} id 
	 */
	fetchOrder(id) {
		// fetch orders from the server
		const url = this.service.getAPI('ORDER', { id: id });
		this.service.get(url, {}, {},
			(data) => {
				if (data?.data?.length > 0) {
					this.order = data;
					this.onSuccess(this.order);
				} else {
					this.onError('Order not found');
				}
			},
			(error, response) => {
				error = response?.responseData?.message || error;
				this.onError(error);
			}
		);
	}
}