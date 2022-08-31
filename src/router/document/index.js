export default [
    {
        path: '/document',
        name: 'document',
        component: resolve => require(['@/pages/document/document'], resolve),
        meta: {
            keepAlive:true
        }
    },

];