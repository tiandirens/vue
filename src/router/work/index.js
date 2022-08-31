export default [
    {
        path: '/conference',
        name: 'conference',
        component: resolve => require(['@/pages/work/conference'], resolve),
        meta: {
            keepAlive:true
        }
    },
    {
        path: '/approval',
        name: 'approval',
        component: resolve => require(['@/pages/work/approval'], resolve),
        meta: {
            keepAlive:true
        }
    },
    {
        path: '/log',
        name: 'log',
        component: resolve => require(['@/pages/work/log'], resolve),
        meta: {
            keepAlive:true
        }
    },
    {
        path: '/notice',
        name: 'notice',
        component: resolve => require(['@/pages/work/notice'], resolve),
        meta: {
            keepAlive:true
        }
    },
    {
        path: '/task',
        name: 'task',
        component: resolve => require(['@/pages/work/task'], resolve),
        meta: {
            keepAlive:true
        }
    },
];
