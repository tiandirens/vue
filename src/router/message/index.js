export default [
    {
        path: '/message',
        name: 'message',
        component: resolve => require(['@/pages/message/message'], resolve),
        meta: {
            keepAlive:true
        }
    },

];