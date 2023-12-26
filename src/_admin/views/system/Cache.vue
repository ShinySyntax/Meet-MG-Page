<template>
    <div class="commonright container">
        <div class="filter">
            <div class="filter-btn">
                <button class="primarybtn addlen" @click="clearUser">清空用户缓存</button>
                <button class="primarybtn addlen" @click="clearConf">清空配置</button>
                <button class="primarybtn addlen" @click="clearStaticRes">清空静态资源</button>
            </div>
        </div>
    </div>
</template>
<script>
import {clear,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {

        }
    },
    methods:{
        /* 清空用户缓存成功 */
        clearUser(){
            clear.clearUser().then(res=>{
                if(res.ok){
                    successTips("清空用户缓存成功");
                }else{
                    msgTips(res);
                }
            })
        },
        /* 清空配置 */
        clearConf(){
            clear.clearConf().then(res=>{
                if(res.ok){
                    successTips("清空配置成功");
                }else{
                    msgTips(res);
                }
            })
        },
        /* 清空静态资源 */
        clearStaticRes(){
            clear.clearStaticRes().then(res=>{
                if(res.ok){
                    successTips("清空静态资源成功");
                }else{
                    msgTips(res);
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.addlen{
    width:auto;
    padding:0 8px;
    margin-top: 15px
}
</style>
