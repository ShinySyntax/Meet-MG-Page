<template>
    <div class="commonright container">
        <div class="topcontainer">
            <div class="filter">
                <div class="filter-item">
                    <label class="filter-label">单号</label>
                    <el-input type="text" clearable v-model="filters.code"></el-input>
                </div>
                <div class="filter-btn">
                    <button class="primarybtn search" @click="getData(1)">查询</button>
                </div>
            </div>
            <div class="top-right">
                 <button class="primarybtn addleng" @click="addReim" v-auth="'add'">新建报销单</button>
            </div>
        </div>
        
        <div class="contentpad tmcheckbox">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}" >
                <el-table-column label="报销单号" :align="$protovar.align" prop="code">
                </el-table-column>
                 <el-table-column label="备注" :align="$protovar.align" prop="remark">
                    <template slot-scope="scope">
                        {{scope.row.remark||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="报销时间" :align="$protovar.align" width="180">
                    <template slot-scope="scope">
                        <span @click.stop="propStop">
                            <span v-show="!scope.row.rtimeshow" class="tmopera" @click="showRtime(scope.row)">{{scope.row.reimtime||'添加'}}</span>
                            <el-date-picker v-show="scope.row.rtimeshow" type="date" v-model="scope.row.rtimedate" class="rtime-picker" prefix-icon="el" @change="updaterTime(scope.row)" value-format="yyyy-MM-dd" clear-icon :ref="'saveDateInput'+scope.row.id"></el-date-picker>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" :align="$protovar.align" prop="amount">
                </el-table-column>
                <el-table-column label="单据数量" :align="$protovar.align" prop="num">
                </el-table-column>
                <el-table-column label="报销人" :align="$protovar.align" prop="nick">
                </el-table-column>
                <el-table-column label="创建时间" :align="$protovar.align" prop="createtime">
                </el-table-column>
                <el-table-column label="状态" :align="$protovar.align" prop="uploadstatus">
                    <template slot-scope="scope">
                        {{scope.row.uploadstatus==1?'已下载':'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <span class="tmopera waring" @click="showDelDialog(scope.row.id)" v-auth="'del'">删除</span>
                        <span class="tmopera" @click="seeInfo(scope.row.code)" v-auth="'see'">查看</span>
                        <span :class="['tmopera',scope.row.uploadstatus==1?'tmtray':'']" @click="updateReim(scope.row)" v-auth="'update'">修改</span>
                        <span :class="[load?'tmopera tmtray':'tmopera']" @click="downReim(scope.row)" v-auth="'down'">下载</span>
                       <!--  <span :class="['tmopera',scope.row.developstatus==1&&!scope.row.developcode?'tmtray':'']">下载</span> -->
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
        <!-- 新建|修改 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog setdialog" :width="$protovar.dtbwidth">
            <div class="tmheader">
                报销单
                    <span v-show="dialog.remarkShow">
                        <span class="marginL15" v-show="!dialog.remarksInputShow">{{dialog.remark}}</span>
                        <input v-show="dialog.remarksInputShow" type="text" v-model="dialog.remark" maxlength="20" class="remark_input">
                        <span v-show="dialog.type==2" class="remarks" @click="dialog.remarksInputShow=!dialog.remarksInputShow">{{dialog.remarksInputShow?'确定':'修改'}}</span>
                    </span>
                    <span class="remarks" v-show="dialog.type==1" @click="remarksInput()">{{dialog.remarksInputShow?'确定':'备注'}}</span>
            </div>
            <div class="dialogpad">
                <div class="content-head">
                    <span>
                        <label>报销单号</label>
                         {{dialog.code}}
                    </span>
                    <span>
                        <label>合计人民币</label> 
                        <b>{{dialog.money}}</b>
                    </span>
             
                </div>
                <el-table :data="dialog.list"  :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="日期" prop="uploadtime" :align="$protovar.align">
                    </el-table-column>
                    <el-table-column label="费用类别" :align="$protovar.align" >
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.ucosttype" @change="saveCostChange(scope.row)">
                                <el-option v-for="item in costType" :key="item.code" :value="item.code" :label="item.name"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="报销内容" prop="name" :align="$protovar.align">
                    </el-table-column>
                    <el-table-column label="单据张数" :align="$protovar.align">
                        <template>
                            1
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" prop="amount" :align="$protovar.align">
                    </el-table-column>
                    <el-table-column label="备注" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span class="opera" @click="showRemarkIpt($event,scope.row)" v-show="!scope.row.rmshow">{{scope.row.remark?scope.row.remark:'修改备注'}}</span>
                            <input type="text" v-model="scope.row.uremark" class="remarkinput" @blur="saveMark(scope.row)" v-show="scope.row.rmshow"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  :align="$protovar.align">
                        <template slot-scope="scope">
                         <span class="tmopera waring" @click="delCheckInvoice(scope.row)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="reimadd">
                    <div>
                        <label class="reiman-label">报销人</label>
                        <el-select v-model="dialog.mguid" clearable>
                            <el-option v-for="item in userList" :key="item.mguid" :value="item.mguid" :label="item.nick"></el-option>
                        </el-select>
                    </div>
                    <span class="tmopera" @click="getInvoiceOutList(1)">+添加发票</span>
                </div>
            </div>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="saveReim">保存</button>
            </div>
        </el-dialog>
        <!-- 发票列表 -->
        <el-dialog :visible.sync="dialog2.visible" :close-on-click-modal="false" class="tmdialog setdialog" width="1200px">
            <div class="content-head invoice-head">
                <div class="invoice-filter">
                    <span class="invoice-title">添加发票</span>
                    <div class="filter-col"> 
                        <label class="filter-label">用户</label>
                        <el-select v-model="dialog2.mguid" clearable>
                            <el-option v-for="item in userList" :key="item.mguid" :value="item.mguid" :label="item.nick"></el-option>
                        </el-select>
                    </div>
                    <div class="filter-col"> 
                        <label class="filter-label">时间</label>
                        <el-date-picker v-model="dialog2.starttime" type="date" placeholder="开始时间" value-format="yyyyMMdd">
                        </el-date-picker>
                        <label class="filter-label fl-date-left">至</label>
                        <el-date-picker v-model="dialog2.endtime" type="date" placeholder="结束时间" value-format="yyyyMMdd">
                        </el-date-picker>
                    </div>
                    <button class="primarybtn" @click="getInvoiceOutList(1)">查询</button>
                </div>
                <span>
                    <label>已选 <b>{{checkList.length}}</b> 张</label>
                    <button class="primarybtn" @click="addInvoice">添加</button>
                </span>
            </div>
            <div class="dialogpad invoicepad">
                <div class="invoiccontent" id="maincontent" style=" height:60vh;overflow:auto;">
                    <el-table :data="dialog2.list" :header-cell-style="{background:$protovar.tbhabg}" id="scrollcontent">
                        <el-table-column label="选择" :align="$protovar.align" width="80">
                            <template slot-scope="scope">
                                <input type="checkbox" v-model="checkList"  :value="scope.row.id"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="内容" :align="$protovar.align">
                            <template slot-scope="scope">
                                <span class="tmopera" @click="seeInvoice(scope.row)">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="发票金额" :align="$protovar.align" prop="amount">
                        </el-table-column>
                        <el-table-column label="研发费用" :align="$protovar.align">
                            <template slot-scope="scope">
                                <span v-if="scope.row.developstatus==1">是</span>
                                <span v-else>否</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="研发项目" :align="$protovar.align">
                            <template slot-scope="scope">
                                <span v-if="scope.row.developstatus==2">--</span>
                                <span v-else >
                                    {{scope.row.developname}}
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
                                {{scope.row.paytype==1?'个人':'公司'}}
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
                    </el-table>
                </div>
                
            </div>
        </el-dialog>
         <!-- 查看发票 -->
        <el-dialog :visible.sync="dialog3.visible" :close-on-click-modal="false" class="tmdialog" >
            <p class="tmheader"></p>
            <iframe class="iframe" frameborder="no" border="0" :src="dialog3.data" ></iframe>
        </el-dialog>
        <!-- 删除报销单弹框 -->
        <el-dialog :visible.sync="dialog4.visible" :width="$protovar.dwidth"  class="tmdialog" :close-on-click-modal="false"> 
            <div class="title">确定删除该报销单吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog4','visible')">取消</button>
                <button class="primarybtn" @click="sureDelReim">删除</button>
            </div>
        </el-dialog>
        <!-- 确认下载报销单和发票弹框 -->
        <el-dialog :visible.sync="dialog5.visible" :width="$protovar.dwidth"  class="tmdialog" :close-on-click-modal="false"> 
            <div class="title">确定下载报销单及发票吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog5','visible')">取消</button>
                <button class="primarybtn" @click="sureDelReim">删除</button>
            </div>
        </el-dialog>
        <!-- 报销单信息 -->
        <ReimInfo :code="reiminfo.code" :show="reiminfo.show" @closeInfo="closeInfo"></ReimInfo>
    </div>
</template>
<script>
import {reimb,invoice,mgdictChild,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import ReimInfo from '@_/components/offical/ReimInfo';//报销单信息
import {getFile} from '@/_admin/axios/http';
export default {
    data(){
        return {
            filters:{
                code:''
            },
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            curroute:'',//当前路由
            checkList:[],//选中列表
            reimInvoiceList:[],//报销发票列表
            developsCode:[],//项目code
            costType:[],//费用类型
            userList:[],//报销人列表
            load:false,
            dialog:{
                type:1,//1:新增；2：修改
                visible:false,
                list:[],
                mguid:'',//报销人uid
                code:'',//单号
                codeid:'',//单号code的id
                money:0.00,//金额
                orgmoney:0,//初始发票金额
                orglist:[],//初始发票列表
                rid:'',//报销单id
                remark:'',
                remarkShow:false,
                remarksInputShow:false
            },
            dialog2:{
                visible:false,
                msguid:'',
                starttime:'',
                endtime:'',
                pageNumber:1,
                pageSize:10,
                totalPage:0,//总页数
                loading:false,//loading
                list:[],//列表
            },
            dialog3:{//查看发票
                visible:false,
                data:''
            },
            dialog4:{//确认删除报销单
                visible:false,
                rid:''
            },
            dialog5:{//确认下载报销单
                visible:false,
                rid:''
            },
            reiminfo:{//报销单信息
                code:'',
                show:false
            },
            timeout:''
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.getDevelopCode();
        this.getUserList();
        this.getData();
    },
    components:{
        ReimInfo
    },
    watch: {
        async '$route'(to,from){
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.getDevelopCode();
                this.getUserList();
                this.getData();
            }
        }
    },
    methods:{
        /* 发票列表 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            reimb.reimBurseList({...this.filters,pageNumber,pageSize}).then(res=>{
               if(res.ok){
                    let data=res.data;
                    this.data.totalRow=data.totalRow;
                    let list=data.list;
                    list.map(item=>{
                        item.rtimeshow=false;
                        item.reimtime=item.reimtime?item.reimtime.substring(0,11):'';
                        item.rtimedate='';
                    })
                    this.data.list=list;
                }
                this.data.loading=false;
                this.load=false;
            })
        },
        /* 添加报销时间 */
        showRtime(item){
            clearTimeout(this.timeout);
            item.rtimeshow=true;
            item.rtimedate=item.reimtime?item.reimtime:'';
            this.$nextTick(()=>{
                //日期自动获取焦点
                this.$refs['saveDateInput'+item.id].$refs.reference.$refs.input.focus();
            })
            this.timeout=setTimeout(()=>{
                //点击空白处隐藏
                document.addEventListener('click', this.unbindListen, false);
            },300)
        },
        /* 解绑监听 */
        unbindListen (e) {
            this.data.list.map(item=>{
                item.rtimeshow=false;
            })
            document.removeEventListener('click', this.unbindListen, false)
        },
        /* 组织默认事件 */
        propStop(){},
        /* 保存报销时间 */
        async updaterTime(item){
            let ptdata={
                reimtime:item.rtimedate,
                id:item.id
            };
            let res=await reimb.updateReimBurse(ptdata);
            if(res.ok){
                successTips("修改成功");
                this.getData();
            }else{
                msgTips(res);
            }
            item.rtimeshow=false;
        },
         /* 报销人列表 */
        getUserList(){
            invoice.invoiceUsers().then(res=>{
                if(res.ok){
                    this.userList=res.data;
                }
            })
        },
        /* 新建报销单 */
        addReim(){
            this.dialog=this.$options.data().dialog;
            this.checkList=[];
            this.getCode();
            this.dialog.visible=true;
            this.dialog.remark=""
        },
        /* 生成报销单code */
        getCode(){
            reimb.getrCode().then(res=>{
                if(res.ok){
                    let data=res.data;
                    this.dialog.code=data.code;
                    this.dialog.codeid=data.id;
                }
            })
        },
        /* 保存报销单 */
        async saveReim(){
            let {mguid,code,codeid,type,rid,remark}=this.dialog;
            if(!this.dialog.mguid){
                msgTips("请选择报销人");
                return;
            }
            let ptdata={},res;
            if(type==1){
                ptdata={
                    code:code,
                    codeid:codeid,
                    mguid:mguid,
                    ids:this.checkList.join(","),
                    remark
                };
                res=await reimb.addReimBurse(ptdata);
            }
            if(type==2){
                ptdata={
                    mguid:mguid,
                    ids:this.checkList.join(","),
                    id:rid,
                    remark
                };
                res=await reimb.updateReimBurse(ptdata);
            }
            if(res.ok){
                this.dialog.visible=false;
                successTips("保存成功");
                this.getData();
            }else{
                msgTips(res);
            }
        },
        /* 修改报销单 */
        async updateReim(item){
            if(item.uploadstatus==1){
                return;
            }
            this.checkList=[];
            this.dialog.type=2;
            let info=await this.getReimBurseInfo(item.code);
            let {code,mguid,amount,id,remark}=info;
            this.dialog.code=code;
            this.dialog.mguid=mguid;
            this.dialog.rid=id;
            this.dialog.money=amount.toFixed(2);
            this.dialog.orgmoney=amount;
            this.dialog.remark=remark
            this.getInvoiceList(item.code);
            this.dialog.visible=true;
            this.dialog.remarkShow = true
            this.dialog.remarksInputShow = false
        },
        /* 查看报销单信息 */
        seeInfo(code){
            this.reiminfo.code=code;
            this.reiminfo.show=true;
        },
        /* 关闭报销单信息 */
        closeInfo(){
            this.reiminfo.show=false;
        },
        /* 报销单基础信息 */
        async getReimBurseInfo(code){
            let data={};
            let res=await reimb.reimBurseInfo({code});
            if(res.ok){
                data=res.data;
            }else{
                msgTips(res);
            }
            return data;
        },
        /* 发票列表-报销单内 */
        getInvoiceList(code){
            let ptdata={pageNumber:1,pageSize:99,code};
            reimb.invoiceReimBurseList(ptdata).then(res=>{
                if(res.ok){
                    let list=res.data.list;
                    list.map(item=>{
                        item.rmshow=false;
                        item.uremark=item.remark;
                        item.ucosttype=item.costtype;
                        item.amount=item.amount.toFixed(2);
                    })
                    this.dialog.orglist=list;
                    this.dialog.list=list;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 研发项目字典、费用类型字典 */
        async getDevelopCode(){
            let res=await mgdictChild({pcode:'developcode'})
            if(res.ok){
                this.developsCode=res.data;
            }else{
                msgTips(res);
            }
            let res2=await mgdictChild({pcode:'costtype'})
            if(res2.ok){
                this.costType=res2.data;
            }else{
                msgTips(res);
            }
        },
        /* 添加发票 */
        addInvoice(){
            let {orgmoney,money,orglist}=this.dialog;
            let checkmoney=0;
            let list=[];
            this.dialog2.list.map(item=>{
                this.checkList.map(v=>{
                    if(v==item.id){
                        item.rmshow=false;
                        item.uremark=item.remark;
                        item.ucosttype=item.costtype;
                        list.push(item);
                        checkmoney+=Number(item.amount);
                    }
                })
            })
            this.dialog.money=(Number(orgmoney)+checkmoney).toFixed(2);
            this.dialog.list=orglist.concat(list);
            this.dialog2.visible=false;
        },
        /* 发票列表 */
        getInvoiceOutList(num){
            if(num){
                this.dialog2.pageNumber=num;
            }
            let {pageNumber,pageSize,mguid,starttime,endtime}=this.dialog2;
            let ptdata={
                pageNumber,
                pageSize,
                mguid,
                starttime,
                endtime
            };
            this.dialog2.loading=true;
            this.dialog2.visible=true;
            reimb.invoiceOutReimBurseList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    this.dialog2.totalPage=data.totalPage;
                    let list=data.list;
                    list.map(item=>{
                        item.fileurl=resUrl(item.fileurl);
                        item.amount=item.amount?Number(item.amount).toFixed(2):0.00;
                        this.developsCode.map(val=>{
                            if(val.code==item.developcode){
                                item.developname=val.name;
                            }
                        })
                    })
                    if(pageNumber==1){
                        this.dialog2.list=[];
                        this.setScroll();
                    }
                    this.dialog2.list=this.dialog2.list.concat(list);
                }
            })
        },
         /* 监听聊天滚动 */
        setScroll(){
            let _this=this;
            $("#maincontent").unbind('scroll');
            $("#maincontent").on('scroll',function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $("#scrollcontent").height();
                var contentHeight = $(this).height();
                if(_this.dialog2.totalPage>_this.dialog2.pageNumber&&_this.dialog2.loading&&scrollTop+contentHeight>scrollHeight-50){
                    _this.dialog2.pageNumber++;
                    _this.getInvoiceOutList();
                }
            })
        },
        /* 删除发票 */
        delCheckInvoice(item){
            let {type,rid,list}=this.dialog;
            let index=this.checkList.findIndex(val=>val==item.id);
            //若是新增发票-删除已选择发票数据，若是删除报销单中已存在发票请求删除接口
            if(index!=-1){
                this.checkList.splice(index,1);
                let index2=this.dialog.list.findIndex(val=>val.id==item.id);
                this.dialog.list.splice(index2,1);
                this.dialog.money=(this.dialog.money-item.amount).toFixed(2);
            }
            if(type==2&&index==-1){
                let ptdata={id:item.id,rid};
                reimb.delReimBurseInvoice(ptdata).then(res=>{
                    if(res.ok){
                        let index3=list.findIndex(val=>val.id==item.id);
                         this.dialog.list.splice(index3,1);
                    }else{
                        msgTips(res);
                    }
                })
            }
        },
        /* 编辑备注 */
        showRemarkIpt(event,item){
            item.rmshow=true;
            //解决table不更新问题
            this.dialog.list = Object.assign([],this.dialog.list) ;
            this.$nextTick(()=>{
                $(event.currentTarget).next().focus();
            })
        },
        /* 保存备注 */
        saveMark(item){
            item.rmshow=false;
            this.dialog.list = Object.assign([],this.dialog.list) ;
            let ptdata={
                id:item.id,
                remark:item.uremark
            };
            reimb.updateremark(ptdata).then(res=>{
                if(res.ok){
                    item.remark=item.uremark;
                    successTips('修改成功');
                }else{
                    msgTips('修改失败');
                }
            })
        },
        /* 保存费用类型修改 */
        saveCostChange(item){
            this.dialog.list = Object.assign([],this.dialog.list) ;
            let ptdata={
                id:item.id,
                remark:item.remark,
                costtype:item.ucosttype
            };
            reimb.updateremark(ptdata).then(res=>{
                if(res.ok){
                    item.costtype=item.ucosttype;
                    successTips('修改成功');
                }else{
                    item.ucosttype=item.costtype;
                    msgTips('修改失败');
                }
            })
        },
        /* 删除报销单 */
        showDelDialog(rid){
            this.dialog4.rid=rid;
            this.dialog4.visible=true;
        },
        /* 确认删除报销单 */
        sureDelReim(){
            reimb.delReimBurse({rid:this.dialog4.rid}).then(res=>{
                if(res.ok){
                    this.dialog4.visible=false;
                    this.getData();
                }else{
                    msgTips(res);
                }
            })
        },
        /* 查看 */
        seeInvoice(item){
            this.dialog3.visible=true;
            this.dialog3.data=resUrl(item.fileurl);
        },
        /* 切换分页 */
		handleCurrentChange(val){
            this.checkList=[];
            this.data.pageNumber = val;
            this.getData();
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this.data.pageNumber=1;
            this.data.pageSize=val;
            this.getData();
        },
        /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 下载 */
        downReim(item){
            if(item.fileurl){
                this.downFile(item.fileurl,item.reimtime);
            }else{
                if(this.load){
                    return;
                }
                this.load=true;
                reimb.upload({rid:item.id}).then(res=>{
                    if(res.ok){
                        let data=res.data;
                        this.downFile(data.url,item.reimtime);
                        this.getData();
                    }else{
                        this.load=false;
                        msgTips(res);
                    }
                })
            }
        },
        downFile(durl,reimtime){
            let fileurl=resUrl(durl);
            getFile(fileurl).then(res=>{
                let a = document.createElement('a');
                let url = window.URL.createObjectURL(res);
                a.href = url;
                let arr_name= durl.split("/");
                let file_name = arr_name[arr_name.length - 1]; // 获取文件名
                if(reimtime){
                    let index=file_name.lastIndexOf(".");
                    file_name=file_name.substring(0,index)+'_'+reimtime+file_name.substring(index);
                }
                a.download=file_name;
                a.click();
                window.URL.revokeObjectURL(url);
            });
        },
        remarksInput(){
          this.dialog.remarkShow = true
          this.dialog.remarksInputShow = !this.dialog.remarksInputShow
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/official/reimmanage.less";
</style>