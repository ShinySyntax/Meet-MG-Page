<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="topcontainer">
            <div class="filter">
                <div class="filter-item">
                    <label class="filter-label">类型</label>
                    <el-select v-model="filters.type" placeholder="全部" clearable>
                        <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                    </el-select>
                </div>
                <div class="filter-item">
                    <label class="filter-label">付款方</label>
                    <el-select v-model="filters.paytype" placeholder="全部" clearable>
                        <el-option v-for="item in payList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                    </el-select>
                </div>
                <div class="filter-btn">
                    <button class="primarybtn search" @click="getData(1)" >查询</button>
                </div>
            </div>
            <div class="top-right">
                <span class="total">金额合计：<span>{{total}}</span></span>
                <button class="primarybtn" @click="setData('add')">添加发票</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="发票号码" prop="no" width="100" :align="$protovar.align"></el-table-column>
                <el-table-column label="货物或应税劳务、服务名称" prop="name" :align="$protovar.align"  width="200"></el-table-column>
                <el-table-column label="发票金额" prop="amount" :align="$protovar.align"></el-table-column>
                <el-table-column label="类型" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{scope.row.type==1?'报销':(scope.row.type==2?'抵税':'')}}
                    </template>
                </el-table-column>
                <el-table-column label="付款方" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{scope.row.paytype==1?'个人':(scope.row.paytype==2?'公司':'')}}
                    </template>
                </el-table-column>
                <el-table-column label="开票日期" :align="$protovar.align" prop="time">
                </el-table-column>
                <el-table-column label="上传时间" :align="$protovar.align" prop="uploadtime">
                </el-table-column>
                <el-table-column label="操作"  :align="$protovar.align"  v-if="authdisable">
                    <template slot-scope="scope">
                        <span class="tmopera" v-auth="'see'" @click="seeInvoice(scope.row)">查看</span>
                        <span :class="['tmopera',scope.row.status==1?'tmtray':'']" v-auth="'update'" @click="setData('edit',scope.row)">修改</span>
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
        <!-- 新增|修改 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" class="dialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="发票号码">
                        <el-input v-model="dialog.form.no"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="商品或服务名称" prop="name">
                        <el-input v-model="dialog.form.name"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="发票金额" prop="amount">
                        <el-input v-model="dialog.form.amount"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="开票日期" prop="time">
                        <el-date-picker v-model="dialog.form.time" type="date"  value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="类型" prop="type">
                        <div class="padt5">
                            <label class="tm-radio">
                                <input type="radio" v-model="dialog.form.type" value="2" class="tm-radio-input"/>
                                <span class="tm-radio-label">抵税</span>
                            </label>
                            <label class="tm-radio">
                                <input type="radio" v-model="dialog.form.type" value="1" class="tm-radio-input"/>
                                <span class="tm-radio-label">报销</span>
                            </label>
                        </div>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="付款方" prop="paytype">
                        <div class="padt5">
                            <label class="tm-radio">
                                <input type="radio" v-model="dialog.form.paytype" value="1" class="tm-radio-input"/>
                                <span class="tm-radio-label">个人</span>
                            </label>
                            <label class="tm-radio">
                                <input type="radio" v-model="dialog.form.paytype" value="2" class="tm-radio-input"/>
                                <span class="tm-radio-label">公司</span>
                            </label>
                            <span class="tip">（款项由公司支付则选"公司"）</span>
                        </div>
                    </el-form-item>
                </div>
                <div class="tmcol" >
                    <el-form-item label="上传发票" prop="uploadFile">
                        <span class="filename" v-show="dialog.form.uploadFile">{{dialog.form.uploadFile}}</span>
                        <span :class="['primarybtn','inputfile']">上传文件
                            <input type="file" multiple @change="uploadFile"/>
                        </span>
                        <el-input v-model="dialog.form.uploadFile" style="display:none;"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol" v-if="dialog.type=='add'">
                    <el-form-item>
                       <el-checkbox v-model="checkbox">保存不关闭继续添加</el-checkbox>
                    </el-form-item>
                </div> 
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit">保存</button>
            </div>
        </el-dialog>
        <!-- 查看发票 -->
        <el-dialog :visible.sync="dialog2.visible" :close-on-click-modal="false" class="tmdialog" >
             <p class="tmheader"></p>
            <iframe class="iframe" frameborder="no" border="0" :src="dialog2.data" ></iframe>
        </el-dialog>
    </div>
