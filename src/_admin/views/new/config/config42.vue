<template>
    <div class="commonright container">
            <div class="filter">
                <div class="filter-item">
                    <label class="filter-label">第42页 靓号图标配置</label>
                </div>
                

            <!-- 数据表格 -->
            <div class="contentpad">
                <div class="filter-btn">
                <el-form :model="dialog.form" :label-width="$protovar.fmlabwidth" ref="form"
                     :hide-required-asterisk="true" class="dialogform" id="form">
                <el-form-item label="上传文件" prop="icon">
                        <el-upload class="upload-demo" ref='upload'  :file-list='file'
                                action='/tioadmin/upload/uploadLianghaoIcon'
                                :limit="1"
                                :on-success="uploadSuccess"
                                :on-error="uploadFailed">
                            <el-button size="small" type="primary">点击上传</el-button>
                            
                        </el-upload>
                    </el-form-item>
                </el-form>
                </div>
                

                <!-- 数据表格 -->
            <div class="contentpad">
                <el-table  :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="序号" width="80" type="index" :align="$protovar.align" :index="indexMethod" ></el-table-column>
                    <el-table-column label="配置项名称" prop="title"></el-table-column>
                    <el-table-column label="参数名" prop="name"></el-table-column>
                    <el-table-column label="参数值" prop="value"></el-table-column>
                    <el-table-column label="单位"  prop="unit" width="150">
                    </el-table-column>
                    <el-table-column label="类型" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.type==1?'系统':'业务'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.updatetime.substring(0,16)}}</span>
                        </template>
                    </el-table-column>
                    
                </el-table>
            </div>
                
            </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mgconfs,msgTips,successTips} from '@_/axios/path';

export default {
    data(){
        return {
            filters:{
                searchkey:'',
                searchkey1:'42',
                type:''
            },
            data:{//数据表格
                loading:false,//表单loading
                list:[],//列表
                form: {
                    filename: null,
                    
                },
                file: null,
                fileList: [],
                fileResult: ""
            },
            dialog:{
                type:'add',
                title:'',
                visible:false,
                form:{
                },
                page:'',
                rules:{
                    title: [
                        {required: true,message: "请输入配置项名称",trigger: "blur"}
                    ],
                    name: [
                        {required: true,message: "请输入参数名",trigger: "blur"}
                    ],
                    value:[
                        {required: true,message: "请输入参数值",trigger: "blur"}
                    ],
                    // unit:[ {required: true,message: "请输入参数单位",trigger: "blur"}],
                    type:[
                        { required: true, message: '请选择参数类型', trigger: 'change' }
                    ],
                    page:[
                        { required: true, message: '请选择页码', trigger: 'blur' }
                    ],
                }
            },
            typeList:[{id:1,label:"系统"},{id:2,label:"业务"}],
            loading:false,
            curroute:'',
            upform: {
                
            }
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.getData();
    },
    computed:{
        authdisable(){
            return this.authDisable(['update']);
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
                this.getData();
            }
        }
    },
    methods:{
        // 上传成功
        uploadSuccess(res) {
            this.data.fileResult = res.data.data;
            successTips("上传成功");
            getData();
        },
        // 上传失败
        uploadFailed() {
            msgTips("上传失败,请重试");
        },
        /* 序号 */
        indexMethod(index) {
            return (index+1);
        },
        /* 用户数据 */
        getData(){
            this.data.loading=true;
            let ptdata={searchkey:this.filters.searchkey,searchkey1:this.filters.searchkey1,type:this.filters.type};
            mgconfs.mgConfLists(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.list=data;
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
        /* 提交表单 */
        formSubmit(){
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading=true;
                    let type=this.dialog.type;
                    let res,postdata;
                    postdata=$("#form").serialize()+`&type=${this.dialog.form.type}`;
                    /* 新增 */
                    if(type=="add"){
                        res=await mgconfs.mgConfAdd(postdata);
                    }
                    /* 修改 */
                    if(type=="edit"){
                        res=await mgconfs.mgConfUpdate(postdata);
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
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.dialog.form=this.$options.data().dialog.form;
                this.dialog.title="新增配置项";
            }
            if(type=="edit"){
                let data={...item};
                this.dialog.form=data;
                this.dialog.title="编辑配置项";
            }
        },
    },
}
</script>