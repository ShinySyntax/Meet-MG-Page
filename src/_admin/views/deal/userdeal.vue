<template>
    <div>
        <div style="float:left;width: 60%;height:50pc;">
            <iframe v-show="show" ref="myIframe" style="width: 100%;height:100vh"></iframe>
            <textarea  style="width: 100%;height: 100vh" v-show="!show" v-model="html"></textarea>
        </div>
        <div style="float:right;width: 38%;height:50pc">
            <el-button >编辑模板</el-button>
            <el-button @click="save3">生成新页面</el-button>
            <div>
                <div>
                <p>需要替换的内容（旧内容）：</p>
                <el-input v-model="oldText" style="float: left;width: 62%"></el-input>
                <br>
                <br>
                <p>替换成的内容（新内容）：</p>
                <el-input v-model="replaceText" style="float: left;width: 62%"></el-input>
                </div>

                <br>
                <br>
                <el-button @click="replace()" style="float: left;width: 20%">替换</el-button>

            </div>
        </div>

    </div>
</template>

<script>
import {litemall, deal, msgTips,successTips} from "../../axios/path";
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
            oldText: '',
            replaceText: '',
            list: [],
        }
    },
// 监听器
    methods: {
        
        initdate() {
            deal.userdeal().then((res) => {
                console.log(res);
                this.html = res.data.value;
                this.$nextTick(() => {
                    const iframe = this.$refs.myIframe;
                    iframe.contentDocument.write(this.html);
                    iframe.contentDocument.close();
                });
            });
        },
        replace() {
            if (this.oldText == '') {
                msgTips('请输入旧内容')
                return;
            }
            if (this.replaceText == '') {
                msgTips('请输入新内容')
                return;
            }
            let data = {old:this.oldText, newText:this.replaceText};
            deal.replaceText(data).then((res) => {
                console.log(res);
                if (res.ok) {
                    successTips('替换成功');
                    this.initdate();
                } else {
                    msgTips('操作失败，请重试');
                }
            });
        },
        save3: function () {
            deal.generateHtml().then((res1) => {
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



