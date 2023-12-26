<template>
    <div class="commonright container tmdialog">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules"  class="dialogform" :hide-required-asterisk="true" id="form">
            <div class="tmcol">
                <el-form-item label="起始用户id" prop="startid">
                    <el-input v-model="form.startid" placeholder="请输入起始id(包含)" name="startid"></el-input>
                </el-form-item>
            </div>
            <div class="tmcol">
                <el-form-item label="截至用户id" prop="endid">
                    <el-input v-model="form.endid" placeholder="请输入截至id(包含)" name="endid"></el-input>
                </el-form-item>
            </div>
            <div class="tmcol">
                <el-form-item label="标题" prop="title">
                    <el-input maxlength="40" v-model="form.title" placeholder="邮件标题(40字以内)" name="title"></el-input>
                </el-form-item>
            </div>
            <div class="tmcol">
                <el-form-item label="邮件内容" prop="content">
                    <el-input type="textarea" v-model="form.content" placeholder="邮件内容" name="content"></el-input>
                </el-form-item>
            </div>
        </el-form>
        <button class="primarybtn" @click="formSubmit">确定</button>
    </div>
</template>
<script>
import {email,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {
            form:{
                startid:'',
                endid:'',
                title:'',
                content:'',
            },
            rules:{
                startid: [
                    {required: true,message: "请输入起始id",trigger: "blur"}
                ],
                endid:[
                    {required: true,message: "请输入截至id",trigger: "blur"}
                ],
                title:[
                    {required: true,message: "请输入邮件标题",trigger: "blur"}
                ],
                content:[
                    {required: true,message: "请输入邮件内容",trigger: "blur"}
                ],
            },
            curroute:''
        }
    },
    mounted(){
        this.curroute=this.$route.path;
    },
    watch: {
        '$route'(to,from){
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                this.$refs.form.resetFields();
                this.curroute=this.$route.path;
            }
        }
    },
    methods:{
        formSubmit(){
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    let ptdata=$("#form").serialize();
                    email.emailSubmit(ptdata).then(res=>{
                        if(res.ok){
                            successTips("发送成功")
                        }else{
                            msgTips(res);
                        }
                    })
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
.container{
    padding:50px calc(50% - 310px);
    background: #fff;
    .dialogform{
        padding:0;
        /deep/.el-input__inner{
            width:500px;
        }
        /deep/.el-textarea__inner{
            width:500px;
            height:300px;
        }
    }
    .primarybtn{
        margin-left:100px;
        margin-top:20px;
        width:268px;
        height:40px;
        line-height:40px;
    }
}
</style>