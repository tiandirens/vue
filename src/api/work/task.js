import request from '../../utils/request';
export function list(param) {
    return request({
        method: 'post',
        data: param,
        url: '/task/list'
    });
}

export function updateStatus(param) {
    var id = param.id;
    var status = param.status;
    return request({
        method: 'post',
        url: '/task/updateStatus?id='+id+"&status="+status,
    });
}
export function updatePriority(param) {
    var id = param.id;
    var priority = param.priority;
    return request({
        method: 'post',
        url: '/task/updatePriority?id='+id+"&priority="+priority,
    });
}
//保存任务
export function saveOrUpdate(param) {
    return request({
        method: 'post',
        data:param,
        url: '/task/saveOrUpdate',
    });
}
//保存评论
export function saveCommentTask(param) {
    return request({
        method: 'post',
        data:param,
        url: '/commentTask/saveOrUpdate',
    });
}
//添加任务处理人
export function saveUsertaskcontact(param) {
    return request({
        method: 'post',
        data:param,
        url: '/usertaskcontact/saveOrUpdate',
    });
}
//模糊查询用户
export function getUser(param) {
    return request({
        method: 'post',
        data: param,
        url: '/user/list',
    });
}
//查看处理人列表
export function listUserTask(param) {
    return request({
        method: 'post',
        data:param,
        url: '/usertaskcontact/list',
    });
}
//删除处理人
export function del(param) {
    var userId = param.userId;
    var taskId = param.taskId;
    return request({
        method: 'post',
        url: '/usertaskcontact/delete?userId='+userId+"&taskId="+taskId,
    });
}