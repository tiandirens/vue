import request from '../../utils/request';
export function list(param) {
    return request({
        method: 'post',
        data: param,
        url: '/log/list',
    });
}
export function get(param) {
    var id = param.logId;
    return request({
        method: 'post',
        data: param,
        url: '/log/get?id='+id,
    });
}
export function save(param) {
    return request({
        method: 'post',
        data: param,
        url: '/log/saveOrUpdate',
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
//查找评论
export function getCommentList(param) {
    return request({
        method: 'post',
        data: param,
        url: '/commentLog/list',
    });
}
//保存评论
export function saveComment(param) {
    return request({
        method: 'post',
        data: param,
        url: '/commentLog/saveOrUpdate',
    });
}