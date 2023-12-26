<template>
    <div class="conmonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-btn">
                <button class="primarybtn search" @click="add()">新增</button>
            </div>
            <div class="filter-item">
                <label class="filter-label">请输入搜索内容:</label>
                <el-input type="text" clearable v-model="dialog.searchkey" placeholder="昵称/账号/ID"></el-input>
            </div>
<!--            <div class="filter-item">-->
<!--                <label class="filter-label">状态</label>-->
<!--                <el-select v-model="filters.status" clearable>-->
<!--                    <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>-->
<!--                </el-select>-->
<!--            </div>-->
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData()">查询</button>
            </div>
        </div>

        <!-- 数据表格 -->
        <div class="contentpad" >
            <el-table :data="data.list" v-loading="false" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="号码" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{ scope.row.number }}</span>
                    </template>
                </el-table-column>
<!--                <el-table-column label="是否被使用" :align="$protovar.align">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.whethertouse==0?'未被使用':'已使用' }}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column label="使用者" :align="$protovar.align">
                    <template slot-scope="scope">
<!--                        {{scope.row}}-->
                        <span v-show="scope.row.uid!=null">序号：{{ scope.row.uid}}<br/></span>
                        <span v-show="scope.row.uid!=null">昵称：{{ scope.row.nick}}<br/></span>
                        <span v-show="scope.row.uid!=null">登录名：{{ scope.row.loginname}}<br/></span>
                        <span v-show="scope.row.uid!=null">手机号：{{ scope.row.phone}}</span>
                        <span v-show="scope.row.uid==null" class="tmopera" @click="resetopen(scope.row.id)">没有使用者</span>
                    </template>
                </el-table-column>
                <el-table-column label="分类" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name}}</span>
                    </template>
                </el-table-column>
<!--                <el-table-column label="金额" :align="$protovar.align">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.money }}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="积分" :align="$protovar.align">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span >{{ scope.row.integral}}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="靓号还是靓群" :align="$protovar.align">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>-->
<!--                            {{scope.row.type==1?'靓号':'靓群'}}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagecontainer" v-show="data.totalRow > 0">
            <el-pagination layout="total,prev, pager, next,sizes,jumper" background :page-size="data.pageSize"
                           :page-sizes="data.pagesizes" :total="data.totalRow" :current-page="data.pageNumber"
                           @current-change="handleCurrentChange" @size-change="handleSizeChange">
            </el-pagination>
        </div>
        <!--        点击文本输入-->
        <el-dialog :visible.sync="dialog.visible1" :width="$protovar.dwidth" class="tmdialog"  :close-on-click-modal="false">
            <div class="filter">
                <div class="filter-item">
                    <label class="filter-label">用户</label>
                    <el-input type="text" clearable v-model="dialog.searchkey1" placeholder="昵称/账号/ID"></el-input>
                    <button class="primarybtn search" @click="getUser()">查询</button>
                </div>
            </div>
            <el-table :data="data.list1" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="用户" :align="$protovar.align">
                    <template slot-scope="scope">
                        <div class="user" @click="chooseold(scope.row.id)">
                            <div>
                                <el-image :src="scope.row.avatar" class="imgcol tmopera"></el-image>
                            </div>
                            <div class="userInfo">
                                <span class="userInfo-nick color_666">{{ scope.row.nick }}</span>
                                <span class="color_999">ID?:{{ scope.row.id }}</span>
                                <span class="color_999">账号:{{ scope.row.tiono }}</span>
                            </div>
                            <div class="userInfo">
                                <span class="userInfo-nick color_666">{{ scope.row.country }}{{ scope.row.province}}{{ scope.row.city }}</span>
                                <span class="color_999">{{scope.row.ip}}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!--        点击文本输入-->
        <el-dialog :visible.sync="dialog.visible2" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div style="width:268px;margin:auto;padding: 40px 0 20px">
                <span style="float: left">号码:</span>
                <el-input type="textarea" style="margin:auto;width:268px;" v-model="dialog.number" ></el-input>
            </div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog">
                    取消
                </button>
                <button class="primarybtn" @click="addopen">确定</button>
            </div>
        </el-dialog>
<!--        选好确定-->
        <el-dialog :visible.sync="dialog.visible3" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div class="title">确定更改此用户的账号</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="handleClose">取消</button>
                <button class="primarybtn" @click="choose">确定</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {notice, msgTips} from "@_/axios/path";
import {account, imuser, UID} from "../../axios/path";
import {resUrl} from "../../utils/common";
import userList from "../im/UserList.vue";

export default {
    computed: {
        userList() {
            return userList
        }
    },
    data() {
        return {
            timevalue: '',
            data: {
                list: [],
                list1: [],
                //数据表格
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                loading: false, //表单loading
                pagesizes: [10, 20, 30, 40],
            },
            dialog:{
                visible:false,
                visible2:false,
                visible3:false,
                visible1:false,
                id:'',
                uid:'',
                key:'',
                text:'',
                name:'',
                content:'',
                sort:'',
                deleted:'',
                type:'',
                searchkey:'',
                number:''
            },
        };
    },
    watch: {
        $route() {
            this.getData();
        },
    },
    mounted() {
        this.getData();
    },
    methods: {
        getUser(){
            let ptdata={searchkey:this.dialog.searchkey1};
            imuser.userList(ptdata).then((res) => {
                console.log(res);
                this.data.list1 = res.data.list;
                if (res.ok) {
                    this.data.list1.map((item) => {
                        item.avatar = resUrl(item.avatar);
                    });
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            } );
        },
        getData() {
            let date={searchkey:this.dialog.searchkey,pageNumber: this.data.pageNumber,pageSize: this.data.pageSize};
            UID.openlist(date).then((res) => {
                console.log(res)
                if (res.ok) {
                    this.data.totalRow = res.data.totalRow;
                    this.data.list = res.data.list;
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        reset(id,key,value){
            let ids={id:id,key:key,value:value};
            UID.reset(ids).then((res)=>{
                if(res.ok){
                    this.getData();
                    this.dialog.visible=false;
                }
            })
        },
        addopen(){
            let date={
                number:this.dialog.number,
                type:this.dialog.type,
            }
            UID.addopen(date).then((res)=>{
                if(res.ok){
                    this.getData();
                    this.dialog.visible2=false;
                }else {
                    msgTips(res);
                }
            })
        },
        resetopen(id){
            this.dialog.id=id;
            this.dialog.visible1=true;
        },
        chooseold(id){
            this.dialog.uid=id;
            this.dialog.visible3=true;
        },
        handleClose(){
            this.dialog.visible3=false;
        },
        choose(){
            let data={uid:this.dialog.uid,id:this.dialog.id};
            UID.choose(data).then((res)=>{
                if(res.ok){
                    this.getData();
                    this.dialog.visible1=false;
                    this.dialog.visible3=false;
                }else {
                    msgTips(res);
                }
            })
        },
        add(){
            this.dialog.number='';
            this.dialog.categoryid='';
            this.dialog.type=1;
            this.dialog.visible2=true;
        },
        del(id){
            let ids={id:id};
            UID.delete(ids).then((res)=>{
                if(res.ok){
                    this.getData();
                }else {
                    msgTips(res);
                }
            })
        },
        /* 取消弹框 */
        hideDialog() {
            this.dialog.visible2 = false;
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
        } ,

    },
};
</script>

<style lang="less" scoped>
@import "~@_/assets/style/less/im/appmanage.less";
</style>

<style lang="less" scoped>
@import "~@_/assets/style/less/im/usermanage.less";
</style>

<style lang="less" scoped>@import "~@_/assets/style/less/im/PurseComm.less";</style>