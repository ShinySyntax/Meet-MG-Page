<template>
    <div>
        <div style="float:left;width: 60%;height:50pc;">
            <iframe v-show="show" ref="myIframe" style="width: 100%;height:100vh"></iframe>
            <textarea  style="width: 100%;height: 100vh" v-show="!show" v-model="html"></textarea>
        </div>
        <div style="float:right;width: 38%;height:50pc">
            <el-button v-show="show" @click="edit">编辑模板</el-button>
            <el-button v-show="!show" @click="edit">保存模板</el-button>
            <el-button @click="save3">生成新页面</el-button>
            <el-table :data="list" v-loading="false" >
                <el-table-column label="位置" :align="$protovar.align" width="50">
                    <template slot-scope="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                <el-table-column label="值" :align="$protovar.align">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dictionary" style="float: left;width: 62%"></el-input>
                        <el-button @click="save(scope.row,1)" style="float: left;width: 20%">保存</el-button>
                        <el-button @click="save(scope.row,2)" style="float: left;width: 15%">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="newAdd()" style="float: right;width: 29%">新建</el-button>
        </div>

    </div>
</template>

<script>
import {litemall} from "../../axios/path";
import {resUrl} from "../../utils/common";

export default {
    components: {},
    // 计算机属性
    created() {
        this.initdate()
    },
    // 页面数据声明
    data() {
        return {
            show: true,
            html: '',
            text: '',
            list: [],
        }
    },
// 监听器
    methods: {
        edit() {
            console.log(this.html)
            litemall.save2({data: this.html, type: this.show}).then((res) => {
                if (this.show) {
                    console.log("获取模板")
                    console.log(res);

                    this.show = !this.show;
                    this.html = res.data.page.fileContent;
                } else {
                    console.log("保存模板")
                    console.log(res);

                    this.show = !this.show;

                    this.text = res.data.page.fileContent;
                    this.list = res.data.page.list;
                    this.$nextTick(() => {
                        const iframe = this.$refs.myIframe;
                        iframe.contentDocument.write(this.text);
                        iframe.contentDocument.close();
                    });
                }
            });

        },
        initdate() {
            litemall.html().then((res) => {
                console.log(res);
                this.text = res.data.page.fileContent;
                this.list = res.data.page.list;
                this.$nextTick(() => {
                    const iframe = this.$refs.myIframe;
                    iframe.contentDocument.write(this.text);
                    iframe.contentDocument.close();
                });
            });
        },
        newAdd() {
            litemall.newAdd().then((res) => {
                this.initdate();
            });
        },
        save(data,type) {
            data={...data,type}
            litemall.save(data).then((res) => {
                this.text = res.data.page.fileContent;
                this.list = res.data.page.list;
                this.$nextTick(() => {
                    const iframe = this.$refs.myIframe;
                    iframe.contentDocument.write(this.text);
                    iframe.contentDocument.close();
                });
            });
        },
        save3: function () {
            litemall.save3().then((res) => {
                    window.open(resUrl("res/changyou_privacypolicy.html"), "_blank", "width=500,height=400");
                }
            );

        }

    },
//     生命周期，创建vue时
    name: "Home",
    watch: {}
}
</script>



