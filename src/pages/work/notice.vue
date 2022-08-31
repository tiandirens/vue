<template>
  <div>
    <el-row :gutter="20" >
        <el-col :span="5" style="margin-left: 30%;">
        <el-autocomplete
                v-model="notice.title"
                :fetch-suggestions="getNotice"
                placeholder="请输入公告主题"
                :trigger-on-focus="false"
                hide-loading
                clearable
              ></el-autocomplete>
              <el-button type="primary" size="medium" @click="addNotice">
          <i class="el-icon-edit"></i>
          写公告
        </el-button>
      </el-col>
    </el-row>
    <el-row style="width: 95%">
      <div class="left" style="height: 700px; overflow: auto">
        <el-table class="table" :data="noticeList">
          <el-table-column label="公告主题" width="200">
            <template slot-scope="scope">
              <div
                slot="reference"
                class="name-wrapper"
                @click="get(scope.$index, noticeList)"
              >
                <span>{{ scope.row.title }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" width="250">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.dtCreate | dateFormat }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="150">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-popover placement="right" width="600" trigger="click">
                    <!-- <pre>{{content}}</pre> -->
                    <span v-html="content"></span>
                  <el-link
                    type="primary"
                    slot="reference"
                    @click="getContent(scope.$index, noticeList)"
                    >查看公告详情</el-link
                  >
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="rigth" style="height: 700px; overflow: auto">
        <el-table class="table" :data="notices">
          <el-table-column width="1500" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.dtCreate | dateFormat }}</span>
              <span
                ><h3><b>主题：</b></h3></span
              >
              <span>{{ scope.row.title }}</span>
              <span
                ><h3><b>内容：</b></h3></span
              >
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div> -->
    </el-row>
    
    <!-- 添加界面 -->
    <el-dialog title="添加" :visible.sync="noticeDialog" @opened="openWangEditor" @close="closeDialog">
      <el-form ref="form" :model="formList" label-width="130px" size="medium">
        <el-form-item label="公告主题">
          <el-input v-model="formList.title"></el-input>
        </el-form-item>
        <!-- <el-form-item label="公告内容">
          <el-input v-model="formList.content"></el-input>
        </el-form-item> -->
        <div id="div1"></div>
        <el-form-item size="large">
          <el-button type="primary" @click="save">立即创建</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { list, save,updateStatus } from "@/api/work/notice";
import E from "wangeditor"
export default {
  data() {
    return {
      noticeList: [],
      notice: {},
      userNoticeContact:{},
      notices: [],
      result: [],
      content:"",
      pageSize: 100,
      currentPage: 1,
      totalElement: null,
      noticeDialog: false,
      formList: {
        title: "",
        content: "",
        dtCreate: "",
      },
      userId: "",
    };
  },
  mounted() {
    this.getUserId();
    this.loadAll();
  },
  watch:{
      "notice.title":{
          handler(newVal,oldVal){
              if(newVal=="" || newVal==null){
                  this.noticeList = [];
                  this.notice.titleLike="";
                  this.loadAll();
              }
          }
      }
  },
  methods: {
    //获取用户编号
    getUserId() {
      var userId = localStorage.getItem("userId");
      if (userId != "" && userId != null) {
        this.userId = userId;
      }
    },
    //进入页面载入数据
    loadAll() {
      //获取列表信息
      this.notice.page = this.currentPage;
      this.notice.pageSize = this.pageSize;
      list(this.notice).then((res) => {
        if(this.notice.title=="" || this.notice.title==null){
            this.noticeList = res.data.data;
        } 
        this.totalElement = res.data.totalCount;
      });
    },
    //保存和修改
    save() {
      this.formList.userId = this.userId;
      save(this.formList)
        .then((res) => {
          this.$message.success("保存成功");
          this.loadAll();
          this.formList = {
            title: "",
            content: "",
            dtCreate: "",
          };
        })
        .catch((error) => {
          this.$message.waring("保存失败");
        });
      this.noticeDialog = false;
      this.loadAll();
    },
    //打开添加界面
    addNotice() {
      this.formList = {
        userId: this.userId,
      };
      this.noticeDialog = true;
    },
    //关闭添加界面
    closeDialog() {
      this.closeWangEditor();
      this.noticeDialog = false;
      this.formList = {
        title: "",
        content: "",
        dtCreate: "",
      };
    },

    //查询公告
    getNotice(queryString, cb) {
      this.result = [];
      this.notice.titleLike = "%" + this.notice.title + "%";
      this.notice.page = 1;
      this.notice.pageSize = 100;
      list(this.notice).then((res) => {
        if(res.data.data.length!=0){
            this.noticeList = res.data.data;
            this.loadAll();
        }
      });
      
    //   cb(this.result);
    },
    //查看公告详情
    getContent(index,rows){
        this.content = rows[index].content;
        this.userNoticeContact.userId = this.userId;
        this.userNoticeContact.noticeId = rows[index].noticeId;
        updateStatus(this.userNoticeContact).then((res)=>{
        });
    },

    openWangEditor() {
      //富文本
      const editor = new E("#div1");

      editor.config.onchange = (html) => {
        this.formList.content = html;
      };
      editor.create();
      if (this.formList.content != "" && this.formList.content != null) {
        editor.txt.html(this.formList.content);
      }
    },
    closeWangEditor() {
      //富文本
      $("#div1").empty();
    },
    // 修改页面显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadAll();
    },
    // 选中当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadAll();
    },
  },
};
</script>

<style scoped>
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
.left {
  float: left;
  border: 1px solid #a4a4a4;
  height: 750px;
  margin-left: 30%;
}
.rigth {
  float: right;
}
</style>