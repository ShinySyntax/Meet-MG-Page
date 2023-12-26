<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">类型</label>
                <el-select v-model="filters.type" clearable>
                    <el-option v-for="item in typeSelect" :key="item.id" :value="item.id"
                               :label="item.label"></el-option>
                </el-select>
            </div>

            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)">查询</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="举报投诉人" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        ID：{{ scope.row.u1tiono }}<br/>
                        昵称：{{ scope.row.u1nick }}<br/>
                        手机号：{{ scope.row.u1phone }}<br/>
                        <button class="primarybtn search" @click="closure(scope.row.u1id, 1,scope.row.u1status)">
                            {{ scope.row.u1status == 1 ? '封禁' : '解封' }}
                        </button>
                    </template>
                </el-table-column>
                <el-table-column label="被举报者" :align="$protovar.align" width="200">
                    <template slot-scope="scope">

                        <div v-if="scope.row.type == '1'">
                            ID：{{ scope.row.u2tiono }}<br/>
                            昵称：{{ scope.row.u2nick }}<br/>
                            手机号：{{ scope.row.u2phone }}<br/>
                            <button class="primarybtn search" @click="closure(scope.row.u2id, 1,scope.row.u2status)">
                                {{ scope.row.u2status == 1 ? '封号' : '解封' }}
                            </button>
                        </div>
                        <div v-if="scope.row.type == '2'">
                            群ID：{{ scope.row.groupid }}<br/>
                            群名称：{{ scope.row.groupname }}<br/>
                            <button class="primarybtn search" @click="inblackclick(scope.row)" v-auth="'reset'">
                                {{ scope.row.groupstatus == 1 ? '封群' : '解封' }}
                            </button>
                            <br/>
                            ID：{{ scope.row.u3tiono }}<br/>
                            昵称：{{ scope.row.u3nick }}<br/>
                            手机号：{{ scope.row.u3phone }}<br/>
                            <button class="primarybtn search" @click="closure(scope.row.u3id, 1,scope.row.u3status)">
                                {{ scope.row.u3status == 1 ? '封号' : '解封' }}
                            </button>
                        </div>
                        <div v-if="scope.row.type == '5'">
                            ID：{{ scope.row.u4tiono }}<br/>
                            昵称：{{ scope.row.u4nick }}<br/>

                            手机号：{{ scope.row.u4phone }}<br/>
                            <button class="primarybtn search" @click="closure(scope.row.u4id, 1,scope.row.u4status)">
                                {{ scope.row.u4status == 1 ? '封号' : '解封' }}
                            </button>
                        </div>

                        <div v-if="scope.row.type == '6' ||scope.row.type == '7'">

                            ID：{{ scope.row.u5tiono }}<br/>
                            昵称：{{ scope.row.u5nick }}<br/>

                            手机号：{{ scope.row.u5phone }}<br/>
                            <button class="primarybtn search" @click="closure(scope.row.u5id, 1,scope.row.u5status)">
                                {{ scope.row.u5status == 1 ? '封号' : '解封' }}
                            </button>
                        </div>


                    </template>
                </el-table-column>


                <el-table-column label="举报类型" :align="$protovar.align" width="100">
                    <template slot-scope="scope">
                        {{
                        scope.row.type == 1
                            ? "用户"
                            : scope.row.type == 2
                                ? "群"
                                : scope.row.type == 3
                                    ? "消息"
                                    : scope.row.type == 4
                                        ? "反馈"
                                        : scope.row.type == 5
                                            ? "朋友圈"
                                            : scope.row.type == 7
                                                ?"圈子详情"
                                                : scope.row.type == 6
                                                    ?"圈子"
                                            : "异常"
                        }}


                        <p v-if="scope.row.DESC != null && scope.row.DESC != ''" style="color: firebrick">
                            {{ scope.row.DESC }}
                        </p>
