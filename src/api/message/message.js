import request from '../../utils/request';
export function list(param) {
    return request({
        method: 'post',
        data: param,
        url: '/messageRecord/list'
    });
}
//查询数据库单个好友消息
export function getOneMessage(param) {
    return request({
        method: 'post',
        data: param,
        url: '/message/getOneMessage'
    });
}
//查询数据库群组消息
export function getGroupMessage(param) {
    return request({
        method: 'post',
        data: param,
        url: '/groupmessage/getGroupMessage'
    });
}
//将未读改为已读
export function updateStatus(param) {
    var userId = param.userId;
    var toUserId = param.toUserId;
    var type = param.type;
    return request({
        method: 'post',
        url: '/message/updateStatus?userId='+userId+"&toUserId="+toUserId+"&type="+type,
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
//获取自己的头像地址
export function getUser(param) {
    var id = param.id;
    return request({
        method: 'post',
        url: '/user/get?id='+id,
    });
}