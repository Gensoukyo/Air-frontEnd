import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Routers from './router.js';
import StoreConfig from './store.js';
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './app.vue';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueAxios, axios)

const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);
const store = new Vuex.Store(StoreConfig);

const TITLE='Air-云之彼端';

//全局前置守卫
router.beforeEach((to, from, next) => {
	if (to.path==='/user'&&!store.state.auth) {
		return next(false);
	}
    window.document.title = to.meta.title||TITLE;
    next();
});
//全局后置守卫
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});

const app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});