<!--                        <span v-if="scope.row.type==6">{{scope.row}}</span>-->
                        <button class="primarybtn search" @click="delmid(scope.row.mid)"
                                v-if="scope.row.DESC != null && scope.row.type == 5">
                            删除
                        </button>
                        <button class="primarybtn search" v-if="scope.row.DESC == null &&
                               scope.row.videourl == null && scope.row.type == 5 ">
                            朋友圈为空
                        </button>
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="credentialImg" width="200" label="举报图片/视频">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="click" width="300" v-for="item in scope.row.url"
                                    :key="item">
                            <img :src="sentout(item)" width="150%"/>
                            <img slot="reference" :src="sentout(item)"
                                 style="max-height: 70px; max-width: 70px; padding: 5px"/>
                        </el-popover>

                        <el-popover placement="left" trigger="click" width="300" v-if="scope.row.videourl!=null">
                            <video :src="scope.row.videourl" width="100%" autoplay="ture" controls="ture" loop="ture"
                                   muted="false"/>
                            <video slot="reference" :src="scope.row.videourl"
                                   style="max-height: 70px; max-width: 70px; padding: 5px"/>
                        </el-popover>
<!--                        <el-popover placement="left" trigger="click" width="300" v-if="scope.row.wcaftype == '1'"-->
<!--                                    v-for="item in scope.row.urlf.split(',')"-->
<!--                                    :key="item">-->
<!--                            <img :src="sentout(item)" width="150%"/>-->
<!--                            <img slot="reference" :src="sentout(item)"-->
<!--                                 style="max-height: 70px; max-width: 70px; padding: 5px"-->
<!--                            />-->
<!--                        </el-popover>-->

