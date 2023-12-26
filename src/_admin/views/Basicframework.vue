<!--<template>-->
<!--    <div class="conmonright container">-->
<!--        &lt;!&ndash; 筛选 &ndash;&gt;-->
<!--        <div class="filter">-->
<!--            <div class="filter-btn">-->
<!--                <button class="primarybtn" @click="addData()" v-auth="'add'">-->
<!--                    新增-->
<!--                </button>-->
<!--            </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; 数据表格 &ndash;&gt;-->
<!--        <div class="contentpad">-->
<!--            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">-->
<!--                <el-table-column label="序号" :align="$protovar.align">-->
<!--                    <template slot-scope="scope">{{-->
<!--                        scope.row.id-->
<!--                        }}-->
<!--                    </template>-->
<!--                </el-table-column>-->

<!--            </el-table>-->
<!--        </div>-->
<!--        &lt;!&ndash;        新增&ndash;&gt;-->
<!--        <el-dialog :visible.sync="dialog2.visible2" :width="$protovar.dwidth" class="tmdialog"-->
<!--                   :close-on-click-modal="false">-->
<!--            <div class="title">新增</div>-->
<!--            <div class="tmdialog-footer pb60" >需要封禁的IP-->
<!--                <el-input type="text" clearable v-model="ip" ></el-input>-->
<!--            </div>-->
<!--            <div class="tmdialog-footer pb60">-->
<!--                <button class="primarybtn search" @click="hideDialog('dialog2', 'visible2')">取消</button>-->
<!--                <button class="primarybtn search" @click="sureAdd()">新增</button>-->
<!--            </div>-->
<!--        </el-dialog>-->
<!--    </div>-->
<!--</template>-->
<!--<script>-->
<!--import {page, msgTips} from "@_/axios/path";-->
<!--import {IP} from "../../axios/path";-->

<!--export default {-->
<!--    data() {-->
<!--        return {-->
<!--            data: {-->
<!--                //数据表格-->
<!--                loading: false, //表单loading-->
<!--                list: [], //列表-->
<!--                pageNumber: 1,-->
<!--                pageSize: 10,-->
<!--                totalRow: 0, //总条数-->
<!--                pagesizes: [10, 20, 30, 40],-->
<!--            },-->


<!--            dialog: {-->
<!--                type: "add",-->
<!--                title: "",-->
<!--                visible: false,-->
<!--                form: {-->
<!--                    id: null,-->
<!--                    pid: null,-->
<!--                    name: null,-->
<!--                    url: null,-->
<!--                    icon: null,-->
<!--                },-->

<!--            },-->
<!--        };-->
<!--    },-->

<!--    watch: {-->
<!--        $route(to, from) {-->
<!--            if (to.path == this.curroute) {-->
<!--                if (this.$protovar.routehasopen != -1 && !to.query.random) {-->
<!--                    return;-->
<!--                }-->
<!--                Object.assign(this.$data, this.$options.data());-->
<!--                this.curroute = this.$route.path;-->
<!--                this.getData();-->
<!--            }-->
<!--        },-->
<!--    },-->
<!--    mounted() {-->
<!--        this.curroute = this.$route.path;-->
<!--        this.getData();-->
<!--    },-->
<!--    methods: {-->

<!--        getData(item) {-->
<!--            this.data.loading = true;-->
<!--            let ptdata = {...this.filters};-->
<!--            IP.openlist(ptdata).then((res) => {-->
<!--                console.log(res)-->
<!--                if (res.ok) {-->
<!--                    let data = res.data;-->
<!--                    if (data) {-->
<!--                        this.data.totalRow = data.totalRow;-->

<!--                        this.data.list = data.list;-->
<!--                    }-->
<!--                } else {-->
<!--                    msgTips(res);-->
<!--                }-->
<!--                this.data.loading = false;-->
<!--            });-->
<!--        },-->
<!--        /* 提交表单 */-->
<!--        formSubmit(postdata) {-->
<!--            page.addpage(postdata).then((res) => {-->
<!--                if (res.ok) {-->
<!--                    let data = res.data;-->
<!--                    if (data) {-->
<!--                        this.data.totalRow = data.totalRow;-->
<!--                        this.data.list = data.list;-->
<!--                    }-->
<!--                } else {-->
<!--                    msgTips(res);-->
<!--                }-->
<!--            });-->
<!--            this.dialog.visible = false;-->
<!--            this.getData();-->
<!--        },-->

<!--    },-->
<!--};-->
<!--</script>-->