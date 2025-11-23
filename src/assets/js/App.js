import constants from './assets/js/utils/constants.js';
import Storage from './assets/js/utils/Storage.js';
import utils from './assets/js/utils/utils.js';

// Singletons - If not Singletons, the App must have intantiate them and expose them publicly to be used throughout the app. - App.cache, App.pubsub, etc.
import router from './assets/js/router/Router.js';
import Service from './assets/js/service/Service.js';
import cache from './assets/js/utils/Cache.js';
import cookieBanner from './assets/js/utils/CookieBanner.js';
import pubsub from './assets/js/utils/PubSub.js';
import viewManager from './assets/js/ViewManager.js';

class Application {
	#pagesViewed = [];
	#isAppReady = true;
	#isActive = false;

	/**
	 * 
	 */
	constructor() {
		this.user = {};

		// Set dependencies
		this.storage = new Storage();	// Used to store data in localstorage or a cookie
		this.service = new Service();

		// Event listeners
		pubsub.subscribe(constants.events.APP_READY, this.#onAppReady, this);
		pubsub.subscribe(constants.events.SESSION_ACTIVE, this.#onSessionActive, this);
		pubsub.subscribe(constants.events.LOGGED_IN, this.#onLoggedIn, this);
		pubsub.subscribe(constants.events.LOGGED_OUT, this.#onLoggedOut, this);
		pubsub.subscribe(constants.events.REQUEST_DONE, this.#onRequestDone, this);
		pubsub.subscribe(constants.events.REQUEST_FAIL, this.#onRequestFail, this);
		pubsub.subscribe(constants.events.VIEW_LOAD_FAILED, this.#onViewLoadFailed, this);
		pubsub.subscribe(constants.events.LOGOUT, this.logout, this);

		// Setup the navigation menu hide/show functionality
		this.setMenu();
	}

	/**
	 * 
	 */
	init() {
		this.initRouter();

		pubsub.publish(constants.events.APP_READY);
	}

	/**
	 * @private
	 */
	#onAppReady() {
		this.#isAppReady = true;
		cookieBanner.checkCookieConsent();
	}

	/**
	 * 
	 * @returns {bool}
	 */
	isAppReady() {
		return this.#isAppReady;
	}

	/**
	 * 
	 * @returns {bool}
	 */
	isActiveAccount() {
		return this.#isActive;
	}

	/**
	 * This will set the click handler for the hamburger menu
	 * which is used to hide and show it
	 */
	setMenu() {
		const $menu = $('#menu');
		$('.hamburger img').click(function (e) {
			if ($menu.hasClass('open')) {
				$menu.removeClass('open');
			} else {
				$menu.addClass('open');
			}
		});

		// Hide the nav menu on click
		$('li a', $menu).click(function (e) {
			$menu.removeClass('open');
		});
	}

	/**
	 * 
	 */
	initRouter() {
		utils.loading.show();

		setTimeout(() => {
			this.getSession(success => {
				// Authentication filter
				router.addFilter(() => {
					if ($.isEmptyObject(this.user)) {
						this.logout();
						return false;
					}
					return true;
				});
				router.init();

				utils.loading.hide();
			});
		}, 100);
	}

	/**
	 * This is called once the session is active
	 * 
	 * @private
	 */
	#onSessionActive() {
		// Show the active session menu
		$('#menu .user').removeClass('hidden');
		$('#menu .not-user').addClass('hidden');
	}

	/**
	 * Loads the session
	 * 
	 * @param {function} callback 
	 */
	getSession(callback) {
		this.service.get(this.service.apis.SESSION, {}, {},
			(data) => {
				this.user = data?.data || {};

				if (data?.status === 200) {
					pubsub.publish(constants.events.SESSION_ACTIVE);
				}
				if (callback) callback(true);
			},
			(error, response) => {
				this.user = {};
				if (callback) callback(false);
			}
		);
	}

	/**
	 * 
	 * @param {mixed} data 
	 * @private
	 */
	#onLoggedIn(data) {
		this.getSession((data) => {
			if (!$.isEmptyObject(this.user)) {
				router.navigate('home');
			}
		});
	}

	/**
	 * 
	 * @param {mixed} data 
	 * @private
	 */
	#onLoggedOut(data) {
		$('#menu .user').addClass('hidden');
		$('#menu .not-user').removeClass('hidden');
	}

	/**
	 * 
	 * @param {mixed} data 
	 * @private
	 */
	#onRequestDone(data) {
		//utils.logger.log('onRequestDone called', data);
	}

	/**
	 * 
	 * @param {mixed} data 
	 * @private
	 */
	#onRequestFail(data) {
		//utils.logger.log('onRequestFail called', data);
	}

	/**
	 * 
	 * @param {JSON} data 
	 * @private
	 */
	#onViewLoadFailed(data) {
		utils.logger.log(data);
		data = data || {};
		if (data.id !== 'pagenotfound') router.navigate('pagenotfound');
	}

	/**
	 * 
	 * @param {string} page 
	 * @private
	 */
	#setPageViewed(page) {
		const index = this.#pagesViewed.findIndex(item => {
			return item.page === page;
		});
		if (index >= 0) {
			this.#pagesViewed[index].visits++;
		} else {
			this.#pagesViewed.push({ page: page, visits: 1 });
		}
	}

	/**
	 * Adds the class selected to the currrent routes associated navigation tab
	 * 
	 * @param {string} tab 
	 */
	setSelectedTab(tab) {
		const $menu = $('#menu');
		$('.active', $menu).removeClass('active');
		$('.' + tab, $menu).addClass('active');
	}

	/**
	 * 
	 */
	logout() {
		utils.loading.hide();

		this.service.post(this.service.apis.LOGOUT);

		// Clear app cache
		cache.empty();

		viewManager.disposeAll();

		this.user = {};
		this.storage.remove('user');
		
		router.navigate('login');

		pubsub.publish(constants.events.LOGGED_OUT);
	}
};

// Initialize the app
$(function () {
	window.App = new Application();
	App.init();
});
