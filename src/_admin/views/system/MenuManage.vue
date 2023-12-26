<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">类型</label>
                <el-select v-model="filters.type" clearable placeholder="全部">
                    <el-option v-for="v in typeselect" :key="v.id" :value="v.id" :label="v.label"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" clearable>
                    <el-option v-for="v in statuselect" :key="v.id" :value="v.id" :label="v.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData()" >查询</button>
                <button class="primarybtn" @click="setData('add')" v-auth="'add'">新增</button>
            </div>
        </div>
        <div class="contentpad">
            <div :class="['menulist',dragover?'':'menuhover']" id="menulist">
                <div class="menu-col listheader">
                    <div class="men-col-name">菜单名称</div>
                    <div class="men-col-url">URL</div>
                    <div class="men-col-route">路由</div>
                    <div class="men-col-type">类型</div>
                    <div class="men-col-status">状态</div>
                    <div class="men-col-see" v-auth="'osee'">操作权限</div>
                    <div class="men-col-oper" v-auth="{'list':['update','disable','del']}">操作</div>
                </div>
                <MenuItem :menusItem="listData" ref="menuparent" :applyThis="applyThis"></MenuItem>
            </div>
        </div>
        <!-- 删除 -->
        <el-dialog :visible.sync="dialog2.visible" :width="$protovar.dwidth"  class="tmdialog"> 
            <div class="title">确定删除当前菜单吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog2','visible')">取消</button>
                <button class="primarybtn" @click="sureDel" :disabled="loading">删除</button>
            </div>
        </el-dialog>
        <!-- 确认排序 -->
        <el-dialog :visible.sync="dialog3.visible" :width="$protovar.dwidth"  class="tmdialog" :before-close="setOriginal"> 
            <div class="title">确定修改当前排序吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="setOriginal">取消</button>
                <button class="primarybtn" @click="saveSort" :disabled="loading">保存</button>
            </div>
        </el-dialog>
        <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form"
                     :hide-required-asterisk="true" class="dialogform sdialogform" id="form">
<!--                <div class="tmcol">-->
<!--                    <el-form-item label="上级菜单" prop="pid">-->
<!--                        <ElTreeSelect-->
<!--                                popoverClass="fas"-->
<!--                                v-model="dialog.form.pid"-->
<!--                                :treeParams="treeParams"-->
<!--                                :selectParams="selectParams"-->
<!--                                ref="treeSelect"-->
<!--                        ></ElTreeSelect>-->
<!--                    </el-form-item>-->
<!--                </div>-->
                <div class="tmcol">
                <el-form-item label="上级菜单" prop="pid">
                    <el-tree-select
                            popoverClass="fas"
                            v-model="dialog.form.pid"
                            :treeParams="treeParams"
                            :selectParams="selectParams"
                            ref="treeSelect"
                    ></el-tree-select>
                </el-form-item>
            </div>
                <div class="tmcol">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialog.form.name" name="name"></el-input>
                    </el-form-item>
                </div>  
                <div v-if="dialog.form.type==2">
                    <div class="tmcol">
                        <el-form-item label="路径" prop="authurl">
                            <el-input v-model="dialog.form.authurl" name="authurl"></el-input>
                            <span class="visitcheck" @click="visitCheck">访问验证</span>
                        </el-form-item>
                    </div>  
                    <div class="tmcol">
                        <el-form-item label="路由" prop="routekey">
                            <el-input v-model="dialog.form.routekey" name="routekey"></el-input>
                        </el-form-item>
                    </div> 
                </div>
                <div class="tmcol">
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="dialog.form.type">
                            <el-option v-for="item in typeselect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialog.form.status">
                            <el-option v-for="item in statuselect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <input type="hidden" name="id" :value="dialog.form.id"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit" :disabled="loading">保存</button>
            </div>
        </el-dialog>
        <!-- 权限组件 -->
        <AuthOper :show="dialog4.visible" :data="dialog4.data" @closeAuthOper="closeAuthOper"></AuthOper>
        <!-- 提示 -->
        <transition name="el-fade-in-linear">
            <div class="dragsort" :style="{left:tips.left,top:tips.top}" v-show="tips.show">
                按住拖动排序
            </div>
        </transition>
        <!-- 禁用二次确认弹框 -->
        <DisableOper :show="disableoper.show" @handleDisableClose="handleDisableShow" @sureDisableOper="sureDisableOper"></DisableOper>
    </div>
