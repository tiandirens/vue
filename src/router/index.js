import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from "../router/login/index"
import message from "../router/message/index"
import work from "../router/work/index"
import document from "../router/document/index"
import contacts from "../router/contacts/index"
import NavMenu from '@/components/NavMenu'

Vue.use(Router)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta:{
        keepAlive:false
      }
    },
  ...login,
  ...message,
  ...work,
  ...document,
  ...contacts,
  ],
})
