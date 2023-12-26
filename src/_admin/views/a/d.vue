<template>
    <div class="conmonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-btn">
                <button class="primarybtn search" @click="add()">新增</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad" >
            <el-table :data="data.list" v-loading="false" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="名称" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="resetopen(scope.row.id,'name')">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="内容" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="resetopen(scope.row.id,'content')">
                            {{scope.row.content==null||scope.row.content==''?'空内容':scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="排序" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="resetopen(scope.row.id,'sort')">
                            {{scope.row.sort==null||scope.row.sort==''?'空内容':scope.row.sort}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否删除" :align="$protovar.align" >
                    <template slot-scope="scope">
                        <span  class="tmopera" @click="reset(scope.row.id,'deleted',(-1*(scope.row.deleted*2-1)+1)/2)">
                            {{ scope.row.deleted==1?"删除了":"没删除"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="时间" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{ scope.row.create_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="靓号还是亮群" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type==1?"靓号":"亮群"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="删除" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span  class="tmopera" @click="deleted(scope.row.id)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
<!--        点击文本输入-->
        <el-dialog :visible.sync="dialog.visible" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div style="  padding: 20px 0 10px;  text-align: center;  line-height: 1;">输入以更改</div>
            <div style="width:268px;margin:auto;padding: 10px 0 20px">
                <el-input type="textarea" style="margin:auto;" v-model="dialog.text" ></el-input>
            </div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog">
                    取消
                </button>
                <button class="primarybtn" @click="reset(dialog.id,dialog.key,dialog.text)">确定</button>
            </div>
        </el-dialog>

        <!--        点击文本输入-->
        <el-dialog :visible.sync="dialog.visible2" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div style="width:268px;margin:auto;padding: 40px 0 20px">
                <span style="float: left">名称:</span>
                <el-input type="textarea" style="margin:auto;width:268px;" v-model="dialog.name" ></el-input>
            </div>
            <div style="width:268px;margin:auto;padding: 10px 0 20px">
                <span style="float: left">内容:</span>
                <el-input type="textarea" style="margin:auto;" v-model="dialog.content" ></el-input>
            </div>
            <div style="width:268px;margin:auto;padding: 10px 0 20px">
                <span style="float: left">排序:</span>
<!--                <el-input type="textarea" style="margin:auto;" v-model="dialog.sort" ></el-input>-->
                <el-input v-model="dialog.sort" oninput ="value=value.replace(/[^0-9]/g,'')" >
                    <span slot="suffix"> </span>
                </el-input>

            </div>
            <div style="width:268px;margin:auto;padding: 10px 0 20px">
                <span style="float: left;width: 35%">是否删除:</span>
                <label>不删除<input type="radio" v-model="dialog.deleted" value="0"/></label>
                <label>删除<input type="radio" v-model="dialog.deleted" value="1"/></label>
            </div>
            <div style="width:268px;margin:auto;padding: 10px 0 20px">
                <span style="float: left;width: 36%">靓号还是靓群:</span>
                <label>靓号<input type="radio" v-model="dialog.type" value="1"/></label>
                <label>靓群<input type="radio" v-model="dialog.type" value="2"/></label>
            </div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="dialog.visible2=false">
                    取消
                </button>
                <button class="primarybtn" @click="addopen">确定</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {notice, msgTips} from "@_/axios/path";
import {account, UID} from "../../axios/path";

export default {
    data() {
        return {
            timevalue: '',
            data: {
                list: [],
            },
            dialog:{
                visible:false,
                visible2:false,
                id:'',
                key:'',
                text:'',
                name:'',
                content:'',
                sort:'',
                deleted:'',
                type:'',
            },
        };
    },
    watch: {
        $route() {
            this.getData();
        },
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            UID.list().then((res) => {
                console.log(res);
                if (res.ok) {
                    this.data.list = res.data.list;
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        reset(id,key,value){
            let ids={id:id,key:key,value:value};
            UID.reset(ids).then((res)=>{
                if(res.ok){
                    this.getData();
                    this.dialog.visible=false;
                }
            })
        },
        addopen(){
            let date={
                name:this.dialog.name,
                content:this.dialog.content,
                sort:this.dialog.sort,
                deleted:this.dialog.deleted,
                type:this.dialog.type,
            }
            UID.add(date).then((res)=>{
                if(res.ok){
                    this.getData();
                    this.dialog.visible2=false;
                }else {
                    msgTips(res);
                }
            })
        },
        resetopen(id,key){
            this.dialog.id=id;
            this.dialog.key=key;
            this.dialog.visible=true;
        },
        add(){
            this.dialog.name='';
            this.dialog.content='';
            this.dialog.sort='';
            this.dialog.deleted='0';
            this.dialog.type='1';
            this.dialog.visible2=true;
        },
        deleted(id){
            let ids={id:id};
            UID.delete(ids).then((res)=>{
                if(res.ok){
                    this.getData();
                }
            })
        },
        /* 取消弹框 */
        hideDialog() {
            this.dialog.visible = false;
        },

    },
};
</script>

<style lang="less" scoped>
@import "~@_/assets/style/less/im/appmanage.less";
</style>