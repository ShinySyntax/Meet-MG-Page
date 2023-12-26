import Vue from 'vue'
import VueRouter from 'vue-router';
import adminRoute from './_admin'
Vue.use(VueRouter);

/* 解决路由 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error => error)
}

const routes = [
	...adminRoute,
]

const router = new VueRouter({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
