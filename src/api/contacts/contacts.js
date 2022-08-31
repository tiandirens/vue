import request from '../../utils/request';
//获取好友列表
export function list(param) {
    return request({
        method: 'post',
        data: param,
        url: '/friend/list'
    });
}
//获取群组列表
export function groupList(param) {
    return request({
        method: 'post',
        data: param,
        url: '/group/list'
    });
}
//获取该群组下的成员列表
export function groupMemberList(param) {
    return request({
        method: 'post',
        data: param,
        url: '/groupmember/list'
    });
}
//获取成因所在分组
export function getOne(param) {
    return request({
        method: 'post',
        data: param,
        url: '/friend/getOne'
    });
}
//查找是否为好友
export function find(param) {
    return request({
        method: 'post',
        data: param,
        url: '/friend/find'
    });
}
//查看所有分组
export function getCategoryList(param) {
    var userId = param.userId;
    return request({
        method: 'post',
        url: '/friend/getCategoryList?userId='+userId,
    });
}
//查看好友信息
export function getUserData(param) {
    var userId = param.userId;
    return request({
        method: 'post',
        url: '/user/get?id='+userId,
    });
}
//修改好友分组
export function updateCategory(param) {
    return request({
        method: 'post',
        data: param,
        url: '/friend/updateCategory'
    });
}
//查找是否有该聊天记录
export function findAndSave(param) {
    var userId = param.userId;
    var toUserId = param.toUserId;
    var type = param.type;
    return request({
        method: 'post',
        url: '/messageRecord/findAndSave?userId='+userId+"&toUserId="+toUserId+"&type="+type,
    });
}
//添加好友
export function saveFriendRequest(param) {
    return request({
        method: 'post',
        data:param,
        url: '/friendrequest/saveOrUpdate',
    });
}
//查看是否已发送过好友请求
export function FriendRequestList(param) {
    return request({
        method: 'post',
        data:param,
        url: '/friendrequest/list',
    });
}
//查找好友
export function findUser(param) {
    var content = param.content;
    return request({
        method: 'post',
        url: '/user/findUser?content='+content,
    });
}
//获取好友信息封装成jsonArray
export function findAll(param) {
    return request({
        method: 'post',
        data: param,
        url: '/friend/findAll'
    });
}
//获取剩余好友信息封装成jsonArray
export function findElse(param) {
    var userId = param.userId;
    var groupId = param.groupId;
    return request({
        method: 'post',
        url: '/friend/findElse?userId='+userId+"&groupId="+groupId,
    });
}
//创建群组
export function saveGroup(param) {
    return request({
        method: 'post',
        data: param,
        url: '/group/save'
    });
}
//添加群成员
export function addGroupMember(param) {
    return request({
        method: 'post',
        data: param,
        url: '/group/addGroupMember'
    });
}
//踢出群成员
export function delMember(param) {
    var userId = param.userId;
    var groupId = param.groupId;
    return request({
        method: 'post',
        url: '/groupmember/delete?userId='+userId+"&groupId="+groupId,
    });
}
//获取群主编号
export function getGroupOwner(param) {
    var groupId = param.groupId;
    return request({
        method: 'post',
        url: '/group/getGroupOwner?groupId='+groupId,
    });
}
//修改或保存分组
export function saveOrUpdateCategory(param) {
    return request({
        method: 'post',
        data:param,
        url: '/friend/saveOrUpdateCategory',
    });
}
//删除分组
export function delCategory(param) {
    var categoryId = param.categoryId;
    return request({
        method: 'post',
        url: '/friend/delCategory?categoryId='+categoryId,
    });
}
//处理好友申请
export function updateRequest(param) {
    var id = param.id;
    var status = param.status;
    return request({
        method: 'post',
        url: '/friendrequest/updateStatus?id='+id+"&status="+status,
    });
}
//查询搜索框所有好友和群组
export function getFriendsAndGroup(param) {
    return request({
        method: 'post',
        data:param,
        url: '/friend/getFriendsAndGroup',
    });
}
//头像上传
export function putImg(param) {
    return request({
        method: 'post',
        headers: { "Content-Type": "multipart/form-data" },
        data:param,
        url: '/upload/putImg',
    });
}