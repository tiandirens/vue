<template>
      <el-container>
        <el-aside width="340px">
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
                <el-row>
                    <div v-for="(item,index) in messageRecordList" :key="index" class="chatItem" @click="category(item)" style="text-align:center">
                        <img class="headImg" :src="item.url"/>
                        <span>{{item.name}}</span>
                        <span class="bage" style="margin-top:20px;margin-right:10px" v-if="item.count!='' && item.count!=null">{{item.count}}</span>
                    </div>
                </el-row>
            </div>
        </el-aside>
        <el-main>
          <!-- 上面显示栏 -->
            <span style="width:2%"><b>{{name}}</b></span>
            <div class="above" id="scrolldIV">
                <div v-for="(item,index) in messageList" :key="index">
                    <div v-if="item.apart=='1'" style="width:100%;margin-top:20px;">
                        <img class="headImg" :src="item.url"/>
                        <div style="float:left;margin-left:15px;width:80%">
                            <div style="height:12px;font-size:10px;text-align:left">{{item.insertDate | dateFormat}}</div>
                            <div style="height:12px;font-size:10px;text-align:left" v-if="messageJson.type=='1'">{{item.name}}</div>
                            <div class="chatContent" style="float:left;">{{item.content}}</div>
                        </div>
                    </div>
                    <div v-else style="width:100%;margin-top:20px;">
                        <img class="headImg" :src="item.url" style="float:right"/>
                        <div style="float:right;margin-left:15px;width:80%;">
                            <div style="height:12px;font-size:10px;text-align:right">{{item.insertDate | dateFormat}}</div>
                            <div class="chatContent" style="background-color:grey;float:right">{{item.content}}</div>
                        </div>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            </div>
            <!-- 下面输入栏 -->
            <div class="below">
                <el-input type="textarea" :rows="12" v-model="messageJson.content" @keyup.enter.native="websocketsend"> </el-input>
                <el-button @click="websocketsend" style="float:right;border-radius: 25px;">发送</el-button>
            </div>
        </el-main>
      </el-container>
