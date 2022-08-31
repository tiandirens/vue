import request from '../../utils/request';
export function list(param) {
    return request({
        method: 'post',
        data: param,
        url: '/document/list',
    });
}
//删除文件
export function updateStatus(param) {
    var id = param.id;
    var status = param.status;
    return request({
        method: 'post',
        url: '/document/updateStatus?id='+id+"&status="+status,
    });
}
//获取文件映射的随机数
export function randomUUID(param) {
    var fileName = param.fileName;
    return request({
        method: 'post',
        url: '/upload/randomUUID?fileName='+fileName,
    });
}
//下载文件
export function download(param) {
    var key = param.key;
    return request({
        method: 'post',
        url: '/upload/download?key='+key,
    });
}
//上传
export function putFile(param) {
    return request({
        method: 'post',
        headers: { "Content-Type": "multipart/form-data" },
        data:param,
        url: '/upload/putFile',
    });
}