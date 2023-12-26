import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';


import '@_/assets/style/reset.css';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '@_/assets/themeconfig/theme/index.css';
Vue.use(ElementUI);

/* 全局混合模式 */
import myMixin from '@_/mixins/mymixin.js';
Vue.mixin(myMixin);

/* 树形下拉框 */
import ElTreeSelect from 'el-tree-select';
Vue.use(ElTreeSelect);

import {generaMenu,unique} from '@_/utils/common.js';
import {mgCurr,sysParams,mgMenu,mgAuthPageAuthList,msgTips } from '@_/axios/path.js';

/* 自定义指令 */
import  '@_/utils/direct.js';
/*quill编辑器 */
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 将富文本编辑器，注册为全局可用组件
Vue.use(VueQuillEditor)
// Vue.use(Quill)

/* 全局变量 */
import protovar from '@_/utils/protovar.js';
Vue.prototype.$protovar=protovar;
//首次访问页面
let fristVisit=true;
//菜单列表
let tAdminMenu=JSON.parse(localStorage.getItem("tadminmenu"));
/* 刷新页面重新动态添加路由 */
if(tAdminMenu){
	let res= mgMenu();
	if(res.ok){
		let routeList=res.data;
		let route=[];
		localStorage.setItem("tadminmenu",JSON.stringify(routeList));
		generaMenu(route,routeList);
		router.addRoutes(route);
		store.commit('addRouteList', routeList);
		store.commit('addDealRoutes', route);
		store.commit('addTags', []);
	}
}

router.beforeEach(async (to, from, next) => {
	let topath=to.path;
	let res;
	if(topath!='/login'){
		res=await mgCurr();//当前用户
		if(res.ok){
			store.commit('setCurrUser', res.data);
		}else{
			store.commit('setCurrUser', null);
		}
	}
	tAdminMenu=localStorage.getItem("tadminmenu");//菜单列表
	//跳转登录页面(移除storage存储的菜单列表、清除store中的curruser),如果存储中没有菜单列表||登录信息失效且为首次访问跳转登录页面，跳转登录页面
	if(topath=="/login"){
		localStorage.removeItem("tadminmenu");
		store.commit('setCurrUser', null);
		store.commit("setLoginDialog",{show:false,title:''});
		if(tAdminMenu){
			// location.reload();//防止重复添加路由控制台警告
			window.location.href = '/';
			return false;
		}else{
			next();
		}
	}else if(!tAdminMenu||(!res.data&&fristVisit)){
		store.commit("setRouteFrom",topath);//登录后需要跳回之前访问的页面
		next({path:"/login"});
	}else{
		//权限接口
		let authres=await mgAuthPageAuthList({path:topath.split("/")[1]});
		if(authres.ok){
			store.commit('setAuthList', authres.data);
		}
		if (to.matched.length ===0) {                                 //如果未匹配到路由
			from.name ? next({ name:from.name }):next('/index');   //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
		} else {
			next(); //如果匹配到正确跳转
		}
		// next();
	}
	fristVisit=false;
})
router.afterEach(async(to,from)=>{
	let tpath=to.path;
	document.title = to.name||'TioAdmin';
	//tab
	let tags=store.state.myadmin.tags;
	protovar.routehasopen=tags.findIndex(item=>item.path==tpath);
	let dealroutes=store.state.myadmin.dealroutes;
	let obj={};
	dealroutes.map(item=>{
		if(item.children){
			obj=item.children.find(v=>v.path==tpath.split("/")[1]);
			if(obj){
				tags.push({"name":obj.name,"path":tpath,"id":obj.id});
				store.commit("addTags",unique(tags));
				return;
			}
		}
	})
	//系统参数
	if(!store.state.myadmin.sysparams){
		let sysparams=await sysParams();
		if(sysparams.ok){
			store.commit('setSysParams', sysparams.data);
			localStorage.setItem('tiomgconfig',JSON.stringify(sysparams.data))
		}
	}
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
