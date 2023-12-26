<template>
     <el-dialog :visible.sync="show" :close-on-click-modal="false" class="tmdialog pwddialog" :width="$protovar.sgtwidth" v-if="show" :before-close="handleClose">
            <p class="tmheader">修改密码</p>
            <el-form :model="form" :rules="rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="当前用户" prop="title">
                        <span class="textlh">{{curruser.nick}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="原密码" prop="pwd">
                        <el-input v-model="form.pwd" type="password"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="新密码" prop="newpwd">
                        <el-input v-model="form.newpwd" type="password"></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="确认密码" prop="surePwd">
                        <el-input v-model="form.surePwd" type="password"></el-input>
                    </el-form-item>
                </div>  
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn" @click="formSubmit">确认修改</button>
            </div>
        </el-dialog>
</template>
<script>
import CryptoJS from 'crypto-js';//加密
import {mgUpdatePwd,msgTips,successTips} from '@_/axios/path';
export default {
    props:['show'],
    data(){
        var checkReNewPwd=(rule,value,callback)=>{
            if(value==""){
                callback(new Error("密码不能为空"));
            }else if(value!=this.form.newpwd){
                callback(new Error("两次输入密码不一致"));
            }else{
                callback();
            }
        };
        return {
            visible:true,
            form:{
                pwd:'',
                newpwd:'',
                surePwd:''
            },
            rules:{
                pwd:[{required: true,message: "请输入原密码",trigger: "blur"}],
                newpwd:[{required: true,message: "请输入新密码",trigger: "blur"}],
                surePwd:[{validator:checkReNewPwd,trigger:"blur"}]
            },
        }
    },
    methods:{
        formSubmit(){
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    let	key1='$',key2='{',key3='}';
                    let palinstr='';
                    let loginname=this.curruser.loginname;
                    palinstr= `${key1}${key2}${loginname}${key3}${this.form.pwd}`;
                    let pwd=CryptoJS.MD5(CryptoJS.enc.Latin1.parse(palinstr)).toString();
                    palinstr= `${key1}${key2}${loginname}${key3}${this.form.newpwd}`;
                    let newpwd=CryptoJS.MD5(CryptoJS.enc.Latin1.parse(palinstr)).toString();
                    let ptdata={pwd,newpwd};
                    mgUpdatePwd(ptdata).then(res=>{
                        if(res.ok){
                            successTips("修改成功");
                            this.$router.push("/login");
                        }else{
                            msgTips(res);
                        }
                    })
                }
            })
        },
        handleClose(){
            this.$emit("toEditPwd");
        }
    }
}
</script>
<style lang="less" scoped>
.pwddialog{
    .tmcol{
        margin-bottom:20px;
    }
    /deep/.el-form-item__label,/deep/.el-input__inner{
        line-height: 34px;
        height:34px;
    }
    .tmdialog-footer .primarybtn{
        width:224px;
        height:40px;
        line-height: 40px;
    }
}

</style>