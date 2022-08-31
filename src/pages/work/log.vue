<template>
  <div>
    <el-row :gutter="20" style="min-width: 1360px">
      <el-col :span="8">
        <el-tabs v-model="type" type="card" @tab-click="this.loadAll">
          <el-tab-pane label="全部" name="全部"></el-tab-pane>
          <el-tab-pane label="我发起的" name="我发起的"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:left">
        <el-button type="primary" size="medium" @click="addLog">
          <i class="el-icon-edit"></i>
          写日志
        </el-button>
        <el-popover placement="right" width="400" trigger="click">
          <el-form ref="form" :model="log" label-width="130px" size="medium">
            <el-form-item label="发送人">
              <el-autocomplete
                v-model="log.name"
                :fetch-suggestions="getUser"
                placeholder="请输入发送人名称"
                :trigger-on-focus="false"
                @select="handleSelect"
                clearable
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="log.beginTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="log.endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="log.dayType" size="small">
                <el-radio-button label="今天"></el-radio-button>
                <el-radio-button label="本周"></el-radio-button>
                <el-radio-button label="本月"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="日志模版">
              <el-select v-model="log.type" placeholder="请选择">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div style="text-align: center">
              <el-button type="primary" size="medium" @click="clear">
                清空
                <i class="el-icon-delete"></i>
              </el-button>
              <el-button type="primary" size="medium" @click="search">
                查询
                <i class="el-icon-search"></i>
              </el-button>
            </div>
          </el-form>
          <el-button slot="reference">筛选</el-button>
        </el-popover>
      </el-col>
    </el-row>
    <el-row style="width: 95%">
      <div class="left" style="height: 600px; ">
        <el-table class="table" :data="logList">
          <el-table-column width="120">
            <template slot-scope="scope">
              <!-- <div
                slot="reference"
                class="name-wrapper"
                @click="get(scope.$index, logList)"
              >
                <span>{{ scope.row.name }}</span>
              </div> -->
                  <el-link type="primary" @click="get(scope.$index, logList)" >{{ scope.row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column width="150">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.dtCreate | dateFormat }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="rigth" style="height: 700px; overflow: auto">
        <el-table class="table" :data="logs">
          <el-table-column width="1300" align="center">
            <template slot-scope="scope">
              <span
                ><h2>
                  <b>{{ scope.row.name }}的日报</b>
                </h2></span
              >
              <span>{{ scope.row.dtCreate | dateFormat }}</span>
              <span
                ><h3><b>今日完成工作：</b></h3></span
              >
              <span>{{ scope.row.workToday }}</span>
              <span
                ><h3><b>未完成工作：</b></h3></span
              >
              <span>{{ scope.row.workNot }}</span>
              <span
                ><h3><b>需协调工作：</b></h3></span
              >
              <span>{{ scope.row.workHelp }}</span
              ><br />
              <el-input
                v-model="commentLog.content"
                placeholder="请输入评论内容"
              ></el-input>
              <el-button
                type="primary"
                size="medium"
                @click="saveComment(scope.$index, logs)"
              >
                发送
              </el-button>

              <el-popover placement="right" width="400" trigger="click">
                <el-table class="table" :data="commentList">
                  <el-table-column width="400">
                    <template slot-scope="scope">
                      <span><b>{{ scope.row.name }}的评论</b></span><br />
                      <span
                        ><b>评论时间：</b>{{ scope.row.dtCreate | dateFormat }}</span
                      ><br />
                      <span><b>评论内容：</b>{{ scope.row.content }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-link
                  type="primary"
                  slot="reference"
                  @click="getCmoment(scope.$index, logs)"
                  >查看评论</el-link
                >
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <!-- 分页 -->
    <el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="10"
        :total="totalElement"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </el-row>
    <!-- 添加界面 -->
    <el-dialog title="添加" :visible.sync="logDialog" @close="closeDialog">
      <el-form ref="form" :model="formList" label-width="130px" size="medium">
        <el-form-item label="日志类型">
          <el-select v-model="formList.type" placeholder="请输入审核类型">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="今日完成工作" v-if="formList.type == '0'">
          <el-input v-model="formList.workToday"></el-input>
        </el-form-item>
        <el-form-item label="未完成的工作" v-if="formList.type == '0'">
          <el-input v-model="formList.workNot"></el-input>
        </el-form-item>
        <el-form-item label="需协调工作" v-if="formList.type == '0'">
          <el-input v-model="formList.workHelp"></el-input>
        </el-form-item>
        <el-form-item label="本周完成工作" v-if="formList.type == '1'">
          <el-input v-model="formList.workToday"></el-input>
        </el-form-item>
        <el-form-item label="下周工作计划" v-if="formList.type == '1'">
          <el-input v-model="formList.workNot"></el-input>
        </el-form-item>
        <el-form-item label="本周工作总结" v-if="formList.type == '1'">
          <el-input v-model="formList.workHelp"></el-input>
        </el-form-item>
        <el-form-item label="本月工作内容" v-if="formList.type == '2'">
          <el-input v-model="formList.workToday"></el-input>
        </el-form-item>
        <el-form-item label="本月工作总结" v-if="formList.type == '2'">
          <el-input v-model="formList.workNot"></el-input>
        </el-form-item>
        <el-form-item label="下月工作计划" v-if="formList.type == '2'">
          <el-input v-model="formList.workHelp"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="save">立即创建</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  save,
  getUser,
  getCommentList,
  saveComment,
} from "@/api/work/log";
export default {
  data() {
    return {
      logList: [],
      logs: [],
      log: {},
      user: {},
      commentLog: {
        logId: "",
        content: "",
        dtCreate: "",
        userId: "",
      },
      commentList: [],
      result: [],
      pageSize: 100,
      currentPage: 1,
      totalElement: null,
      types: [
        {
          value: "0",
          label: "日报",
        },
        {
          value: "1",
          label: "周报",
        },
        {
          value: "2",
          label: "月报",
        },
      ],
      type: "全部",
      logDialog: false,
      formList: {
        logId: "",
        userId: "",
        content: "",
        type: "",
        workToday: "",
        workNot: "",
        workHelp: "",
      },
      userId: "",
    };
  },
  mounted() {
    this.getUserId();
    this.loadAll();
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
      this.log.page = this.currentPage;
      this.log.pageSize = this.pageSize;
      if (this.type == "全部") {
        this.log.userId = "";
      } else {
        this.log.userId = this.userId;
      }
      list(this.log).then((res) => {
        this.logList = res.data.data;
        if (this.logs.length == 0) {
          this.logs = res.data.data;
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
          this.formList = {
            logId: "",
            userId: "",
            content: "",
            type: "",
            workToday: "",
            workNot: "",
            workHelp: "",
          };
        })
        .catch((error) => {
          this.$message.waring("保存失败");
        });
      this.logDialog = false;
      this.loadAll();
    },
    //删除
    del(index, rows) {
      var approvalId = rows[index].approvalId;
      del({ id: approvalId }).then((res) => {
        this.$message.success("删除成功");
        this.loadAll();
      });
    },
    //打开添加界面
    addLog() {
      this.formList = {
        type: "0",
        userId: this.userId,
      };
      this.logDialog = true;
    },
    //关闭添加界面
    closeDialog() {
      this.logDialog = false;
      this.formList = {
        logId: "",
        userId: "",
        content: "",
        type: "",
        workToday: "",
        workNot: "",
        workHelp: "",
      };
    },

    //查看日志详情
    get(index, rows) {
      this.log.logId = rows[index].logId;
      list(this.log).then((res) => {
        console.log(res);
        this.logs = res.data.data;
        this.log.logId = "";
        this.loadAll();
      });
    },
    //查询发送人
    getUser(queryString, cb) {
      this.result = [];
      this.user.nameLike = "%" + this.log.name + "%";
      this.user.page = 1;
      this.user.pageSize = 100;
      getUser(this.user).then((res) => {
        res.data.data.forEach((item) => {
          if (this.result.indexOf(item.name) === -1) {
            this.result.push({
              value: item.name,
              userId: item.userId,
            });
          }
        });
      });
      cb(this.result);
    },
    search() {
      this.log.page = 1;
      this.log.pageSize = 100;
      list(this.log).then((res) => {
        this.logList = res.data.data;
        if (this.logs.length == 0) {
          this.logs = res.data.data;
        }
        this.totalElement = res.data.totalCount;
      });
    },
    //清空数据
    clear() {
      this.log = {
        name: "",
        userId: "",
        beginTime: "",
        endTime: "",
        type: "",
      };
    },
    //确认发送人
    handleSelect(item) {
      this.log.userId = item.userId;
    },
    //查看该日志下所有评论
    getCmoment(index, rows) {
      this.commentLog.logId = rows[index].logId;
      this.commentLog.content = "";
      this.commentLog.page = 1;
      this.commentLog.pageSize = 1000;
      getCommentList(this.commentLog).then((res) => {
        this.commentList = res.data.data;
      });
    },
    //保存评论
    saveComment(index, rows) {
      this.commentLog.userId = this.userId;
      this.commentLog.logId = rows[index].logId;
      this.commentLog.dtCreate = new Date();
      saveComment(this.commentLog).then((res) => {
        this.$message.success("评论成功");
        this.commentLog = {
          logId: "",
          content: "",
          dtCreate: "",
          userId: "",
        };
      });
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
  border:1px solid #A4A4A4;
  height: 700px;
}
.rigth {
  float: left;
  margin-left: 5%;
  
}
</style>