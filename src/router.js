const Routers = [
    {
        path: '/',
        meta: {
            title: 'Air-云之彼端'
        },
        components: {
            default:null,
            play: (resolve) => require(['./components/music-play.vue'], resolve),
            main: (resolve) => require(['./views/main.vue'], resolve)
        }
    },
    {
        path: '/play',
        component: (resolve) => require(['./views/enjoy.vue'], resolve),
        props: true
    },
    {
        path: '/user',
        name: 'user',
        component: (resolve) => require(['./views/user.vue'], resolve)
    },
    {
        path: '/message',
        component: (resolve) => require(['./views/message.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/'
    }
];

export default Routers;