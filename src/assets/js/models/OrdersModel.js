import Model from './Model.js';

export default class OrdersModel extends Model {
	/**
	 * 
	 */
	constructor() {
		super();
		this.orders = [];
		this.filters = {};
	}

	/**
	 * 
	 * @param {int} page 
	 */
	fetchOrders(page = 1) {
		// fetch orders from the server
		let url = `${this.service.apis.ORDERS}?limit=${this.pageSize}`;

		if (this.filters.status) {
			url = `${this.service.getAPI('ORDERS_BY_STATUS', { status: this.filters.status })}?limit=${this.pageSize}`;
		}

		this.service.get(url, {}, {},
			(data) => {
				this.orders = data;
				this.onSuccess(this.orders, 1, 1);

				// for pagination:
				//this.onSuccess(this.orders, page, Math.ceil(totalCount / this.pageSize));
			},
			(error, response) => {
				error = response?.responseData?.message || error;
				this.onError(error);
			}
		);
	}

	/**
	 * 
	 * @param {Function} callback 
	 */
	fetchStatuses(callback) {
		// fetch orders from the server
		this.service.get(this.service.apis.ORDER_STATUSES, {}, {},
			(data) => {
				callback(data);
			},
			(error, response) => {
				callback(null);
			}
		);
	}

	/**
	 * 
	 * @param {JSON} filters 
	 */
	setFilters(filters) {
		this.filters = { ...this.filters, ...filters };
	}
}