</template>
<script>
import {invoice,commonFile,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
export default {
    data(){
        return {
            filters:{
                type:'',
                paytype:''
            },
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            total:0,//总金额
            currdata:null,
            loading:false,
            typeList:[{id:2,label:'抵税'},{id:1,label:'报销'}],
            payList:[{id:1,label:'个人'},{id:2,label:'公司'}],
            curroute:'',
            file:'',
            checkbox:false,//保存不关闭选项
            dialog:{
                type:'add',
                title:'添加发票',
                visible:false,
                form:{
                    uploadFile:'',
                    type:2,
                    paytype:1
                },
                rules:{
                    name: [
                        {required: true,message: "请输入名称",trigger: "blur"}
                    ],
                    time: [
                        {required: true,message: "请选择发票日期",trigger: "blur"}
                    ],
                    amount:[
                        {required: true,message: "请输入发票金额",trigger: "blur"}
                    ],
                    uploadFile:[
                        {required: true,message: "请上传发票"}
                    ],
                }
            },
            dialog2:{
                visible:false,
                data:''
            }
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.getData();
    },
    computed:{
        authdisable(){
            return this.authDisable(['update','see'])
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
            invoice.userInvoiceList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        list.map(item=>{
                            item.time=item.time?item.time.substring(0,10):'--'
                        })
                        this.data.list=list||[];
                    }
                }else{
                    msgTips(res);
                }
                this.data.loading=false;
            })
            this.getTotal();
        },
        /* 总金额 */
        getTotal(){
            let ptdata={
                type:this.filters.type,
                paytype:this.filters.paytype
            };
            invoice.userTotal(ptdata).then(res=>{
                if(res.ok){
                    this.total=res.data.toFixed(2)||0;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
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
            let files=event.currentTarget.files;
            if(files){
                this.file=files[0];
                this.dialog.form.uploadFile=files[0].name;
                event.target.value="";
            }
        },
        /* 新增|编辑 */
        setData(type,item){
            if(item&&item.status==1){
                return;
            }
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.dialog.title='添加发票';
                this.dialog.form=this.$options.data().dialog.form;
            }
            if(type=="edit"){
                this.dialog.title='修改发票';
                let data={...item};
                let name=data.fileurl.split("/");
                data.uploadFile= name[name.length - 1];
                this.dialog.form=data;
            }
        },
        /* 提交表单 */
        formSubmit(){
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let {uploadFile,name,no,amount,time,type,paytype,id}=this.dialog.form;
                    let res,postdata;
                    let file=this.file;
                    let dtype=this.dialog.type;
                    let fd=new FormData();
                    if(file){
                        fd.append("uploadFile",file,uploadFile);
                    }
                    fd.append("name",name);
                    fd.append("no",no||'');
                    fd.append("amount",amount);
                    fd.append("time",time);
                    fd.append("type",type||'');
                    fd.append("paytype",paytype||'');
                    /* 新增 */
                    if(dtype=="add"){
                        res=await invoice.addInvoice(fd);
                    }
                    /* 修改 */
                    if(dtype=="edit"){
                        fd.append("id",id);
                        res=await invoice.updateInvoice(fd);
                    }
                    if(res.ok){
                        //保存不关闭
                        if(dtype=='add'&&this.checkbox){
                            this.dialog.form=this.$options.data().dialog.form;
                            this.$nextTick(()=>{
                                this.$refs.form.clearValidate();
                            })
                        }else{
                            this.dialog.visible=false;
                        }
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
        /* 查看 */
        seeInvoice(item){
            this.dialog2.visible=true;
            this.dialog2.data=resUrl(item.fileurl);
        }
    },
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/official/invoicemanage.less";
@import "~@_/assets/style/less/im/appmanage.less";
</style>