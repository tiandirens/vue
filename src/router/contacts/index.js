export default [
    {
        path: '/contacts',
        name: 'contacts',
        component: resolve => require(['@/pages/contacts/contacts'], resolve),
        meta: {
            keepAlive:true
        }
    },

];