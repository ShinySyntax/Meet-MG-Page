<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <!--            <div class="filter-item">-->
            <!--                <label class="filter-label">类型</label>-->
            <!--                <el-select v-model="filters.type" clearable>-->
            <!--                    <el-option v-for="item in typeSelect" :key="item.id" :value="item.id"-->
            <!--                               :label="item.label"></el-option>-->
            <!--                </el-select>-->
            <!--            </div>-->

            <div class="filter-btn">
                <button class="primarybtn search" @click="getData()">查询</button>
                <span>支付宝总计：{{vipCount.zfb}}，微信总计：{{vipCount.wx}},苹果内购总计:{{vipCount.apple}}， 后台赠送总计：{{vipCount.houtai}}</span>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">


                <el-table-column label="用户" :align="$protovar.align" width="210px">
                    <template slot-scope="scope">
                        <div class="user">
                            <div>
                                <el-image :src="scope.row.avatar" class="imgcol tmopera"
                                          @click="seeInfo(scope.row)"></el-image>
                            </div>
                            <div class="userInfo">
                                <span class="userInfo-nick color_666">{{ scope.row.nick }}</span>
                                <span class="color_999">UID:{{ scope.row.id }} </span>
                                <span class="color_999">ID:{{ scope.row.tiono }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="登录名/手机号" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <div class="accountInfo">
                            <span><i class="el-icon-user"></i>{{ scope.row.loginname }}</span><br />
                            <span><i class="el-icon-user"></i>{{ scope.row.phone }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="vip等级" :align="$protovar.align">
                    <template slot-scope="scope">
                        会员等级：{{ scope.row.vipid }}<br/>
                        会员名称：{{ scope.row.vipname }}<br/>
                        会员到期时间：{{ scope.row.expiretime }}<br/>
                    </template>

                </el-table-column>
                <el-table-column label="购买类型" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{ scope.row.paystatus == '1' ? "苹果内购" : scope.row.paystatus == '2' ? '微信' : scope.row.paystatus == '3' ? "支付宝" : scope.row.paystatus == '4' ? "后台" : "" }}
                    </template>

                </el-table-column>
                <el-table-column label="时间" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{ scope.row.createtime }}<br/>
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
    </div>
</template>
<script>
import {newgroupList, report, msgTips} from "@_/axios/path";
import {resUrl, btDate} from "@_/utils/common.js";
import {vipuser} from "../../axios/path";

export default {
    data() {
        return {
            names: 0,
            filters: {
                type: "",
            },
            typeSelect: [
                {id: 1, label: "有效"},
                {id: 0, label: "无效"},
            ],
            data: {
                //数据表格
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                loading: false, //表单loading
                list: [], //列表
                pagesizes: [10, 20, 30, 40],
            },
            curroute: "",
            visible: {
                complaintShow: false, //投诉记录
                groupChatShow: false,
                userChatShow: false,
            },
            groupid: "", //群id
            grouprowdata: {}, //选中的群消息
            groupStatus: 1,//1 封停, 2 解封
            userid: "", //群id
            userdata: {}, //选中的群消息
            userStatus: 1,//1 封停, 2 解封
            userStatus2: 1,//1 封停, 2 解封
            inblack: {//封停/解封原因
                reason: '',
                day: ''
            },
            refresh: false,
            report: {
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                list: [],
                loading: false,
                status: "",
                type: "",
            },
            vipCount: {
                apple:0.0,
                wx:0.0,
                zfb:0.0, 
                houtai:0.0
            }
        };
    },
    mounted() {
        this.curroute = this.$route.path;
        this.filters.searchkey = this.$route.query.uid || "";
        this.getData();
        this.getVipCount();
        
    },
    watch: {
        $route(to, from) {
            if (to.path == this.curroute) {
                let query = to.query;
                if (query.uid) {
                    Object.assign(this.$data, this.$options.data());
                    this.filters.searchkey = query.uid || "";
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
        },
    },
    //封号解封
    methods: {
        /** vip统计*/
        getVipCount() {
            vipuser.getVipCount({}).then((res) => {
                let result = res.data;
                this.vipCount = result;
                
            });
        },
        /* 用户账户 */
        getData(item) {
            if (item) {
                this.data.pageNumber = item;
            }
            this.data.loading = true;
            let {pageNumber, pageSize} = this.data;
            let ptdata = {...this.filters, pageNumber, pageSize};
            vipuser.getList(ptdata).then((res) => {

                let list = res.data.list;
                list.map((item) => {
                    item.avatar = resUrl(item.avatar);
                });
                this.data.totalRow = res.data.totalRow;

                this.data.list = res.data.list;
                this.data.loading = false;
            });

            
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
        /* 关闭弹框 */
        closeMsg(value) {
            this.dialog.visible = value;
        },
    },
};
</script>
<style lang="less" scoped>@import "~@_/assets/style/less/im/PurseComm.less";</style>