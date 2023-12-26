<template>
    <div class="commonright container groupChatMage">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">用户</label>
                <el-input type="text" clearable v-model="filters.searchkey" placeholder="昵称"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">钱包ID</label>
                <el-input type="text" clearable v-model="filters.walletid" placeholder="钱包ID"></el-input>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)">查询</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="用户" :align="$protovar.align" width="220">
                    <template slot-scope="scope">
                        <div class="user">
                            <div>
                                <el-image :src="scope.row.avatar" class="imgcol tmopera">
                                    <div slot="error" class="image-slot">
                                        <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                    </div>
                                </el-image>
                            </div>
                            <div class="userInfo">
                                <span class="userInfo-nick color_666">{{ scope.row.nick }} </span>
                                <span class="color_999">UID:{{ scope.row.id }} </span>
                                <span class="color_999">ID:{{ scope.row.tiono }} </span>
                                <span class="color_999">手机号:{{ scope.row.phone }} </span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="钱包Id" prop="phone" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.walletid }}
                    </template>
                </el-table-column>
                <el-table-column label="姓名/身份证" :align="$protovar.align" width="300">
                    <template slot-scope="scope">
                        <div class="user">
                            <div class="userInfo">
                                <span class="color_666">姓名：{{ scope.row.truename }} </span>
                                <span class="color_999">身份账号：{{ scope.row.idcardno }} </span>
                                <span class="color_666">微信绑定id：{{ scope.row.wxopenid }} </span>
                                <span class="color_999">微信账号：{{ scope.row.wxunionid }} </span>
                                <span class="color_666">绑定支付宝姓名：{{ scope.row.alipayname }} </span>
                                <span class="color_999">支付宝账号：{{ scope.row.alipayloginid }} </span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="余额" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <div>
                            <p>余额￥{{ scope.row.cny / 100 || 0 }}元</p>
                            <p>充值￥{{ scope.row.cnyin / 100 || 0 }}元</p>
                            <p>提现￥{{ scope.row.cnyout / 100 || 0 }}元</p>

                            <!--                            <span class="color_3A7BE9" @click="seereportLists(scope.row)"-->
                            <!--                                  v-auth="'update'">修改</span>-->
                            <!--                            <span class="color_3A7BE9" @click="seereportList(scope.row)">钱包明细</span>-->
                            <button class="button" @click="seereportLists(scope.row)" v-auth="'revise'"><span>修改</span></button>
                            <button class="button"  @click="seereportList(scope.row)" v-auth="'details'"><span>明细</span></button>

                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="开户手机/状态" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <div class="user">
                            <div class="userInfo">
                                <div>
                                    <span
                                            :class="['statuIcon', scope.row.num== 3 ? 'statuRed':'statuGreen'  ]"></span>
                                    <span>密码错误{{ scope.row.num != null ? scope.row.num : '0' }}次</span>
                                    <br/>
                                    <div style="display: flex;" v-if="scope.row.num!=null">
                                        <button class="button"  @click="setzero(scope.row.wwpnid)"><span>错误次数归零</span></button>

                                    </div>
                                </div>
                                <br/>
                                <span class="userInfo-nick color_666">{{ scope.row.mobile }} </span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="时间" sortable prop="time" :align="$protovar.align" width="190">
                    <template slot-scope="scope">
                        <span class="color_666">{{ scope.row.updatetime }} </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagecontainer" v-show="data.totalRow > 0">
            <el-pagination layout="total,prev, pager, next,sizes,jumper" background :page-size="data.pageSize"
                           :page-sizes="data.pagesizes" :total="data.totalRow" :current-page="data.pageNumber"
                           @current-change="handleCurrentChange" @size-change="handleSizeChange">
            </el-pagination>
        </div>

        <!-- 钱包明细 -->
        <el-dialog :visible.sync="visible.complaintShow" class="complaintShow-dialog" width="1080px">
            <div class="complaintShowBox contentpad">
                <p class="complaintShow-title">钱包明细</p>
                <div class="complaintShow-header">
                    <div class="complaintShow-left">
                        <div class="header-box">
                            <el-image :src="grouprowdata.avatar" fit="cover" class="el-image">
                                <div slot="error" class="image-slot">
                                    <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                </div>
                            </el-image>
                            <div class="complaintShow-header-right">
                                <p>{{ grouprowdata.nick }}</p>
                                <p class="color_666">ID:{{ grouprowdata.id }}</p>
                            </div>
                        </div>
                        <div class="header-box">
                            <div class="complaintShow-header-right">
                                <p>钱包ID</p>
                                <p class="color_666">{{ grouprowdata.walletid }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="filter">
                        <div class="filter-item">
                            <el-select v-model="report.status" clearable placeholder="请选择">
                                <el-option label="充值" value="1"></el-option>
                                <el-option label="提现" value="2"></el-option>
                                <el-option label="红包" value="3"></el-option>
                            </el-select>
                        </div>
                        <div class="filter-btn">
                            <button class="primarybtn search" @click="getreportlist(1)">查询</button>
                        </div>
                    </div>
                    <span class="refresh" @click="getreportlist(1), report.status = ''">
                        <img src="~@_/assets/img/common/refreshin.png" :class="[refresh ? 'rotate' : '']"/>
                        刷新
                    </span>
                </div>
                <div class="complaintShow-table">
                    <el-table :data="report.list" v-loading="report.loading"
                              :header-cell-style="{ background: $protovar.tbhabg }">
                        <el-table-column label="流水单号" prop="reqid" :align="$protovar.align" width="300">
                            <template slot-scope="scope">
                                {{ scope.row.merorderid }}
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" :align="$protovar.align">
                            <template slot-scope="scope">
                                <div class="user">
                                    <span v-if="scope.row.paytype == 4">
                                    {{
                                        '转账'
                                    }}
                                    </span>
                                    <span v-else>{{
                                        scope.row.mode == 1 ? '充值' : scope.row.mode == 2 ? '提现' : scope.row.mode == 3 ?
                                            '红包' : scope.row.mode == 4 ? '银行卡消费' : scope.row.mode == 5 ? '银行卡退款' : ''
                                        }}
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" prop="cny" :align="$protovar.align">
                        </el-table-column>
<!--                        <el-table-column label="收支" :align="$protovar.align">-->
<!--                            <template slot-scope="scope">-->
<!--                                <div class="user">-->
<!--                                    <span>{{-->
<!--                                        scope.row.coinflag == 1 ? '收入' : scope.row.coinflag == 2 ? '支出' : ''-->
<!--                                        }}</span>-->
<!--                                </div>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                        <el-table-column label="描述" prop="remark" :align="$protovar.align">
                        </el-table-column>

                        <el-table-column label="时间" prop="time" :align="$protovar.align" width="180">
                            <template slot-scope="scope">
                                <span class="color_666">{{ scope.row.createtime }} </span><br>
                            </template>
                        </el-table-column>

                    </el-table>
                    <!-- 分页 -->
                    <div class="pagecontainer" v-show="report.totalRow > 0">
                        <el-pagination layout="total,prev, pager, next,sizes,jumper" background
                                       :page-size="report.pageSize"
                                       :page-sizes="report.pagesizes" :total="report.totalRow"
                                       :current-page="report.pageNumber"
                                       @current-change="handleCurrentReport" @size-change="handleSizeReport">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 钱包明细 -->
        <el-dialog :visible.sync="visible.complaintShows" class="complaintShow-dialog" width="1080px">
            <div class="complaintShowBox contentpad">
                <p class="complaintShow-title">钱包</p>
                <div class="complaintShow-header">
                    <div class="header-box">
                        <el-image :src="grouprowdata.avatar" fit="cover" class="el-image">
                            <div slot="error" class="image-slot">
                                <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                            </div>
                        </el-image>
                        <div class="complaintShow-header-right">
                            <p>{{ grouprowdata.nick }}</p>
                            <p class="color_666">ID:{{ grouprowdata.id }}</p>
                            <p class="color_666">钱包ID{{ grouprowdata.walletid }}</p>
                        </div>
                    </div>

                </div>
            </div>
            <div style="height:100px">
                <div style="margin:20px 50px 0px 20px; width:40%;float:left;">
                    <div class="complaintShow-header-right"
                         style="border:1px solid #000;height:60px;padding-top:15px;font-size:20px">
                        ￥：<input border-style='solid' v-model="cny1" style="text-align: center;font-size:20px">
                        元
                        <button class="primarybtn search" style="float:right"
                                @click="update(grouprowdata, cny1, 1)">添加
                        </button>
                    </div>
                </div>
                <div style="margin:20px 50px 0px 20px; width:40%;float:left;">
                    <div class="complaintShow-header-right"
                         style="border:1px solid #000;height:60px;padding-top:15px;font-size:20px">
                        ￥：<input border-style='solid' v-model="cny2" style="text-align: center;font-size:20px">
                        元
                        <button class="primarybtn search" style="float:right"
                                @click="update(grouprowdata, cny2, 2)">减少
                        </button>
                    </div>
                </div>


            </div>
        </el-dialog>
    </div>
</template>
<script>
import {redPrurse, msgTips, successTips} from '@_/axios/path';
import {resUrl, btDate} from '@_/utils/common.js';

export default {
    data() {
        return {
            cny1: '',
            cny2: '',
            filters: {
                searchkey: '',
                walletid: ''
            },
            data: {//数据表格
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0,//总条数
                loading: false,//表单loading
                list: [],//列表
                pagesizes: [10, 20, 30, 40]
            },
            curroute: '',
            visible: {
                complaintShow: false,//投诉记录
                complaintShows: false,//投诉记录
            },
            groupid: '',//群id
            grouprowdata: {},//选中的群消息
            refresh: false,
            report: {
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0,//总条数
                list: [],
                loading: false,
                status: '',
                money: '',
                cnys: '',
            }
        }
    },
    mounted() {
        this.curroute = this.$route.path;
        this.filters.searchkey = this.$route.query.uid || '';
        this.getData();
    },
    watch: {
        '$route'(to, from) {
            if (to.path == this.curroute) {
                let query = to.query;
                if (query.uid) {
                    Object.assign(this.$data, this.$options.data());
                    this.filters.searchkey = query.uid || '';
                    this.curroute = this.$route.path;
                    this.getData();
                    return;
                }
                if (this.$protovar.routehasopen != -1 && !query.random) {
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute = this.$route.path;
                this.getData();
            }
        }
    },

    methods: {

        /* 用户账户 */
        getData(item) {
            if (item) {
                this.data.pageNumber = item;
            }
            this.data.loading = true;
            let {pageNumber, pageSize} = this.data;
            let ptdata = {...this.filters, pageNumber, pageSize};
            console.log(ptdata);
            redPrurse.openlist(ptdata).then(res => {
                console.log(res)
                if (res.ok) {
                    let data = res.data;
                    if (data) {
                        this.data.totalRow = data.totalRow;
                        let list = data.list;
                        list.map(item => {
                            item.avatar = resUrl(item.avatar);
                            item.useravatar = resUrl(item.useravatar);
                            item.forbiddenflag = item.forbiddenflag == 1 ? '已开启' : '关闭'
                            item.createtimeday = btDate(item.createtime)
                        })
                        this.data.list = list || [];
                        window.scrollTo(0, 0);
                    }
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            })
        },
        /* 切换分页 */
        handleCurrentChange(val) {
            this.data.pageNumber = val;
            this.getData();
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this.data.pageNumber = 1;
            this.data.pageSize = val;
            this.getData();
        },
        /**查看红包明细 */
        seereportList(data) {
            this.visible.complaintShow = true
            this.grouprowdata = data
            this.uid = data.id
            this.getreportlist(1)
        },
        /**查看红包明细 */
        seereportLists(data) {
            this.cny1='';
            this.cny2='';
            this.visible.complaintShows = true
            this.grouprowdata = data
            this.uid = data.id
        },
        getreportlist(number) {
            let data = {
                pageNumber: this.report.pageNumber,
                uid: this.uid,
                status: this.report.status,
                pageSize: this.report.pageSize
            }
            if (number) {
                data.pageNumber = number
            }
            this.report.loading = true
            console.log(data)
            redPrurse.coinlist(data).then(res => {
                if (res.ok) {
                    this.report.totalRow = res.data.totalRow;
                    let list = res.data.list;
                    list.map(item => {
                        item.avatar = resUrl(item.avatar);
                        item.createtimeday = btDate(item.createtime)
                    })
                    this.report.list = list || [];
                }
                this.report.loading = false
            })
        },
        /* 切换分页 */
        handleCurrentReport(val) {
            this.report.pageNumber = val;
            this.getreportlist();
        },
        /* 调整每页显示条数 */
        handleSizeReport(val) {
            this.report.pageNumber = 1;
            this.report.pageSize = val;
            this.getreportlist();
        },
        /* 关闭弹框 */
        closeMsg(value) {
            this.dialog.visible = value;
        },
        update(name, cny, n) {

            var strArray = ["0","1","2","3","4","5","6","7","8","9","."];
            var bResult = true;
            for(var i in cny){
                if (strArray.indexOf(cny[i])==-1) {
                    bResult =false;
                }
            }
            if (cny == null || cny == "") {
                successTips("请输入金额");
                return;
            }
            cny = parseFloat(cny) * 100;
            if (bResult) {
                if (n == 1) {
                    cny = "+" + cny
                } else if (n == 2) {
                    if(name.cny<cny){
                        successTips("处理失败");
                        return false;
                    }
                    cny = "-" + cny
                }
                let data = {uid: name.id, cnys: cny}
                redPrurse.updata(data).then((response) => {
                    successTips("修改成功");
                    this.visible.complaintShows = false;
                    this.getData(0);
                })
            }else {
                successTips("处理失败");
            }
        },
        setzero(wwpnid) {
            let data = {id: wwpnid};
            redPrurse.setzero(data).then((res) => {
                if (res.ok) {
                    this.getData();
                } else {
                    msgTips(res);
                }
            });
        },
    },

}
</script>
<style lang="less" scoped>@import "~@_/assets/style/less/im/PurseComm.less";</style>