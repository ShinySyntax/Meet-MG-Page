<template>
    <div class="commonright container">
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">联系人</label>
                <el-input type="text" clearable v-model="filters.bizname"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">企业</label>
                <el-input type="text" clearable v-model="filters.cmpname" placeholder="全称/简称"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">产品</label>
                <el-input type="text" clearable v-model="filters.productname"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" clearable>
                    <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">时间</label>
                <el-date-picker v-model="filters.starttime" type="date" placeholder="开始时间" value-format="yyyyMMdd">
                </el-date-picker>
                <label class="filter-label fl-date-left">至</label>
                <el-date-picker v-model="filters.endtime" type="date" placeholder="结束时间" value-format="yyyyMMdd">
                </el-date-picker>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData">查询</button>
                <button class="primarybtn" v-auth="'add'" @click="setData('add')">新增</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="订单编号" >
                    <template slot-scope="scope">
                        <span class="tmopera" @click="orderDialog(scope.row,'info')">{{scope.row.orderno||'--'}}</span>
                    </template>
                </el-table-column>
                <!-- :align="$protovar.align" -->
                <el-table-column label="联系人" prop="bizname" :align="$protovar.align"></el-table-column>
                <el-table-column label="单位" prop="cmpname" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="订购产品" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.productname||'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="类型" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.producttype==1?'源码':(scope.row.producttype==2?'sdk':'--')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开票" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.invoiceflag==1?'是':(scope.row.invoiceflag==2?'否':'--')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="迭代记录" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="orderDialog(scope.row,'iteration')">查看</span>
                    </template>
                </el-table-column>
                <el-table-column label="订购合同" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="seeContract(scope.row)" v-if="scope.row.contractimgs">查看</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.status==1?'待付款':(scope.row.status==2?'已完成':'--')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" prop="phone" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.ordertime?scope.row.ordertime.substring(0,11):'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="关联用户" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="orderDialog(scope.row,'user')">查看</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  :align="$protovar.align" width="200" v-if="authdisable">
                    <template slot-scope="scope">
                        <span class="tmopera" v-auth="'config'" @click="orderDialog(scope.row,'config')">参数配置</span>
                        <span class="tmopera" v-auth="'download'">下载</span>
                        <span class="tmopera" v-auth="'update'" @click="setData('edit',scope.row)">维护</span>
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
        <!-- 新增|编辑 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.dtfwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform" id="form">
                <div class="tmcol tmcol-half">
                    <el-form-item label="联系人" prop="bizname">
                        <el-input v-model="dialog.form.bizname" name="bizname"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model="dialog.form.phone" name="phone"></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol tmcol-half">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="dialog.form.email" name="email"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol tmcol-half">
                    <el-form-item label="单位" prop="cmpname">
                        <el-input v-model="dialog.form.cmpname" name="cmpname"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol tmcol-half">
                    <el-form-item label="地址" prop="addressdetail">
                        <el-input v-model="dialog.form.addressdetail" name="addressdetail"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol tmcol-half">
                    <el-form-item label="订购产品" prop="productname">
                        <el-input v-model="dialog.form.productname" name="productname"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol tmcol-half">
                    <el-form-item label="类型" prop="producttype">
                        <el-select v-model="dialog.form.producttype" placeholder="请选择产品类型">
                            <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="合同价" prop="contractprice">
                        <el-input v-model="dialog.form.contractprice"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol tmcol-half">
                    <el-form-item label="返点" prop="rebate">
                        <el-input v-model="dialog.form.rebate"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol tmcol-half">
                    <el-form-item label="提成" prop="commission">
                        <el-input v-model="dialog.form.commission"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol tmcol-half">
                    <el-form-item label="付款时间" prop="entrytime">
                       <el-date-picker v-model="dialog.form.entrytime" type="datetime" popper-class="resetoverf"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="合同编号" prop="contractno">
                       <el-input v-model="dialog.form.contractno" name="contractno"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="是否开票" prop="invoiceflag">
                       <el-select v-model="dialog.form.invoiceflag">
                            <el-option v-for="item in invoiceList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <div class="tmcol tmcol-half">
                    <el-form-item label="发票抬头" prop="invoicecmpname">
                      <el-input v-model="dialog.form.invoicecmpname" name="invoicecmpname"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="税号" prop="invoicecmpno">
                      <el-input v-model="dialog.form.invoicecmpno" name="invoicecmpno"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="快递公司" prop="deliverycmp">
                      <el-input v-model="dialog.form.deliverycmp" name="deliverycmp"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="快递单号" prop="deliveryno">
                      <el-input v-model="dialog.form.deliveryno" name="deliveryno"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialog.form.status">
                            <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="合同文件" prop="contractno">
                        <div v-for="(v,i) in dialog.form.imgs" :key="v" class="contractimg">
                            <span class="mask">
                                <i class="el-icon-delete" @click="delImg(i)"></i>
                            </span>
                            <img :src="setUrl(v)"/>
                        </div>
                        <span class="primarybtn fileimg">上传图片<input type="file" accept="image/*" multiple @change="uploadImg"/></span>
                    </el-form-item>
                </div>
                <input type="hidden" v-model="dialog.form.id" name="id" v-if="dialog.type=='edit'"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit" :disabled="loading">保存</button>
            </div>
        </el-dialog>
        <!-- 合同查看 -->
	    <div id="view-container" style='display:none' class="view-container">
            <img :src="item" v-for="item in contractList" :key="item"/>
        </div>
        <!-- 订单弹框 -->
        <Order :order="orderdialog" :oid="orderdialog.form.id" @closeOrder="closeOrder" :show="orderdialog.show"></Order>
    </div>
