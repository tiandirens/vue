import request from '../../utils/request';
export function list(param) {
    return request({
        method: 'post',
        data: param,
        url: '/notice/list',
    });
}

//保存
export function save(param) {
    return request({
        method: 'post',
        data: param,
        url: '/notice/saveOrUpdate',
    });
}
//修改为已读
export function updateStatus(param) {
    return request({
        method: 'post',
        data: param,
        url: '/userUserNoticeContactContact/updateStatus',
    });
}