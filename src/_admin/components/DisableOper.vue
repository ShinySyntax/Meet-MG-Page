<template>
    <div>
        <!-- 禁用二次弹框 -->
        <el-dialog :visible.sync="show" :width="$protovar.dwidth"  class="tmdialog" :before-close="handleClose"> 
            <div class="title">确定禁用此项吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="handleClose">取消</button>
                <button class="primarybtn" @click="sureOpera">确定</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:['show'],
    methods:{
        /* 关闭弹框 */
        handleClose(){
            this.$emit("handleDisableClose",false);
        },
        /* 确认操作 */
        sureOpera(){
            this.$emit("sureDisableOper");
        }
    }
}
</script>