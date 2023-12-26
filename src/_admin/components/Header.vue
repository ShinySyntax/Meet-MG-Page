<template>
    <div>
        <div class="headercontainer">
            <div class="header">
                <div class="head-center">
                    <el-dropdown trigger="click" @visible-change="changeActive($event,'recent')">
                        <span :class="['operitem recent-col',dropdown.type=='recent'&&dropdown.show?'active':'']">
                            最近访问
                        </span>
                        <el-dropdown-menu slot="dropdown" class="recoldrop">
                            <el-dropdown-item v-for="v in recenteList" :key="v.id" @click.native="toPath(v)">{{v.name}}</el-dropdown-item>
                            <el-dropdown-item  v-show="recenteList.length==0">暂无数据</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown trigger="click" @visible-change="changeActive($event,'collect')" :hide-on-click="false">
                        <span :class="['operitem collect-col',dropdown.type=='collect'&&dropdown.show?'active':'']">
                            我的收藏
                        </span>
                        <el-dropdown-menu slot="dropdown" class="recoldrop collectdragmove">
                            <el-dropdown-item v-for="v in collectList" :key="v.id" @click.native="toPath(v)" :class="[dragover?'collectdrag':'']" :did="v.id">
                                {{v.name}}
                                <i class="delcollect" @click.stop="delFavorite(v)"></i>
                            </el-dropdown-item>
                            <el-dropdown-item  v-show="collectList.length==0">暂无数据</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span :class="['operitem recent-col',dropdown.type=='recent'&&dropdown.show?'active':'']" @click="goIm">
                        im
                    </span>
                </div>
                <div class="head-right">
                    <el-dropdown  trigger="click" @visible-change="changeActive($event,'avatar')">
                        <div :class="['avatar flexbox',dropdown.type=='avatar'&&dropdown.show?'avatarbg':'']">
                            <img src="~@_/assets/img/common/avatar.jpg"/>
                            <span class="namerole">
                                <p class="name">{{curruser&&curruser.loginname}}</p>
                            </span>
                            <i :class="[dropdown.type=='avatar'&&dropdown.show?'el-icon-arrow-down':'el-icon-arrow-right']"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown" class="avatardrop">
                            <el-dropdown-item >
                                <span class="dropitem" @click="toEditPwd">
                                    <img src="~@_/assets/img/common/hpwd.png" class="icon"/>
                                    修改密码
                                </span>
                            </el-dropdown-item>
                            <el-dropdown-item >
                                <span class="dropitem" @click="layOut">
                                    <img src="~@_/assets/img/common/hout.png" class="icon"/>
                                    退出登录
                                </span> 
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <TagList></TagList>
        </div>
        <!-- 退出登录 -->
        <el-dialog :visible.sync="visible" :width="$protovar.dwidth" class="tmdialog layout-dialog">
            <div class="title">
                <img src="~@_/assets/img/common/outb.png" class="icon"/>确定退出当前帐号吗？
            </div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn" @click="sureLayOut" :disabled="loading">确定</button>
            </div>
        </el-dialog>
        <!-- 权限变更弹框/系统登录超时 -->
        <el-dialog :visible.sync="tologin.show" :width="$protovar.dwidth"  class="tmdialog" :show-close="false"> 
            <div class="title">{{tologin.title}}</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideAuthDialog">稍后处理？</button>
                <button class="primarybtn" @click="sureLayOut">重新登录！</button>
            </div>
        </el-dialog>
        <!-- 修改密码 -->
        <UpdatePwd :show="visible2" @toEditPwd="toEditPwd"></UpdatePwd>
        <!-- 取消收藏 -->
        <el-dialog :visible.sync="visible3" :width="$protovar.dwidth" class="tmdialog">
            <div class="title">
                确定取消该菜单的收藏？
            </div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog">取消</button>
                <button class="primarybtn" @click="sureDelFavorite" :disabled="loading">确定</button>
            </div>
        </el-dialog>
                   <el-dialog :visible.sync="tioimsShow" :close-on-click-modal="false" class="tmdialog" >
            <p class="tmheader"></p>
            <iframe class="iframe" id="tioim-container-iframe" ref="iframe" border="0" :src="url"  frameborder="no" allowfullscreen ></iframe>
        </el-dialog>
    </div>
    
