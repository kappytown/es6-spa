import OrderModel from './../models/OrderModel.js';
import utils from './../utils/utils.js';
import View from './View.js';

export default class OrderView extends View {
	order_id;

	/**
	 * Loads the template upon initialization
	 * 
	 * @override
	 */
	constructor() {
		super();

		this.id 			= 'order';				// ID name of the element to render in to
		this.viewName 		= 'OrderView';			// Could replace with this.constructor.name
		this.templateID 	= `${this.id}_tmpl`;	// Use this if the template is already on the page
		this.templateName 	= this.id;				// Use this to load the template file
		this.model 			= new OrderModel();
		this.events 		= {
			'click .breadcrumb a': 'onBreadcrumbClick'
		}

		this.model.setSuccessListener(this.showOrder.bind(this));
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

		const { id } = params.data;
		this.order_id = id;

		// Lazy-load the template
		this.loadTemplate(function (success) {
			if (success) {
				this.addViewToDOM();

				App.setSelectedTab('orders');

				if (this.isViewEmpty) {
					this.populateView();
				}

				$('.order_details').empty();
				utils.addLoadingIcon($('.order_details', this.$el));

				this.model.fetchOrder(id);
			}
		}.bind(this));

		return this;
	}

	/**
	 * 
	 */
	populateView() {
		this.addBackButton('orders');
	}

	/**
	 * Displays the details of the specified order object
	 * 
	 * @param {JSON} order 
	 */
	showOrder(order) {
		utils.removeLoadingIcon($('.order_details', this.$el));

		const $el = $('.order_details', this.$el);

		// Get order list template
		const template = this.templateManager.getTemplate('partials/order_details.html');
		
		$el.html(_.template(template)({ order: order?.data }));
	}

	/**
	 * Display the specified error message
	 * 
	 * @param {string} message 
	 */
	showError(message) {
		utils.removeLoadingIcon($('.order_details', this.$el));

		const $el = $('.error', this.$el);
		$el.html(message).show();
		setTimeout(() => {
			$el.hide();
		}, 5000);
	}

	/**
	 * Navigates to the route specified in the data route attribute
	 * 
	 * @param {Event} e 
	 */
	onBreadcrumbClick(e) {
		e.preventDefault();
		const $el = $(e.currentTarget);
		const route = $el.data('route');
		this.router.navigate(route);
	}
};