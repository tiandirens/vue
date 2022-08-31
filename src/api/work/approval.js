import request from '../../utils/request';
export function list(param) {
    return request({
        method: 'post',
        data: param,
        url: '/approve/list',
    });
}
//保存和修改
export function save(param) {
    return request({
        method: 'post',
        data: param,
        url: '/approve/saveOrUpdate',
    });
}
//删除
export function del(param) {
    var id = param.id;
    return request({
        method: 'post',
        data: param,
        url: '/approve/delete?id='+id,
    });
}
//获取用户信息
export function getUser(param) {
    var id = param.id;
    return request({
        method: 'post',
        data: param,
        url: '/user/get?id='+id,
    });
}
//审批
export function updateStatus(param) {
    var id = param.id;
    var status = param.status;
    return request({
        method: 'post',
        data: param,
        url: '/approve/updateStatus?id='+id+"&status="+status,
    });
}