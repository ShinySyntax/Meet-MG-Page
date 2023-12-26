<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">角色</label>
                <el-select v-model="rid" clearable placeholder="全部">
                    <el-option v-for="item in roleList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn" @click="initMenu">同步</button>
            </div>
        </div>
    </div>
</template>
<script>
import {mgauth,mgRoleDictList,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {
            roleList:[],
            rid:''
        }
    },
    mounted(){
        this.getRolelist();
    },
    methods:{
        /* 角色列表 */
        getRolelist(){
            mgRoleDictList().then(res=>{
                if(res.ok){
                    this.roleList=res.data;
                }else{
                    msgTips(res);
                }
            });
        },
        /* 同步 */
        initMenu(){
            if(!this.rid){
                msgTips("请选择角色");
                return;
            }
            mgauth.initMenu({rid:this.rid}).then(res=>{
                if(res.ok){
                    successTips("同步成功");
                }else{
                    msgTips(res);
                }
            })
        }
    }
}
</script>