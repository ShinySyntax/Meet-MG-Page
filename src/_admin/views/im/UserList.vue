<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">用户</label>
                <el-input type="text" clearable v-model="filters.searchkey" placeholder="昵称/账号/ID"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" clearable>
                    <el-option v-for="item in statusSelect" :key="item.id" :value="item.id"
                               :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)">查询</button>
            </div>

            <div class="filter-btn" v-if="isSelectAll == true">
                <img  src="../../assets/img/im/ic_user_list_checked.png" @click="allSelectCancelClick">取消全选</img>
            </div>
            <div class="filter-btn" v-else>
                <img  src="../../assets/img/im/ic_user_list_check.png" @click="allSelectClick">全选</img>
            </div>

            <div class="filter-btn">
                <button class="primarybtn search" @click="joinGroupClick()">进群</button>
            </div>

            <div class="filter-item">
                共存在{{ this.data.totalRow }}用户
                共在线{{ this.data.totalRow }}用户
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad" v-if='showip'>
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
             <el-table-column label="选择" :align="$protovar.align" width="60px">
                    <template slot-scope="scope">
                        <div class="filter-btn" v-if="scope.row.tempcheck == 1">
                                <img src="../../assets/img/im/ic_user_list_checked.png" 
                                          @click="singleSelect(scope.row)"></img>
                        </div>
                        <div class="filter-btn" v-else>
                                <img src="../../assets/img/im/ic_user_list_check.png" 
                                          @click="singleSelect(scope.row)"></img>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="用户" :align="$protovar.align" width="210px">
                    <template slot-scope="scope">
                        <div class="user">
                            <div>
                                <el-image :src="scope.row.avatar" class="imgcol tmopera"
                                          @click="seeInfo(scope.row)"></el-image>
                            </div>
                            <div class="userInfo">
                <span class="userInfo-nick color_666">{{ scope.row.nick }}
                </span>
                                <span class="color_999">UID:{{ scope.row.id }} </span>
                                <span class="color_999">ID:{{ scope.row.tiono }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="账号/邮箱/手机号" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <div class="accountInfo">
                            <span><i class="el-icon-user"></i>{{ scope.row.loginname }}</span>
                            <span><i class="el-icon-eleme"></i>{{ scope.row.email }}</span>
                            <span><i class="el-icon-mobile-phone"></i>{{ scope.row.phone || "--" }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="三方绑定" width="150" :align="$protovar.align">
                    <template slot-scope="scope">
                        <div class="thirdTypeBox" v-if="scope.row.thirdtype">
                            <img v-for="(item, index) in scope.row.thirdtype" :key="index" :src="thirdArr[item].img"
                                 :class="[thirdArr[item].css]" alt="" srcset=""/>
                        </div>
                        <span v-else>暂无</span>
                    </template>
                </el-table-column>
                <el-table-column label="群组" width="150" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="more(scope.row.id)"
                              v-auth="'reset'">共加入{{ scope.row.groupids }}个群</span>
                    </template>
                </el-table-column>

                <el-table-column label="地区/IP" width="280" :align="$protovar.align" >
                    <template slot-scope="scope" >
                    <span v-auth="'showip'">
                    <span class="color_666"  v-show="scope.row.region" >{{
                        scope.row.region
                    }}</span><br/>
                    <a class="a_ip" v-if="scope.row.ip"
                        :href="`https://www.baidu.com/s?wd=${scope.row.ip}&from=t-io`"
                        target="_blank">{{ scope.row.ip }}
                    </a>
                    <span v-else>未知</span><br/>
                    <button class="primarybtn search" @click="setIp(scope.row.ip,scope.row.banid)">
                        {{
                        scope.row.isBan == '1' ? '解封' : '封禁'
                        }}
                    </button>
                    </span>
            
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" width="210" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="color_666">{{ scope.row.createdays }} </span><br/>
                        <span class="color_999">{{ scope.row.createtime }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="最近登录" width="210" prop="lastlogintime" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="color_666">{{ scope.row.lastlogindays }} </span><br/>
                        <span class="color_999">{{ scope.row.lastlogintime }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="120" :align="$protovar.align">
                    <template slot-scope="scope">
            <span :class="[
              scope.row.status == 1 ? 'tmdisabledfalse' : 'tmdisabledtrue',
            ]">{{ scope.row.status == 1 ? "正常" : scope.row.status == 5 ? '被封禁' : '已注销' }}</span>
                        <br/>
                        <span v-show="scope.row.status==5">{{ scope.row.banlevel == null ? '永久' : scope.row.banlevel + "天" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="邀请码" width="150" :align="$protovar().align">
                    <template slot-scope="scope">
                        邀请码：{{ scope.row.invitecode }}<br/>
                        被邀请码：{{ scope.row.beinvitecode }}<br/>
                        邀请人：{{ scope.row.uinick }}<br/>
                        被邀请人：{{ scope.row.u2nicks }}
                    </template>
                </el-table-column>
                <el-table-column style="text-align: center" label="操作" align="center" width="300">
                    <template slot-scope="scope">
                        <div style="display: flex; justify-content: center">
                            <!--              <span :class="[-->
                            <!--                'tmopera',-->
                            <!--                scope.row.status == 1 ? 'stateDisabled' : 'statesuccess',-->
                            <!--              ]" v-auth="'disable'" @click="operStatus(scope.row)">{{ scope.row.status == 1 ? "禁用" : "启用" }}</span>-->
                            <span :class="[
                'tmopera',
                scope.row.status == 1 ? 'stateDisabled' : 'statesuccess',
              ]" v-auth="'disable'" @click="closure(scope.row.id, 1,scope.row.status)">{{
                                scope.row.status == 1 ? "禁用" : "启用"
                                }}</span>


                            <!--                <button class="primarybtn search" @click="closure(scope.row.id, 1,scope.row.status)">-->
                            <!--                    {{ scope.row.status == 1 ? '禁用' : '启用' }}-->
                            <!--                </button>-->

                            <span class="tmopera" v-auth="'reset'"
                                  @click="setVip(scope.row.id,scope.row.vid,scope.row.vipid)">
                    {{
                                scope.row.vipid == 1 ? '初级会员' : scope.row.vipid == 2 ? '中级会员' :
                                    scope.row.vipid == 3 ? '高级会员' : scope.row.vipid == 4 ? '超级会员' : '不是会员'
                                }}</span>
                            <span class="tmopera" @click="resetPwd(scope.row)" v-auth="'reset'">重置密码</span>
                            <span class="tmopera" @click="modifyID(scope.row)" v-auth="'reset'">修改ID</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="contentpad" v-else>
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
             <el-table-column label="选择" :align="$protovar.align" width="60px">
                    <template slot-scope="scope">
                        <div class="filter-btn" v-if="scope.row.tempcheck == 1">
                                <img src="../../assets/img/im/ic_user_list_checked.png" 
                                          @click="singleSelect(scope.row)"></img>
                        </div>
                        <div class="filter-btn" v-else>
                                <img src="../../assets/img/im/ic_user_list_check.png" 
                                          @click="singleSelect(scope.row)"></img>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="用户" :align="$protovar.align" width="210px">
                    <template slot-scope="scope">
                        <div class="user">
                            <div>
                                <el-image :src="scope.row.avatar" class="imgcol tmopera"
                                          @click="seeInfo(scope.row)"></el-image>
                            </div>
                            <div class="userInfo">
                <span class="userInfo-nick color_666">{{ scope.row.nick }}
                </span>
                                <span class="color_999">UID:{{ scope.row.id }} </span>
                                <span class="color_999">ID:{{ scope.row.tiono }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="账号/邮箱/手机号" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <div class="accountInfo">
                            <span><i class="el-icon-user"></i>{{ scope.row.loginname }}</span>
                            <span><i class="el-icon-eleme"></i>{{ scope.row.email }}</span>
                            <span><i class="el-icon-mobile-phone"></i>{{ scope.row.phone || "--" }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="三方绑定" width="150" :align="$protovar.align">
                    <template slot-scope="scope">
                        <div class="thirdTypeBox" v-if="scope.row.thirdtype">
                            <img v-for="(item, index) in scope.row.thirdtype" :key="index" :src="thirdArr[item].img"
                                 :class="[thirdArr[item].css]" alt="" srcset=""/>
                        </div>
                        <span v-else>暂无</span>
                    </template>
                </el-table-column>
                <el-table-column label="群组" width="150" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="more(scope.row.id)"
                              v-auth="'reset'">共加入{{ scope.row.groupids }}个群</span>
                    </template>
                </el-table-column>

                
                <el-table-column label="注册时间" width="210" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="color_666">{{ scope.row.createdays }} </span><br/>
                        <span class="color_999">{{ scope.row.createtime }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="最近登录" width="210" prop="lastlogintime" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="color_666">{{ scope.row.lastlogindays }} </span><br/>
                        <span class="color_999">{{ scope.row.lastlogintime }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="120" :align="$protovar.align">
                    <template slot-scope="scope">
            <span :class="[
              scope.row.status == 1 ? 'tmdisabledfalse' : 'tmdisabledtrue',
            ]">{{ scope.row.status == 1 ? "正常" : scope.row.status == 5 ? '被封禁' : '已注销' }}</span>
                        <br/>
                        <span v-show="scope.row.status==5">{{ scope.row.banlevel == null ? '永久' : scope.row.banlevel + "天" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="邀请码" width="150" :align="$protovar().align">
                    <template slot-scope="scope">
                        邀请码：{{ scope.row.invitecode }}<br/>
                        被邀请码：{{ scope.row.beinvitecode }}<br/>
                        邀请人：{{ scope.row.uinick }}<br/>
                        被邀请人：{{ scope.row.u2nicks }}
                    </template>
                </el-table-column>
                <el-table-column style="text-align: center" label="操作" align="center" width="300">
                    <template slot-scope="scope">
                        <div style="display: flex; justify-content: center">
                            <!--              <span :class="[-->
                            <!--                'tmopera',-->
                            <!--                scope.row.status == 1 ? 'stateDisabled' : 'statesuccess',-->
                            <!--              ]" v-auth="'disable'" @click="operStatus(scope.row)">{{ scope.row.status == 1 ? "禁用" : "启用" }}</span>-->
                            <span :class="[
                'tmopera',
                scope.row.status == 1 ? 'stateDisabled' : 'statesuccess',
              ]" v-auth="'disable'" @click="closure(scope.row.id, 1,scope.row.status)">{{
                                scope.row.status == 1 ? "禁用" : "启用"
                                }}</span>


                            <!--                <button class="primarybtn search" @click="closure(scope.row.id, 1,scope.row.status)">-->
                            <!--                    {{ scope.row.status == 1 ? '禁用' : '启用' }}-->
                            <!--                </button>-->

                            <span class="tmopera" v-auth="'reset'"
                                  @click="setVip(scope.row.id,scope.row.vid,scope.row.vipid)">
                    {{
                                scope.row.vipid == 1 ? '初级会员' : scope.row.vipid == 2 ? '中级会员' :
                                    scope.row.vipid == 3 ? '高级会员' : scope.row.vipid == 4 ? '超级会员' : '不是会员'
                                }}</span>
                            <span class="tmopera" @click="resetPwd(scope.row)" v-auth="'reset'">重置密码</span>
                            <span class="tmopera" @click="modifyID(scope.row)" v-auth="'reset'">修改ID</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagecontainer" v-show="data.totalRow > 0">
            <el-pagination layout="total,prev, pager, next,sizes,jumper" background :page-size="data.pageSize"
                           :page-sizes="data.pagesizes" :total="data.totalRow" :current-page="data.pageNumber"
                           @current-change="handleCurrentChange" @size-change="handleSizeChange">
            </el-pagination>
        </div>
        <!-- 重置密码-->
        <el-dialog :visible.sync="dialog3.visible" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div class="title">确认重置当前用户登录密码为 csmm123456 吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog3', 'visible')">
                    取消
                </button>
                <button class="primarybtn" @click="sureResetPwd">重置</button>
            </div>
        </el-dialog>
        <!-- 提示成功 -->
        <el-dialog :visible.sync="dialog3.visible2" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div class="title">
                <p>
                    已成功重置为默认密码：{{ sysparams ? sysparams["resetpwd"] : "" }}
                </p>
                <p>请尽快通知用户进行修改！</p>
            </div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn" @click="hideDialog('dialog3', 'visible2')">
                    确定
                </button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="getmessage1">
            <div class="filter">
                <div class="filter-btn">
                    <button class="primarybtn search" @click="txtdata1(data.list2)">
                        导出txt
                    </button>
                </div>
                <div class="filter-btn">
                    <button class="primarybtn search" @click="xlsdata1(data.list2)">
                        导出xls
                    </button>
                </div>
            </div>
        </el-dialog>
        <!-- 封停/解封弹窗 -->
        <el-dialog :visible.sync="visible.userChatShow" class="groupChat-dialog" width="553px">
            <div class="groupChatBox">
                <p>{{ userStatus == 1 ? '封停' : '解封' }}原由</p>
                <textarea v-model="inblack.reason"
                          :placeholder="userStatus==1?'请输入封停原由':'请输入解封原由'"></textarea>
                <p class="operator">操作人：{{ curruser && curruser.loginname }}</p>
            </div>
            <div class="groupChatBox" style="height: 60px" v-show="userStatus==1">
                封禁时间：
                <el-select v-model="inblack.day">
                    <el-option label="3天" value="3"></el-option>
                    <el-option label="7天" value="7"></el-option>
                    <el-option label="30天" value="30"></el-option>
                    <el-option label="永久" value="null"></el-option>
                </el-select>
            </div>
            <div class="tmdialog-footer">
                <button class="primarybtn search" @click="visible.userChatShow=false">取消</button>
                <button class="primarybtn" @click="closure1()">
                    {{ userStatus == 1 ? '确认封停' : '确认解封' }}
                </button>
            </div>
        </el-dialog>
        <!--      vip会员选择-->
        <el-dialog :visible.sync="dialog3.visible3" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div class="title">选择VIP</div>
            <div class="tmdialog-footer pb60">临时会员设置时间<el-input v-model="dialog3.time" oninput ="value=value.replace(/[^0-9]/g,'')"></el-input>分钟</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn" @click="sureReset(0)" v-show="vipid!=null&&vipid!=''">非会员</button>
                <button class="primarybtn" @click="sureReset(1)" v-show="vipid!=1">初级会员</button>
                <button class="primarybtn" @click="sureReset(2)" v-show="vipid!=2">中级会员</button>
                <button class="primarybtn" @click="sureReset(3)" v-show="vipid!=3">高级会员</button>
                <button class="primarybtn" @click="sureReset(4)" v-show="vipid!=4">超级会员</button>
            </div>
        </el-dialog>
        <!--      会员确定-->

        <el-dialog :visible.sync="dialog3.visible4" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div class="title">设置会员等级</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="dialog3.visible4=false">取消</button>
                <button class="primarybtn" @click="sureReset2">确定</button>
            </div>
        </el-dialog>
        <!--      群组详情-->
        <el-dialog :visible.sync="dialog4.visible" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <!-- 数据表格 -->
            <div class="contentpad">
                <div v-for="item in dialog4.data.list" style="float: left">
                    <div class="user" >
                        <div>
                            <el-image :src="item.avatar" @click="seeInfoG(item)" class="imgcol tmopera">
                                <div slot="error" class="image-slot">
                                    <img src="~@_/assets/img/im/avatar.jpg" @click="seeInfoG(item)"
                                         class="error-img"/>
                                </div>
                            </el-image>
                        </div>
                        <div class="userInfo">
                            <span class="userInfo-nick color_666">{{ item.name }} </span>
                            <span class="color_999">ID:{{ item.id }} </span>
                        </div>
                    </div>
                </div>
                <!--              <el-table :data="dialog4.data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">-->
                <!--                  <el-table-column label="群聊" :align="$protovar.align" width="180">-->
                <!--                      <template slot-scope="scope">-->
                <!--                          <div class="user">-->
                <!--                              <div>-->
                <!--                                  <el-image :src="scope.row.avatar" @click="seeInfoG(scope.row)"  class="imgcol tmopera">-->
                <!--                                      <div slot="error" class="image-slot">-->
                <!--                                          <img src="~@_/assets/img/im/avatar.jpg" @click="seeInfoG(scope.row)"  class="error-img"/>-->
                <!--                                      </div>-->
                <!--                                  </el-image>-->
                <!--                              </div>-->
                <!--                              <div class="userInfo">-->
                <!--                                  <span class="userInfo-nick color_666">{{scope.row.name}} </span>-->
                <!--                                  <span class="color_999">ID:{{scope.row.id}} </span>-->
                <!--                              </div>-->
                <!--                          </div>-->
                <!--                      </template>-->
                <!--                  </el-table-column>-->
                <!--              </el-table>-->
            </div>
            <!-- 分页 -->
            <div class="pagecontainer" v-show="dialog4.data.totalRow > 0">
                <el-pagination layout="total,prev, pager, next,sizes,jumper" background
                               :page-size="dialog4.data.pageSize"
                               :page-sizes="dialog4.data.pagesizes" :total="dialog4.data.totalRow"
                               :current-page="dialog4.data.pageNumber"
                               @current-change="handleCurrentChange1" @size-change="handleSizeChange1">
                </el-pagination>
            </div>

        </el-dialog>

        <!-- 加入的群组输入弹框 -->
        <el-dialog :visible.sync="visible.joinGroupShow" class="groupChat-dialog" width="553px">
            <div class="groupChatBox">
                <p>请输入加入的群组id</p>
                <textarea v-model="joinGroup.groupid"
                          :placeholder="请输入加入的群组id"></textarea>
                <p class="operator">操作人：{{ curruser && curruser.loginname }}</p>
            </div>
            <div class="tmdialog-footer">
                <button class="primarybtn search" @click="visible.joinGroupShow=false">取消</button>
                <button class="primarybtn" @click="confirmJoinGroup()">确定</button>
            </div>
        </el-dialog>

        <!-- 群聊信息 -->
        <el-dialog :visible.sync="info.visible" :close-on-click-modal="false" class="tmdialog userdialog" width="487px">
            <div class="user-top">
                <div class="info-main">
                    <div class="info-top">
                        <div>
                            <el-image class="user-avatar" :src="info.data.avatar">
                                <div slot="error" class="image-slot">
                                    <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                </div>
                            </el-image>
                        </div>
                        <div class="top-center">
                            <p class="group-info">
                                <span class="group-name">{{ info.data.name }}</span>
                                <span :class="['group-status',info.data.status==1?'':'group-status-error']">{{ info.data.status == 1 ? '有效群' : '无效群' }}</span>
                            </p>
                            <div class="fidgop">
                                {{ info.data.joinnum }}位成员
                            </div>
                        </div>
                        <div class="top-right">
                            <!--                          <button class="primarybtn" @click="showMsgList(info.data)">查看记录</button>-->
                        </div>
                    </div>
                </div>
            </div>
            <div class="info-content2">
                <p class="info-col">
                    <span>UID：</span>
                    <span class="info-row">{{ info.data.id }}</span>
                    <span>ID：</span>
                    <span class="info-row">{{ info.data.usertiono }}</span>
                </p>
                <p class="info-col">
                    <span>群简介：</span>
                    <span class="info-row">{{ info.data.intro || '无' }}</span>
                </p>
                <p class="info-col">
                    <span>群公告：</span>
                    <span class="info-row">{{ info.data.notice || '无' }}</span>
                </p>
                <p class="info-col">
                    <span>群主：</span>
                    <span>
                        <span class="info-row">{{ info.data.usernick }}</span>
                        <span class="owner-uid">(UID:{{ info.data.uid }})</span>
                        <span class="owner-uid">(ID:{{ info.data.usertiono }})</span>
                    </span>
                </p>
                <p class="info-col">
                    <span>管理员：</span>
                    <span class="info-row">无</span>
                </p>
                <p class="info-col">
                    <span>成员邀请：</span>
                    <span class="info-row">{{ info.data.applyflag == 1 ? '开启' : '已关闭' }}</span>
                </p>
                <p class="info-col">
                    <span>进群审核：</span>
                    <span class="info-row">{{ info.data.joinmode == 1 ? '开启' : '已关闭' }}</span>
                </p>
                <p class="info-col">
                    <span>全员禁言：</span>
                    <span class="info-row">{{ info.data.forbiddenflag == 1 ? '开启' : '已关闭' }}</span>
                </p>
                <!-- <p class="info-col">
                    <span>近1月消息数：</span>
                    <span class="info-row">{{info.data.applyflag==1?'开启':'已关闭'}}</span>
                </p> -->
                <p class="info-col">
                    <span>创建时间：</span>
                    <span class="info-row">{{ info.data.createtime }}</span>
                </p>
            </div>
        </el-dialog>
        <!-- 修改ID输入弹框 -->
        <el-dialog :visible.sync="visible.modifyID" class="groupChat-dialog" width="553px">
            <div class="groupChatBox">
                <p>请输入新ID(8位)</p>
                <textarea v-model="tiono"
                          :placeholder="请输入8位新ID" maxlength="8"></textarea>
                <p class="operator">操作人：{{ curruser && curruser.loginname }}</p>
            </div>
            <div class="tmdialog-footer">
                <button class="primarybtn search" @click="visible.modifyID=false">取消</button>
                <button class="primarybtn" @click="confirmModifyID()">确定</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

import {mapMutations} from "vuex";
import {imuser, msgTips, successTips, mgrole} from "@_/axios/path";
import $protovar from "quill";
import {resUrl, btDate} from "@_/utils/common.js";
import {IP, report, UID} from "../../axios/path";

export default {
    data() {
        return {
            uid: '',
            vid: '',
            vipid: '',
            vipid2: '',
            joinGroup: {
                groupid: ''
            },
            visible: {
                userChatShow: false,
                joinGroupShow: false,
                modifyID: false,
            },
            inblack: {//封停/解封原因
                reason: '',
                day: 'null'
            },
            userid: "", //群id
            userdata: {}, //选中的群消息
            userStatus: 1,//1 封停, 2 解封
            userStatus2: 1,//1 封停, 2 解封
            main: '',
            item: [],
            // 全选按钮是否选中
            isSelectAll: false,
            //弹框
            getmessage1: false,
            getmessage2: false,
            getmessage3: false,
            filters: {
                searchkey: "",
                status: "",
            },
            statusSelect: [
                {id: 1, label: "正常"},
                {id: 5, label: "禁用"},
                {id: 6, label: "已注销"},
                {id: 10, label: "在线"},
            ],
            data: {
                //数据表格
                pageNumber: 1,
                pageSize: 10,
                pageNumber1: 1,
                pageSize1: 10,
                totalRow: 0, //总条数
                totalRow1: 0, //总条数
                loading: false, //表单loading
                list: [], //列表
                list2: [], //列表
                pagesizes: [10, 20, 30, 40],
                pagesizes1: [10, 20, 30, 40],
            },
            currdata: null,
            dialog3: {
                time:'',
                visible: false,
                visible2: false,
                visible3: false,
                visible4: false,
            },
            dialog4: {
                visible: false,
                id: '',
                data: {
                    pageNumber: 1,
                    pageSize: 10,
                    totalRow: 0, //总条数
                    loading: false, //表单loading
                    pagesizes: [10, 20, 30, 40],
                    list: [], //列表
                },
            },
            info: {// 群聊信息
                visible: false,
                data: {}
            },
            loading: false,
            curroute: "",
            thirdArr: [
                {img: "", css: ""},
                {img: require("@_/assets/img/im/icon_qq.png"), css: "qq"},
                {img: require("@_/assets/img/im/icon_wx.png"), css: "wx"},
                {img: require("@_/assets/img/im/icon_weibo.png"), css: "wb"},
                {img: require("@_/assets/img/im/icon_dy.png"), css: "dy"},
                {img: require("@_/assets/img/im/icon_kaiyuan.png"), css: "kaiyuan"},
            ],
            // 是否展示地区/IP
            showip: false,
            // 头像是否可以点击
            avatarClickable: false,
            // 修改ID选中的item
            modifyIDItem: null,
            tiono: "",

        };
    },
    mounted() {
        this.curroute = this.$route.path;
        this.judgeShowIp();
        this.judegeAvatarClickable();
    },
    watch: {
        tiono (newValue, oldValue) {
            this.tiono = newValue.replace(/[^\d]/g, "")
        },
        $route(to, from) {
            if (to.path == this.curroute) {
                if (this.$protovar.routehasopen != -1 && !to.query.random) {
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute = this.$route.path;
                this.getData();
            }
        },
    },
    methods: {
        // 修改ID
        modifyID(item) {
            this.tiono = "";
            this.modifyIDItem = item;
            this.visible.modifyID = true;
        },
        // 修改ID确认
        confirmModifyID() {
            if (this.tiono == "" || this.tiono == '') {
                msgTips("请输入新ID");
                return;
            } else if (this.tiono.length !=8) {
                msgTips("请输入8位ID")
                return;
            }
            let psData = {tiono:this.tiono, uid:this.modifyIDItem.id}
            UID.modifyUserTiono(psData).then((res) => {
                if (res.ok == 1) {
                    msgTips("修改成功");
                    this.getData()
                } else {
                    msgTips(res.msg);
                }
                this.modifyIDItem = null;
                this.visible.modifyID = false;
            })
        },

        // 取消全选
        allSelectCancelClick() {
            this.isSelectAll = false;
            for (var i=0;i<this.data.list.length;i++)
            { 
                this.data.list[i].tempcheck = 0;
            }
        },

        // 全选
        allSelectClick() {
            this.isSelectAll = true;
            for (var i=0;i<this.data.list.length;i++)
            { 
                this.data.list[i].tempcheck = 1;
            }
        },
        // 单选
        singleSelect(item) {
            this.isSelectAll = false;
            if (item.tempcheck == 1) {
                item.tempcheck = 0;
            } else {
                item.tempcheck = 1;
            }
        },
        // 进群
        joinGroupClick() {
            this.visible.joinGroupShow = true;
        },
        // 确定进群
        confirmJoinGroup() {
            this.visible.joinGroupShow = false;
            var uids = "";
            for (var i=0;i<this.data.list.length;i++)
            { 
                var item = this.data.list[i];
                if (item.tempcheck == 1) {
                    uids += item.id;
                    if (i < this.data.list.length-1) {
                        uids += ",";
                    }
                }
                
            }
            if (uids == "") {
                msgTips("请选择入群的用户");
            } else if (this.joinGroup.groupid == '') {
                msgTips("请输入要加入的群组id");
            } else {
                let ptdata = {uids: uids, groupid: this.joinGroup.groupid};
                imuser.joinGroup(ptdata).then((res) => {
                    if (res.ok) {
                        this.getData();
                    } else {
                        msgTips("操作失败");
                    }
                });
            }
        },
        judgeShowIp() {
            mgrole.getMgUserShowIpAuth(null).then((res) => {
                if (res.data == 1) {
                    this.showip = true;
                } else {
                    this.showip = false;
                }
                this.getData()
            })
        },
        judegeAvatarClickable() {
            mgrole.getMgUserCanClickAvatar(null).then((res) => {
                if (res.data == 1) {
                    this.avatarClickable = true;
                } else {
                    this.avatarClickable = false;
                }
            })
        },
        setIp(ip, id) {
            IP.setIp({ip: ip, id: id}).then(res => {
                if (res.ok) {
                    this.getData();
                } else {
                    msgTips(res);
                }
            })
        },
        closure(id, status, status2) {
            this.inblack.reason = '账号涉嫌违规已封停'
            this.userid = id;
            this.userStatus2 = status;
            this.userStatus = status2;
            this.visible.userChatShow = true;
        },
        closure1() {
            let closures = {
                id: this.userid,
                status: this.userStatus2,
                reason: this.inblack.reason,
                day: this.inblack.day
            };
            report.closure(closures).then((res) => {
                if (res.ok == true) {
                    this.visible.userChatShow = false;
                    this.getData();
                } else {
                    msgTips(res.msg);
                }
            });
        },
        $protovar() {
            return $protovar
        },
        ...mapMutations(["setUserInfoUid", "setUserInfoShow"]),
        /* 用户数据 */
        getData(item) {
            if (item) {
                this.data.pageNumber = item;
            }
            this.data.loading = true;
            let {pageNumber, pageSize} = this.data;
            let ptdata = {...this.filters, pageNumber, pageSize};
            
            imuser.userRegisterMainLive().then(res => {
                this.main = res;
            }),
                imuser.userList(ptdata).then((res) => {
                    if (res.ok) {
                        console.log(res);
                        this.allSelectCancelClick();
                        let data = res.data;
                        if (data) {
                            this.data.totalRow = data.totalRow;
                            let list = data.list;
                            list.map((item) => {
                                item.avatar = resUrl(item.avatar);
                                item.province = item.province || "";
                                item.city = item.city || "";
                                item.region = item.country + " " + item.province + " " + item.city;
                                item.createdays = btDate(item.createtime);
                                item.lastlogindays = btDate(item.lastlogintime);
                                if (item.thirdtype) {
                                    item.thirdtype = item.thirdtype.replace(/11/g, 1);
                                    item.thirdtype = item.thirdtype.replace(/22/g, 2);
                                    item.thirdtype = item.thirdtype.replace(/33/g, 3);
                                    item.thirdtype = item.thirdtype.split(",");
                                    item.thirdtype = Array.from(new Set(item.thirdtype));
                                }
                            });
                            this.data.list = list || [];
                        }
                    } else {
                        msgTips(res);
                    }
                    this.data.loading = false;
                });
        },
        /* 切换分页 */
        handleCurrentChange(val) {
            this.data.pageNumber = val;
            this.getData();
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this.data.pageNumber = 1;
            this.data.pageSize = val;
            this.getData();
        }, /* 切换分页 */
        handleCurrentChange1(val) {
            this.dialog4.data.pageNumber = val;
            this.more();
        },
        /* 调整每页显示条数 */
        handleSizeChange1(val) {
            this.dialog4.data.pageNumber = 1;
            this.dialog4.data.pageSize = val;
            this.more();
        },
        /* 查看 */
        seeInfo(item) {
            if (!this.avatarClickable) {
                return;
            }
            this.setUserInfoUid(item.id);
            this.setUserInfoShow(true);
        },  /* 查看qun */
        seeInfoG(item) {
            this.info.visible = true;
            this.info.data = item;
        },

        /* 取消弹框 */
        hideDialog(dialog, visible) {
            this[dialog][visible] = false;
        },
        /* 重置密码 */
        resetPwd(item) {
            this.currdata = item;
            this.dialog3.visible = true;
        },  /*设置VIP */
        setVip(uid, vid, vipid) {
            this.uid = uid;
            this.vid = vid;
            this.vipid = vipid;
            this.dialog3.time='';
            this.dialog3.visible3 = true;
        },
        /* 确定重置密码 */
        sureResetPwd() {
            let ptdata = {uid: this.currdata.id};
            imuser.resetPwd(ptdata).then((res) => {
                if (res.ok) {
                    this.dialog3.visible = false;
                } else {
                    msgTips(res);
                }
            });
        },
        sureReset(vipid) {
            this.vipid2 = vipid;
            this.dialog3.visible4 = true;
        },
        sureReset2() {
            let ptdata = {uid: this.uid, vipid: this.vipid2, vid: this.vid,time:this.dialog3.time};
            // console.log(ptdata);
            imuser.resetVip(ptdata).then((res) => {
                if (res.ok) {
                    this.dialog3.visible3 = false;
                    this.dialog3.visible4 = false;
                    this.getData();
                } else {
                    msgTips(res);
                }
            });
        },
        /* 启用|禁用 */
        operStatus(item) {
            var statusvalue;
            if (item.status == 6)
                successTips("该账户已注销，请求驳回");
            else {
                if (item.status == 5)
                    statusvalue = 1;
                if (item.status == 1)
                    statusvalue = 5;
                let ptdata = {
                    uid: item.id,
                    status: statusvalue,
                };
                imuser.userDisable(ptdata).then((res) => {
                    if (res.ok) {
                        successTips("修改成功");
                        this.getData();
                    } else {
                        msgTips(res);
                    }
                });
            }
        },
        more(id) {
            if (id == null) {
                id = this.dialog4.id;
            } else {
                this.dialog4.id = id;
                this.dialog4.data.pageNumber = 0;
                this.dialog4.data.pageSize = 10;
            }
            imuser.more({
                searchkey: id,
                pageNumber: this.dialog4.data.pageNumber,
                pageSize: this.dialog4.data.pageSize
            }).then((res) => {
                console.log(res)
                this.dialog4.data = res.data;
                this.dialog4.data.list.map((item) => {
                    item.avatar = resUrl(item.avatar);
                })
            });
            this.dialog4.visible = true;
        }
    },
};
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/usermanage.less";
@import "~@_/assets/style/less/im/groupChatManage.less";
@import "~@_/assets/style/less/im/groupmanage.less";
</style>

<style lang="less" scoped>@import "~@_/assets/style/less/im/PurseComm.less";</style>