<template>
    <div class="conmonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-btn">
                <button class="primarybtn search" @click="add()">新增</button>
            </div>
            <div class="filter-item">
                <label class="filter-label">请输入搜索内容:</label>
                <el-input type="text" clearable v-model="dialog.searchkey" placeholder="名称"></el-input>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData()">查询</button>
            </div>
        </div>

        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="false" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="ID" :align="$protovar.align" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品" :align="$protovar.align"  width="300px">
                    <template slot-scope="scope">
                        <div class="user">
                            <div>
                                <el-popover placement="left" trigger="click" width="300">
                                    <img :src=scope.row.pic_url width="100%" alt="scope.row.pic_url"/>
                                    <img slot="reference" :src=scope.row.pic_url
                                         style="max-height: 70px;max-width: 70px; padding: 5px" alt="scope.row.pic_url"/>
                                </el-popover>
                            </div>
                            <div class="userInfo">
                                <span>{{ scope.row.goods_sn }}</span>
                                <span>{{ scope.row.name }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="价格" :align="$protovar.align"  width="170px">
                    <template slot-scope="scope">
                        <div class="user">
                            <div class="userInfo">
                                <span>商品价格：{{ scope.row.counter_price }}</span>
                                <span>折扣价格：{{ scope.row.retail_price }}</span>
                                <span>会员价格：{{ scope.row.vip_price }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="轮转图" :align="$protovar.align" width="400px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.gallery!=null">
                            <el-popover placement="left" trigger="click" width="300"
                                        v-for="item in JSON.parse(scope.row.gallery)" :key="item">
                                <img :src=items(item) width="100%" alt="items(item)"/>
                                <img slot="reference" :src=items(item)
                                     style="max-height: 70px;max-width: 70px; padding: 5px" alt="items(item)"/>
                            </el-popover>
                        </div>
                        <div v-else>图片为空</div>
                    </template>
                </el-table-column>
                <el-table-column label="介绍" :align="$protovar.align" width="100px">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="click">
                            <div style="height:800px;overflow:auto;background:#EEEEEE;">
                                <p v-html="scope.row.detail"></p>
                            </div>
                            <button slot="reference" class="color_3A7BE9 cursor">点击查看</button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="参值" :align="$protovar.align"  width="150px">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.parameter">
                            <el-popover placement="left" trigger="click">
                                <div style="overflow:auto;background:#EEEEEE;">
                                    <img :src="item.pic_url">
                                    <span style="float: right">
                                        商品价格：{{item.price}}<br />
                                        折扣价格：{{item.discount_price}}<br />
                                        会员价格：{{item.vip_price}}<br />
                                    </span>
                                </div>
                                <button slot="reference" class="color_3A7BE9 cursor">
                                    {{ item.specification }}:{{ item.value }}
                                </button>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="编辑" :align="$protovar.align"  width="150px">
                    <template slot-scope="scope">
                        <el-button class="color_3A7BE9 cursor" @click="editForm1(scope.row)">修改</el-button>
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
import {msgTips} from "@_/axios/path";
import {commonFile, litemall} from "../../axios/path";
import userList from "../im/UserList.vue";
import {dataURLtoBlob, resUrl} from "../../utils/common";

export default {
    computed: {
        userList() {
            return userList
        }
    },
    data() {
        return {
            editForm: {
                price:'',
                discount_price: '',
                vip_price: '',
                number:'',
                pic_url: '',
                specification:'',
                value:'',
                gallery:'',
                parameter:[],
            },

            specification:'',

            timevalue: '',
            data: {
                list: [],
                //数据表格
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                loading: false, //表单loading
                pagesizes: [10, 20, 30, 40],
            },
            dialog: {
                visible: false,
                searchkey: '',
                number: ''
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
        main(it){
            if(it!=null&&it!=="")
                return it.substr(1, it.length-2).split(",");
        },
        editForm1(it) {
            console.log(it);
            this.editForm = it;
            this.dialog.visible=true;
            if(it.parameter!=null){
                this.specification=it.parameter[0].specification;
            }
            else this.specification="";

        },
        onAdd() {
            this.editForm.parameter.push(
                {
                    price:'',
                    discount_price: '',
                    vip_price: '',
                    number:'',
                    pic_url: '',
                    specification:'',
                    value:'',
                    gallery:'',
                }
            )
        },
        onDel() {
            this.editForm.parameter=this.editForm.parameter.slice(0, -1);
        },
        add() {
            this.editForm = {
                price:'',
                discount_price: '',
                vip_price: '',
                number:'',
                pic_url: '',
                specification:'',
                value:'',
                gallery:'',
                parameter:[],
            }
            this.dialog.visible = true;
        },
        items(item) {
            return item.replace('"', '').replace('"', '')
        },
        getData() {
            let date = {
                searchkey: this.dialog.searchkey,
                pageNumber: this.data.pageNumber,
                pageSize: this.data.pageSize
            };
            litemall.list(date).then((res) => {
                console.log(res);
                if (res.ok) {
                    this.data.totalRow = res.data.totalRow;
                    this.data.list = res.data.list;
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
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
        },
//         // 修改商品功能
        editGoods() {
            let data = this.editForm;
            data.specification=this.specification;
            this.dialog.visible=false;
            litemall.add({main:JSON.stringify(data)}).then((res) => {
            });
        },

        /* 上传处理数据 */
        uploadImg(index) {
            let _this = this,
                file = event.currentTarget.files[0],
                reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                let blob = dataURLtoBlob(this.result);
                let fd = new FormData();
                fd.append("uploadFile", blob, file.name);
                fd.append("type", 1);
                commonFile(fd).then(res => {
                    if (res.ok) {
                        _this.editForm.parameter[index].pic_url = resUrl(res.data.url);
                    } else {
                        msgTips(res);
                    }
                })
                event.target.value = "";
            }
        },
        /* 上传处理数据 */
        uploadUrl(index) {
            let _this = this,
                file = event.currentTarget.files[0],
                reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                let blob = dataURLtoBlob(this.result);
                let fd = new FormData();
                fd.append("uploadFile", blob, file.name);
                fd.append("type", 1);
                commonFile(fd).then(res => {
                    console.log(res)
                    console.log(_this.editForm)
                    if (res.ok) {
                        if (index == 1) {
                            _this.editForm.pic_url = resUrl(res.data.url);
                        } else if (index == 2) {
                            if(_this.editForm.gallery==null||_this.editForm.gallery==""){
                                _this.editForm.gallery="[\""+resUrl(res.data.url)+"\"]";
                            }else{
                                _this.editForm.gallery=_this.editForm.gallery.substring(0,_this.editForm.gallery.length-1)+",\""+resUrl(res.data.url)+"\"]";
                            }
                            console.log(_this.editForm.gallery)
                            _this.$forceUpdate();

                        }
                    } else {
                        msgTips(res);
                    }
                })
                event.target.value = "";
            }
        },
    },
};
</script>

<style lang="less" scoped>
@import '~@_/assets/style/less/im/appmanage.less';
@import "~@_/assets/style/less/im/usermanage.less";
@import "~@_/assets/style/less/im/PurseComm.less";
</style>
<style scoped>
.btn-add {
    margin-top: 15px;
}
</style>
