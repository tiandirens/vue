<template>
  <div>
    <el-row :gutter="20" style="min-width: 1360px">
      <el-col :span="8">
        <div class="el-text">审核编号：</div>
        <el-input
          class="inline-input"
          clearable
          v-model="approval.approvalId"
          placeholder="请输入审批编号"
          style="width: 300px"
        ></el-input>
      </el-col>
      <el-col :span="8">
        <div class="el-text">审批类型：</div>
        <el-select v-model="approval.approvalName" placeholder="请选择" clearable>
          <el-option
            v-for="item in approvalNames"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            style="width: 300px"
            clearable
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <div class="el-text">状态：</div>
        <el-select v-model="approval.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            style="width: 300px"
            clearable
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="min-width: 1360px">
      <el-col :span="8">
        <el-button type="primary" size="medium" @click="addApproval">
          添加
          <i class="el-icon-plus"></i>
        </el-button>
        <el-button type="primary" size="medium" >
          清空
          <i class="el-icon-delete"></i>
        </el-button>
        <el-button type="primary" size="medium" @click="loadAll">
          查询
          <i class="el-icon-search"></i>
        </el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-table class="table" :data="approvalList">
        <el-table-column label="审核编号" min-width="2">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.approvalId }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核类型" min-width="1">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.approvalName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" min-width="2">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="2">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.content }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="2">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === '0'"
              type="warning"
              size="mini"
              >待审核</el-button
            >
            <el-button
              v-else-if="scope.row.status === '1'"
              type="success"
              size="mini"
              >审核通过</el-button
            >
            <el-button
              v-else-if="scope.row.status === '2'"
              type="danger"
              size="mini"
              >未通过</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="开始时间" min-width="2">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.beginTime |dateFormat }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" min-width="2">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.endTime | dateFormat}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="操作" min-width="1">
          <template slot-scope="scope">
            <el-row :gutter="0" style="margin-top: 0">
              <el-col :span="10">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editList(scope.$index, approvalList)"
                ></el-button>
              </el-col>
              <el-col :span="10">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                  @click="del(scope.$index, approvalList)"
                ></el-button>
              </el-col>
              <el-col :span="10">
                <el-button
                  type="success"
                  icon="el-icon-success"
                  size="mini"
                  title="同意"
                  @click="updateStatus(scope.$index, approvalList,'1')"
                  v-if="user.power=='admin'"
                ></el-button>
              </el-col>
              <el-col :span="10">
                <el-button
                  type="info"
                  icon="el-icon-info"
                  size="mini"
                  title="拒绝"
                  @click="updateStatus(scope.$index, approvalList,'2')"
                  v-if="user.power=='admin'"
                ></el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog  title="添加" :visible.sync="approvalDialog" @close="closeDialog">
        <el-form ref="form" :model="formList" label-width="80px" size="medium">
        
        <el-form-item label="审核类型">
            <el-select v-model="formList.approvalName" placeholder="请输入审核类型">
                <el-option v-for="item in approvalNames" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="描述">
            <el-input v-model="formList.content"></el-input>
        </el-form-item>
        <el-form-item label="时间">
                <el-date-picker
                v-model="formList.timeList"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                style="width: 660px"
                >
                </el-date-picker>
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
import { list,save,del,getUser,updateStatus } from "@/api/work/approval";
export default {
  data() {
    return {
      approvalList: [],
      approval: {},
      pageSize: 10,
      currentPage: 1,
      totalElement: null,
      approvalNames:[
          {
              value:"请假",
              label:"请假"
          },
          {
              value:"出差",
              label:"出差"
          },
          {
              value:"外出",
              label:"外出"
          },
      ],
      options:[
          {
            value:"0",
            label:"待审核"
          },
          {
            value:"1",
            label:"审核通过"
          },
          {
            value:"2",
            label:"未通过"
          },
      ],
      approvalDialog:false,
      formList:{
            approvalId:"",
            userId:"",
            approvalName:"",
            content:"",
            timeList:[],
        },
        user:{},
      userId:"",
    };
  },
  mounted() {
    this.getUserId();
    this.loadAll();
  },
  methods: {
      //获取用户编号
      getUserId(){
          var userId = localStorage.getItem("userId");
          if(userId!="" && userId!=null){
              this.userId = userId;
          }
      },
    //进入页面载入数据
    loadAll() {
      //获取列表信息
      this.approval.page = this.currentPage;
      this.approval.pageSize = this.pageSize;
      this.approval.userId = this.userId;
      list(this.approval).then(
        (res) => {
          console.log(res);
          this.approvalList = res.data.data;
          this.totalElement = res.data.totalCount;
        }
      );
      getUser({id:this.userId}).then((res)=>{
        this.user = res.data;
      })
    },
    //保存和修改
    save(){
      this.formList.userId = this.userId;
      save(this.formList).then((res)=>{
        this.$message.success("保存成功");
        this.formList={
            approvalId:"",
            userId:"",
            approvalName:"",
            content:"",
            timeList:[],
        };
      })
      .catch(error=>{
          this.$message.waring("保存失败");
      });
      this.approvalDialog = false;
      this.loadAll();
    },
    //删除
    del(index,rows){
      var approvalId = rows[index].approvalId;
      del({id:approvalId}).then((res)=>{
        this.$message.success("删除成功");
        this.loadAll();
      });
    },
    //打开添加界面
    addApproval(){
        this.approvalDialog = true;
    },
    //关闭添加界面
    closeDialog(){
        this.approvalDialog = false;
        this.formList={
            approvalId:"",
            userId:"",
            approvalName:"",
            content:"",
            timeList:[],
        };
    },
    //打开编辑页面
    editList(index,rows){
        var result = [];
        result.push(rows[index].beginTime);
        result.push(rows[index].endTime);
        this.formList={
            approvalId:rows[index].approvalId,
            userId:rows[index].userId,
            approvalName:rows[index].approvalName,
            content:rows[index].content,
            timeList:result,
        },
        console.log(this.formList.timeList);
        this.approvalDialog = true;
    },
    //审批
    updateStatus(index,rows,status){
      updateStatus({id:rows[index].approvalId,status:status}).then((res)=>{
        if(status=='1'){
          this.$message.success("审批通过");
        }else{
          this.$message.success("审批已拒绝");
        };
        this.loadAll();
      })
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
</style>