<template>
  <div>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="true"
      router
    >
      <el-menu-item @click="openDialog">
        <i class="el-icon-star-on"></i>
        <span slot="title">消息</span>
      </el-menu-item>
      <el-menu-item index="/message">
        <i class="el-icon-view"></i>
        <span slot="title">消息</span>
      </el-menu-item>

      <el-menu-item index="/document">
        <i class="el-icon-document"></i>
        <span slot="title">文档</span>
      </el-menu-item>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
        </template>
        <el-menu-item-group >
          <span slot="title">工作台</span>
          <el-menu-item index="/conference">会议</el-menu-item>
          <el-menu-item index="/log">日志</el-menu-item>
          <el-menu-item index="/approval">审批</el-menu-item>
          <el-badge :value="count" :max="99" style="width:180px">
            <el-menu-item index="/notice">公告</el-menu-item>
          </el-badge>
          <el-menu-item index="/task">任务</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-menu-item index="/contacts">
        <i class="el-icon-phone"></i>
        <span slot="title">联系人</span>
      </el-menu-item>
    </el-menu>
    <el-dialog  :visible.sync="dialog" @close="closeDialog" width="500px">
      <el-form>
        <img style="width:200px;height:200px;" :src="user.url" />
        <el-button type="primary" @click="openInput">头像上传</el-button>
        <input type="file" @change="upload" id="upload" style="display: none" ref="file">
        <el-form-item label="号码">
          <el-input v-model="user.phone" placeholder="请输入手机号" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="user.age" placeholder="请输入年龄" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="user.sex" placeholder="请输入性别" style="width:70%"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="save">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </el-dialog>
  </div>
</template>



<script>
import { getUserNotice,getUser,putImg,save } from "@/api/login/login";
export default {
  data() {
    return {
        userNotice:{},
        user:{},
        userId:"",
        count:"",
        dialog:false,
    };
  },
  mounted(){
    this.getUserId();
    this.getUserNotice();
  },
  methods: {
    //获取用户编号
    getUserId() {
      var userId = localStorage.getItem("userId");
      if (userId != "" && userId != null) {
        this.userId = userId;
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getUserNotice(){
      this.userNotice.userId = this.userId;
      this.userNotice.status = "0";
      this.userNotice.page = 1;
      this.userNotice.pageSize = 1000;
      getUserNotice(this.userNotice).then((res)=>{
        if(res.data.data.length!=0){
          this.count = res.data.data.length;
        }else{
          this.count = "";
        }
      });
    },
    //获取用户信息
    getUser(){
      getUser({id:this.userId}).then((res)=>{
        this.user = res.data;
      })
    },
    //打开dialog
    openDialog(){
      this.getUser();
      this.dialog = true;
    },
    //关闭dialog
    closeDialog(){
      this.dialog = false;
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
            this.user.url = res.data;
        });
    },
    //修改和保存
    save(){
      save(this.user).then((res)=>{
        this.$message.success("保存成功");
        this.dialog = false;
      })
    },
  },

};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>