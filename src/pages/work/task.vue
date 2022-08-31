<template>
  <div>
    <el-row style="width: 95%">
      <div class="left" style="height: 700px; overflow: auto">
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          :collapse="false"
        >
          <el-menu-item index="1" @click="get(1)">
            <span slot="title">我的待办</span>
          </el-menu-item>
          <el-menu-item index="2" @click="get(2)">
            <span slot="title">我的已办</span>
          </el-menu-item>
          <el-menu-item index="3" @click="get(3)">
            <span slot="title">我创建的</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="rigth" style="height: 700px;width:1400px">
        <div>
          <span v-if="index == 1"><b><h3>我的待办</h3></b></span>
          <el-button type="primary" v-if="index == 1" @click="taskDialog=true">添加</el-button>
          <el-tabs v-model="activeName" @tab-click="handleClick" v-if="index == 1">
            <el-tab-pane label="所有" name="所有"></el-tab-pane>
            <el-tab-pane label="缺陷" name="缺陷"></el-tab-pane>
            <el-tab-pane label="需求" name="需求"></el-tab-pane>
          </el-tabs>

          <span v-if="index == 2"><b><h3>我的已办</h3></b></span>
          <el-button type="primary" v-if="index == 2" @click="taskDialog=true">添加</el-button>
          <el-tabs v-model="activeName" @tab-click="handleClick" v-if="index == 2">
            <el-tab-pane label="缺陷" name="缺陷"></el-tab-pane>
            <el-tab-pane label="需求" name="需求"></el-tab-pane>
          </el-tabs>

          <span v-if="index == 3"><b><h3>我创建的</h3></b></span>
          <el-button type="primary" v-if="index == 3" @click="taskDialog=true">添加</el-button>
          <el-tabs v-model="activeName" @tab-click="handleClick" v-if="index == 3">
            <el-tab-pane label="所有" name="所有"></el-tab-pane>
            <el-tab-pane label="缺陷" name="缺陷"></el-tab-pane>
            <el-tab-pane label="需求" name="需求"></el-tab-pane>
          </el-tabs>

          <el-table class="table" :data="taskList">
            <el-table-column label="" width="150">
              <template slot-scope="scope">
                  <el-tag
                    v-if="scope.row.type === '0'"
                    type="danger"
                    effect="dark">
                    BUG
                </el-tag>
                <el-tag
                    v-if="scope.row.type === '1'"
                    effect="dark">
                    STORY
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="标题" min-width="5">
              <template slot-scope="scope">
                <el-popover placement="right" width="600" trigger="click">
                  <el-form :inline="true">
                    <el-form-item label="标题：">
                      <el-link :underline="false" v-if="taskNameBool" @click="taskNameBool=false">{{scope.row.taskName?scope.row.taskName:"--"}}</el-link>
                        <el-input v-model="taskName" v-if="!taskNameBool"  @blur="saveTaskName(scope.$index,taskList)"></el-input>
                    </el-form-item><br>
                    <span><b>基本信息</b></span><br>
                    <el-form-item label="状态：">
                  <el-popover placement="right" width="600" trigger="click">

                    <div>
                          <div style="float:left">
                            <el-button size="mini" round v-if="scope.row.status=='0' || scope.row.status === '6'" @click="updateStatus(scope.$index,taskList,1)">已接受</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='0' || scope.row.status=='1' || scope.row.status=='5' || scope.row.status=='6'" @click="updateStatus(scope.$index,taskList,2)">已解决</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='0' || scope.row.status=='1' || scope.row.status=='5' || scope.row.status === '6'" @click="updateStatus(scope.$index,taskList,4)">已拒绝</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='1' || scope.row.status=='2' || scope.row.status=='4' || scope.row.status=='5'" @click="updateStatus(scope.$index,taskList,6)">延期处理</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='2' || scope.row.status=='4' || scope.row.status === '6' || scope.row.status=='7'" @click="updateStatus(scope.$index,taskList,5)">重新激活</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='2' || scope.row.status=='4' || scope.row.status=='5' || scope.row.status=='6'" @click="updateStatus(scope.$index,taskList,7)">已关闭</el-button>

                          </div>
                          <div style="float:left">
                              <el-form ref="form" label-width="120px" size="medium">
                                <el-form-item label="处理人" v-if="scope.row.status=='0' || scope.row.status=='1' || scope.row.status === '2' || scope.row.status=='4' || scope.row.status=='5' || scope.row.status === '7'">
                                    <el-input v-model="task.type"></el-input>
                                </el-form-item>
                                <el-form-item label="评论">
                                    <el-input type="textarea" v-model="commentTask.content" style="width:300px"></el-input><br>
                                <el-button size="mini" type="primary" @click="saveCommentTask(scope.$index,taskList)">确认</el-button>

                                </el-form-item>
                            </el-form>
                          </div>
                      </div>

                    <el-button
                    v-if="scope.row.status === '0'"
                    size="mini"
                    round
                    slot="reference"
                    >新</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '1'"
                    size="mini"
                    round
                    slot="reference"
                    >已接受</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '2'"
                    size="mini"
                    round
                    slot="reference"
                    >已解决</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '3'"
                    size="mini"
                    round
                    slot="reference"
                    >测试中</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '4'"
                    size="mini"
                    round
                    slot="reference"
                    >已拒绝</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '5'"
                    size="mini"
                    round
                    slot="reference"
                    >重新激活</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '6'"
                    size="mini"
                    round
                    slot="reference"
                    >延期处理</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '7'"
                    size="mini"
                    round
                    slot="reference"
                    >已关闭</el-button
                  >
                  </el-popover>
                    </el-form-item>
                    <el-form-item label="优先级：">
                        <el-popover placement="right" width="100" trigger="click">
                  <el-button size="mini" @click="updatePriority(scope.$index,taskList,0)">--</el-button><br />
                  <el-button type="info" size="mini" @click="updatePriority(scope.$index,taskList,1)">低</el-button><br />
                  <el-button type="success" size="mini" @click="updatePriority(scope.$index,taskList,2)">中</el-button><br />
                  <el-button type="danger" size="mini" @click="updatePriority(scope.$index,taskList,3)">高</el-button><br />
                  <el-button type="danger" size="mini" @click="updatePriority(scope.$index,taskList,4)">紧急</el-button><br />
                  <el-button type="info" size="mini" @click="updatePriority(scope.$index,taskList,5)">无关紧要</el-button>

                  <el-button
                    v-if="scope.row.priority === '0'"
                    size="mini"
                    slot="reference"
                    >--</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '1'"
                    type="info"
                    size="mini"
                    slot="reference"
                    >低</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '2'"
                    type="success"
                    size="mini"
                    slot="reference"
                    >中</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '3'"
                    type="danger"
                    size="mini"
                    slot="reference"
                    >高</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '4'"
                    type="danger"
                    size="mini"
                    slot="reference"
                    >紧急</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '5'"
                    type="info"
                    size="mini"
                    slot="reference"
                    >无关紧要</el-button
                  >
                </el-popover>
                    </el-form-item>
                    <el-form-item label="处理人：">
                        <el-link :underline="false" v-if="nameBoll" type="primary" @click="nameBoll=false,taskId=scope.row.taskId">{{scope.row.name?scope.row.name:"--"}}</el-link>
                        <el-autocomplete v-model="name" v-if="!nameBoll" :fetch-suggestions="getUser" @blur="changeNameBoll" placeholder="请输入处理人姓名" @select="handleSelect"></el-autocomplete>
                        <el-popover placement="right" width="300" trigger="click">
                            <el-table class="table" :data="userTaskList">
                                <el-table-column label="处理人" width="150">
                                  <template  slot-scope="scope">
                                      <span>{{ scope.row.name }}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column label="操作" width="100">
                                  <template  slot-scope="scope">
                                      <el-button
                                        type="danger"
                                        icon="el-icon-delete"
                                        size="mini"
                                        title="删除"
                                        @click="del(scope.$index, userTaskList)"
                                      ></el-button>
                                  </template>
                                </el-table-column>
                            </el-table>
                            <el-button slot="reference" v-if="nameBoll" type="danger" icon="el-icon-delete" @click="getUserTaskList(scope.$index,taskList)" circle></el-button>
                        </el-popover>
                    </el-form-item><br>
                    <span><b>描述</b></span><el-link :underline="false" @click="open(scope.$index,taskList)"><i class="el-icon-edit"></i>编辑</el-link><br><br>
                    <span v-if="contentBoll" v-html="content"></span>
                    <!-- <div v-if="!contentBoll"> -->
                      <div id="div1" v-if="!contentBoll">
                        
                      </div>
                    <!-- </div> -->
                    
                    <el-button type="primary" v-if="!contentBoll" @click="saveContent(scope.$index,taskList)">确认</el-button>
                    <el-button v-if="!contentBoll" @click="closeWangEditor">取消</el-button>
                  </el-form>
                  <el-link type="primary" slot="reference" @click="setContent(scope.$index,taskList)">{{ scope.row.taskName?scope.row.taskName:"--" }}</el-link>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="2">
              <template slot-scope="scope">
                  <el-popover placement="right" width="600" trigger="click">
                      <div>
                          <div style="float:left">
                            <el-button size="mini" round v-if="scope.row.status=='0' || scope.row.status === '6'" @click="updateStatus(scope.$index,taskList,1)">已接受</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='0' || scope.row.status=='1' || scope.row.status=='5' || scope.row.status=='6'" @click="updateStatus(scope.$index,taskList,2)">已解决</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='0' || scope.row.status=='1' || scope.row.status=='5' || scope.row.status === '6'" @click="updateStatus(scope.$index,taskList,4)">已拒绝</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='1' || scope.row.status=='2' || scope.row.status=='4' || scope.row.status=='5'" @click="updateStatus(scope.$index,taskList,6)">延期处理</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='2' || scope.row.status=='4' || scope.row.status === '6' || scope.row.status=='7'" @click="updateStatus(scope.$index,taskList,5)">重新激活</el-button><br />
                            <el-button size="mini" round v-if="scope.row.status=='2' || scope.row.status=='4' || scope.row.status=='5' || scope.row.status=='6'" @click="updateStatus(scope.$index,taskList,7)">已关闭</el-button>

                          </div>
                          <div style="float:left">
                              <el-form ref="form" label-width="120px" size="medium">
                                <el-form-item label="处理人" v-if="scope.row.status=='0' || scope.row.status=='1' || scope.row.status === '2' || scope.row.status=='4' || scope.row.status=='5' || scope.row.status === '7'">
                                    <el-input v-model="task.type"></el-input>
                                </el-form-item>
                                <el-form-item label="评论">
                                    <el-input type="textarea" v-model="commentTask.content" style="width:300px"></el-input><br>
                                <el-button size="mini" type="primary" @click="saveCommentTask(scope.$index,taskList)">确认</el-button>

                                </el-form-item>
                            </el-form>
                          </div>
                      </div>
                      
                      <el-button
                    v-if="scope.row.status === '0'"
                    size="mini"
                    round
                    slot="reference"
                    >新</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '1'"
                    size="mini"
                    round
                    slot="reference"
                    >已接受</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '2'"
                    size="mini"
                    round
                    slot="reference"
                    >已解决</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '3'"
                    size="mini"
                    round
                    slot="reference"
                    >测试中</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '4'"
                    size="mini"
                    round
                    slot="reference"
                    >已拒绝</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '5'"
                    size="mini"
                    round
                    slot="reference"
                    >重新激活</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '6'"
                    size="mini"
                    round
                    slot="reference"
                    >延期处理</el-button
                  >
                  <el-button
                    v-else-if="scope.row.status === '7'"
                    size="mini"
                    round
                    slot="reference"
                    >已关闭</el-button
                  >
                  </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="优先级" min-width="2">
              <template slot-scope="scope">
                <el-popover placement="right" width="100" trigger="click">
                  <el-button size="mini" @click="updatePriority(scope.$index,taskList,0)">--</el-button><br />
                  <el-button type="info" size="mini" @click="updatePriority(scope.$index,taskList,1)">低</el-button><br />
                  <el-button type="success" size="mini" @click="updatePriority(scope.$index,taskList,2)">中</el-button><br />
                  <el-button type="danger" size="mini" @click="updatePriority(scope.$index,taskList,3)">高</el-button><br />
                  <el-button type="danger" size="mini" @click="updatePriority(scope.$index,taskList,4)">紧急</el-button><br />
                  <el-button type="info" size="mini" @click="updatePriority(scope.$index,taskList,5)">无关紧要</el-button>

                  <el-button
                    v-if="scope.row.priority === '0'"
                    size="mini"
                    slot="reference"
                    >--</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '1'"
                    type="info"
                    size="mini"
                    slot="reference"
                    >低</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '2'"
                    type="success"
                    size="mini"
                    slot="reference"
                    >中</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '3'"
                    type="danger"
                    size="mini"
                    slot="reference"
                    >高</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '4'"
                    type="danger"
                    size="mini"
                    slot="reference"
                    >紧急</el-button
                  >
                  <el-button
                    v-else-if="scope.row.priority === '5'"
                    type="info"
                    size="mini"
                    slot="reference"
                    >无关紧要</el-button
                  >
                  <el-button
                    v-else
                    type="info"
                    size="mini"
                    slot="reference"
                    >--</el-button
                  >
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="预计结束" min-width="2">
              <template slot-scope="scope">
                <el-popover placement="right" width="300" trigger="click">
                  <el-date-picker
                    v-model="formList.endTime"
                    type="datetime"
                    @change="saveEndTime(scope.$index,taskList)"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    >
                  </el-date-picker>
                  <el-link :underline="false" slot="reference" >{{ scope.row.endTime | dateFormat }}</el-link>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
    <el-dialog title="添加" :visible.sync="taskDialog" @opened="openWangEditor2" @close="closeDialog">
      <el-form ref="form" :model="formList"  label-width="130px" size="medium">
        <el-form-item label="标题：" >
          <el-input v-model="formList.taskName" placeholder="输入标题"></el-input>
        </el-form-item>
        <el-form-item label="类型：" >
           <el-select v-model="formList.type" placeholder="请选择">
             <el-option label="缺陷" value="0"></el-option>
             <el-option label="需求" value="1"></el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="预计结束时间：" >
           <el-date-picker
              v-model="formList.endTime"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              >
            </el-date-picker>
        </el-form-item>
        <div id="div2"></div>
        <el-form-item size="large">
          <el-button type="primary" @click="save">立即创建</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { list,saveOrUpdate,updateStatus,updatePriority,saveCommentTask,saveUsertaskcontact,getUser,listUserTask,del } from "@/api/work/task";
