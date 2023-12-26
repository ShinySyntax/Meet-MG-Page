<template>
    <div class="conmonright container">
        <!--        &lt;!&ndash; 筛选 &ndash;&gt;-->
        <!--        <div class="filter">-->
        <!--            <div class="filter-btn">-->
        <!--                <button class="primarybtn" @click="addData()" v-auth="'add'">-->
        <!--                    新增-->
        <!--                </button>-->
        <!--            </div>-->
        <!--        </div>-->
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="序号" :align="$protovar.align" width="50px">
                    <template slot-scope="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                <el-table-column label="用户" :align="$protovar.align" width="230px">
                    <template slot-scope="scope">
                        <!--                        用户序号：{{scope.row.uid}}<br>-->
                        <!--                        账号：{{scope.row.tiono}}<br>-->
                        <!--                        登录名：{{scope.row.loginname}}<br>-->
                        <!--                        昵称：{{scope.row.nick}}<br>-->
                        <!--                        <el-image :src="scope.row.avatar" @click="seeInfo(scope.row,'groupInfo')"  class="imgcol tmopera">-->
                        <!--                            <div slot="error" class="image-slot">-->
                        <!--                                <img src="~@_/assets/img/im/avatar.jpg" @click="seeInfo(scope.row,'groupInfo')"  class="error-img"/>-->
                        <!--                            </div>-->
                        <!--                        </el-image>-->
                        <div class="user">
                            <div>
                                <el-image :src="scope.row.avatar" class="imgcol tmopera">
                                    <div slot="error" class="image-slot">
                                        <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                    </div>
                                </el-image>
                            </div>
                            <div class="userInfo">
                                <span>用户序号：{{ scope.row.uid }}</span>
                                <span>账号：{{ scope.row.tiono }}</span>
                                <span>登录名：{{ scope.row.loginname }}</span>
                                <span>昵称：{{ scope.row.nick }}</span>
                                <span>手机号：{{ scope.row.phone }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="圈子描述" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{ scope.row.info }}
                    </template>
                </el-table-column>
                <el-table-column label="圈子名称" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column label="时间" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{ scope.row.createtime }}
                    </template>
                </el-table-column>
                <el-table-column label="审核状态">
                    <template slot-scope="scope">
                        {{
                        scope.row.status == 0 ? '未审核' : scope.row.status == 1 ? '审核通过' : scope.row.status == 2 ? '审核拒绝' : ''
                        }}
                        <br />
                        {{
                            scope.row.recommend == 0 ? '未推荐' :'已推荐'
                        }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" :align="$protovar.align">
                    <template slot-scope="scope">
                        <div style="display: flex;" v-if="scope.row.status==0">
                            <span @click="setCircle1(scope.row.id,1)" style="color:green">选择通过</span>
                            <span @click="setCircle1(scope.row.id,2)" style="color:red">选择拒绝</span>
                        </div>
                        <div style="display: flex;" v-else-if="scope.row.status==1" >
                            <span @click="setCircle1(scope.row.id,4)" v-show="scope.row.recommend==0" style="color:green">上架推荐</span>
                            <span @click="setCircle1(scope.row.id,3)"  v-show="scope.row.recommend==1" style="color:red">下架推荐</span>
                        </div>
                        <div style="display: flex">
                            <span @click="openCircle(scope.row.id)" style="color:green">详情</span>
                            <span @click="delCircle(scope.row.id)" style="color:red">解散圈子</span>
                        </div>
                        <!--                        <div style="display: flex;" v-if="scope.row.status==1">-->
                        <!--                            <span @click="setCircle(scope.row.id,2)" style="color:red">选择拒绝</span>-->
                        <!--                        </div>-->
                        <!--                        <div style="display: flex;" v-if="scope.row.status==2">-->
                        <!--                            <span @click="setCircle(scope.row.id,1)" style="color:green">选择通过</span>-->
                        <!--                        </div>-->
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
        <!--       详情-->
        <div>
            <el-dialog :visible.sync="dialog1.visible" class="tmdialog" :modal="false">
                <el-table :data="data1.list" v-loading="false" :header-cell-style="{ background: $protovar.tbhabg }">
                    <el-table-column label="用户" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span>账号：{{ scope.row.tiono }}</span><br/>
                            <span>昵称：{{ scope.row.nick }}</span><br/>
                            <span>登录名：{{ scope.row.loginname }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="圈子" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span>题目：{{ scope.row.info}}</span><br/>
                            <span>地点：{{ scope.row.name}}</span><br/>
                            <span>时间：{{ scope.row.createtime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="图片/视频" :align="$protovar.align">
                        <template slot-scope="scope">
                            <div v-if="scope.row.type == 1">
                                <el-popover placement="left" trigger="click" width="300"
                                            v-for="item in scope.row.urls.split(',')" :key="item">
                                    <img :src=item width="100%" />
                                    <img slot="reference" :src=item
                                         style="max-height: 70px;max-width: 70px; padding: 5px" />
                                </el-popover>
                            </div>
                            <div v-if="scope.row.type == 2">
                                <el-popover placement="left" trigger="click" width="300">
                                    <video :src="scope.row.urls" width="100%" autoplay="ture" controls="ture" loop="ture"
                                           muted="false" />
                                    <video slot="reference" :src="scope.row.urls"
                                           style="max-height: 70px;max-width: 70px; padding: 5px" />
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <button class="button"  @click="del(scope.row.id)">删除</button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagecontainer" v-show="data1.totalRow > 0">
                    <el-pagination layout="total,prev, pager, next,sizes,jumper" background :page-size="data1.pageSize"
                                   :page-sizes="data1.pagesizes" :total="data1.totalRow"
                                   :current-page="data1.pageNumber"
                                   @current-change="handleCurrentChange1" @size-change="handleSizeChange1">
                    </el-pagination>
                </div>
            </el-dialog>
        </div>
        <el-dialog :visible.sync="dialog1.visible1" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div class="title">确定删除</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="dialog1.visible1=false">取消</button>
                <button class="primarybtn" @click="del2">确定</button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialog2.visible" :width="$protovar.dwidth" class="tmdialog" :modal="false">
        <div class="title">确定解散</div>
        <div class="tmdialog-footer pb60">
            <button class="primarybtn search" @click="dialog2.visible=false">取消</button>
            <button class="primarybtn" @click="delCircle2">确定</button>
        </div>
    </el-dialog>
        <el-dialog :visible.sync="dialog3.visible" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div class="title">{{dialog3.title}}</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="dialog3.visible=false">取消</button>
                <button class="primarybtn" @click="setCircle">确定</button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {page, msgTips} from "@_/axios/path";
import {circle, IP} from "../../axios/path";
import {resUrl} from "../../utils/common";

export default {
    data() {
        return {
            ids:'',
            data: {
                //数据表格
                loading: false, //表单loading
                list: [], //列表
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                pagesizes: [10, 20, 30, 40],
            },
            data1: {
                //数据表格
                loading: false, //表单loading
                list: [], //列表
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                pagesizes: [10, 20, 30, 40],
            },
            dialog: {
                type: "add",
                title: "",
                visible: false,
                form: {
                    id: null,
                    pid: null,
                    name: null,
                    url: null,
                    icon: null,
                },

            },
            dialog1: {
                visible: false,
                visible1: false,
                id:'',
                ids:'',
            },
            dialog2: {
                visible: false,
                ids:'',
            },
            dialog3: {
                title:'',
                visible: false,
                status:'',
                ids:'',
            },

        };
    },

    watch: {
        $route(to, from) {
            if (to.path == this.curroute) {
                if (this.$protovar.routehasopen != -1 && !to.query.random) {
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute = this.$route.path;
                this.getData();
            }
        },
    },
    mounted() {
        this.curroute = this.$route.path;
        this.getData();
    },
    methods: {
        getData() {
            this.data.loading = true;//加载中
            let ptdata = {pageNumber: this.data.pageNumber, pageSize: this.data.pageSize};
            circle.getList(ptdata).then((res) => {
                if (res.ok) {
                    let data = res.data;
                    if (data) {
                        this.data.totalRow = data.totalRow;
                        this.data.list = data.list;
                        this.data.list.map(item => {
                            item.avatar = resUrl(item.avatar);
                        })
                    }
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        setCircle1(id, status){
            this.dialog3.visible=true;
            this.dialog3.status=status;
            this.dialog3.id=id;
                switch (status){
                    case 1:
                        this.dialog3.title="请确定审核通过";
                        break;
                    case 2:
                        this.dialog3.title="请确定审核拒绝";
                        break;
                    case 3:
                        this.dialog3.title="请确定推荐下架";
                        break;
                    case 4:
                        this.dialog3.title="请确定推荐上架";
                        break;
                }
        },
        // 审核
        setCircle() {
            let update = {id: this.dialog3.id, status: this.dialog3.status}
            this.dialog3.visible=false;
            circle.setStatus(update).then((res) => {
                if (res.ok) {
                    this.getData();
                } else {
                    msgTips(res);
                }
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
        }, /* 切换分页 */
        handleCurrentChange1(val) {
            this.data1.pageNumber = val;
            this.openCircle();
        },
        /* 调整每页显示条数 */
        handleSizeChange1(val) {
            this.data1.pageNumber = 1;
            this.data1.pageSize = val;
            this.openCircle();
        },
        openCircle(ids) {
            if(ids!=null&&ids!=''){
                this.dialog1.ids=ids;
            }
            this.dialog1.visible = true;
            let data = {id: this.dialog1.ids, pageNumber:this.data1.pageNumber, pageSize:this.data1.pageSize };
            circle.openCircle(data).then((res) => {
                console.log(res);
                if (res.ok) {
                    let data = res.data;
                    this.data1.totalRow = data.totalRow;
                    this.data1.list = data.list;
                    this.data1.loading = false;
                }
            });
        },
        delCircle(ids){
            this.dialog2.visible=true;
            this.dialog2.ids=ids;
        },
        del(id) {
            this.dialog1.visible1 = true;
            this.dialog1.id = id;
        },
        del2(){
            let data = {id:this.dialog1.id };
            circle.del(data).then((res) => {
                if (res.ok) {
                    this.openCircle(this.dialog1.ids)
                    this.dialog1.visible1=false;
                }
            });
        },
        delCircle2(){
            let data = {id:this.dialog2.ids };
            circle.del2(data).then((res) => {
                if (res.ok) {
                    this.dialog2.visible=false;
                    this.getData();
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@_/assets/style/less/im/invalidGroup.less";
@import "~@_/assets/style/less/im/groupmanage.less";
</style>