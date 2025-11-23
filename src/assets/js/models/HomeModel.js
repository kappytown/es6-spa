import Model from './Model.js';

export default class HomeModel extends Model {
	/**
	 * 
	 */
	constructor() {
		super();
		this.account = {};
	}

	/**
	 * 
	 * @param {function} callback 
	 */
	fetchOrderStats(callback) {
		const url = this.service.getAPI('REPORT_ORDER_STATS');
		this.service.get(url, {}, {},
			(data) => {
				if (callback) callback(data?.data || []);
			},

			(error, response) => {
				error = response?.responseData?.message || error;
				if (callback) callback(error);
			}
		);
	}

	/**
	 * 
	 * @param {function} callback 
	 */
	fetchTopProducts(callback) {
		const url = this.service.getAPI('REPORT_TOP_PRODUCTS');
		this.service.get(url, {}, {},
			(data) => {
				if (callback) callback(data?.data || []);
			},

			(error, response) => {
				error = response?.responseData?.message || error;
				if (callback) callback(error);
			}
		);
	}

	/**
	 * 
	 * @param {function} callback 
	 */
	fetchRecentOrders(callback) {
		const url = this.service.getAPI('REPORT_RECENT_ORDERS');
		this.service.get(url, {}, {},
			(data) => {
				if (callback) callback(data?.data || []);
			},

			(error, response) => {
				error = response?.responseData?.message || error;
				if (callback) callback(error);
			}
		);
	}
}