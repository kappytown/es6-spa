import constants from '../utils/constants.js';
import utils from '../utils/utils.js';
import lazyload from './../utils/Lazyload.js';
import Modal from './../utils/Modal.js';
import pubsub from './../utils/PubSub.js';
import templateManager from './../utils/TemplateManager.js';
import viewManager from './../ViewManager.js';
import cookieBanner from './../utils/CookieBanner.js';

export default class RouteController {
	/**
	 * 
	 */
	gotoIgnore() {
		viewManager.cleanup();

	}

	/**
	 * 
	 */
	gotoHome() {
		this.#loadController('home', './../views/HomeView.js', { css: ['assets/css/views/home.css'] });
	}

	/**
	 * 
	 * @param {JSON} params 
	 */
	gotoProducts(params) {
		this.#loadController('products', './../views/ProductsView.js', { css: ['assets/css/views/products.css'] }, params)
	}

	/**
	 * 
	 * @param {JSON} params
	 */
	gotoProduct(params) {
		this.#loadController('product', './../views/ProductView.js', { css: ['assets/css/views/product.css'] }, params);
	}

	/**
	 * 
	 * @param {JSON} params 
	 */
	gotoOrders(params) {
		this.#loadController('orders', './../views/OrdersView.js', { css: ['assets/css/views/orders.css'] }, params)
	}

	/**
	 * 
	 * @param {JSON} params
	 */
	gotoOrder(params) {
		this.#loadController('order', './../views/OrderView.js', { css: ['assets/css/views/order.css'] }, params);
	}

	/**
	 * 
	 */
	gotoSignup() {
		this.#loadController('sign_up', './../views/SignUpView.js', { css: ['assets/css/views/sign_up.css'] });
	}

	/**
	 * 
	 */
	gotoLogin() {
		this.#loadController('login', './../views/LoginView.js', { css: ['assets/css/views/login.css'] });
	}

	/**
	 * 
	 */
	gotoLogout() {
		pubsub.publish(constants.events.LOGOUT);
	}

	/**
	 * 
	 */
	gotoContactUs() {
		this.#loadController('contact_us', './../views/ContactUsView.js', { css: ['assets/css/views/contact_us.css'] });
	}

	/**
	 * 
	 */
	gotoPageNotFound() {
		this.#loadController('pagenotfound', './../views/PageNotFoundView.js');
	}

	/**
	 * 
	 */
	gotoMyAccount() {
		this.#loadController('my_account', './../views/MyAccountView.js', { css: ['assets/css/views/my_account.css'] });
	}

	/**
	 * 
	 */
	gotoEditProfile() {
		this.#loadController('edit_profile', './../views/EditProfileView.js', { css: ['assets/css/views/edit_profile.css'] });
	}

	/**
	 * 
	 */
	gotoChangePassword() {
		this.#loadController('change_password', './../views/ChangePasswordView.js', { css: ['assets/css/views/change_password.css'] });
	}

	/**
	 * Force reloads the current view
	 */
	gotoPageRefresh() {
		utils.reload(true);
	}

	/**
	 * 
	 */
	gotoPolicyPrivacy() {
		this.#gotoPolicy('privacy', 'Privacy Policy');
	}

	/**
	 * 
	 */
	gotoPolicyTerms() {
		this.#gotoPolicy('terms', 'Terms and Conditions');
	}

	/**
	 * 
	 */
	gotoPolicyCookies() {
		this.#gotoPolicy('cookies', 'Cookie Policy');
	}
	
	/**
	 * 
	 */
	gotoCookiePreferences() {
		cookieBanner.showCookieConsent();
	}

	/**
	 * Loads the policy template and displays it in a modal window
	 * 
	 * @param {string} policy 
	 * @param {string} title 
	 * @private
	 */
	#gotoPolicy(policy, title) {
		const modal 	= new Modal();
		const modalId 	= 'modal_policy';
		const body 		= templateManager.getContent(`modals/${policy}.html`, {});

		modal.show(modalId, { class: 'info', title: title, body: body, closeButton: true });
	}

	/**
	 * To reduce redundancy, this method will load all the assets and modules for every view
	 * 
	 * @param {string} id 			The id of the view
	 * @param {string} modulePath 	The module path to load
	 * @param {JSON} assets 		An object of all the assets to be loaded
	 * @param {JSON} params 		Object containing parameters to pass to the view
	 * @param {Function} callback 	Handler to execute after view has been rendered if required
	 * @private
	 */
	#loadController(id, modulePath, assets, params, callback) {
		viewManager.cleanup();
		let view;

		// Called when the module is loaded
		// Renders the view
		const onModuleLoaded = () => {
			viewManager.setCurrentView(view);

			// Once the data is received from the server, let's display it and pass any params
			view.render(params);

			if (callback) callback();
		}

		// Called when all assets are loaded
		// This will then load the module
		const onAssetsLoaded = () => {
			view = viewManager.getView(id);

			if (!view) {
				// loads the module
				// modulePath is the relative path from the router directory
				import(modulePath).then(module => {
					const ViewClass = module.default;
					view = new ViewClass();
					viewManager.register(id, view);

					onModuleLoaded();
				}).catch(error => {
					utils.logger.log(`Module (${modulePath}) not found.`, error.message);
					/* TODO: Load error page */
					pubsub.publish(constants.events.VIEW_LOAD_FAILED, { id: id, view: modulePath });
				});
			} else {
				onModuleLoaded();
			}

		}

		if (assets) {
			lazyload.load(assets, onAssetsLoaded);
		} else {
			onAssetsLoaded();
		}
	}
};