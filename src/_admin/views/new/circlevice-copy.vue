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
        <div>

            <el-button type="warning" @click="deleteSelectItem">批量删除</el-button>
            <el-table
                ref="multipleTable"
                :data="searchlist"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="bianhao" label="" width="200">
                </el-table-column>
            </el-table>

        </div>
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="序号" :align="$protovar.align" width="50px">
                    <template slot-scope="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                <el-table-column label="用户" :align="$protovar.align" width="220px">
                    <template slot-scope="scope">
                        <div class="user">
                            <div>
                                <el-image :src="scope.row.avatar" class="imgcol tmopera"></el-image>
                            </div>
                            <div class="userInfo">
                                <span class="userInfo-nick color_666">{{ scope.row.nick }}</span>
                                <span class="color_999">ID:{{ scope.row.uid }}</span>
                                <span class="color_999">账号:{{ scope.row.tiono }}</span>
                                <span class="color_999">手机号:{{ scope.row.phone }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="圈子详情" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{ scope.row.info }}<br/>
                        <span class="userInfo-nick color_666">地区：{{ scope.row.province }}{{
                            scope.row.city
                            }}{{ scope.row.area }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所在圈子" :align="$protovar.align">
                    <template slot-scope="scope">
                        内容：{{ scope.row.wcname }}<br/>
                        描述:{{ scope.row.wcinfo }}<br/>
                    </template>
                </el-table-column>
                <el-table-column label="图片/视频" :align="$protovar.align">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="click" width="300"
                                    v-for="item in scope.row.urls.split(',')" :key="item">
                            <img :src=item width="100%"/>
                            <img slot="reference" :src=item
                                 style="max-height: 70px;max-width: 70px; padding: 5px"/>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作" :align="$protovar.align">
                    <template slot-scope="scope">
                        <div style="display: flex">
                            <span @click="delcirclevice(scope.row.id)" style="color:red">删除</span>
                        </div>
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
<!--        确定删除-->
        <el-dialog :visible.sync="dialog" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div class="title">确定删除</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="dialog=false">取消</button>
                <button class="primarybtn" @click="delcirclevice2">确定</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {page, msgTips} from "@_/axios/path";
import {circle, IP, circlevice} from "../../axios/path";
import {resUrl} from "../../utils/common";
import $protovar from "quill";

export default {
    data() {
        return {
            mainid:[],
            id:'',
            dialog:false,
            data: {
                //数据表格
                loading: false, //表单loading
                list: [], //列表
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                pagesizes: [10, 20, 30, 40],
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
        $protovar() {
            return $protovar
        },
        resUrl,
        getData() {
            this.data.loading = true;//加载中
            let ptdata = {pageNumber: this.data.pageNumber, pageSize: this.data.pageSize};
            circlevice.getList(ptdata).then((res) => {
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
        delcirclevice(id){
            this.id=id;
            this.dialog=true;
        },
        delcirclevice2(){
            circlevice.del({id:this.id}).then((res)=>{
                if(res.ok){
                    this.dialog=false;
                    this.getData();
                }
            })
            this.dialog=ture;
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
    },
};
</script>

<style lang="less" scoped>
@import "~@_/assets/style/less/im/invalidGroup.less";
@import "~@_/assets/style/less/im/groupmanage.less";
</style>