</template>
<script>
import {order,commonFiles,msgTips,successTips} from '@_/axios/path';
import {dataURLtoBlob,resUrl} from '@_/utils/common.js';
import Order from "@_/components/offical/Order.vue";
import Viewer from 'viewerjs';//放大图片插件
import 'viewerjs/dist/viewer.min.css';//放大图片插件css
export default {
    data(){
        return {
            filters:{//筛选表单
                bizname:'',
                cmpname:'',
                productname:'',
                starttime:'',
                endtime:'',
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
            statusSelect:[{id:1,label:'待付款'},{id:2,label:'已完成'}],
            typeList:[{id:1,label:'源码版本'},{id:2,label:'SDK版本'}],
            invoiceList:[{id:1,label:'是'},{id:2,label:'否'}],
            dialog:{
                type:'add',
                visible:false,
                title:'',
                form:{
                    producttype:'',
                    invoiceflag:'',
                    status:'',
                    imgs:[],
                    seeimgs:[]
                },
                rules:{
                    bizname: [
                        {required: true,message: "请输入联系人",trigger: "blur"}
                    ],
                    phone: [
                        {required: true,message: "请输入电话",trigger: "blur"}
                    ],
                    cmpname:[
                        {required: true,message: "请输入单位名称",trigger: "blur"}
                    ],
                }
            },
            orderdialog:{//订单弹框
                show:false,
                type:'',
                form:{}
            },
            contractList:[],
            loading:false,
            curroute:''
        }
    },
	created(){
        this.curroute=this.$route.path;
        this.getData();
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
    computed:{
        authdisable(){
            return this.authDisable(['config','download','update']);
        }
    },
    components:{
        Order
    },
    methods:{
        /* 查询列表 */
        getData(){
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            let {bizname,cmpname,productname,starttime,endtime,status}=this.filters;
            let ptdata={bizname,cmpname,productname,status,pageNumber,pageSize,starttime:starttime?starttime+'000000':'',endtime:endtime?endtime+'235959':''};
            order.orderList(ptdata).then(res=>{
                if(res.ok){
                     let data=res.data;
                    this.data.totalRow=data.totalRow;
                    let list=data.list;
                    this.data.list=list||[];
                }
                this.data.loading=false;
            })
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
        /* 新增|编辑 */
        setData(type,item){
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.dialog.title='新增订单';
                this.dialog.form=this.$options.data().dialog.form;
            }
            if(type=="edit"){
                this.dialog.title='维护订单';
                item.imgs=item.contractimgs?item.contractimgs.split(","):[];
                let data={...item};
                this.dialog.form=Object.assign(this.dialog.form,data);
            }
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
                    let {producttype,invoiceflag,status,contractprice,rebate,commission,imgs}=this.dialog.form;
                    contractprice=contractprice||0;
                    rebate=rebate||0;
                    commission=commission||0;
                    let contractimgs=imgs.join(",");
                    postdata=$("#form").serialize()+`&producttype=${producttype}&invoiceflag=${invoiceflag}&status=${status}&contractprice=${contractprice}&rebate=${rebate}&commission=${commission}&contractimgs=${contractimgs}`;
                    /* 新增 */
                    if(type=="add"){
                        res=await order.orderAdd(postdata);
                    }
                    /* 修改 */
                    if(type=="edit"){
                        res=await order.orderUpdate(postdata);
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
        /* 上传处理数据 */
        uploadImg(event){
            let files=event.currentTarget.files;
            let fd=new FormData();
            let file;
            let fileall=[];
            for(let i=0;i<files.length;i++){
                file = files[i];
                fd.append("uploadFile",file,file.name);
                if(i==files.length-1){
                    fd.append("type",1);
                    commonFiles(fd).then(res=>{
                        if(res.ok){
                            let data=res.data;
                            $.each(data,(i,item)=>{
                                this.dialog.form.imgs.push(item.url);
                            })
                        }else{
                            msgTips(res);
                        }
                    })
                }
            }
        },
        /* 删除合同 */
        delImg(i){
            this.dialog.form.imgs.splice(i,1);
        },
        /* 查看合同 */
        seeContract(item){
            let list=item.contractimgs.split(",");
            for(let i=0;i<list.length;i++){
                list[i]=resUrl(list[i]);
            }
            this.contractList=list;

            this.$nextTick(()=>{
                var viewer = new Viewer(document.getElementById("view-container"), {
                    hidden: function () {
                        viewer.destroy();
                    },
                    button:true,
                    url: 'data-original',
                    toolbar: {
                        zoomIn: 4,
                        zoomOut: 4,
                        prev: function() {
                            viewer.prev(false);//当前是第一个时是不转向查看最后一个
                        },
                        next: function() {
                            viewer.next(false);//当前是最后一个时是不转向查看第一个
                        },
                        loop:false,
                    },
                    title:false,
                });
                viewer.view(0); 
                viewer.show();
            })
        },
        /* 订单相关弹框 */
        orderDialog(item,type){
            this.orderdialog.type=type;
            this.orderdialog.form=item;
            this.orderdialog.show=true;
        },
        closeOrder(){
            this.orderdialog.show=false;
        },
        setUrl(path){
            return resUrl(path);
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/official/ordermanage.less";
</style>
<style>
.resetoverf .el-time-spinner__list::before{
    height: 72px;
}
</style>
