import request from '../../utils/request';
export function login(param) {
    return request({
        method: 'post',
        data: param,
        url: '/Login/loginUser'
    });
}

export function getUserNotice(param) {
    return request({
        method: 'post',
        data: param,
        url: '/userUserNoticeContactContact/list'
    });
}
//获取用户信息
export function getUser(param) {
    var id = param.id;
    return request({
        method: 'post',
        url: '/user/get?id='+id
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
//修改和保存用户信息
export function save(param) {
    return request({
        method: 'post',
        data:param,
        url: '/user/saveOrUpdate',
    });
}
//查询是否存在该用户名
export function list(param) {
    return request({
        method: 'post',
        data:param,
        url: '/user/list',
    });
}

