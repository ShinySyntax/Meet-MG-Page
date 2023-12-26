<template>
    <div class="conmonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-btn">
                <button class="primarybtn" @click="addData()" v-auth="'add'">
                    新增
                </button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="序号" :align="$protovar.align">
                    <template slot-scope="scope">{{
                        scope.row.id
                        }}
                    </template>
                </el-table-column>
                <el-table-column label="IP地址" :align="$protovar.align" >
                    <template slot-scope="scope">{{
                        scope.row.ip
                        }}
                    </template>
                </el-table-column>
<!--                <el-table-column label="是否被封禁" :align="$protovar.align" >-->
<!--                    <template slot-scope="scope">{{-->
<!--                            scope.row.isBan=='1'?'是':'否'-->
<!--                        }}-->
<!--                    </template>-->
<!--                </el-table-column>-->

                <el-table-column label="操作" :align="$protovar.align"  width="200px">
                    <template slot-scope="scope">
<!--                        <button class="primarybtn search" @click="setData(scope.row.id)">-->
<!--                            {{-->
<!--                                scope.row.isBan=='1'?'解封':'封禁'-->
<!--                            }}-->
<!--                        </button>-->
                        <button class="primarybtn search" @click="delServer(scope.row)">
                            删除
                        </button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 删除 -->
        <el-dialog :visible.sync="dialog2.visible" :width="$protovar.dwidth" class="tmdialog"
                   :close-on-click-modal="false">
            <div class="title">确定删除该配置信息吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog2', 'visible')">取消</button>
                <button class="primarybtn search" @click="sureDel(dialog.form)">删除</button>
            </div>
        </el-dialog>
<!--        新增-->
        <el-dialog :visible.sync="dialog2.visible2" :width="$protovar.dwidth" class="tmdialog"
                   :close-on-click-modal="false">
            <div class="title">新增</div>
            <div class="tmdialog-footer pb60" >需要封禁的IP
                <el-input type="text" clearable v-model="ip" ></el-input>
            </div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog2', 'visible2')">取消</button>
                <button class="primarybtn search" @click="sureAdd()">新增</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {page, msgTips} from "@_/axios/path";
import {IP} from "../../axios/path";

export default {
    data() {
        return {
ip:'',
            // filters:{
            //     searchkey:'',
            //     walletid:'',
            //     type:''
            // },
            data: {
                //数据表格
                loading: false, //表单loading
                list: [], //列表
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                pagesizes: [10, 20, 30, 40],
            },
            // currdata:null,

            // grouprowdata:{},//选中的群消息
            // refresh:false,
            report: {
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                list: [],
                loading: false,
                status: "",
                type: "",
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
            dialog2: {
                visible: false,
                visible2: false,
            },
            showpwd: "",
            statusSelect: [
                {id: 1, label: "正常"},
                {id: 2, label: "禁用"},
            ],
            curroute: "",
        };
    },
    conputed: {
        authdisable() {
            return this.authDisable(["update", "del"]);
        },
    },

    watch: {
        showpwd(nv, ol) {
            if (ol == "******") {
                this.showpwd = "";
                this.dialog.form.pwd = "";
            }
            this.dialog.form.showpwd = nv;
        },
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
        picture(response, file, filrList) {
            this.dialog.form.icon = response.data.url;
            for (var i in this.data.list) {
                this.data.list[i].icon = response.data.url;
            }
        },
        update(item) {
            page.set(item).then((res) => {
                if (res.ok) {
                    this.getData();
                }
            })
        },
        getData(item) {
            this.data.loading = true;
            let ptdata = {...this.filters};
            IP.openlist(ptdata).then((res) => {
                console.log(res)
                if (res.ok) {
                    let data = res.data;
                    if (data) {
                        this.data.totalRow = data.totalRow;

                        this.data.list = data.list;
                    }
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        /* 提交表单 */
        formSubmit(postdata) {
            page.addpage(postdata).then((res) => {
                if (res.ok) {
                    let data = res.data;
                    if (data) {
                        this.data.totalRow = data.totalRow;
                        this.data.list = data.list;
                    }
                } else {
                    msgTips(res);
                }
            });
            this.dialog.visible = false;
            this.getData();
        },
        /* 取消弹框 */
        hideDialog(dialog, visible) {
            this[dialog][visible] = false;
        },
        /* 删除 */
        delServer(item) {
            this.dialog.form = item;
            this.dialog2.visible = true;
        },
        /* 确定删除 */
        sureDel(data) {
            IP.delDate(data).then((res) => {
                if (res.ok) {
                    this.dialog2.visible = false;
                    this.getData();
                } else {
                    msgTips(res);
                }
            });
        },
        /* 确定增加 */
        sureAdd() {
            let data={ip:this.ip};
            IP.addip(data).then((res) => {
                if (res.ok) {
                    this.dialog2.visible2 = false;
                    this.getData();
                } else {
                    msgTips(res);
                }
            });
        },

        /* 编辑 */
        setData(id) {
            let ids={id:id}
            IP.addpage(ids).then((res) => {
                if (res.ok) {
                    this.getData();
                } else {
                    msgTips(res);
                }
            })
        }, /* 新增 */
        addData() {
            this.dialog2.visible2 = true;
        },
    },
};
</script>