</template>
<script>
import { list,getOneMessage,getGroupMessage,updateStatus,getFriendsAndGroup,findAndSave,getUser } from "@/api/message/message";
export default {
  data() {
    return {
      messageRecordList: [],
      messageList:[],
      getFriendList:[],
      messageRecord: {},
      pageSize: 10,
      currentPage: 1,
      totalElement: null,
      websock:null,
      content:"",
      state:"",
      name:"",
      friend:{},
      user:{},
      messageJson:{
          userId:"",
          relationId:"",
          content:"",
          type:""
      },
      toMessageJson:{
          userId:"",
          relationId:"",
          content:"",
          type:""
      },
      message:{},
      groupMessage:{},
      toUserId:"",
      userId:"",
    };
  },
  created() {
      this.getUserId();
      this.initWebSocket();
    },
  destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
  mounted() {
    this.loadAll();
  },
  methods: {
    
    //获取用户编号
      getUserId() {
      var userId = localStorage.getItem("userId");
      if (userId != "" && userId != null) {
        this.userId = userId;
        this.messageJson.userId = userId;
        
      }
    },
    //websocket
    //初始化weosocket
    initWebSocket(){ 
        var num = Math.floor(Math.random() * 10 + 1);
        var wsuri = "";
        if(num<=5){
            wsuri = "ws://121.40.171.145:8087/websocket?userId="+this.userId;
        }else{
            wsuri = "ws://121.40.171.145:8087/websocket?userId="+this.userId;
        }
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },

    //连接建立之后执行send方法发送数据
    websocketonopen(){ 
      },

    //连接建立失败重连
    websocketonerror(){
        this.initWebSocket();
      },

    //数据接收
    websocketonmessage(e){ 
        var str = eval('(' +  e.data + ')');
        var content = str["content"];
        var type = str["type"];
        var insertDate = str["insertDate"];
        var userId = str["userId"];
        var relationId = str["relationId"];
        var name = str["name"];
        var url = str["url"];
        if(type=="0"){
                if(userId==this.messageJson.relationId){
                var apart = "1";
                this.messageList.push({apart:apart,content:content,insertDate:insertDate,url:url});
            }else{
                this.messageRecordList.forEach((item)=>{
                    if(item.relationId == userId){
                        var i;
                        if(item.count==""){
                            i = 0;
                        }else{
                            i = parseInt(item.count);
                        }
                        i+=1;
                        item.count = String(i);
                        
                    }
                });
            }
        }else{
            if(relationId==this.messageJson.relationId){
                var apart = "1";
                this.messageList.push({apart:apart,content:content,insertDate:insertDate,name:name,url:url});
            }else{
                this.messageRecordList.forEach((item)=>{
                    if(item.relationId == relationId){
                        item.count+=1;
                    }
                })
            }
        }
        
        this.$nextTick(() => {
            var div = document.getElementById("scrolldIV");
            div.scrollTop = div.scrollHeight;
        });
      },

    //数据发送
     websocketsend(){
          
         if(this.messageJson.content=="" || this.messageJson.content==null){
             this.$message.waring("请先输入内容");
         }else{
             this.messageJson.insertDate = new Date();
            this.websock.send(JSON.stringify(this.messageJson));
            this.messageList.push({apart:"0",content:this.messageJson.content,insertDate:this.messageJson.insertDate,url:this.user.url});
            this.messageJson.content = "";
         }
        this.$nextTick(() => {
            var div = document.getElementById("scrolldIV");
            div.scrollTop = div.scrollHeight;
        });
      },

      //关闭
      websocketclose(e){  
        console.log('断开连接',e);
      },


    //列表查询
    loadAll() {
      this.messageRecord.page = this.currentPage;
      this.messageRecord.pageSize = this.pageSize;
      this.messageRecord.userId = this.userId;
      list(this.messageRecord).then((res) => {
        this.messageRecordList = res.data.data;
        if(res.data.data.length!=0){
            this.messageJson.relationId = res.data.data[0].relationId;
            this.messageJson.type = res.data.data[0].type;
            if(res.data.data[0].type=='0'){
                this.getOneMessage(res.data.data[0].relationId);
            }else{
                this.getGroupMessage(res.data.data[0].relationId);
            }
            this.name = res.data.data[0].name;
            this.messageRecordList[0].count="";
        }
      });
      //查询搜索框所有好友和群组
      this.friend.userId = this.userId;
      getFriendsAndGroup(this.friend).then((res)=>{
          this.getFriendList = res.data.data;
      });
      getUser({id:this.userId}).then((res)=>{
            this.user = res.data;
        });
    },
    //区分查询消息
    category(item){
        this.name = item.name;
        //设为已读
        updateStatus({userId:item.relationId,toUserId:this.userId,type:item.type}).then((res)=>{
        });
        if(item.relationId!=this.messageJson.relationId){
            this.messageRecordList.forEach((i)=>{
                if(item.relationId==i.relationId){
                    i.count="";
                }
            })
        };
        this.messageJson.relationId = item.relationId;
        this.messageJson.type = item.type;
        if(item.type=='0'){
            this.getOneMessage(item.relationId);
        }else{
            this.getGroupMessage(item.relationId);
        }
        
    },
    //获取数据库单个用户消息
    getOneMessage(toUserId){
        this.message.userId = this.userId;
        this.message.toUserId = toUserId;
        this.message.page = 1;
        this.message.pageSize = 100;
        getOneMessage(this.message).then((res)=>{
            this.messageList = res.data.data;
            this.$nextTick(() => {
            var div = document.getElementById("scrolldIV");
            div.scrollTop = div.scrollHeight;
        });
        })
    },
    //获取数据库中群组消息
    getGroupMessage(groupId){
        this.groupMessage.groupId  = groupId;
        this.groupMessage.userId = this.userId;
        getGroupMessage(this.groupMessage).then((res)=>{
            this.messageList = res.data.data;
            this.$nextTick(() => {
            var div = document.getElementById("scrolldIV");
            div.scrollTop = div.scrollHeight;
        });
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
    //前往聊天页面
    goChat(type){
        findAndSave({userId:this.userId,toUserId:this.toUserId,type:type}).then((res)=>{
            this.loadAll();
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
.left {
  float: left;
  width: 100%;
  height: 1000px;
    border-radius: 5px;
  -moz-box-shadow:2px 2px 10px #090533; -webkit-box-shadow:2px 2px 10px #090533; box-shadow:2px 2px 10px #090533;
}
.rigth {
  padding-left: 10px;
  float: left;
  width:80%
}
.above {
  width: 95%;
  height: 500px;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: rgb(247, 242, 242);
}
.below {
  width: 95%;
  height: 200px;
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
.bage{
    background-color: #F56C6C;
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    float: right;
    box-shadow:2px 2px 8px #7D7D7D;
}
.chatItem{
    width:98%;
    height:60px;
    line-height:60px;
    box-shadow:2px 2px 5px #333333;
    border-radius:9px;
    margin-top: 8px;
    background-color: #FFF;
}
.searchItem{
    width:80%;
    height:40px;
    line-height:40px;
    box-shadow:2px 2px 5px #333333;
    border-radius:9px;
    margin-left: 10%;
    background-color: #FFF;
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
.chatContent{
    background-color:green;
    min-height:30px;
    margin-top:12px;
    max-width:80%;
    color: #FFF;
    font-size:18px;
    padding:15px;
    border-radius: 15px;
}
</style>