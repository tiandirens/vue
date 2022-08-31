<template>
  <div>
    <el-row :gutter="20" style="min-width: 1360px">
      <el-col :span="8">
        <div class="el-text">编号：</div>
        <el-input
          class="inline-input"
          clearable
          v-model="conference.conferenceId"
          placeholder="请输入会议编号"
          style="width: 300px"
        ></el-input>
      </el-col>
      <el-col :span="8">
        <div class="el-text">会议名称：</div>
        <el-input
          class="inline-input"
          clearable
          v-model="conference.conferenceName"
          placeholder="请输入会议名称"
          style="width: 300px"
        ></el-input>
      </el-col>
      <el-col :span="8">
        <div class="el-text">房间号：</div>
        <el-select v-model="conference.room" placeholder="请选择" clearable>
          <el-option
            v-for="item in rooms"
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
        <div class="el-text" style="width: 120px">状态：</div>
        <el-select v-model="conference.status" placeholder="请选择" clearable style="width: 300px">
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
      <el-col :span="8">
        <el-button type="primary" size="medium" @click="addConference">
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
      <el-table class="table" :data="conferenceList">
        <el-table-column label="编号" min-width="2">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.conferenceId }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="会议名称" min-width="2">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.conferenceName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="房间号" min-width="2">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.room }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="2">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === '0'"
              type="warning"
              size="mini"
              >未开始</el-button
            >
            <el-button
              v-else-if="scope.row.status === '1'"
              type="success"
              size="mini"
              >已开始</el-button
            >
            <el-button
              v-else-if="scope.row.status === '2'"
              type="danger"
              size="mini"
              >已结束</el-button
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
                  @click="editList(scope.$index, conferenceList)"
                ></el-button>
              </el-col>
              <el-col :span="10">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                  @click="del(scope.$index, conferenceList)"
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
    <el-dialog  title="添加" :visible.sync="conferenceDialog" @close="closeDialog">
        <el-form ref="form" :model="formList" label-width="80px" size="medium">
        <el-form-item label="会议名称">
            <el-input v-model="formList.conferenceName"></el-input>
        </el-form-item>
        <el-form-item label="房间号">
            <el-select v-model="formList.room" placeholder="请选择房间号">
                <el-option v-for="item in rooms" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
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
import { list,save,del } from "@/api/work/conference";
export default {
  data() {
    return {
      conferenceList: [],
      conference: {},
      pageSize: 10,
      currentPage: 1,
      totalElement: null,
      options:[
          {
            value:"0",
            label:"未开始"
          },
          {
            value:"1",
            label:"已开始"
          },
          {
            value:"2",
            label:"已结束"
          },
      ],
      conferenceDialog:false,
      formList:{
        conferenceName:"",
        room:"",
        timeList:[],
      },
      rooms:[
          {
              value:311,
              label:311
          },
          {
              value:312,
              label:312
          },
          {
              value:313,
              label:313
          },
          {
              value:314,
              label:314
          },
      ],
    };
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    //进入页面载入数据
    loadAll() {
      //获取列表信息
      this.conference.page = this.currentPage;
      this.conference.pageSize = this.pageSize;
      list(this.conference).then(
        (res) => {
          console.log(res);
          this.conferenceList = res.data.data;
          this.totalElement = res.data.totalCount;
        }
      );
    },
    //保存和修改
    save(){
      save(this.formList).then((res)=>{
        this.$message.success("保存成功");
        this.formList={
            conferenceId:"",
            conferenceName:"",
            room:"",
            beginTime:"",
            timeList:[],
        };
      })
      .catch(error=>{
          this.$message.waring("保存失败");
      });
      this.conferenceDialog = false;
      this.loadAll();
    },
    //删除
    del(index,rows){
      var conferenceId = rows[index].conferenceId;
      del({id:conferenceId}).then((res)=>{
        this.$message.success("删除成功");
        this.loadAll();
      });
    },
    //打开添加界面
    addConference(){
        this.conferenceDialog = true;
    },
    //关闭添加界面
    closeDialog(){
        this.conferenceDialog = false;
        this.formList={
            conferenceId:"",
            conferenceName:"",
            room:"",
            beginTime:"",
            timeList:[],
        };
    },
    //打开编辑页面
    editList(index,rows){
        var result = [];
        result.push(rows[index].beginTime);
        result.push(rows[index].endTime);
        this.formList={
            conferenceId:rows[index].conferenceId,
            conferenceName:rows[index].conferenceName,
            room:rows[index].room,
            timeList:result,
        },
        console.log(this.formList.timeList);
        this.conferenceDialog = true;
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