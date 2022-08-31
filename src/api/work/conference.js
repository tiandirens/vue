import request from '../../utils/request';
export function list(param) {
    return request({
        method: 'post',
        data: param,
        url: '/conference/list',
    });
}
//保存和修改
export function save(param) {
    return request({
        method: 'post',
        data: param,
        url: '/conference/saveOrUpdate',
    });
}
//删除
export function del(param) {
    var id = param.id;
    return request({
        method: 'post',
        data: param,
        url: '/conference/delete?id='+id,
    });
}