</template>
<script>
import UpdatePwd from '@_/components/UpdatePwd';
import TagList from '@_/components/TagList';
import {mgheader,mgLogout,successTips ,msgTips} from '@_/axios/path';
import Sortable from 'sortablejs';
export default {
    data(){
        return{
            visible:false,
            visible2:false,
            visible3:false,
            dropdown:{
                type:'',
                show:false
            },
            recenteList:[],//最近访问列表
            collectList:[],//收藏列表
            pageSize:15,//条数
            dragover:false,//拖拽状态
            loading:false,//按钮可以点击状态
            collectid:'',
            tioimsShow:false,
            url:""
        }
    },
    components:{
        UpdatePwd,
        TagList
    },
    methods:{
        /* 拖拽排序 */
        drag(){
            let _this=this;
            new Sortable(document.getElementsByClassName("collectdragmove")[0], {
                ghostClass: 'blue-drag-collect',
                animation: 150,
                // 结束拖拽
                onEnd: function (evt) {
                    _this.dragover=false;
                    let $item=$(evt.item);
                    let did=$item.attr("did");
                    let obj={};
                    obj['id']=did;
                    if($item.prev().length>0){
                        let topdid=$item.prev().attr("did");
                        obj['topdid']=topdid;
                    }
                    mgheader.topmenuIndex(obj).then(res=>{
                        if(!res.ok){
                            msgTips(res);
                        }
                    }) 
                },
                onMove: function () {
                    _this.dragover=true;
	            },
            });
        },
        /* 下拉框出现/隐藏时触发 */
        changeActive(show,type){
            this.dropdown.type=type;
            this.dropdown.show=show;
            if(type=='recent'){
                mgheader.recentPage({pageSize:this.pageSize}).then(res=>{
                    if(res.ok){
                        this.recenteList=res.data;
                    }else{
                        msgTips(res);
                    }
                })
            }
            if(type=="collect"){
                this.getFavoriteList();
            }
        },
        /* 获取收藏列表 */
        getFavoriteList(){
            mgheader.favoriteList({}).then(res=>{
                if(res.ok){
                    this.collectList=res.data;

                    this.$nextTick(()=>{
                        this.drag()
                    })
                }else{
                    msgTips(res);
                }
            })
        },
        /* 修改密码 */
        toEditPwd(){
            this.visible2=!this.visible2;
        },
        /* 退出登录 */
        layOut(){
            this.visible=true;
        },
        /* 确定退出登录 */
        sureLayOut(){
            this.loading=false;
            mgLogout().then(res=>{
                this.$router.push({path:'/login'});
                this.loading=true;
            })
        },
        /* 跳转页面 */
        toPath(item){
            this.$router.push({path:'/'+item.routekey});
        },
        /* 取消收藏 */
        delFavorite(item){
            this.collectid=item.id;
            this.visible3=true;
        },
        /* 取消-隐藏弹框 */
        hideDialog(){
            this.visible3=false;
        },
        /* 确认取消收藏 */
        sureDelFavorite(){
            let ptdata={
                'id':this.collectid
            };
            this.loading=true;
            mgheader.delFavorite(ptdata).then(res=>{
                if(res.ok){
                    successTips('取消成功');
                    this.getFavoriteList();
                     this.visible3=false;
                }else{
                    msgTips(res);
                }
                this.loading=false;
            })
        },
        /* 隐藏权限弹框 */
        hideAuthDialog(){
            this.$store.commit("setLoginDialog",{show:false,title:''});
        },
        goIm(){
          let bs_tio_session = this.getCookie('tio_mg_session'),imsite = this.sysparams.imsite
          if(bs_tio_session){
            window.location.href = imsite+'/tioims/home?bs_tio_session='+bs_tio_session
          }
        },
        getCookie(name) { 
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); 
        　　 return (arr=document.cookie.match(reg))?unescape(arr[2]):null;
        }
    },
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/header.less";
</style>