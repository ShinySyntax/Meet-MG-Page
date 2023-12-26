import {mapState} from 'vuex';
import DisableOper from '@_/components/DisableOper.vue';//禁用确认弹框
let mymixin={
    computed:{
        ...mapState({
            authList:(state)=>state.myadmin.authList,//权限列表
            tags:(state)=>state.myadmin.tags,//头部导航tab
            curruser:(state)=>state.myadmin.curruser,//当前用户信息
            tologin:(state)=>state.myadmin.tologin,//权限弹框显示状态
            sysparams:(state)=>state.myadmin.sysparams,//系统参数
        })
    },
    data(){
        return {
            disableoper:{//禁用确认弹框
                show:false,//显示状态
                data:null,//禁用数据
            },
            deviceImg:[
                {img:'',css:''},
                {img:require("@_/assets/img/im/device_pc.png"),css:'pc'},
                {img:require("@_/assets/img/im/device_android.png"),css:'android'},
                {img:require("@_/assets/img/im/device_ios.png"),css:'ios'},
            ]
        }
    },
    components:{
        DisableOper
    },
    methods:{
        /* 权限父节点是否显示 */
        authDisable(list){
            if(list){
                let num=0;
                list.map(item=>{
                    if(this.authList[item]==2){
                        num++;
                    }
                })
                if(num>0&&num==list.length){
                    return false;
                }else{
                    return true;
                }
            }
        },
        /* 点击禁用 */
        setDisableClick(item){
            this.disableoper.data=item;
            this.handleDisableShow(true);
        },
        /* 隐藏|显示禁用确认弹框 */
        handleDisableShow(val){
            this.disableoper.show=val;
        }
    }
};
export default mymixin;