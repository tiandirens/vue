<template>
  <div class="login">
    <div class="broder">
      <el-form
        :model="user"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="margin-top: 20%;"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="user.username"
            autocomplete="off"
            style="width:70%"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            type="password"
            v-model="user.password"
            autocomplete="off"
            style="width:70%"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="openDialog">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
      <el-dialog  :visible.sync="dialog" @close="closeDialog" width="400px">
        <el-form
        :model="formList"
        >
            <el-form-item label="用户名" >
            <el-input
              v-model="formList.username"
              autocomplete="off"
              style="width:70%;float:right;margin-right:5%"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="formList.password"
              type="password"
              autocomplete="off"
              style="width:70%;float:right;margin-right:5%"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input
              v-model="formList.password2"
              type="password"
              autocomplete="off"
              style="width:70%;float:right;margin-right:5%"
              placeholder="请再输入一次密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" >
            <el-input
              v-model="formList.name"
              autocomplete="off"
              style="width:70%;float:right;margin-right:5%"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" >
            <el-input
              v-model="formList.phone"
              autocomplete="off"
              style="width:70%;float:right;margin-right:5%"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="年龄" >
            <el-input
              v-model="formList.age"
              autocomplete="off"
              style="width:70%;float:right;margin-right:5%"
              placeholder="请输入年龄"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" >
            <el-select v-model="formList.sex" style="width:70%;float:right;margin-right:5%">
              <el-option value="男">男</el-option>
              <el-option value="女">女</el-option>
            </el-select>
          </el-form-item>
        </el-form>
            <el-button type="primary" @click="save">确认</el-button>
            <el-button @click="closeDialog">取消</el-button>
      </el-dialog>
  </div>
  
</template>

<script>
import {
  login,save,list
} from "@/api/login/login";
export default {
  data() {
    return {
      user: {},
      find:{},
      formList:{
        username:"",
        password:"",
        password2:"",
        name:"",
        phone:"",
        age:"",
        sex:"",
        status:"",
      },
      dialog:false,
    };
  },
  methods: {
    login(){
      if(this.user.username=="" || this.user.username==null){
        this.$message.warning("用户名不能为空");
      }else if(this.user.password=="" || this.user.password==null){
        this.$message.warning("密码不能为空");
      }else{
          login(this.user).then((res)=>{
          if(res.status=="200"){
            if(res.data.msg=="success"){
              localStorage.setItem("userId", res.data.data);
              this.$router.push("/message");
            }
            this.$message.success(res.data.msg);
          }
      });
      }
      
    },
    //注册用户
    save(){
      if(this.formList.username=="" || this.formList.username==null){
        this.$message.warning("用户名不能为空");
      }else if(this.formList.password=="" || this.formList.password==null){
        this.$message.warning("密码不能为空");
      }else if(this.formList.name=="" || this.formList.name==null){
        this.$message.warning("姓名不能为空");
      }else if(this.formList.password!=this.formList.password2){
        this.$message.warning("两次输入的密码不一致");
      }else{
        this.find.username = this.formList.username;
        this.find.page = 1;
        this.find.pageSize = 10;
        list(this.find).then((res)=>{
          if(res.data.data.length==0){
              this.formList.status="1";
          save(this.formList).then((res)=>{
            this.$message.success("注册成功");
            this.dialog = false;
            this.formList={
              username:"",
              password:"",
              password2:"",
              name:"",
              phone:"",
              age:"",
              sex:"",
            }
          });
          }else{
            this.$message.warning("该用户名已存在");
          }
        });
        
      }
      
    },
    //打开注册dialog
    openDialog(){
      this.formList={
          username:"",
          password:"",
          password2:"",
          name:"",
          phone:"",
          age:"",
          sex:"",
        }
      this.dialog = true;
    },
    //关闭dialog
    closeDialog(){
      this.dialog = false;
    }

  },
};
</script>

<style scoped>

.login {
  width: 30%;
  height: 1000px;
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.broder{
  background-color: rgb(238, 241, 248);
  width: 500px;
  height: 400px;
}
</style>
