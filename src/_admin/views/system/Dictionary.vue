<template>
    <div class="commonright container">
        <div class="leftcontent">
            <div class="search">
                <el-input placeholder="输入实时查询" v-model="name" @input="getData"></el-input>
                <button class="primarybtn" @click="setData('addpar')" v-auth="'padd'">新增字典</button>
            </div>
            <ul class="diclist">
                <li :class="['dic-col',pcode==v.code?'active':'']" v-for="v in topList" :key="v.id" @click="getChildData(v)">
                    <span :class="['list-name flexbox',v.status==2?'list-status':'']">
                        {{v.name}}
                        <img src="~@_/assets/img/system/disable.png" v-if="v.status==2" class="dicstatus"/>
                    </span>
                    <span class="dic-oper" v-show="pcode==v.code">
                        <span class="tmopera" @click.stop="setData('editpar',v)" v-auth="'pupdate'">修改</span>
                        <span class="tmopera waring" @click.stop="dicDel(v,'delpar')" v-auth="'pdel'">删除</span>
                        <span :class="['tmopera',v.status==2?'open':'']" @click.stop="dicDisable(v,'disalpar')" v-auth="'pdisable'">{{v.status==1?'停用':'启用'}}</span>
                    </span>
                </li>
            </ul>
        </div>
        <div class="rightcontent">
            <div class="child-top">
                <span>当前字典项：{{pname}}</span>
                <button class="primarybtn fr" @click="setData('addchild')" v-auth="'cadd'">
                    <i class="el-icon-plus"></i>新增子项
                </button>
            </div>
            <div class="contentpad">
                <div class="diclist">
                    <div class="dicrow listheader">
                        <span class="dic-drag" v-auth="'cindex'"></span>
                        <span class="dic-name">名称</span>
                        <span class="dic-code">编码</span>
                        <span class="dic-val">参数/值</span>
                        <span class="dic-status">状态</span>
                        <span class="dic-index">排序号</span>
                        <span class="dic-opera" v-auth="{'list':['cupdate','cinsert','cdel','cdisable']}">操作</span>
                    </div>
                    <div v-if="childList.length==0" class="nodata">
                        暂无数据
                    </div>
                    <div :class="['dicitem',dragover?'':'dichover']">
                        <div v-for="(v,index) in childList" :key="v.id" :did="v.id" class="dicrow">
                            <span class="dic-drag" v-auth="'cindex'">
                                <i class="my-handler"  @mouseover="showTips" @mouseleave="hideTips" ></i>
                            </span>
                            <span class="dic-name">{{v.name}}</span>
                            <span class="dic-code">{{v.code||'--'}}</span>
                            <span class="dic-val">{{v.attribute||'--'}}</span>
                            <span :class="['dic-status',v.status==1?'tmdisabledfalse':'tmdisabledtrue']">{{v.status==1?'有效':'无效'}}</span>
                            <span class="dic-index">{{index+1}}</span>
                            <span class="dic-opera" v-auth="{'list':['cupdate','cinsert','cdel','cdisable']}">
                                <span class="tmopera" @click="setData('addinsertchild',v)" v-auth="'cinsert'">插入</span>
                                <span class="tmopera" @click="setData('editchild',v)" v-auth="'cupdate'">修改</span>
                                <span class="tmopera waring"  @click="dicDel(v,'delchild')" v-auth="'cdel'">删除</span>
                                
                                <span :class="['tmopera',v.status==1?'stateDisabled':'statesuccess']"  @click.stop="dicDisable(v,'disalchild')" v-auth="'cdisable'">{{v.status==1?'停用':'启用'}}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 拖动提示 -->
        <transition name="el-fade-in-linear">
            <div class="dragsort" :style="{left:tips.left,top:tips.top}" v-show="tips.show">
                按住拖动排序
            </div>
        </transition>
        <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="form">
                <div class="tmcol" v-if="dialog.type.indexOf('child')!=-1">
                    <el-form-item label="所属字典">
                        <el-input v-model="pname" :disabled="true"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="字典名称" prop="name">
                        <el-input v-model="dialog.form.name" name="name"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="dialog.form.code" :name="dialog.type.indexOf('add')!=-1?'code':''" :disabled="dialog.type.indexOf('edit')!=-1"></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="参数/值" prop="attribute">
                        <el-input v-model="dialog.form.attribute" name="attribute"></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialog.form.status">
                            <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <div class="tmcol" v-if="dialog.type.indexOf('add')!=-1">
                    <el-form-item>
                       <el-checkbox  v-model="checkbox">保存不关闭继续添加</el-checkbox>
                    </el-form-item>
                </div> 
                <input type="hidden" :value="dialog.type=='addpar'?-1:pcode" name="pcode" v-if="dialog.type.indexOf('add')!=-1"/>
                <input type="hidden" :value="dialog.form.id" name="id" v-if="dialog.type.indexOf('edit')!=-1"/>
                <input type="hidden" :value="dialog.form.bid" name="bid" v-if="dialog.type=='addinsertchild'"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit" :disabled="loading">保存</button>
            </div>
        </el-dialog>
        <!-- 确认排序 -->
        <el-dialog :visible.sync="dialog2.visible" :width="$protovar.dwidth"  class="tmdialog" :before-close="setOriginal"> 
            <div class="title">确定修改当前排序吗？</div>
            <div class="tmdialog-footer pb60">
               <button class="primarybtn search" @click="setOriginal">取消</button>
                <button class="primarybtn" @click="saveSort" :disabled="loading">保存</button>
            </div>
        </el-dialog>
        <!-- 删除 -->
        <el-dialog :visible.sync="dialog3.visible" :width="$protovar.dwidth"  class="tmdialog"> 
            <div class="title">确定删除当前字典项吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog3','visible')">取消</button>
                <button class="primarybtn" @click="sureDel" :disabled="loading">删除</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mgdic,msgTips,successTips} from '@_/axios/path';
