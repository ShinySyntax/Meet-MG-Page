import Vue from 'vue';
import store from '@/store/index.js';
/* 操作权限 */
Vue.directive('auth',{
	inserted: (el,binding,vnode) =>{
		/* 传入的值1:有操作权限 2:无操作权限(隐藏操作按钮) */
		let value = binding.value;
		let authList=store.state.myadmin.authList;
		if(authList[value]==2){
			el.parentNode.removeChild(el);
		}
		let list=value.list;
		if(list){
			let num=0;
			list.map(item=>{
				if(authList[item]==2){
					num++;
				}
			})
			if(num>0&&num==list.length){
				el.parentNode.removeChild(el);
			}
		}
	}
})