<!--                        <el-popover placement="left" trigger="click" width="300" v-if="scope.row.wcaftype=='2'">-->
<!--                            <video :src="scope.row.urlf" width="100%" autoplay="ture" controls="ture" loop="ture"-->
<!--                                   muted="false"/>-->
<!--                            <video slot="reference" :src="scope.row.urlf"-->
<!--                                   style="max-height: 70px; max-width: 70px; padding: 5px"/>-->
<!--                        </el-popover>-->
                    </template>
                </el-table-column>

                <el-table-column label="举报理由" :align="$protovar.align" width="150">
                    <template slot-scope="scope">
                        <p v-if="scope.row.reason != null && scope.row.reason != ''" style="color: blue">
                            {{ scope.row.reason }}
                        </p>
                        <p v-if="scope.row.srctext != null &&
              scope.row.srctext != '' &&
              scope.row.avatar3 != 'picture' &&
              scope.row.avatar3 != 'mp4'
              " style="color: firebrick">
                            内容：{{ scope.row.srctext }}
                        </p>
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="credentialImg" width="200" label="图片/视频">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="click" width="300"
                                    v-for="item in scope.row.imgs.split(',')"
                                    :key="item">
                            <img :src="sentout(item)" width="150%"/>
                            <img slot="reference" :src="sentout(item)"
                                 style="max-height: 70px; max-width: 70px; padding: 5px"
                                 v-if="scope.row.avatar2 == 'picture'"/>
                        </el-popover>

                        <el-popover placement="left" trigger="click" width="300" v-if="scope.row.avatar2 == 'mp4'">
                            <video :src="scope.row.imgs" width="100%" autoplay="ture" controls="ture" loop="ture"
                                   muted="false"/>
                            <video slot="reference" :src="scope.row.imgs"
                                   style="max-height: 70px; max-width: 70px; padding: 5px"/>
                        </el-popover>
                    </template>
                </el-table-column>



                <el-table-column label="记录创建时间" :align="$protovar.align" width="200">
                    <template slot-scope="scope">{{
                        scope.row.createtime
                        }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
<span class="tmopera" @click="deletemain1(scope.row.id)">删除</span>
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

        <el-dialog :visible.sync="visible.dialog" :width="$protovar.dwidth"  class="tmdialog" :before-close="setOriginal">
            <div class="title">确定删除？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="visible.dialog=false">取消</button>
                <button class="primarybtn" @click="deletemain2" :disabled="loading">删除</button>
            </div>
        </el-dialog>
        <!-- 封停/解封弹窗 -->
        <el-dialog :visible.sync="visible.groupChatShow" class="groupChat-dialog" width="553px">
            <div class="groupChatBox">
                <p>{{ groupStatus == 1 ? '封停' : '解封' }}原由</p>
                <textarea v-model="inblack.reason"
                          :placeholder="groupStatus==1?'请输入封停原由':'请输入解封原由'"></textarea>
                <p class="operator">操作人：{{ curruser && curruser.loginname }}</p>
            </div>
<!--            <div class="groupChatBox" style="height: 60px">-->
<!--                封禁时间：-->
<!--                <el-select v-model="inblack.day">-->
<!--                    <el-option label="3天" value="3"></el-option>-->
<!--                    <el-option label="7天" value="7"></el-option>-->
<!--                    <el-option label="30天" value="30"></el-option>-->
<!--                    <el-option label="永久" value="null"></el-option>-->
<!--                </el-select>-->
<!--            </div>-->
            <div class="tmdialog-footer">

                <button class="primarybtn search" @click="visible.groupChatShow=false">取消</button>
                <button class="primarybtn" @click="groupInblackoper()">
                    {{ groupStatus == 1 ? '确认封停' : '确认解封' }}
                </button>
            </div>
        </el-dialog>
        <!-- 封停/解封弹窗 -->
        <el-dialog :visible.sync="visible.userChatShow" class="groupChat-dialog" width="553px">
            <div class="groupChatBox">
                <p>{{ userStatus == 1 ? '封停' : '解封' }}原由</p>
                <textarea v-model="inblack.reason"
                          :placeholder="userStatus==1?'请输入封停原由':'请输入解封原由'"></textarea>
                <p class="operator">操作人：{{ curruser && curruser.loginname }}</p>
            </div>
            <div class="groupChatBox" style="height: 60px" v-show="userStatus==1">
                封禁时间：
                <el-select v-model="inblack.day">
                    <el-option label="3天" value="3"></el-option>
                    <el-option label="7天" value="7"></el-option>
                    <el-option label="30天" value="30"></el-option>
                    <el-option label="永久" value="null"></el-option>
                </el-select>
            </div>
            <div class="tmdialog-footer">
                <button class="primarybtn search" @click="visible.userChatShow=false">取消</button>
                <button class="primarybtn" @click="closure1()">
                    {{ userStatus == 1 ? '确认封停' : '确认解封' }}
                </button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {newgroupList, report, msgTips} from "@_/axios/path";
import {resUrl, btDate} from "@_/utils/common.js";

export default {
    data() {
        return {
            names: 0,
            filters: {
                searchkey: "",
                walletid: "",
                type: "",
            },
            typeSelect: [
                {id: 1, label: "用户"},
                {id: 2, label: "群"},
                // {id: 3, label: "消息"},
                {id: 5, label: "朋友圈"},
                {id: 6, label: "圈子"},
                {id: 7, label: "圈子详情"},
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
                groupChatShow:false,
                userChatShow:false,
                dialog:false,
                id:'',
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
                day: 'null'
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
        };
    },
    mounted() {
        this.curroute = this.$route.path;
        this.filters.searchkey = this.$route.query.uid || "";
        this.getData();
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
        /**封停/解封弹窗展示 */
        inblackclick(data) {
            this.inblack.reason='账号涉嫌违规已封停'
            this.groupid = data.groupid
            if (data.groupstatus == '1') {
                this.groupStatus = true//true封停, false解封
            } else {
                this.groupStatus = false
            }
            this.visible.groupChatShow = true
        },
        /**封停事件 */
        groupInblackoper() {
            let status = this.groupStatus == 1 ? 2 : 1
            let data = {
                reason: this.inblack.reason,
                groupid: this.groupid,
                status
            }
            newgroupList.inblack(data).then(res => {
                if (res.ok) {
                    msgTips(this.groupStatus === true ? '封停成功' : '解封成功')
                    this.visible.groupChatShow = false
                    this.getData()
                }
            })
        },
        sentout(id) {
            return id;
        },

        closure(id, status,status2) {
            console.log(id+">?>+"+status2)
            this.inblack.reason='账号涉嫌违规已封停'
            this.userid=id;
            this.userStatus2=status;
            this.userStatus=status2;
            this.visible.userChatShow = true;
        },
        closure1() {
            let closures = {id:this.userid, status:this.userStatus2, reason:this.inblack.reason ,day: this.inblack.day};
            report.closure(closures).then((res) => {
                if (res.ok == true) {
                    this.visible.userChatShow = false;
                    this.getData();
                } else {
                    msgTips(res.msg);
                }
            });
        },

        delmid(id) {
            console.log(id);
            let mid = {id};

            console.log(id);
            report.delmid(mid).then((res) => {
                console.log(res);
                console.log(res.data);
                if (res.ok == true) {
                    this.getData();
                } else {
                    msgTips(res.msg);
                }
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
            report.openlistmore(ptdata).then((res) => {
                for (var i = 0; i < pageSize; i++) {
                    try {
                        if (res.data.list[i].urls != "") {
                            res.data.list[i].url = res.data.list[i].urls.split(',')
                        }
                    } catch (err) {
                        console.log("不存在urls");
                    }
                    try {
                        if (res.data.list[i].imgs != "") {
                            if (res.data.list[i].imgs.search(".mp4") != -1) {
                                res.data.list[i].avatar2 = "mp4";
                            } else {
                                res.data.list[i].avatar2 = "picture";
                            }
                        }
                    } catch (err) {
                        console.log("不存在imgs");
                    }
                }
                let data = res.data;
                this.data.list = data.list;
                if (data) {
                    this.data.totalRow = data.totalRow;
                    let list = data.list;
                    list.map((item) => {
                        item.avatar = resUrl(item.avatar);
                        item.useravatar = resUrl(item.useravatar);
                        item.forbiddenflag = item.forbiddenflag == 1 ? "已开启" : "关闭";
                        item.createtimeday = btDate(item.createtime);
                    });
                    this.data.list = list || [];
                    window.scrollTo(0, 0);

                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        /* 切换分页 */
        handleCurrentChange(val) {
            this.data.pageNumber = val;
            this.getData();
        },
        deletemain1(id){
            this.visible.id=id;
            this.visible.dialog=true;
        },
        deletemain2(){
            report.deletemain({id:this.visible.id}).then((res)=>{
                if (res.ok ) {
                    this.getData();
                    this.visible.dialog=false;
                } else {
                    msgTips(res.msg);
                }
            })
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this.data.pageNumber = 1;
            this.data.pageSize = val;
            this.getData();
        },
        /**查看红包明细 */
        seereportList(data) {
            this.visible.complaintShow = true;
            this.grouprowdata = data;
            this.uid = data.uid;
            this.getreportlist();
        },

        getreportlist(number) {
            let data = {
                pageNumber: this.report.pageNumber,
                uid: this.uid,
                status: this.report.status,
                pageSize: this.report.pageSize,
            };
            if (number) {
                data.pageNumber = number;
            }
            this.report.loading = true;
            report.coinlist(data).then((res) => {
                if (res.ok) {
                    this.report.totalRow = res.data.totalRow;
                    let list = res.data.list;
                    list.map((item) => {
                        item.avatar = resUrl(item.avatar);
                        item.createtimeday = btDate(item.createtime);
                    });
                    this.report.list = list || [];
                }
                this.report.loading = false;
            });
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
    },
};
</script>
<style lang="less" scoped>@import "~@_/assets/style/less/im/PurseComm.less";</style>