import Sortable from 'sortablejs';
export default {
    data(){
        return {
            name:'',
            pcode:'',
            pname:'',
            topList:[],//父列表
            childList:[],//字列表
            statusList:[{id:1,label:'有效'},{id:2,label:'失效'}],
            checkbox:true,
            dialog:{
                type:'addpar',
                title:'',
                visible:false,
                form:{
                    status:1,
                },
                rules:{
                    name:[{ required: true, message: '请输入字典名称', trigger: 'change' }
                    ],
                    code: [
                        {required: true,message: "请输入编码",trigger: "blur"}
                    ],
                    status:[
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                }
            },
            dialog2:{
                visible:false,
                evt:null
            },
            dialog3:{
                visible:false,
                title:'确定删除当前字典项吗？',
                type:'delpar',
                item:null
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
    mounted(){
        this.curroute=this.$route.path;
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
                this.getData();
            }
        }
    },
    methods:{
        /* 父项列表 */
        getData(){
            let ptdata={name:this.name};
            mgdic.mgDicTopList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    this.topList=data;
                    if(data&&data.length>0){
                        if(this.pcode==''){
                            this.pcode=data[0].code;
                            this.pname=data[0].name;
                        }else{
                            this.pname=(data.find(item=>item.code==this.pcode)).name;
                        }
                        this.getChildData();
                    }
                }else{
                    msgTips(res);
                }
            })
        },
        /* 子项列表 */
        getChildData(item){
            if(item){
                this.pcode=item.code;
                this.pname=item.name;
            }
            let data={pcode:this.pcode};
            mgdic.mgDicChildList(data).then(res=>{
                if(res.ok){
                    this.childList=res.data;
                    this.drag();
                }else{
                    msgTips(res);
                }
            })
        },
        /* 拖拽排序 */
        drag(){
            let _this=this;
            new Sortable(document.getElementsByClassName("dicitem")[0], {
                // invertSwap: true,
                ghostClass: 'blue-background-class',
                handle:".my-handler",
                animation: 150,
                // 结束拖拽
                onEnd: function (evt) {
                    var itemEl = evt.item; 
                    _this.dialog2.visible=true;
                    _this.dialog2.evt=evt;
                    _this.dragover=false;
                    // _this.saveAuthIndex(evt);
                },
                onMove: function () {
                    _this.dragover=true;
	            },
            });
        },
        /* 显示提示 */
        showTips(e){
            if(!this.dragover){
                this.tips.show=true;
                let offset=$(e.currentTarget).offset();
                this.tips.left=offset.left- 20+'px';
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
        /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 提交表单 */
        formSubmit(){
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading=true;
                    let type=this.dialog.type;
                    let res,postdata;
                    postdata=$("#form").serialize()+`&status=${this.dialog.form.status}`;
                    /* 新增 */
                    if(type=="addpar"||type=="addchild"){
                        res=await mgdic.mgDictAdd(postdata);
                    }
                    /* 插入 */
                    if(type=="addinsertchild"){
                        res=await mgdic.mgDictInsert(postdata);
                    }
                    /* 修改 */
                    if(type=="editpar"||type=="editchild"){
                        res=await mgdic.mgDictUpdate(postdata);
                    }
                    if(res.ok){
                        if(type.indexOf('add')!=-1&&this.checkbox){
                            this.$refs.form.resetFields();
                            this.dialog.type=type;
                        }else{
                            this.dialog.visible=false;
                            this.dialog.form=this.$options.data().dialog.form;
                        }
                        successTips("保存成功");
                        if(type.indexOf('par')!=-1){
                            this.getData();
                        }
                        if(type.indexOf('child')!=-1){
                            this.getChildData();
                        }
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
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="addpar"){
                this.dialog.form=this.$options.data().dialog.form;
                this.dialog.title="新增字典项";
            }
            if(type=="addchild"||type=="addinsertchild"){
                this.dialog.form=this.$options.data().dialog.form;
                this.dialog.title="添加字典子类";
                if(type=="addinsertchild"){
                    this.dialog.form.bid=item.id;
                }
            }
            if(type=="editpar"||type=="editchild"){
                let data={...item};
                this.dialog.form=data;
                this.dialog.title="修改字典项";
            }
            if(type=="editchild"){
                this.dialog.title="修改字典子类";
            }
        },
        /* 取消排序 */
        setOriginal(){
            let list=this.childList;
            this.childList=[];
            setTimeout(()=>{
                this.childList=list;
            },10)
            this.dialog2.visible=false;
        },
        /* 确认排序 */
        saveSort(){
            this.loading=true;
            let evt=this.dialog2.evt;
            let obj={};
            let $item=$(evt.item);
            let did=$item.attr("did");
            obj['did']=did;
            if($item.prev().length>0){
                let topdid=$item.prev().attr("did");
                obj['topdid']=topdid;
            }
            mgdic.mgDictIndex(obj).then(res=>{
                this.getChildData();
                if(!res.ok){
                    msgTips(res);
                }
                this.dialog2.visible=false;
                this.loading=false;
            }) 
        },
        /* 删除 */
        dicDel(item,type){
            this.dialog3.item=item;
            this.dialog3.type=type;
            if(type=="delpar"){
                this.dialog3.title="确定删除当前字典项吗？";
            }
            if(type=="delchild"){
                this.dialog3.title="确定删除该子项吗？";
            }
            this.dialog3.visible=true;
        },
        /* 确认删除 */
        sureDel(){
            this.loading=true;
            let ptdata={id:this.dialog3.item.id};
            mgdic.mgDicDel(ptdata).then(res=>{
                if(res.ok){
                    successTips("删除成功");
                    this.dialog3.visible=false;
                    if(this.dialog3.type=="delpar"){
                        this.pcode="";
                        this.getData();
                    }else{
                        this.getChildData();
                    }
                    this.loading=false;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 启用|禁用 */
        dicDisable(item,type){
            let ptdata={id:item.id,status:item.status==1?2:1};
            mgdic.mgDicDisable(ptdata).then(res=>{
                if(res.ok){
                    successTips("修改成功");
                    if(type=="disalpar"){
                        this.getData();
                    }else{
                        this.getChildData();
                    }
                }else{
                    msgTips(res);
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/system/dictionary.less";
</style>