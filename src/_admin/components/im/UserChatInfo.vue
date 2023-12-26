<template>
<div class="container">
    <el-dialog :visible.sync="chatshow" :close-on-click-modal="false" class="tmdialog userdialog" width="1283px" top="10vh" :before-close="handleClose">
        <div class="tm-container">
            <div class="tm-left-bar">
                <el-image class="user-avatar" :src="tmchat.avatar">
                    <div slot="error" class="image-slot">
                        <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                    </div>
                </el-image>
                <div :class="['leftbar-icon leftbar-chat',type=='chat'?'active':'']" @click="changeType('chat')">
                    <span>消息</span>
                </div>
                <div :class="['leftbar-icon leftbar-friends',type=='friend'?'active':'']" @click="changeType('friend')">
                    <span>好友</span>
                </div>
                <div :class="['leftbar-icon leftbar-groups',type=='group'?'active':'']" @click="changeType('group')">
                    <span>群聊</span>
                </div>
            </div>
            <UserChatMsg v-show="type=='chat'" :tmchat="tmchat" :type="type" ref="userchat"></UserChatMsg>
            <UserChatFriends v-show="type=='friend'" :tmchat="tmchat" :type="type"></UserChatFriends>
            <UserChatGroups v-show="type=='group'" :tmchat="tmchat" :type="type"></UserChatGroups>
        </div>
    </el-dialog>
</div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
import {chat,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import UserChatMsg from '@_/components/im/UserChatMsg';
import UserChatFriends from '@_/components/im/UserChatFriends';
import UserChatGroups from '@_/components/im/UserChatGroups';

export default {
    data(){
        return {
            type:'chat',//右侧信息显示 chat:聊天；friend:好友列表；group:群聊
            chatList:[],//会话列表
        }
    },
    watch:{
        chatshow(nv,ol){
            if(nv){
                Object.assign(this.$data, this.$options.data());
                this.tmchat.uid= this.tmchat.uid|| this.tmchat.id;
                this.$nextTick(()=>{
                    this.$refs.userchat.firstGet();
                })
            }
        }
    },
    computed:{
        ...mapState({
            tmchat:(state)=>state.myadmin.tmchat,//会话信息
            chatshow:(state)=>state.myadmin.chatshow,//显示状态
        })
    },
    components:{
        UserChatMsg,
        UserChatFriends,
        UserChatGroups
    },
    methods:{
        ...mapMutations(['setChatShow','setTmChat']),
        /* 侧边栏点击 */
        changeType(type){
            this.type=type;
        },
        /* 关闭会话弹框 */
        handleClose(){
            this.setChatShow(false);
            this.setTmChat({});
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/_admin/assets/style/less/im/userchatinfo.less';
</style>