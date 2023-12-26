<template>
    <div>

        <div class="login">
            <!-- 卡片 -->
            <el-card class="box-card">
               <el-form label-position="right" label-width="80px" :model="user">
                    <el-form-item
                            label="数量"
                            prop="number"
                            :rules="[ { required: true, message: '请输入需要注册的数量', trigger: 'blur' } ]">
                        <el-input v-model="user.number" type="number"></el-input>
                    </el-form-item>
<!--                   <el-form-item-->
<!--                           label="指定群"-->
<!--                           prop="number">-->
<!--                       <el-input v-model="user.groupid" ></el-input>-->
<!--                   </el-form-item>-->
                    <el-form-item
                            label="用户名"
                            prop="name">
                        <el-input v-model="user.name"></el-input>
                    </el-form-item>
                    <el-form-item
                            label="密码"
                            prop="password"
                            :rules="[ { required: true, message: '请输入密码', trigger: 'blur' } ]">
                        <el-input type="password" v-model="user.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item
                            label="确认密码"
                            prop="checkPassword"
                            :rules="[ { required: true, message: '请输入再次输入密码', trigger: 'blur' } ]">
                        <el-input type="password" v-model="user.checkPassword" show-password></el-input>
                    </el-form-item>
                    <!--按钮-->
                    <el-form-item class="button">
                        <el-button  type="warning" @click="signIn"
                                   :disabled="user.number===''||user.password===''||user.checkPassword===''" round>注册
                        </el-button>
                        <el-button @click="dowloadForm" round>下载</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card  class="box-card">

                <table align="center" width="100%"  border="0">
                    <tbody>
                    <tr>
                        <th>账号id</th>
                        <th>昵称</th>
                        <th>登录账号</th>
                    </tr>
                    <tr v-for="item in data.list" :key="item" style="text-align: center">
                        <td>{{item.id}}</td>
                        <td>{{item.nick}}</td>
                        <td>{{item.loginname}}</td>
                    </tr>
                    </tbody>
                </table>

            </el-card>
        </div>

    </div>
</template>

<script>
import {account} from "@_/axios/path";
import CryptoJS from "crypto-js";

export default {
    data() {
        return {
            // 用户数据
            user: {
                number: 1,
                groupid:'',
                name: '',
                password: '',
                checkPassword: '',
            },
            data:{
                list:[]
            },
        }
    },
    methods: {

        // 注册
        signIn() {
            if (this.user.checkPassword !== this.user.password) {
                this.$message.error("两次输入的密码不一致!")
            }
            else {
                var i = /[0-9]+/;
                var str = /[A-Za-z]/;
                if(!str.test(this.user.password) || !i.test(this.user.password) || this.user.password.length<6){
                    alert("必须包含字母数字，且长度大于6");
                }else{
                    let palinstr=this.user.password;
                    let pd5=CryptoJS.MD5(CryptoJS.enc.Latin1.parse(palinstr)).toString();
                    var main=this.user.name;
                    var number=this.user.number;
                    var groupid=this.user.groupid;
                    let ptdata = {main,pd5,number,groupid};
                    account.signlist(ptdata).then((res) => {

                        this.data.list=res.data;
                    })
                }
            }
        },
        dowloadForm(){
            if(this.data.list==[]){
                var data="你还没有注册";
                let str = new Blob([data], {type: 'text/plain;charset=utf-8'});
                saveAs(str, `账号名单.txt`);
            }else {
                var data = ''+this.user.number+"个用户名为"+this.user.name+"密码为"+this.user.password+"\n";
                for(var i in this.data.list){
                    console.log(this.data.list[i]);
                    data=data+i+"\t"+this.data.list[i].loginname+"\t"+this.data.list[i].nick+"\t"+this.data.list[i].id+"\n";
                }
                let str = new Blob([data], {type: 'text/plain;charset=utf-8'});
                saveAs(str, `账号名单.txt`);
            }
        }
    }
}
</script>

<style>

.box-card {
    float: left;
    width: 480px;
//margin: 200px 0 0 530px;
border: 1px solid #1f808c;
}


.button {
    margin: 0 0 0 50px;
}

</style>