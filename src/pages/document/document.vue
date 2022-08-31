<template>
    <el-container>
        <el-aside width="18%" style="position:relative;"> 
            <div>
                <div class="searchItem"> 
                    <el-autocomplete
                    v-model="state"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="搜索"
                    @select="handleSelect"
                    style="width:270px"
                    ></el-autocomplete>
                </div><br><br>
                <span style="float:left"><b>云盘</b></span><br><br>
                <el-row>

                </el-row>
                <el-tree :data="documentTree" :props="defaultProps" @node-click="handleNodeClick">
                                <span slot-scope="{ node}">
                                    <span>{{ node.label }}</span>
                                </span>
                            </el-tree>
            </div>
        </el-aside>
        <el-main >
            <div class="above">
                <span v-if="type=='1'"><h1><b>企业盘</b></h1></span>
                <span v-if="type=='0'"><h1><b>私有盘</b></h1></span>
                <span v-if="type==''"><h1><b>回收站</b></h1></span>
                <el-button  type="primary" style="float:left" @click="openInput">上传文件</el-button>
                <input type="file" @change="upload" id="upload" style="display: none" ref="file">
                <el-table :data="documentList">
                    <el-table-column label="名称" min-width="5">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                            <span>{{ scope.row.fileName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建者" min-width="2">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                            <span>{{ scope.row.name}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="上传时间" min-width="2">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                            <span>{{ scope.row.uploadTime | dateFormat}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" min-width="1">
                        <template slot-scope="scope">
                            <el-row :gutter="0" style="margin-top: 0">
                            <el-col :span="10">
                                <el-button
                                type="primary"
                                icon="el-icon-download"
                                size="mini"
                                @click="download(scope.$index, documentList)"
                                ></el-button>
                            </el-col>
                            <el-col :span="10">
                                <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                title="删除"
                                @click="updateStatus(scope.$index, documentList,'0')"
                                v-if="type!=''"
                                ></el-button>
                                <el-button
                                type="success"
                                icon="el-icon-refresh"
                                size="mini"
                                title="恢复"
                                @click="updateStatus(scope.$index, documentList,'1')"
                                v-if="type==''"
                                ></el-button>
                            </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </el-main>
    </el-container>
</template>
<script>
import { list,updateStatus,randomUUID,download,putFile } from "@/api/document/document";
export default {
    data(){
        return{
            documentTree:[
                {
                    label:"企业盘",
                    type:"0",
                },
                {
                    label:"私有盘",
                    type:"0",
                },
                {
                    label:"回收站",
                    children: [{
                    label: '企业盘',
                    type:"1",
                    },
                    {
                        label:"私有盘",
                        type:"1",
                    }]
                },
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            document:{},
            documentList:[],
            fileList:[],
            result:[],
            state:"",
            status:"1",
            userId:"",
            type:"0",
        }
    },
    created() {
      this.getUserId();
    },
    mounted(){
        this.loadAll();
    },
    methods:{
        //获取用户编号
        getUserId() {
            var userId = localStorage.getItem("userId");
            if (userId != "" && userId != null) {
                this.userId = userId;
            }
        },
        //列表查询
        loadAll(){
            if(this.type=="0"){
                this.document.userId = this.userId;
            }else{
                this.document.userId = "";
            }
            this.document.status = this.status;
            this.document.type = this.type;
            list(this.document).then((res)=>{
                this.documentList = res.data.data;
            });
            this.document.status = "1";
            this.document.type = "";
            this.document.userId = "";
            list(this.document).then((res)=>{
                this.fileList = res.data.data;
            })
        },
        //删除文件
        updateStatus(index,rows,status){
            updateStatus({id:rows[index].documentId,status:status}).then((res)=>{
                this.$message.success("删除成功");
                this.loadAll();
            })
        },
        //下载文件
        download(index,rows){
            randomUUID({fileName:rows[index].path}).then((res)=>{
                if(res.data!="" && res.data!=null){
                    window.open("http://121.40.171.145:8087/upload/download?key="+res.data);
                }
            });
        },
        //上传文件
        upload(){
            const file = document.getElementById("upload").files[0];
            var fileName = file.name;
            let formData = new FormData();
            formData.append("file", file);
            formData.append("userId",this.userId);
            formData.append("type",this.type);
            putFile(formData).then((res) => {
                this.loadAll();
            });
        },
        //打开上传界面
        openInput() {
        $("#upload").click();
        },
        //树切换
        handleNodeClick(data){
            console.log(data);
            if(data.label == '企业盘' &&  data.type=='0'){
                this.type = "1";
                this.status = "1";
            }else if(data.label == '私有盘' &&  data.type=='0'){
                this.type = "0";
                this.status = "1";
            }else if(data.label == '企业盘' &&  data.type=='1'){
                this.type = "1";
                this.status = "0";
            }else if(data.label == '私有盘' &&  data.type=='1'){
                this.type = "0";
                this.status = "0";
            }
            this.loadAll();
        },
        //搜索框搜索
        querySearchAsync(queryString, cb) {
            this.result = [];
            this.fileList.forEach((item) => {
            if (item.fileName.indexOf(queryString) !=-1) {
                this.result.push({
                value: item.fileName,
                path: item.path,
                });
            }
            });
            cb(this.result);
        },
        //搜索框确认
        handleSelect(item){
           randomUUID({fileName:item.path}).then((res)=>{
                if(res.data!="" && res.data!=null){
                    window.open("http://121.40.171.145:8087/upload/download?key="+res.data);
                }
            });
        },
    },
}
</script>

<style scoped>
.searchItem{
    width:80%;
    height:40px;
    line-height:40px;
    box-shadow:2px 2px 5px #333333;
    border-radius:9px;
    margin-left: 3%;
    background-color: #FFF;
}
.above {
  width: 100%;
  height: 800px;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: rgb(247, 242, 242);
}
</style>