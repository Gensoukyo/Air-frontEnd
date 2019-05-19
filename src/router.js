const Routers = [{
        path: '/',
        meta: {
            title: 'Air-云之彼端'
        },
        components: {
            default: false,
            play: (resolve) => require(['./components/music-play.vue'], resolve)
        }
    },
    {
        path: '/recommend',
        meta: {
            title: 'Air-云之彼端'
        },
        components: {
            default: (resolve) => require(['./views/recommend.vue'], resolve),
            play: (resolve) => require(['./components/music-play.vue'], resolve)
        }
    },
    {
        path: '/discover',
        meta: {
            title: 'Air-云之彼端'
        },
        components: {
            default: (resolve) => require(['./views/discover.vue'], resolve),
            play: (resolve) => require(['./components/music-play.vue'], resolve)
        }
    },
    {
        path: '/user',
        meta: {
            title: 'Air-云之彼端'
        },
        component: (resolve) => require(['./views/user.vue'], resolve),
        props: (route) => ({
            id: route.query.id
        })
    },
    {
        path: '/:type(song|playlist|album)',
        meta: {
            title: 'Air-云之彼端'
        },
        components: {
            default: (resolve) => require(['./views/detail.vue'], resolve),
            play: (resolve) => require(['./components/music-play.vue'], resolve)
        },
        props: {
            default: (route) => ({
                type: route.params.type,
                id: route.query.id
            }),
            play: false
        }
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