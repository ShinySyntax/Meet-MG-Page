<template>
    <div class="commonright container">
        <div class="filter">
            <!-- <div class="filter-item">
                    <label class="filter-label">配置项</label>
                    <el-input type="text" clearable v-model="filters.searchkey" placeholder="输入名称/参数名"></el-input>
                </div>
                <div class="filter-item">
                    <label class="filter-label">类型</label>
                    <el-select v-model="filters.type" clearable placeholder="全部">
                        <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                    </el-select>
                </div> -->
            <div class="filter-btn">
                <!-- <button class="primarybtn search" @click="getData()" >查询</button> -->
                <button class="primarybtn" @click="setData('add')" v-auth="'add'">新增</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">

                    

                <el-table-column label="头像边框图片" width="300"><template slot-scope="scope">
                <img :src="scope.row.avatarborder" style="width:200px;whight:200px" />
                </template></el-table-column>

                <el-table-column label="头像边框图片" prop="avatarborder" width="150"></el-table-column>


                <el-table-column label="创建时间" prop="createtime" width="150"></el-table-column>
                <el-table-column label="更新时间" prop="updatetime" width="150"></el-table-column>

                <el-table-column label="操作" width="150" v-if="authdisable">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="setData('edit', scope.row)">编辑</span>
                        <span class="tmopera" @click="setData('delete', scope.row)">移除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog"
            :width="$protovar.sgtwidth">
            <p class="tmheader">{{ dialog.title }}</p>
            <el-form :model="dialog.form" :label-width="$protovar.fmlabwidth" ref="form" class="dialogform sdialogform"
                id="form">


                <div class="tmcol" v-show="0">
                    <el-form-item label="ID" prop="id">
                        <el-input v-model="dialog.form.id" name="id"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="头像边框图片" prop="avatarborder">
                        <el-input v-model="dialog.form.avatarborder" name="avatarborder"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">

                    <el-form-item label="头像边框图片" prop="icon">
                        <el-upload class="upload-demo" action="/tioadmin/page/upload.admin_x" list-type="picture"
                            :on-success="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload></el-form-item>
                </div>



                <!-- <div class="tmcol">
                    <el-form-item label="头像边框图片" prop="avatarborder">
                        <el-input v-model="dialog.form.file" type="file" name="file"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="头像边框图片" prop="avatarborder">
                        <el-input v-model="file" type="file" name="file"></el-input>
                    </el-form-item>
                </div> -->



            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog', 'visible')">取消</button>
                <button class="primarybtn" @click="formSubmit" :disabled="loading">保存</button>
            </div>
        </el-dialog>
        <!-- 移除 -->
        <el-dialog :visible.sync="dialog.visible1" :close-on-click-modal="false" class="tmdialog"
            :width="$protovar.sgtwidth">
            <p class="tmheader">{{ dialog.title }}</p>
            <el-form :model="dialog.form" :label-width="$protovar.fmlabwidth" ref="form" class="dialogform sdialogform"
                id="form">

                <div class="tmcol" v-show="0">
                    <el-form-item label="ID" prop="id">
                        <el-input v-model="dialog.form.id" name="id"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog', 'visible1')">取消</button>
                <button class="primarybtn" @click="formSubmit" :disabled="loading">移除</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { vipconfig, msgTips, successTips } from '@_/axios/path';
export default {
    data() {
        return {
            filters: {
                searchkey: '',
                type: ''
            },
            data: {//数据表格
                loading: false,//表单loading
                list: [],//列表
            },
            file: '',
            dialog: {
                type: 'add',
                title: '',
                visible: false,
                visible1: false,
                form: {
                },
                page: '',

            },
            typeList: [{ id: 1, label: "系统" }, { id: 2, label: "业务" }],
            loading: false,
            curroute: ''
        }
    },
    mounted() {
        this.curroute = this.$route.path;
        this.getData();
    },
    computed: {
        authdisable() {
            return this.authDisable(['update']);
        }
    },
    watch: {
        '$route'(to, from) {
            if (to.path == this.curroute) {
                if (this.$protovar.routehasopen != -1 && !to.query.random) {
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute = this.$route.path;
                this.getData();
            }
        }
    },
    methods: {
        picture(response, file, filrList) {

            console.log($("#form").serializeArray());
            var id = $("#form").serializeArray()[0].value;
            this.dialog.form.avatarborder = response.data.url;
            if (id != null && id != '') {
                for (var i in this.data.list) {
                    if (id == this.data.list[i].id) {
                        this.data.list[i].avatarborder = response.data.url;
                    }
                }

            }

        },
        /* 序号 */
        indexMethod(index) {
            return (index + 1);
        },
        /* 用户数据 */
        getData() {
            this.data.loading = true;
            let ptdata = { file: this.file, searchkey: this.filters.searchkey, type: this.filters.type };
            vipconfig.getAvatarList(ptdata).then(res => {
                if (res.ok) {
                    let data = res.data;
                    if (data) {
                        this.data.list = data;
                    }
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            })
        },
        /* 取消弹框 */
        hideDialog(dialog, visible) {
            this[dialog][visible] = false;
        },
        /* 提交表单 */
        formSubmit() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    let type = this.dialog.type;
                    let res, postdata;
                    console.log(this.dialog);
                    postdata = $("#form").serialize() + `&type=${this.dialog.type}`;
                    console.log(postdata);
                    console.log("postdata");
                    res = await vipconfig.AvatarAdd(postdata);

                    if (res.ok) {
                        this.dialog.visible = false;
                        this.dialog.visible1 = false;
                        successTips("保存成功");
                        this.dialog.form = this.$options.data().dialog.form;
                        this.getData();
                    } else {
                        msgTips(res);
                    }
                    this.loading = false;
                } else {
                    return false;
                }
            });
        },
        /* 新增|编辑 */
        setData(type, item) {
            if (type == "add") {

                this.dialog.visible = true;
                this.dialog.type = type;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
                this.dialog.form = this.$options.data().dialog.form;
                this.dialog.title = "新增配置项";
            }
            if (type == "edit") {

                this.dialog.visible = true;
                this.dialog.type = type;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
                let data = { ...item };
                this.dialog.form = data;
                this.dialog.title = "编辑配置项";
            }
            if (type == "delete") {
                this.dialog.visible1 = true;
                this.dialog.type = type;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
                let data = { ...item };
                this.dialog.form = data;
                this.dialog.title = "移除";
            }
        },
    },
}
</script>