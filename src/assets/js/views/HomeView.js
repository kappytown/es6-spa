import View from './View.js';
import HomeModel from './../models/HomeModel.js';

export default class HomeView extends View {
	/**
	 * Loads the template upon initialization
	 * 
	 * @override
	 */
	constructor() {
		super();

		this.id 			= 'home';				// ID name of the element to render in to
		this.viewName 		= 'HomeView';
		this.templateID 	= `${this.id}_tmpl`;	// Use this if the template is already on the page
		this.templateName 	= this.id;				// Use this to load the template file
		this.model 			= new HomeModel();
		this.events 		= {
			'click .logout-btn': 'onLogoutClick',
			'click #ordersTableBody tr': 'onOrderClick'
		}
		super.init();
	}

	/**
	 * Renders the template on to the page
	 * 
	 * @override
	 * @returns {View}
	 */
	render() {
		super.render();

		// Lazy-load the template
		this.loadTemplate(function (success) {
			if (success) {
				this.addViewToDOM();

				App.setSelectedTab('home');

				this.getStats();
			}
		}.bind(this));

		return this;
	}

	/**
	 * Gets the status used to populate the dashboard
	 */
	getStats() {
		const $headerEl 		= $('.header', this.$el).empty();
		const $statsEl 			= $('.stats', this.$el).empty();
		const $topProductsEl 	= $('.top-products', this.$el).empty();
		const $recentOrdersEl 	= $('.recent-orders', this.$el).empty();

		$headerEl.append(this.templateManager.getContent('partials/home_header.html', { data: App.user }));

		this.model.fetchOrderStats((data) => {
			$statsEl.append(this.templateManager.getContent('partials/home_stats.html', { data: data?.length > 0 ? data[0] : null }));
		});

		this.model.fetchTopProducts((data) => {
			$topProductsEl.append(this.templateManager.getContent('partials/home_top_products.html', { data: data?.length > 0 ? data : null }));
		});

		this.model.fetchRecentOrders((data) => {
			$recentOrdersEl.append(this.templateManager.getContent('partials/home_recent_orders.html', { data: data?.length > 0 ? data : null }));
		});
	}

	/**
	 * Logs the user out
	 * 
	 * @param {Event} e 
	 */
	onLogoutClick(e) {
		e.preventDefault();
		this.router.navigate('logout');
	}

	/**
	 * Navigates to the order details page
	 * 
	 * @param {Event} e 
	 */
	onOrderClick(e) {
		const id = e.currentTarget.dataset.id;
		this.router.navigate(`order/${id}`);
	}
};