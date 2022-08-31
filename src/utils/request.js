import axios from 'axios';
import {Message} from 'element-ui';
import router from '@/router';

let msg = null;
const request = axios.create({
  baseURL: process.env.API_HOST,
  timeout: 50000
});

request.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

request.interceptors.response.use(function (response) {
  // login 超时
  if (response.data.code === '4000') {
    if (msg) msg.close();
    msg = Message({
      showClose: true,
      type: 'warning',
      message: '登录超时,请重新登录'
    });
    router.push('/login');
    return Promise.reject(response);
  }
  // code 9999
  if (response.data.code === '9999') {
    if (msg) msg.close();
    msg = Message({
      showClose: true,
      type: 'warning',
      message: '系统抛出一个雷，程序猿哥哥们正在努力排雷中···'
    });
    return Promise.reject(response);
  }
  return response;
}, function (error) {
  if (error.message.includes('timeout')) {
    if (msg) msg.close();
    msg = Message({
      showClose: true,
      type: 'warning',
      message: '网络被外星人劫走了!!!'
    });
    return Promise.reject(error);
  }
  return Promise.reject(error);
});

export default request;
