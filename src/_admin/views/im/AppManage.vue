<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">版本号</label>
                <el-input type="text" clearable v-model="filters.version"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">更新模式</label>
                <el-select v-model="filters.mode" placeholder="全部" clearable>
                    <el-option v-for="item in modeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">类型</label>
                <el-select v-model="filters.type" placeholder="全部" clearable>
                    <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" placeholder="全部" clearable>
                    <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)" >查询</button>
                <button class="primarybtn" @click="setData('add')" v-auth="'add'">新增</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="序号" type="index" width="100" :align="$protovar.align"></el-table-column>
                <el-table-column label="版本号" prop="version" :align="$protovar.align"></el-table-column>
                <el-table-column label="应用名称" prop="name" :align="$protovar.align"></el-table-column>
                <el-table-column label="更新模式" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{scope.row.updatemode==1?'正常更新':'强制更新'}}
                    </template>
                </el-table-column>
                <el-table-column label="类型" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{scope.row.type==1?'安卓':'IOS'}}
                    </template>
                </el-table-column>
                <el-table-column label="上传包大小" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{formatSize(scope.row.packagesize)}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span :class="[scope.row.status==1?'tmsuccess':'']">{{scope.row.status==1?'已发布':'已下架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" prop="updatetime" :align="$protovar.align"></el-table-column>
                <el-table-column label="操作"  :align="$protovar.align" width="200" v-if="authdisable">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="setData('edit',scope.row)" v-auth="'update'">修改</span>
                        <span class="tmopera waring" @click="delServer(scope.row)" v-auth="'del'">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagecontainer" v-show="data.totalRow>0">
            <el-pagination layout="total,prev, pager, next,sizes,jumper" background
                :page-size="data.pageSize" 
                :page-sizes="data.pagesizes"  
                :total="data.totalRow"  
                :current-page="data.pageNumber"
                @current-change="handleCurrentChange" 
                @size-change="handleSizeChange">
            </el-pagination>
        </div>
        <!-- 删除 -->
        <el-dialog :visible.sync="dialog2.visible" :width="$protovar.dwidth"  class="tmdialog" :close-on-click-modal="false" > 
            <div class="title">确定删除该版本信息吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog2','visible')">取消</button>
                <button class="primarybtn" @click="sureDel" >删除</button>
            </div>
        </el-dialog>
        <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">APP管理</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="名称" prop="name">
                        <el-input type="textarea" style="width:268px" v-model="dialog.form.name" name="name"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="版本号" prop="version">
                        <el-input v-model="dialog.form.version" name="version"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="更新模式" prop="updatemode">
                        <el-select v-model="dialog.form.updatemode">
                            <el-option v-for="item in modeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="dialog.form.type">
                            <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="tmcol" v-if="dialog.form.type==1">
                    <el-form-item label="安卓包" prop="fileurl">
                        <el-input v-model="dialog.form.fileurl"  class="filename" name="fileurl"></el-input>
                        <span :class="['primarybtn','inputfile',loading?'disable':'']">{{loading?'正在上传':'上传文件'}}<input type="file" multiple @change="uploadFile" v-show="!loading"/></span>
                        <!-- <span class="filesize" v-show="dialog.form.packagesize!=0">{{formatSize(dialog.form.packagesize)}}</span> -->
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialog.form.status">
                            <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <input type="hidden" name="mguid" :value="curruser.id"/>
                <input type="hidden" name="packagesize" v-model="dialog.form.packagesize"/>
                <input type="hidden" name="packagename" :value="dialog.form.type==1?'安卓包':'IOS'"/>
                <input type="hidden" v-model="dialog.form.id" v-if="dialog.type=='edit'" name="id"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit">保存</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {imapp,commonFile,msgTips,successTips} from '@_/axios/path';
import {dataURLtoBlob,formatSize1,resUrl} from '@_/utils/common.js';
export default {
    data(){
        return {
            filters:{
                version:'',
                mode:'',
                type:'',
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
            currdata:null,
            loading:false,
            dialog:{
                type:'add',
                visible:false,
                form:{
                    status:1,
                    type:1,
                    updatemode:1,
                    packagename:'',
                    packagesize:0,
                    fileurl:''
                },
                rules:{
                    name: [
                        {required: true,message: "请输入名称",trigger: "blur"}
                    ],
                    version: [
                        {required: true,message: "请输入版本号",trigger: "blur"}
                    ],
                    fileurl:[
                        {required: true,message: "请上传安卓包"}
                    ],
                }
            },
            dialog2:{
                visible:false
            },
            modeList:[{id:1,label:'正常更新'},{id:2,label:'强制更新'}],
            typeList:[{id:1,label:'安卓'},{id:2,label:'IOS'}],
            statusList:[{id:1,label:'已发布'},{id:2,label:'已下架'}],
            curroute:''
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.getData();
    },
    computed:{
        authdisable(){
            return this.authDisable(['update','del'])
        }
    },
    watch: {
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
        /* 用户数据 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize};
            imapp.appList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        this.data.list=list||[];
                    }
                }else{
                    msgTips(res);
                }
                this.data.loading=false;
            })
        },
         /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 删除 */
        delServer(item){
            this.currdata=item;
            this.dialog2.visible=true;
        },
        /* 确定删除 */
        sureDel(){
            let ptdata={id:this.currdata.id};
            imapp.delApp(ptdata).then(res=>{
                if(res.ok){
                    this.dialog2.visible=false;
                    this.getData();
                }else{
                    msgTips(res);
                }
            })
        },
        /* 提交表单 */
        formSubmit(){
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let dtype=this.dialog.type;
                    let {type,status,updatemode}=this.dialog.form;
                    let res,postdata;
                    postdata=$("#form").serialize()+`&status=${status}&type=${type}&updatemode=${updatemode}`;
                    /* 新增 */
                    if(dtype=="add"){
                        res=await imapp.addApp(postdata);
                    }
                    /* 修改 */
                    if(dtype=="edit"){
                        res=await imapp.updateApp(postdata);
                    }
                    if(res.ok){
                        this.dialog.visible=false;
                        successTips("保存成功");
                        this.getData();
                    }else{
                        msgTips(res); 
                    }
                    
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
            if(type=="add"){
                this.dialog.form=this.$options.data().dialog.form;
            }
            if(type=="edit"){
                let data={...item};
                this.dialog.form=data;
            }
        },
         /* 切换分页 */
		handleCurrentChange(val){
            this.data.pageNumber = val;
            this.getData();
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this.data.pageNumber=1;
            this.data.pageSize=val;
            this.getData();
        },
        /* 上传包 */
        uploadFile(event){
            this.loading=true;
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
                        let data=res.data;
                        _this.dialog.form.packagesize=data.size;
                        _this.dialog.form.fileurl=data.url;
                        // _this.dialog.form.packagename=data.filename;
                    }else{
                        msgTips(res);
                    }
                    _this.loading=false;
                })
                event.target.value="";
            }
        },
        formatSize(size){
            return formatSize1(size);
        }
    },
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/appmanage.less";
</style>