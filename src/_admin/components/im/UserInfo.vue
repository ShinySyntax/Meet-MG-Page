<template>
    <el-dialog :visible.sync="usershow" :close-on-click-modal="false" class="tmdialog userdialog" width="646px" :before-close="handleClose">
        <!-- 用户详情 -->
        <UserDetails :uid="useruid" :detailshow="usershow" :from="from" @handleClose="handleClose"></UserDetails>
    </el-dialog>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
import UserDetails from '@_/components/im/UserDetails';
export default {
    data(){
        return {
            logincount:0,
            ipcount:0,
            areacount:0,
            ctcount:0,
            from:'hasbtn'
        }
    },
    components:{
        UserDetails
    },
    computed:{
        ...mapState({
            useruid:(state)=>state.myadmin.useruid,//用户uid
            usershow:(state)=>state.myadmin.usershow,//显示状态
        })
    },
    methods:{
        ...mapMutations(['setUserInfoShow']),
        /* 关闭用户信息弹框 */
        handleClose(){
            this.setUserInfoShow(false);
        },
    }
}
</script>
<style lang="less" scoped>
.userdialog{
    
}
</style>