</template>
<script>
import MenuItem from '@_/components/system/MenuItem.vue';
import AuthOper from '@_/components/system/AuthOper.vue';
import {mgauth,msgTips,successTips} from '@_/axios/path';
import Sortable from 'sortablejs';
export default {
    data(){
        return {
            filters:{//筛选表单字段
                type:'',
                status:'',
            },
            listData:[],
            typeselect:[{id:1,label:'菜单'},{id:2,label:'页面'}],
            statuselect:[{id:1,label:'有效'},{id:2,label:'无效'}],
            selectParams:{
                clearable:false
            },
            treeParams: {
                clickParent: true,
                'check-strictly': true,
                'default-expand-all': true,
                'expand-on-click-node': false,
                data: [],
                props: {
                    children: 'childs',
                    label: 'name',
                    value: 'id'
                }
            },
            dialog:{
                type:'add',
                title:'',
                visible:false,
                form:{
                },
                rules:{
                    pid:[{ required: true, message: '请选择父级菜单', trigger: 'change' }
                    ],
                    authurl: [
                        {required: true,message: "请输入页面路径",trigger: "blur"}
                    ],
                    routekey: [
                        {required: true,message: "请输入路由",trigger: "blur"}
                    ],
                    name:[
                        {required: true,message: "请输入名称",trigger: "blur"}
                    ],
                    type:[ {required: true,message: "请选择类型",trigger: "change"}],
                    status:[
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                }
            },
            applyThis:null,
            dialog2:{
                visible:false,
                data:{}
            },
            dialog3:{
                visible:false,
                evt:null
            },
            dialog4:{
                visible:false,
                data:{},
            },
            tips:{
                left:0,
                top:0,
                show:false,
                timer:null
            },
            dragover:false,
            loading:false,
            curroute:''
        }
    },
    components:{
        MenuItem,
        AuthOper,
    },
    mounted(){
        this.curroute=this.$route.path;
        this.applyThis=this;
        this.getData();
    },
    watch:{
        '$route'(to,from){
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.applyThis=this;
                this.getData();
            }
        }
    },
    methods:{
        /* 菜单列表 */
        getData(item){
            this.listData=[];
            mgauth.mgAuthList(this.filters).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.listData=data;
                    }
                }else{
                    msgTips(res);
                }
                this.$nextTick(()=>{
                    this.drag();
                })
            })
        },
         /* 拖拽 */
        drag() {
            let _this=this;
            var elements = document.getElementsByClassName('menusitem');
            for (var i = 0; i < elements.length; i++) {
                new Sortable(elements[i], {
                    group: 'shared',
                    invertSwap: true,
                    ghostClass: 'blue-background-class',
                    handle:".my-handler",
                    animation: 150,
                    // 结束拖拽
                    onEnd: function (evt) {
                        var itemEl = evt.item; 
                        _this.dialog3.visible=true;
                        _this.dialog3.evt=evt;
                        _this.dragover=false;
                    },
                    onMove: function (evt) {
                        _this.dragover=true;
                        //处理拖拽过程-当前行缩进样式
                        let $related=$(evt.related);
                        let $dragged=$(evt.dragged);
                        let relatedSet=$related.attr("dragset");
                        let relatetype=$related.attr("type");
                        if(relatedSet){
                            if($dragged.hasClass("menurow")){
                                let pad=relatedSet-$dragged.attr("dragset");
                                if(pad>0){
                                    $dragged.css("padding-left",pad+'px');
                                    $dragged.css("margin-left",'0px');
                                }else{
                                    $dragged.css("padding-left",'0px');
                                    $dragged.css("margin-left",pad+'px');
                                }
                            }else{
                                $dragged.find(".men-col-name").css("padding-left",relatedSet+'px');
                            }
                        }else{
                            if($dragged.hasClass("menurow")){
                                $dragged.css("margin-left",'0px');
                                $dragged.css("padding-left",'20px');
                            }else{
                                $dragged.find(".men-col-name").css("padding-left",parseInt($related.attr("singled"))+20+'px');
                            }
                        }
                    },
                });
            }
        },
        /* 取消-排序 */
        setOriginal(){
            let data=[...this.listData];
            this.listData=[];
            this.dialog3.visible=false;
            $(this.dialog3.evt.item).remove();
            /* 页面视图不更新问题 */
            setTimeout(()=>{
                this.listData=data;
                this.$nextTick(()=>{
                    this.drag();
                })
            },10)
        },
        /* 菜单-重排序 */
        saveSort(){
            this.loading=true;
            let evt=this.dialog3.evt;
            let topflag,toaid,aid;
            let $item=$(evt.item);
            aid=$item.attr("aid");
            if($item.prev().length>0){
                toaid=$item.prev().attr("aid");
                topflag=2;
            }else{
                toaid=$item.parent().parent().attr("aid")||-1;
                topflag=1;
            }
            let ptdata={topflag,toaid,aid};
            mgauth.mgAuthIndex(ptdata).then(res=>{
                if(res.ok){
                    this.getData();
                }else{
                    this.getData();
                    msgTips(res);
                }
                this.dialog3.visible=false;
                this.loading=false;
            }) 
        },
        /* 显示权限管理弹框 */
        seeOper(item){
            this.dialog4.visible=true;
            this.dialog4.data=item;
        },
        /* 关闭权限管理弹框 */
        closeAuthOper(){
           this.dialog4.visible=false; 
           this.dialog4.data={};
        },
        /* 删除菜单 */
        delItem(item){
            this.dialog2.data=item;
            this.dialog2.visible=true;
        },
        /* 确认删除 */
        sureDel(){
            this.loading=true;
            let ptdata={"aid":this.dialog2.data.id};
            mgauth.mgAuthDel(ptdata).then(res=>{
                this.dialog2.visible=false;
                if(res.ok){
                    this.getData();
                }else{
                    msgTips(res);
                }
                this.loading=false;
            })
        },
        /* 显示提示 */
        showTips(e){
            if(!this.dragover){
                this.tips.show=true;
                let offset=$(e.currentTarget).offset();
                this.tips.left=offset.left - 20+'px';
                this.tips.top=offset.top-$(window).scrollTop() + 50+'px';
                if(this.tips.timer){
                    clearTimeout(this.tips.timer);
                }
                this.tips.timer=setTimeout(()=>{
                    this.tips.show=false;
                },2000)
            }
        },
        /* 隐藏提示 */
        hideTips(){
            this.tips.show=false;
        },
        /* 提交表单 */
        formSubmit(formName){
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    this.loading=true;
                    let res;
                    let {pid,status,type}=this.dialog.form;
                    let postdata=$("#form").serialize()+`&pid=${pid}&status=${status}&type=${type}`;
                    /* 修改 */
                    if(this.dialog.type=="add"||this.dialog.type=="addchild"){
                        res=await mgauth.mgAuthAdd(postdata);
                    }
                    if(this.dialog.type=="edit"){
                        res=await mgauth.mgAuthUpdate(postdata);
                    }
                    if(res.ok){
                        this.dialog.visible=false;
                        successTips("保存成功");
                        this.dialog.form=this.$options.data().dialog.form;
                        this.getData();
                    }else{
                        msgTips(res); 
                    }
                    this.loading=false;
                } else {
                    return false;
                }
            });
        },
        /* 新增|编辑 */
        setData(type,item){
            this.getMenuList();
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.dialog.form=this.$options.data().dialog.form;
                this.dialog.title="新增菜单";
            }
            if(type=="edit"){
                this.dialog.form={...item};
                this.dialog.title="维护菜单";
            }
            if(type=="addchild"){
                this.dialog.form=this.$options.data().dialog.form;
                this.dialog.form.pid=item.id;
                this.dialog.title="新增菜单";
            }
        },
        /* 纯菜单树 */
        getMenuList(){
            mgauth.mgMenuList().then(res=>{
                if(res.ok){
                    this.treeParams.data=[{id:-1,name:'创建一级菜单'}];
                    this.treeParams.data=this.treeParams.data.concat(res.data);
                    console.log(this.$refs.treeSelect)
                    console.log(this.treeParams)
                    this.$refs.treeSelect.treeDataUpdateFun(this.treeParams.data);
                }else{
                    this.treeParams.data=[];
                }
            })
        },
        /* 启用|禁用 */
        setAuthOpen(item){
            if(item.status==1){
                this.setDisableClick(item);
            }else{
                this.comDisable(item);
            }
        },
        /* 确认禁用 */
        sureDisableOper(){
            this.handleDisableShow(false);
            this.comDisable(this.disableoper.data);
        },
        comDisable(item){
            let ptdata={aid:item.id,status:item.status==1?2:1};
            mgauth.mgAuthDisable(ptdata).then(res=>{
               if(res.ok){
                    successTips("修改成功");
                    this.getData();
                }else{
                    msgTips(res); 
                }
            })
        },
        /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 访问验证 */
        visitCheck(){
            let authurl=this.dialog.form.authurl;
            if(authurl){
                window.open(location.origin+"/#/"+authurl);
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/system/menumanage.less";
</style>