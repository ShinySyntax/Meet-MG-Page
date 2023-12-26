<template>
    <div class="commonright container">
        <div class="filter">
           <div class="filter-item">
                <label class="filter-label">企业</label>
                <el-select v-model="filters.cmpid" clearable>
                    <el-option v-for="item in cmpList" :key="item.id" :value="item.id" :label="item.cmpname"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" clearable placeholder="全部">
                    <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData">查询</button>
                <button class="primarybtn" v-auth="'add'" @click="setData('add')">新增</button>
            </div>
        </div>
        <div class="contentpad">
            <!-- 数据表格 -->
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="企业ID"  prop="id" :align="$protovar.align"></el-table-column>
                <el-table-column label="企业简称" prop="cmpname" :align="$protovar.align"></el-table-column>
                <el-table-column label="企业名称" prop="cmpfullname" :align="$protovar.align"></el-table-column>
                <el-table-column label="LOGO" :align="$protovar.align">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.cmplogo"  class="imgcol"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="简介" :align="$protovar.align" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="overell">{{scope.row.description||"--"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已发布职位" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pubcount>0" class="tmopera" @click="toRctPost(scope.row)">{{scope.row.pubcount}}</span>
                        <span v-else>0</span>
                    </template>
                </el-table-column>
                <el-table-column label="收到简历" prop="position" :align="$protovar.align">
                    <template slot-scope="scope">
                        <!-- cmpid -->
                        <span v-if="scope.row.subcount>0" class="tmopera" @click="toRctRsm(scope.row)">{{scope.row.subcount}}份</span>
                        <span v-else>0份</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="status" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.status==1?'有效':'无效'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  :align="$protovar.align" width="200" v-if="authdisable">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="setData('edit',scope.row)" v-auth="'update'">修改</span>
                        <span class="tmopera" @click="setDisable(scope.row)" v-auth="'disable'">{{scope.row.status==1?'下架':'上架'}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新增|编辑 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">企业信息</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="企业名称" prop="cmpfullname">
                        <el-input v-model="dialog.form.cmpfullname" name="cmpfullname"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="企业简称" prop="cmpname">
                        <el-input v-model="dialog.form.cmpname" name="cmpname"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="LOGO" prop="cmplogo">
                        <img :src="setUrl(dialog.form.cmplogo)" class="logoimg" v-show="dialog.form.cmplogo"/>
                        <span class="primarybtn fileimg">上传图片<input type="file" @change="uploadImg" accept="image/*" /></span>
                        <el-input v-model="dialog.form.cmplogo" style="display:none;" name="cmplogo"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="简介信息" prop="description">
                        <el-input v-model="dialog.form.description" name="description" type="textarea"></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialog.form.status">
                            <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <input type="hidden" v-model="dialog.form.id" v-if="dialog.type=='edit'" name="id"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit" :disabled="loading">保存</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {recruit,commonFile,msgTips,successTips} from '@_/axios/path';
import {dataURLtoBlob,resUrl} from '@_/utils/common.js';
export default {
    data(){
        return {
            filters:{//筛选表单
                cmpid:'',
                status:''
            },
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            dialog:{
                type:'add',
                visible:false,
                form:{
                    cmplogo:''
                },
                rules:{
                    cmpname: [
                        {required: true,message: "请输入企业简称",trigger: "blur"}
                    ],
                    cmpfullname: [
                        {required: true,message: "请输入企业全称",trigger: "blur"}
                    ],
                    cmplogo:[
                        {required: true,message: "请选择图片",trigger: "blur"}
                    ],
                    description:[
                        {required: true,message: "请输入简介",trigger: "blur"}
                    ],
                    status:[
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                }
            },
            cmpList:[],
            statusSelect:[{id:1,label:'有效'},{id:2,label:'无效'}],
            resserver:'',
            loading:false,
            curroute: ''
        }
    },
	created(){
        this.curroute=this.$route.path;
        this.dictList();
        this.getData();
    },
    computed:{
        authdisable(){
            return this.authDisable(['update','disable']);
        }
    },
    watch:{
        '$route'(to,from){
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.dictList();
                this.getData();
            }
        }
    },
    methods:{
        /* 查询列表 */
        getData(){
            this.data.loading=true;
            recruit.cmpQueryList({...this.filters}).then(res=>{
                if(res.ok){
                    let data=res.data;
                    data.map(item=>{
                        item.cmplogo=resUrl(item.cmplogo);
                    })
                    this.data.list=res.data;
                }
                this.data.loading=false;
            })
        },
        /* 企业字典列表 */
        dictList(){
            recruit.cmpDictList().then(res=>{
                if(res.ok){
                    this.cmpList=res.data;
                }
            })
        },
        /* 新增|编辑 */
        setData(type,item){
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.dialog.form=this.$options.data().dialog.form;
            }
            if(type=="edit"){
                let data={...item};
                this.dialog.form=data;
            }
        },
        /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 上传处理数据 */
        uploadImg(event){
            let _this=this,
                file = event.currentTarget.files[0],
                reader = new FileReader();
            reader.readAsDataURL(file); 
            reader.onload = function (e) { 
                let blob=dataURLtoBlob(this.result);
                let fd=new FormData();
                fd.append("uploadFile",blob,file.name);
                fd.append("type",1);
               commonFile(fd).then(res=>{
                    if(res.ok){
                        _this.dialog.form.cmplogo=res.data.url;
                    }else{
                        msgTips(res);
                    }
                })
                event.target.value="";
            }
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
                    if(type=="add"){
                        res=await recruit.cmpAdd(postdata);
                    }
                    /* 修改 */
                    if(type=="edit"){
                        res=await recruit.cmpUpdate(postdata);
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
        /* 启用|禁用 */
        setDisable(item){
            let ptdata={
                cmpid:item.id,
                status:item.status==1?2:1
            };
            recruit.cmpDisable(ptdata).then(res=>{
                if(res.ok){
                    successTips("修改成功");
                    this.getData();
                }else{
                    msgTips(res);
                }
            })
        },
        /* 已发布职位 */
        toRctPost(item){
            this.$router.push({"path":'/recruitcpost',"query":{"cmpid":item.id}})
        },
        /* 已投递简历 */
        toRctRsm(item){
            this.$router.push({"path":'/recruitcresume',"query":{"cmpid":item.id}})
        },
        setUrl(path){
            return resUrl(path);
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/official/recruit.less";
</style>

