<template>
    <div class="commonright container">
        <div class="filter invoicefilter">
            <div class="filter-item">
                <label class="filter-label">用户</label>
                <el-select v-model="filters.mguid" clearable>
                    <el-option v-for="item in userList" :key="item.mguid" :value="item.mguid" :label="item.nick"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">标记</label>
                <el-select v-model="filters.status" clearable>
                    <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">类型</label>
                <el-select v-model="filters.type" clearable>
                    <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">研发费用</label>
                <el-select v-model="filters.developstatus" clearable>
                    <el-option v-for="item in developList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">付款方</label>
                <el-select v-model="filters.paytype" clearable>
                    <el-option v-for="item in paytypeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)">查询</button>
            </div>
            <div class="filter-item">
                <div>
                    <p class="total">查询合计：<span>{{total}}</span></p>
                    <p class="total">已选合计：<span>{{checkMoney}}</span></p>
                    <p class="total">本页合计：<span>{{pageMoney}}</span></p>
                </div>
            </div>
            <div class="filter-item filter-opera">
                <button class="primarybtn" @click="batchClick('add')">批量标记</button>
                <button class="primarybtn addleng" @click="batchClick('cancel')">批量取消标记</button>
                <button class="primarybtn" @click="batchDown">下载并标记</button>
                <!-- <button class="primarybtn addleng" @click="showReceipts">批量添加到报销单</button> -->
            </div>
        </div>
        <div class="contentpad tmcheckbox">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}" :row-class-name="tableRemarked">
                <el-table-column :align="$protovar.align" width="80">
                    <template slot="header">
                        <div :class="[checkList.length>0&&checkList.length<ableCheck.length?'bf':'']">
                            <input type="checkbox"  @change="checkAll" v-model="checkall"/>
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <input type="checkbox" v-model="checkList" :disabled="scope.row.developstatus==1&&!scope.row.developcode?true:false" :value="scope.row.id" @change="checkItem"/>
                    </template>
                </el-table-column>
                <el-table-column label="下载标记" :align="$protovar.align" width="80">
                    <template slot-scope="scope">
                        <span>
                            <img src="~@_/assets/img/system/mark.png" v-if="scope.row.status==1"/>
                            <span v-else>--</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="报销单" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span :class="[scope.row.developstatus==1&&!scope.row.developcode?'':'tmopera']" @click="setInvoice(scope.row)">
                            {{scope.row.rcode?scope.row.rcode:'添加'}}
                        </span>
                    </template>
                </el-table-column>
                 <el-table-column label="发票号码" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{scope.row.no||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="货物或应税劳务、服务名称" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="seeInvoice(scope.row)">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发票金额" :align="$protovar.align" prop="amount">
                </el-table-column>
                <el-table-column label="研发费用" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span :class="['tmopera',scope.row.status==1?'disable':'']" @click="changeDevelop(scope.row)" v-if="scope.row.developstatus==1">是</span>
                        <span :class="['tmopera',scope.row.status==1?'disable':'']" @click="setDevelop(scope.row)" v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column label="研发项目" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-if="scope.row.developstatus==2">--</span>
                        <span :class="['tmopera',scope.row.status==1?'disable':'']" v-else @click="setDevelop(scope.row)">
                            {{scope.row.developcode?scope.row.developname:'选择项目'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="类型" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{scope.row.type==1?'报销':'抵税'}}
                    </template>
                </el-table-column>
                <el-table-column label="付款方" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span :class="['tmopera',scope.row.status==1?'disable':'']" @click="setPayType(scope.row)">{{scope.row.paytype==1?'个人':'公司'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开票日期" :align="$protovar.align" prop="time">
                    <template slot-scope="scope">
                        {{scope.row.time?scope.row.time.substring(0,11):'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="提交人" :align="$protovar.align" prop="nick">
                </el-table-column>
                <el-table-column label="上传时间" :align="$protovar.align" prop="uploadtime">
                </el-table-column>
                <el-table-column label="操作"  :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera"  @click="signClick(scope.row.status,scope.row.id)">{{scope.row.status==1?'取消标记':'标记'}}</span>
                        <span :class="['tmopera',scope.row.developstatus==1&&!scope.row.developcode?'tmtray':'']"  @click="downSingle(scope.row)">下载</span>
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
        <!-- 确定取消标记 -->
        <el-dialog :visible.sync="dialog.visible" :width="$protovar.dwidth"  class="tmdialog" :close-on-click-modal="false"> 
            <div class="title">确定消除标记吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="dialog.type==1?invoiceUpdate(dialog.id,2):batchUpdate(2)">确定</button>
            </div>
        </el-dialog>
        <!-- 查看发票 -->
        <el-dialog :visible.sync="dialog2.visible" :close-on-click-modal="false" class="tmdialog" >
            <p class="tmheader"></p>
            <iframe class="iframe" frameborder="no" border="0" :src="dialog2.data" ></iframe>
        </el-dialog>
        <!--研发费用 -->
        <el-dialog :visible.sync="dialog3.visible" :width="$protovar.sgtwidth" class="tmdialog" :close-on-click-modal="false">
            <p class="tmheader"></p>
            <el-form :model="dialog3.form" :label-width="$protovar.fmlabwidth" class="dialogform sdialogform">
                <div class="tmcol">
                    <el-form-item label="研发标记">
                        <span class="textlh">是</span>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="研发项目" >
                         <el-select v-model="dialog3.form.developcode">
                            <el-option v-for="item in developsCode" :key="item.code" :value="item.code" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog3','visible')">取消</button>
                <button class="primarybtn" @click="changeDevelop(dialog3.form)">保存</button>
            </div>
        </el-dialog>
        <!-- 付款方 -->
        <el-dialog :visible.sync="dialog4.visible" :width="$protovar.sgtwidth" class="tmdialog" :close-on-click-modal="false">
            <p class="tmheader"></p>
            <el-form  :label-width="$protovar.fmlabwidth" class="dialogform sdialogform">
                <div class="tmcol">
                    <el-form-item label="付款方" >
                         <el-select v-model="dialog4.form.paytype">
                            <el-option v-for="item in paytypeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog4','visible')">取消</button>
                <button class="primarybtn" @click="changePaytype">保存</button>
            </div>
        </el-dialog>
        <!-- 确认已选票据 -->
        <el-dialog :visible.sync="dialog5.visible" :width="$protovar.dtfwidth" class="tmdialog" :close-on-click-modal="false">
            <p class="tmheader">确认已选票据</p>
            <div class="checkinvoice">
                <div v-for="item in dialog5.list" :key="item.id" class="receipts-row">
                    <span class="name">{{item.name}}</span>
                    <span class="amount">{{item.amount}}</span>
                    <span class="uploadtime">{{item.uploadtime}}</span>
                    <span class="del">  
                        <i class="el-icon el-icon-close" @click="delCheck(item.id)"></i>
                    </span>
                </div>
            </div>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog5','visible')">取消</button>
                <button class="primarybtn" @click="sureCheck">下一步</button>
            </div>
        </el-dialog>
        <!-- 批量添加到报销单 -->
        <el-dialog :visible.sync="dialog6.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth" >
            <p class="tmheader">{{dialog6.title}}</p>
            <el-form :model="dialog6.form" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" :rules="dialog6.rules" >
                <div class="tmcol">
                    <el-form-item label="已选票据数量">
                        <span class="textlh">{{dialog6.form.num}}张</span>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="合计金额">
                        <span class="textlh">{{dialog6.form.money}}元</span>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="添加方式">
                        <span class="textlh">
                            <label class="tm-radio">
                                <input type="radio" v-model="dialog6.type" value="1" class="tm-radio-input"/>
                                <span class="tm-radio-label">新建报销单</span>
                            </label>
                            <label class="tm-radio">
                                <input type="radio" v-model="dialog6.type" value="2" class="tm-radio-input"/>
                                <span class="tm-radio-label">选择已有报销单</span>
                            </label>
                        </span>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="选择报销人" v-if="dialog6.type==1" prop='mguid'>
                        <el-select v-model="dialog6.form.mguid">
                            <el-option v-for="item in userList" :key="item.mguid" :value="item.mguid" :label="item.nick"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择报销单" v-if="dialog6.type==2" prop='rid'>
                        <el-select v-model="dialog6.form.rid">
                            <el-option v-for="item in dialog6.reimlist" :key="item.id" :value="item.id" :label="item.code+'--报销人'+item.nick"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog6','visible')">取消</button>
                <button class="primarybtn" @click="saveReimby">保存</button>
            </div>
        </el-dialog>
        <!-- 报销单信息 -->
        <ReimInfo :code="reiminfo.code" :show="reiminfo.show" @closeInfo="closeInfo"></ReimInfo>
    </div>
</template>
<script>
import {invoice,mgdictChild,reimb,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import {getFile,handleBatchDownload} from '@/_admin/axios/http';
import ReimInfo from '@_/components/offical/ReimInfo';//报销单信息
export default {
    data(){
        return {
            filters:{
                mguid:'',
                status:'',
                paytype:'',
                type:'',
                developstatus:''
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
            pageMoney:0,//本页合计
            userList:[],
            statusList:[{id:1,label:'已标记'},{id:2,label:'未标记'}],
            typeList:[{id:1,label:'报销'},{id:2,label:'抵税'}],
            developList:[{id:1,label:'是'},{id:2,label:'否'}],
            paytypeList:[{id:1,label:'个人'},{id:2,label:'公司'}],
            developsCode:[],
            curroute:'',//当前路由
            checkList:[],//选中列表
            checkall:'',//全部选中
            dialog:{
                visible:false,
                id:'',
                type:1//1:单个取消标注；2:批量取消标记
            },
            dialog2:{//查看发票
                visible:false,
                data:''
            },
            dialog3:{//研发项目
                visible:false,
                form:{}
            },
            dialog4:{//付款方
                visible:false,
                form:{}
            },
            dialog5:{//确认已选票据
                visible:false,
                list:[],
            },
            ableCheck:[],//可选下载数目
            reiminfo:{//报销单信息
                code:'',
                show:false
            },
            dialog6:{
                title:'批量添加到报销单',
                visible:false,
                id:'',//发票id
                type:'1',
                form:{
                    num:1,
                    money:0.00,
                    mguid:'',
                    rid:'',
                },
                reimlist:[],//报销单列表
                rules:{
                    mguid:[
                        {required: true,message: "请选择报销人",trigger: 'change' }
                    ],
                    rid: [
                        {required: true,message: "请选择报销单",trigger: 'change' }
                    ],
                }
            }
        }
    },
    async mounted(){
        this.curroute=this.$route.path;
        await this.getDevelopCode();
        this.getUserList();
        this.getData();
    },
    components:{
        ReimInfo
    },
    computed:{
        checkMoney(){
            let cm=0;
            this.checkList.map(item=>{
                let obj=this.data.list.find(v=>v.id==item);
                if(obj){
                    cm+=Number(obj.amount);
                }
            })
            return cm.toFixed(2);
        }
    },
    watch: {
        async '$route'(to,from){
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                await this.getDevelopCode();
                this.getUserList();
                this.getData();
            }
        }
    },
    methods:{
        /* 标记行 */
        tableRemarked({row, rowIndex}) {
            if (row.status === 1) {
                return 'remarked';
            } 
            return '';
        },
        /* 研发项目字典 */
        async getDevelopCode(){
            let res=await mgdictChild({pcode:'developcode'})
            if(res.ok){
                this.developsCode=res.data;
            }else{
                msgTips(res);
            }
        },
        /* 发票列表 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            invoice.invoiceList({...this.filters,pageNumber,pageSize}).then(res=>{
               if(res.ok){
                    let data=res.data;
                    this.data.totalRow=data.totalRow;
                    let list=data.list;
                    this.ableCheck=[];
                    this.pageMoney=0;
                    list.map(item=>{
                        item.fileurl=resUrl(item.fileurl);
                        item.amount=item.amount?item.amount.toFixed(2):0;
                        if(item.developstatus==2||(item.developstatus==1&&item.developcode)){
                            this.ableCheck.push(item);
                        }
                        this.pageMoney+=Number(item.amount);

                        this.developsCode.map(val=>{
                            if(val.code==item.developcode){
                                item.developname=val.name
                            }
                        })
                    })
                    this.pageMoney=this.pageMoney.toFixed(2);
                    this.data.list=list;
                }
                this.data.loading=false;
            })
            this.getTotal();
        },
        /* 用户列表 */
        getUserList(){
            invoice.invoiceUsers().then(res=>{
                if(res.ok){
                    this.userList=res.data;
                }
            })
        },
        /* 总金额 */
        getTotal(){
            invoice.invoiceTotal({...this.filters}).then(res=>{
                if(res.ok){
                    this.total=res.data.toFixed(2);
                }
            })
        },
        /* 设置研发费用 */
        setDevelop(item){
            if(item.status==1){
                return;
            }
            this.dialog3.visible=true;
            this.dialog3.form={...item};
        },
        /* 研发修改 */
        changeDevelop(item){
            if(item.status==1){
                return;
            }
            let ptdata={
                id:item.id,
                developstatus:this.dialog3.visible?1:2,
                developcode:item.developcode
            };
            invoice.develop(ptdata).then(res=>{
                if(res.ok){
                    this.dialog3.visible=false;
                    this.getData();
                }else{
                    msgTips(res.msg);
                }
            })
        },
        /* 设置付款方 */
        setPayType(item){
            if(item.status==1){
                return;
            }
            this.dialog4.visible=true;
            this.dialog4.form={...item};
        },
        /* 修改付款方 */
        async changePaytype(){
            let {id,paytype,amount}=this.dialog4.form;
            let fd=new FormData();
            fd.append("paytype",paytype||'');
            fd.append("id",id);
            fd.append("amount",amount);
            let res=await invoice.updateInvoice(fd);
            if(res.ok){
                this.dialog4.visible=false;
                successTips("保存成功");
                this.getData();
            }else{
                msgTips(res); 
            }
        },
        /* 查看 */
        seeInvoice(item){
            this.dialog2.visible=true;
            this.dialog2.data=resUrl(item.fileurl);
        },
        /* 切换分页 */
		handleCurrentChange(val){
            this.checkList=[];
            this.checkall=false;
            this.data.pageNumber = val;
            this.getData();
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this.data.pageNumber=1;
            this.data.pageSize=val;
            this.getData();
        },
        /* 单选 */
        checkItem(){
            if(this.checkList.length>0){
                this.checkall=true;
            }else{
                this.checkall=false;
            }
        },
        /* 全选|取消全选 */
        checkAll(){
            if(this.checkall){
                this.data.list.map(item=>{
                    if(item.developstatus==2||(item.developstatus==1&&item.developcode)){
                        this.checkList.push(item.id);
                    }
                })
            }else{
                this.checkList=[];
            }
        },
        /* 批量标记|取消标记 */
        batchClick(type){
            if(this.checkList.length==0){
                msgTips("至少选择一条");
                return;
            }
            if(type=="add"){
                this.batchUpdate(1);
            }
            if(type=="cancel"){
                this.dialog.type=2;
                this.dialog.visible=true;
            }
        },
        /* 标记点击事件 */
        signClick(status,id){
            if(status==1){
                this.dialog.type=1;
                this.dialog.visible=true;
                this.dialog.id=id;
            }
            if(status==2){
                this.invoiceUpdate(id,1);
            }
        },
        /* 单标记 */
        invoiceUpdate(id,status){
            invoice.invoiceUpdate({id,status}).then(res=>{
                if(res.ok){
                    this.dialog.visible=false;
                    successTips(status==1?'标记成功':'消除成功');
                    // this.getData();
                    this.data.list.map(item=>{
                        if(id==item.id){
                            item.status=status;
                        }
                    })
                }else{
                    msgTips(res);
                }
            })
        },
        /* 多标记 */
        batchUpdate(status){
            let ptdata={
                status:status,
                ids:this.checkList.join(",")
            };
            invoice.batchUpdate(ptdata).then(res=>{
                if(res.ok){
                    this.dialog.visible=false;
                    successTips(status==1?'标记成功':'消除成功');
                    
                    // this.getData();
                    this.data.list.map(item=>{
                        this.checkList.map(v=>{
                            if(v==item.id){
                                item.status=status;
                            }
                        })
                    })
                    this.checkList=[];
                    this.checkall=false;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 单个下载 */
        downSingle(item){
            if(item.developstatus==1&&!item.developcode){
                return;
            }
            let url=item.fileurl;
            getFile(url).then(res=>{
                let a = document.createElement('a');
                let url = window.URL.createObjectURL(res);
                a.href = url;
                //文件命名 是否研发(项目)[可空]"+“对公/对私”(付款对象)+"金额“元.pdf
                let {developstatus,developcode,type,paytype,nick,amount}=item;
                let name="";
                if(developstatus==1){
                    name+='研发('+developcode+')-';
                }
                let paystr=paytype==1?nick:'公司';
                name+=type==1?'对公付款('+paystr+')':'对私付款('+paystr+')';
                name+='-'+amount+'元';
                name+=item.fileurl.substring(item.fileurl.lastIndexOf("."));//文件扩展名
                a.download=name;
                a.click();
                window.URL.revokeObjectURL(url);
            });
        },
        /* 批量下载 */
        batchDown(){
            if(this.checkList.length==0){
                msgTips("至少选择一条");
                return;
            }
            this.batchUpdate(1);
            let dataurl=[];
            this.checkList.map(item=>{
                let obj=this.data.list.find(v=>v.id==item);
                if(obj){
                    //文件命名 是否研发(项目)[可空]"+“对公/对私”(付款方)+"金额“元.pdf
                    let {developstatus,developcode,type,paytype,nick,amount}=obj;
                    let name="";
                    if(developstatus==1){
                        name+='研发('+developcode+')-';
                    }
                    let paystr=paytype==1?nick:'公司';
                    name+=type==1?'对公付款('+paystr+')':'对私付款('+paystr+')';
                    name+='-'+amount+'元';
                    name+=obj.fileurl.substring(obj.fileurl.lastIndexOf("."));//文件扩展名
                    dataurl.push({url:obj.fileurl,name:name});
                }
            })
            // 发票_20200716_133434_￥698.36.zip
            let name='发票_'+this.getCurrentDate()+'_￥'+this.checkMoney+'.zip';
            handleBatchDownload(dataurl,name);
        },
        /* 当前日期 */
        getCurrentDate() {
            let now = new Date();
            let year = now.getFullYear(), //年份
                month = now.getMonth(),//月份
                date = now.getDate(),//日期
                hour = now.getHours(),//小时
                minu = now.getMinutes(),//分钟
                sec = now.getSeconds();//秒
            month = month + 1;
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            if (hour < 10) hour = "0" + hour;
            if (minu < 10) minu = "0" + minu;
            if (sec < 10) sec = "0" + sec;

            let time = year+month+date+hour+minu+sec;
            return time;
        },
        /* 确认已选票据 */
        showReceipts(){
            if(this.checkList.length==0){
                msgTips("至少选择一条");
                return;
            }
            this.dialog5.list=[];
            this.data.list.map(item=>{
                this.checkList.map(v=>{
                    if(v==item.id){
                        this.dialog5.list.push(item);
                    }
                })
            })
            this.dialog5.visible=true;
        },
        /* 删除单条已选票据 */
        delCheck(id){
            this.checkList.map((v,index)=>{
                if(v==id){
                    this.checkList.splice(index,1);
                    this.dialog5.list.splice(index,1);
                }
            })
        },
        /* 查看|添加报销单 */
        setInvoice(item){
            if(item.rcode){
                this.seeInfo(item.rcode);
            }else{
                this.addSingle(item);
            }
        },
        /* 添加单张发票-添加到报销单 */
        addSingle(item){
            if(item.developstatus==1&&!item.developcode){
                return;
            }
            this.dialog6=this.$options.data().dialog6;
            this.dialog6.title="添加到报销单";
            this.dialog6.id=item.id;
            this.dialog6.form.money=item.amount;
            this.getReimbList();
            this.dialog6.visible=true;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
        },
        /* 获取报销单列表 */
        getReimbList(){
            reimb.reimBursedict().then(res=>{
                if(res.ok){
                    this.dialog6.reimlist=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 查看报销单信息 */
        seeInfo(code){
            this.reiminfo.code=code;
            this.reiminfo.show=true;
        },
        /* 确认已选票据-添加到报销单 */
        sureCheck(){
            let clength=this.checkList.length;
            if(clength==0){
                msgTips("至少选择一条");
                return;
            }
            this.dialog6=this.$options.data().dialog6;
            this.dialog6.form.num=clength;
            let money=0;
            this.data.list.map(item=>{
                this.checkList.map(v=>{
                    if(v==item.id){
                        money+=Number(item.amount);
                    }
                })
            })
            this.dialog6.form.money=money;
            this.dialog6.visible=true;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
        },
        /* 保存报销单 */
        saveReimby(){
             this.$refs.form.validate(async (valid) => {
                if (valid) {
                    /* 新增 */
                    let {id,type,form}=this.dialog6;
                     let ptdata={},res;
                    if(type==1){
                        ptdata={
                            mguid:form.mguid,
                            ids:id
                        };
                        res=await reimb.addReimBurse(ptdata);
                    }
                    /* 修改 */
                    if(type==2){
                        let mguid='';
                        this.dialog6.reimlist.map(val=>{
                            if(val.id==form.rid){
                                mguid=val.mguid;
                            }
                        })
                        ptdata={
                            mguid:mguid,
                            ids:id,
                            id:form.rid
                        };
                        res=await reimb.updateReimBurse(ptdata);
                    }
                    if(res.ok){
                        this.dialog6.visible=false;
                        this.dialog5.visible=false;
                        successTips("保存成功");
                        this.getData();
                    }else{
                        msgTips(res);
                    }
                }
             })
        },
        /* 关闭报销单信息 */
        closeInfo(){
            this.reiminfo.show=false;
        },
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/official/invoicemanage.less";
</style>