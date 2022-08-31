<template>
      <el-container>
        <el-aside width="340px" style="position:relative;"> 
            <div>
                <div class="searchItem"> 
                    <el-autocomplete
                    v-model="state"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="搜索"
                    @select="handleSelect"
                    style="width:270px"
                    ></el-autocomplete>
                </div>
                <el-dropdown @command="openDialog" style="float:right;margin-top: -9%;">
                    <el-button icon="el-icon-plus" size="mini" style="float:right;margin-top: -9%;" title="添加好友"></el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a">加好友</el-dropdown-item>
                    <el-dropdown-item command="b">创建群聊</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
                <el-row>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        
                        <el-tab-pane label="好友" name="好友">
                            <el-tree :data="friendList" :props="defaultProps" @node-click="handleNodeClick">
                                <span slot-scope="{ node}">
                                    <span>{{ node.label }}</span>
                                </span>
                            </el-tree>
                        </el-tab-pane>
                        <el-tab-pane label="群组" name="群组">
                            <el-tree :data="groupList" :props="defaultProps" @node-click="handleNodeClick">
                                <span slot-scope="{ node}">
                                    <span>{{ node.label }}</span>
                                </span>
                            </el-tree>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </div>
            <el-badge :value="friendrequestList.length" class="item" style="position: absolute;bottom:0;float:right;">
                <el-button @click="openRequestDialog">好友请求</el-button>
            </el-badge>
            <el-button style="position: absolute;bottom:0;margin-left: -40%;" @click="openCategoryDialog">编辑分组</el-button>
        </el-aside>
        <el-main>
            <!-- 背景图 -->
            <img src="../../assets/a.png" class="above" v-if="type=='0'"/>      
            <!-- 查看好友信息 -->
          <div class="above" v-if="type=='1'" >
            <el-card class="userData">
                <div style="width: 180px;background-color: rgb(226, 226, 226);padding: 20px;">
                    <div style="margin-bottom: 10px;">
                        <div style="float: left;margin-right: 10px;text-align: right;width: 60px;" >
                            <span style="font-weight:bold;color: rgb(145, 146, 146);">账&nbsp;&nbsp;号</span>
                        </div>
                        <div style="float: right;text-align: left;" >
                            <span>{{user.username}}</span>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="float: left;margin-right: 10px;text-align: right;width: 60px;" >
                            <span style="font-weight:bold;color: rgb(145, 146, 146);">姓&nbsp;&nbsp;名</span>
                        </div>
                        <div style="float: right;text-align: left;" >
                            <span>{{user.name}}</span>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="float: left;margin-right: 10px;text-align: right;width: 60px;" >
                            <span style="font-weight:bold;color: rgb(145, 146, 146);">个&nbsp;&nbsp;人</span>
                        </div>
                        <div style="float: right;text-align: left;" >
                            <span>{{user.age}} {{user.sex}}</span>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="float: left;margin-right: 10px;text-align: right;width: 60px;" >
                            <span style="font-weight:bold;color: rgb(145, 146, 146);">电&nbsp;&nbsp;话</span>
                        </div>
                        <div style="float: right;text-align: left;" >
                            <span>{{user.phone}}</span>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="float: left;margin-right: 10px;text-align: right;width: 60px;" >
                            <span style="font-weight:bold;color: rgb(145, 146, 146);">分&nbsp;&nbsp;组</span>
                        </div>
                        <div style="float: right;text-align: left;" >
                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link">
                                    {{category}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" >
                                    <el-dropdown-item v-for="(item,index) in categoryList" :key="index" :command="item.categoryId">{{item.name}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown><br>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                </div>
                    <el-button type="primary" style="float:right;" @click="goChat('0')">发送消息</el-button>
            </el-card>
          </div>
          <!-- 查看群组成员 -->
          <div class="above" v-if="type=='2'">
              <el-button type="primary" @click="goChat('1')" style="float:left">发送消息</el-button>
              <el-button type="primary" @click="add" style="float:left">添加成员</el-button>
              <el-table :data="groupMemberList">
                  <el-table-column label="姓名" min-width="2">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                        <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="手机号" min-width="2">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                        <span>{{ scope.row.phone }}</span>
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="年龄" min-width="1">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                        <span>{{ scope.row.age }}</span>
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="性别" min-width="1">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                        <span>{{ scope.row.sex }}</span>
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column  label="操作" min-width="2">
                    <template slot-scope="scope" v-if="scope.row.userId!=userId">
                            <el-button
                            type="primary"
                            @click="setTouserId(scope.$index, groupMemberList)"
                            >发送消息</el-button>
                            <el-button
                            type="primary"
                            icon="el-icon-plus"
                            @click="addFriend(scope.$index, groupMemberList)"
                            >添加好友</el-button>
                            <el-button
                            type="danger"
                            icon="el-icon-close"
                            @click="delMember(scope.$index, groupMemberList)"
                            v-if="userId == groupOwner"
                            >踢出群聊</el-button>
                    </template>
                  </el-table-column>
              </el-table>
          </div>
        </el-main>
      <el-dialog  :visible.sync="addFriendDialog" @close="closeDialog">
          <el-input placeholder="请输入对方的用户名、手机号或姓名" v-model="userContent"></el-input>
          <el-button type="primary" @click="findUser">查找</el-button>
          <el-row>
            <el-col :span="6" v-for="(item, index) in userList" :key="index" :offset="index > 0 ? 2 : 0">
                <el-card :body-style="{ padding: '0px' }" style="width:200px">
                <div style="padding: 14px;">
                    <img class="headImg" :src="item.url" />
                    <span>{{item.name}}</span><br>
                    <span>{{item.phone}}</span>
                    <div class="bottom clearfix">
                    <el-button type="text" class="button" @click="addFriend(index,userList)">加好友</el-button>
                    </div>
                </div>
                </el-card>
            </el-col>
          </el-row>
      </el-dialog>
      <el-dialog  :visible.sync="addGroupDialog" @close="closeDialog" style="text-align:left" width="700px">
          <img v-if="addGroup.url!=''" style="width:200px;height:200px;" :src="addGroup.url"/>
          <el-button type="primary" @click="openInput" >头像上传</el-button><br>
          <input type="file" @change="upload" id="upload" style="display: none" ref="file">
          <el-input v-model="addGroup.url" style="display:none"></el-input>
          <el-transfer
                filterable
                filter-placeholder="请输入好友姓名"
                v-model="addGroupMember"
                :titles="[' ', ' ']"
                :data="friends"
                >
            </el-transfer>
            <el-input placeholder="填写群名称" v-model="addGroup.groupName"></el-input><br>
            <el-button type="primary" @click="saveGroup">确认</el-button>
            <el-button @click="closeDialog">取消</el-button>
      </el-dialog>

      <el-dialog  :visible.sync="addGroupDialog2" @close="closeDialog" style="text-align:left" width="700px">
          <el-transfer
                filterable
                filter-placeholder="请输入好友姓名"
                v-model="addGroupMember2"
                :titles="[' ', ' ']"
                :data="friends2"
                >
            </el-transfer>
            <el-button type="primary" @click="addMember" >确认</el-button>
            <el-button @click="closeDialog">取消</el-button>
      </el-dialog>

      <el-dialog  :visible.sync="categoryDialog" @close="closeDialog" width="400px">
          <el-button type="primary" icon="el-icon-plus" style="float:left" @click="openCategoryEditDialog('0','0')"></el-button>
          <el-table :data="categoryList">
              <el-table-column label="分组名称" width="200">
                  <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <span>{{ scope.row.name}}</span>
                        </div>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                  <template slot-scope="scope" v-if="scope.row.name!='我的好友'">
                      <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        title="编辑"
                        @click="openCategoryEditDialog(scope.$index, categoryList)"
                        ></el-button>
                        <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        title="删除"
                        @click="delCategory(scope.$index, categoryList)"
                        ></el-button>
                  </template>
              </el-table-column>
          </el-table>
            <el-button type="primary" @click="addMember">确认</el-button>
            <el-button @click="closeDialog">取消</el-button>
      </el-dialog>

      <el-dialog  :visible.sync="categoryEditDialog" @close="closeEditDialog" width="400px">
            <el-input v-model="categorys.categoryId" style="display:none"></el-input>
            <el-input placeholder="请输入分组名称" v-model="categorys.name"></el-input><br>
            <el-button type="primary" @click="saveCategory">确认</el-button>
            <el-button @click="closeEditDialog">取消</el-button>
      </el-dialog>

      <el-dialog  :visible.sync="requestDialog" @close="closeDialog" width="600px">
            <el-table :data="friendrequestList">
                <el-table-column label="姓名" width="200">
                  <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <span>{{ scope.row.name}}</span>
                        </div>
                  </template>
              </el-table-column>
              <el-table-column label="申请时间" width="200">
                  <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <span>{{ scope.row.insertDate | dateFormat}}</span>
                        </div>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                  <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="updateRequest(scope.$index, friendrequestList,1)"
                        >同意</el-button>
                        <el-button
                        type="danger"
                        size="mini"
                        @click="updateRequest(scope.$index, friendrequestList,2)"
                        >拒绝</el-button>
                  </template>
              </el-table-column>
            </el-table>
      </el-dialog>
      </el-container>
</template>
<script>
import {list,getUserData,getOne,getCategoryList,updateCategory,findAndSave,groupList,groupMemberList,find,saveFriendRequest,FriendRequestList,findUser,findAll,saveGroup,findElse,addGroupMember,delMember,getGroupOwner,saveOrUpdateCategory,delCategory,updateRequest,getFriendsAndGroup,putImg  } from "@/api/contacts/contacts";
export default {
  data() {
    return {
       friendList: [],
       getFriendList:[],
       friends:[],
       friends2:[],
       addGroupMember:[],
       addGroupMember2:[],
       friendrequestList:[],
       addGroup:{
            groupName:"",
            userList:[],
            userId:"",
            url:"",
       },
       groupList:[],
       groupMemberList:[],
       userList:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        friend:{},
        group:{},
        groupMember:{},
        friendRequest:{},
        categorys:{
            categoryId:"",
            name:"",
        },
        activeName:"好友",
        category:"",
        addFriendDialog:false,
        addGroupDialog:false,
        addGroupDialog2:false,
        categoryDialog:false,
        categoryEditDialog:false,
        requestDialog:false,
        categoryList:[],
        result:[],
        toUserId:"",
        user:{},
        userContent:"",
        groupOwner:"",
        state:"",
        userId:"",
       type:"0",
    };
  },
  created() {
      this.getUserId();
    },
  mounted() {
    this.loadAll();
    this.getCategoryList();
    this.requestList();
  },
  methods: {
    
    //获取用户编号
      getUserId() {
      var userId = localStorage.getItem("userId");
      if (userId != "" && userId != null) {
        this.userId = userId;
      }
    },

    //列表查询
    loadAll() {
      this.friend.userId = this.userId;
      this.friend.page = 1;
      this.friend.pageSize = 100;
      list(this.friend).then((res)=>{
        this.friendList = res.data;
      });
    //查询搜索框所有好友和群组
      getFriendsAndGroup(this.friend).then((res)=>{
          this.getFriendList = res.data.data;
      });
      this.group.userId = this.userId;
      groupList(this.group).then((res)=>{
          this.groupList = res.data;
      })
    },
    //查看所有分组
    getCategoryList(){
        getCategoryList({userId:this.userId}).then((res)=>{
            this.categoryList = res.data.data;
        })
    },
    //获取好友申请列表
    requestList(){
        this.friendRequest.toUserId = this.userId;
        this.friendRequest.status = "0";
        this.friendRequest.page = 1;
        this.friendRequest.pageSize = 100;
        FriendRequestList(this.friendRequest).then((res)=>{
            this.friendrequestList = res.data.data;
        })
    },
    //标签页选择
    handleClick(tab, event) {
        
    },

     handleNodeClick(data) {
         //data.type==1表示分组下的好友
        if(data.type=="1"){
            this.toUserId = data.userId;
            getUserData({userId:data.userId}).then((res)=>{
                this.user = res.data;
            });
            this.friend.toUserId = data.userId;
            getOne(this.friend).then((res)=>{
                this.category = res.data.categoryName;
            })
        this.type = "1";
        }
        //date.type==2表示分组下的群组
        if(data.type=="2"){
            this.toUserId = data.groupId;
            this.groupMember.groupId = data.groupId;
            this.groupMember.page = 1;
            this.groupMember.pageSize = 100;
            groupMemberList(this.groupMember).then((res)=>{
                this.groupMemberList = res.data.data;
            });
            getGroupOwner({groupId:data.groupId}).then((res)=>{
                this.groupOwner = res.data;
            });
            this.type = "2";
        }
      },
      //修改好友分组
    handleCommand(command) {
        this.friend.toUserId = this.toUserId;
        this.friend.categoryId = command;
        updateCategory(this.friend).then((res)=>{
            this.categoryList.forEach((item)=>{
                if(item.categoryId==command){
                    this.category = item.name;
                }
            });
            this.friend.toUserId = "";
            this.friend.categoryId = "";
            this.loadAll();
        })
      },
    //从群成员前往聊天页面
    setTouserId(index,rows){
        this.friend.toUserId = rows[index].userId;
        find(this.friend).then((res)=>{
            if(res.data.data.length==0){
                this.$message.warning("您与该成员不是好友关系，请先添加为好友！");
            }else{
                this.toUserId = rows[index].userId;
                this.goChat('0');
            }
        });
        this.friend.toUserId="";
    },
    //前往聊天页面
    goChat(type){
        findAndSave({userId:this.userId,toUserId:this.toUserId,type:type}).then((res)=>{
            this.$router.push({
          name: "message",
          params: { toUserId: this.toUserId },
        });
        });
    },
    //添加为好友
    addFriend(index,rows){
        if(rows[index].userId==this.userId){
            this.$message.warning("不能添加自己为好友!");
        }else{
            this.friend.toUserId = rows[index].userId;
        find(this.friend).then((res)=>{
            if(res.data.data.length!=0){
                this.$message.warning("您与该成员已是好友关系！");
            }else{
                this.friendRequest.userId = this.userId;
                this.friendRequest.toUserId = rows[index].userId;
                this.friendRequest.status = "0";
                this.friendRequest.page = 1;
                this.friendRequest.pageSize = 1;
                FriendRequestList(this.friendRequest).then((res)=>{
                    if(res.data.data.length!=0){
                        this.$message.warning("您已发送过好友请求！");
                    }else{
                        this.friendRequest.status = "";
                        this.friendRequest.insertDate = new Date();
                        saveFriendRequest(this.friendRequest).then((res)=>{
                            this.$message.success("发送请求成功");
                        });
                    }
                });
                this.friendRequest.insertDate = "";
            }
        })
        }
    },
    //打开dialog
    openDialog(command){
        if(command=="a"){
            this.addFriendDialog = true;
        }else{
            findAll(this.friend).then((res)=>{
                this.friends = res.data;
                this.addGroup.url = "";
                this.addGroupDialog = true;
            });
        }
    },
    //关闭dialog
    closeDialog(){
        this.userContent = "";
        this.userList = [];
        if(this.addFriendDialog == true){
            this.addFriendDialog = false;
        }
        if(this.addGroupDialog == true){
            this.addGroupDialog = false;
        }
        if(this.addGroupDialog2 == true){
            this.addGroupDialog2 = false;
        }
        if(this.categoryDialog == true){
            this.categoryDialog = false;
        }
        if(this.requestDialog == true){
            this.requestDialog = false;
        }
    },
    //查找用户
    findUser(){
        if(this.userContent=="" || this.userContent==null){
            this.$message.warning("请输入用户名、手机号或姓名后再点击查询");
        }else{
            findUser({content:this.userContent}).then((res)=>{
            this.userList = res.data.data;
        });
        }
    },
    //创建群组
    saveGroup(){
        this.addGroup.userId = this.userId;
        this.addGroupMember.forEach((index)=>{
            this.addGroup.userList.push(this.friends[index].userId);
        });
        saveGroup(this.addGroup).then((res)=>{
            this.$message.success("创建群组成功");
            this.addGroupDialog = false;
            this.loadAll();
        })
    },
    //打开添加群成员dialog
    add(){
        findElse({userId:this.userId,groupId:this.toUserId}).then((res)=>{
            this.friends2 = res.data;
        })
        this.addGroupDialog2 = true;
    },
    //添加群成员
    addMember(){
        this.addGroup.groupId = this.toUserId;
        this.addGroupMember2.forEach((index)=>{
            this.addGroup.userList.push(this.friends2[index].userId);
        });
        addGroupMember(this.addGroup).then((res)=>{
            this.$message.success("添加群成员成功");
            this.addGroupDialog2 = false;
            this.addGroup.groupId = "";
        })
    },
    //踢出群成员
    delMember(index,rows){
        delMember({userId:rows[index].userId,groupId:this.toUserId}).then((res)=>{
            this.$message.success("成功踢出该成员");
        })
    },
    //打开分组dialog
    openCategoryDialog(){
        this.categoryDialog = true;
    },
    //打开好友申请dialog
    openRequestDialog(){
        this.requestDialog = true;
    },
    //打开分组编辑dialog
    openCategoryEditDialog(index,rows){
        if(rows!='0'){
            this.categorys.categoryId = rows[index].categoryId;
            this.categorys.name = rows[index].name;
        }
        this.categorys.userId = this.userId;
        this.categoryEditDialog = true;
    },
    //关闭分组编辑dialog
    closeEditDialog(){
        this.categorys.categoryId = "";
        this.categorys.name = "";
        this.categoryEditDialog = false;
    },
    //修改或保存分组
    saveCategory(){
        saveOrUpdateCategory(this.categorys).then((res)=>{
            this.$message.success("保存成功");
            this.getCategoryList();
            this.loadAll();
            this.categoryEditDialog = false;
        });
        this.categorys={
            categoryId:"",
            name:""
        };
    },
    //删除分组
    delCategory(index,rows){
        delCategory({categoryId:rows[index].categoryId}).then((res)=>{
            this.$message.success("删除成功");
            this.getCategoryList();
            this.loadAll();
        })
    },
    //处理好友申请
    updateRequest(index,rows,status){
        updateRequest({id:rows[index].requestId,status:status}).then((res)=>{
            this.requestList();
            if(status==1){
                this.loadAll();
            }
        })
    },
    //搜索框搜索
    querySearchAsync(queryString, cb) {
        this.result = [];
        this.getFriendList.forEach((item) => {
          if (item.name.indexOf(queryString) !=-1) {
            this.result.push({
              value: item.name,
              toUserId: item.relationId,
              type:item.type,
            });
          }
        });
      cb(this.result);
    },
    //搜索框确认
    handleSelect(item){
        this.toUserId = item.toUserId;
        this.goChat(item.type);
    },
    //打开上传界面
    openInput() {
      $("#upload").click();
    },
    //上传文件
    upload(){
        const file = document.getElementById("upload").files[0];
        var fileName = file.name;
        let formData = new FormData();
        formData.append("file", file);
        putImg(formData).then((res) => {
            this.addGroup.url = res.data;
        });
    },
  },
};
</script>

<style scoped>

.above {
  width: 100%;
  height: 800px;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: rgb(247, 242, 242);
}

.el-row {
  margin-top: 20px;
}
.el-text {
  width: 100px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}
.el-input,
.el-select {
  width: 70%;
}

.searchItem{
    width:80%;
    height:40px;
    line-height:40px;
    box-shadow:2px 2px 5px #333333;
    border-radius:9px;
    margin-left: 3%;
    background-color: #FFF;
}

.userData{
    width: 50%;
    height: 70%;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .headImg{
    width: 50px;
    height: 50px;
    border-radius: 25px;
    float: left;
    margin-top: 5px;
    margin-left: 10px;
    box-shadow:10px 5px 18px #7D7D7D;
}
</style>