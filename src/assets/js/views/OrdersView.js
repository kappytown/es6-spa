import OrdersModel from './../models/OrdersModel.js';
import utils from './../utils/utils.js';
import View from './View.js';

export default class OrdersView extends View {
	/**
	 * Loads the template upon initialization
	 * 
	 * @override
	 */
	constructor() {
		super();

		this.id 			= 'orders';				// ID name of the element to render in to
		this.viewName 		= 'OrdersView';
		this.templateID 	= `${this.id}_tmpl`;	// Use this if the template is already on the page
		this.templateName 	= this.id;				// Use this to load the template file
		this.model 			= new OrdersModel();
		this.events 		= {
			'click .order': 'onOrderClick',
			'click .set-filters': 'onSetFiltersClick'
		}

		this.model.setSuccessListener(this.showOrders.bind(this));
		this.model.setErrorListener(this.showError.bind(this));

		super.init();
	}

	/**
	 * Renders the template on to the page
	 * 
	 * @override
	 * @returns {View}
	 */
	render(params) {
		super.render(params);

		const { status } = params.data;

		// Lazy-load the template
		this.loadTemplate(function (success) {
			if (success) {
				this.addViewToDOM();

				App.setSelectedTab('orders');

				this.setFilters(status);
				this.applyFilters();

				if (this.isViewEmpty) {
					//this.populateView();

					// Get's a list of all available statuses
					const _this = this;
					this.model.fetchStatuses((statuses) => {
						if (statuses?.data?.length > 0) {
							const $status = $('select[name="status"]', _this.$el);
							statuses.data.forEach(item => {
								const selected = status === item.status ? 'selected' : '';
								$status.append(`<option value="${item.status}" ${selected}>${item.status}</option>`);
							});
						}
					});
				}
			}
		}.bind(this));

		return this;
	}

	/**
	 * 
	 */
	populateView() {
		utils.addLoadingIcon($('h1', this.$el));

		this.model.fetchOrders(1);
	}

	/**
	 * Updates the view with the list of orders from the model
	 * 
	 * @param {array} orders 
	 * @param {int} currentPage 
	 * @param {int} totalPages 
	 */
	showOrders(orders, currentPage, totalPages) {
		console.log(orders);

		utils.removeLoadingIcon($('h1', this.$el));
		$('.error', this.$el).hide();

		const $el = $('.orders_list', this.$el).empty();

		if (orders?.data?.length > 0) {
			// Render the template
			$el.append(this.templateManager.getContent('partials/orders_list.html', { orders: orders.data }));

			this.showPagination(currentPage, totalPages, (page) => {
				utils.addLoadingIcon($('h1', this.$el));

				this.model.fetchOrders(page)
			});
		} else {
			$el.html('<div class="mb3 row"><div class="col">No orders found</div></div>');
			this.hidePagination();
		}
	}

	/**
	 * Sets the filters with the specified values
	 * 
	 * @param {string} status 
	 */
	setFilters(status) {
		status = status || '';

		// Set the initial values
		$('select[name="status"]').val(status);

		this.model.setFilters({ status });
	}

	/**
	 * 
	 */
	applyFilters() {
		this.populateView();
	}

	/**
	 * 
	 * @param {string} message 
	 */
	showError(message) {
		utils.removeLoadingIcon($('h1', this.$el));

		const $el = $('.error', this.$el);
		$el.html(message).show();
		setTimeout(() => {
			$el.hide();
		}, 5000);
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	onOrderClick(e) {
		const $el = $(e.currentTarget);
		const id = $el.data('id');
		this.router.navigate(`order/${id}`);
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	onSetFiltersClick(e) {
		const $filters = $('.filters', this.$el);
		const status = $('select[name="status"]').find(':selected').val();
		this.model.setFilters({ status });
		this.applyFilters();
	}
};