<template>
    <div class="content">
        <img src="~@/_admin/assets/img/login/logo.png" class="logo"/>
        <img src="~@/_admin/assets/img/login/loginbg.png" class="contentbg"/>
        <div class="maincontent">
            <div class="left">
                <img src="~@/_admin/assets/img/login/leftbg.png" class="left-img"/>
            </div>
            <div class="right">
                <p class="title">简洁、高效、易用</p>
                <div class="loginform">
                    <input :class="['formcol','username',form.username?'focus':'']" type="text" v-model="form.username" placeholder="请输入用户名"/>
                    <div class="pwd-content">
                        <input :class="['formcol','password',form.password?'focus':'']" :type="pwdshow?'text':'password'" v-model="form.password" placeholder="请输入密码" @keyup.enter="submitForm"/>
                        <span :class="['pwdicon',pwdshow?'showicon':'']" @click="changePwdType"></span>
                    </div>
                    <div class="pwd-content" v-if="isneedGoogle" style="margin-top: 20px;">
                        <!-- Google reCAPTCHA -->
                        <vue-recaptcha :sitekey="siteKey" @verify="onVerify"></vue-recaptcha>
                    </div>
                    
                    <p class="error" >
                        <span v-show="errormsg" class="errorsh">
                            <img src="~@_/assets/img/common/error.png" class="erroricon"/>
                            {{errormsg}}
                        </span>
                    </p>
                    <button class="primarybtn loginbtn" :disabled="loading" @click="submitForm">
                        <span>登录</span>
                        <img src="~@_/assets/img/login/forward.png"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CryptoJS from 'crypto-js';//加密
import {mapMutations} from 'vuex';
import {generaMenu} from '@_/utils/common.js';
import {mgLogin,mgMenu,successTips,msgTips, recaptcha} from '@/_admin/axios/path.js'
import { VueRecaptcha } from 'vue-recaptcha'; // 导入vue-recaptcha库
export default {
    
    data(){
        return {
            siteKey:"6LehRIQpAAAAAPECy6wugsPoGrbA_toepckAUlEn",
            form:{
                username:'',
                password:'',
                authcode:''
            },
            showPhoto:false,
            errormsg:false,
            loading:false,
            pwdshow:false,
            // 谷歌验证是否通过
            isgoogleverify:false,
            // 是否需要谷歌验证
            isneedGoogle:false
        }
    },

    mounted(){
        // var json = JSON.parse(sessionStorage.getItem("allconfig"))
        let json = JSON.parse(sessionStorage.getItem("allconfig"))
        if (json.mg_login_google_isneed == "1") {
            this.isneedGoogle = true;
        } else {
            this.isneedGoogle = false;
        }
    },

    methods:{
         ...mapMutations(['addRouteList','addDealRoutes','setLoginDialog']),

         onVerify(resp) {
            this.isgoogleverify = true;
         },
        submitForm(){
            if (this.isneedGoogle) {
                if (!this.isgoogleverify) {
                    this.errormsg='请先进行人机验证';
                    return;
                }
            }
            
            this.errormsg="";
            let {username,password,authcode}=this.form;
            if(username==""){
                this.errormsg='请输入用户名';
                return;
            }
            if(password==""){
                this.errormsg='请输入密码';
                return;
            }
            this.loading=true;
            //登录加密
            let	key1='$',
                key2='{',
                key3='}';
            let palinstr= `${key1}${key2}${username}${key3}${password}`;
            console.log(CryptoJS.enc.Latin1.parse(palinstr)+">>>>>>>");
            let pd5=CryptoJS.MD5(CryptoJS.enc.Latin1.parse(palinstr)).toString();
            let postdata={loginname:username,pd5:pd5,authcode:authcode};
            console.log("postdate:"+postdata.toString());///////////////////////////////////////////////
            console.log(postdata);
            mgLogin(postdata).then(res=>{
                this.loading=false;
                if(res.ok){
                    //菜单列表
                    let resp=mgMenu();
                    if(resp.ok){
                        this.setRoute(resp.data);
                    }else{
                        msgTips(resp);
                    }
                }else{
                   this.errormsg=res.msg;
                }
            })
        },
        setRoute(routeList){
            let router=[];
            localStorage.setItem("tadminmenu",JSON.stringify(routeList));
            generaMenu(router,routeList);
            this.$router.addRoutes(router);
            this.addRouteList(routeList);
            this.addDealRoutes(router);
            this.setLoginDialog({show:false,title:''});//避免登录后出现-登录超时弹框
            //后台具体页面地址访问时，未登录状态，登录后跳回之前访问的页面
            let routefrom=this.$store.state.myadmin.routefrom;
            if(routefrom){
                let hasroute=false;
                router.map(item=>{
                    if(item.children){
                        let obj=item.children.find(v=>v.path==routefrom.split("/")[1]);
                        if(obj){
                            hasroute=true;
                            this.$router.push({path:routefrom});
                        }
                    }
                })
                if(!hasroute){
                    this.$router.push({path:'/index'});
                }
            }else{
                this.$router.push({path:'/index'});
            }
        },
        /* 修改密码可视状态 */
        changePwdType(){
            this.pwdshow=!this.pwdshow;
        }
    },
    components: {
        VueRecaptcha // 注册vue-recaptcha组件
  },
}
</script>

<style lang="less" scoped>
@import '~@/_admin/assets/style/less/login.less';
</style>