import E from "wangeditor";
export default {
  data() {
    return {
      index: "1",
      activeName: "所有",
      taskList: [],
      userTaskList:[],
      task: {
        taskId: "",
        taskName: "",
        content: "",
        taskStatus: "",
        status: "",
        priority: "",
        userId: "",
        index:"",
      },
      taskName:"",
      taskNameBool:true,
      nameBoll:true,
      contentBoll:true,
      user:{},
      result:[],
      name:"",
      commentTask:{},
      content:"",
      userTaskContact:{
        userId:"",
        taskId:""
      },
      taskId:"",
      pageSize: 100,
      currentPage: 1,
      totalElement: null,
      taskDialog: false,
      formList: {
        taskId: "",
        taskName: "",
        content: "",
        taskStatus: "",
        status: "",
        priority: "",
        userId: "",
        dtCreate:"",
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
      this.task.page = this.currentPage;
      this.task.pageSize = this.pageSize;
      this.task.userId = this.userId;
      this.task.index = this.index;
      list(this.task).then((res) => {
        this.taskList = res.data.data;
        this.totalElement = res.data.totalCount;
      });
    },
    //保存和修改
    save() {
      this.formList.userId = this.userId;
      saveOrUpdate(this.formList)
        .then((res) => {
          this.$message.success("保存成功");
          this.loadAll();
          this.taskNameBool = true;
          this.taskDialog = false;
          this.formList = {
            taskId: "",
            taskName: "",
            content: "",
            taskStatus: "",
            status: "",
            priority: "",
            userId: "",
            dtCreate:"",
          };
        })
        .catch((error) => {
          this.$message.waring("保存失败");
        });
      
    },
    
    //导航栏选择
    get(index) {
      this.index = index;
      this.loadAll();
    },
    //标签框选择
    handleClick(tab, event) {
      if(tab.name=="所有"){
        this.task.type = "";
      }else if(tab.name=="缺陷"){
        this.task.type = "0";
      }else{
        this.task.type = "1";
      }
      this.loadAll();
    },

    //修改状态
    updateStatus(index,rows,status){
      updateStatus({id:rows[index].taskId,status:status}).then((res)=>{
        this.loadAll();
      });
    },
    //修改状优先级
    updatePriority(index,rows,priority){
      updatePriority({id:rows[index].taskId,priority:priority}).then((res)=>{
        this.loadAll();
      });
    },

    //添加评论
    saveCommentTask(index,rows){
        this.commentTask.taskId = rows[index].taskId;
        this.commentTask.userId = this.userId;
        this.commentTask.dtCreate = new Date();
        saveCommentTask(this.commentTask).then((res)=>{
          this.$message.success("评论成功");
        });
    },
    //设置标题
    setContent(index,rows){
      this.taskNameBool = true;
      this.closeWangEditor();
      this.taskName = rows[index].taskName;
      this.content = rows[index].content;
    },
    //保存标题
    saveTaskName(index,rows){
      this.formList = rows[index];
      this.formList.taskName = this.taskName;
      this.save();
    },
    //查询处理人
    getUser(queryString, cb) {
      if(this.name!="" && this.name!=null){
      this.result = [];
      this.user.nameLike = "%" + this.name+ "%";
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
      }
      
    },
    //选中处理人
    handleSelect(item){
      console.log(item);
      this.userTaskContact.userId = item.userId;
      this.userTaskContact.taskId = this.taskId;
      saveUsertaskcontact(this.userTaskContact).then((res)=>{
        this.loadAll();
        this.nameBoll = true;
        this.userTaskContact.userId = "";
        this.userTaskContact.taskId="";
        this.name = "";
        this.taskId="";

      });
    },
    //获取处理人列表
    getUserTaskList(index,rows){
        this.userTaskContact.taskId = rows[index].taskId;
        this.userTaskContact.page = 1;
        this.userTaskContact.pageSize = 100;
        listUserTask(this.userTaskContact).then((res)=>{
          this.userTaskList = res.data.data;
        });
    },
    //删除处理人
    del(index,rows){
      var id = rows[index].userId;
      var taskId = rows[index].taskId;
      del({userId:id,taskId:taskId}).then((res)=>{
        this.loadAll();
        this.$message.success("删除成功");
      })
    },
    //输入框失去焦点时触发
    changeNameBoll(){
      if(this.name==""){
        this.nameBoll = true;
      }
    },
    open(index,rows){
        this.contentBoll = false;
        this.openWangEditor(index,rows);
    },
    openWangEditor(index,rows) {
      //富文本
      const editor = new E("#div1");
      editor.config.onchange = (html) => {
        this.formList.content = html;
      };
      editor.create();
      if (rows[index].content != "" && rows[index].content != null) {
        editor.txt.html(rows[index].content);
      }
    },
    closeWangEditor() {
      this.contentBoll = true;
      //富文本
      $("#div1").empty();
    },
    //保存内容
    saveContent(index,rows){
        this.formList.taskId = rows[index].taskId;
        this.formList.taskName = rows[index].taskName;
        this.formList.taskStatus = rows[index].taskStatus;
        this.formList.status = rows[index].status;
        this.formList.priority = rows[index].priority;
        this.content = this.formList.content;
        this.save();
        this.contentBoll = true;
    },
    //保存结束时间
    saveEndTime(index,rows){
      this.formList.taskId = rows[index].taskId;
      this.formList.taskName = rows[index].taskName;
      this.formList.taskStatus = rows[index].taskStatus;
      this.formList.status = rows[index].status;
      this.formList.priority = rows[index].priority;
      this.formList.content = rows[index].content;
      this.save();
    },
   

   //关闭添加界面
    closeDialog() {
      this.closeWangEditor2();
      this.taskDialog = false;
      this.formList = {
        taskId: "",
        taskName: "",
        content: "",
        taskStatus: "",
        status: "",
        priority: "",
        userId: "",
        dtCreate:"",
      };
    },
    openWangEditor2() {
      //富文本
      const editor = new E("#div2");
      editor.config.onchange = (html) => {
        this.formList.content = html;
      };
      editor.create();
    },
    closeWangEditor2() {
      this.contentBoll = true;
      //富文本
      $("#div2").empty();
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
}
.rigth {
  float: left;
  margin-left: 2%;
}
</style>