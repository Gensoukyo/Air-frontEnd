import axios from 'axios'
const initSong={ sid: 488144, name: "鸟の诗", artist: "Lia", duration: 369398, albumName: "circle of fifth", image: "http://p1.music.126.net/Crwrz3uj35BBirBTpem9vQ==/516770465060643.jpg", albumId: 46731 };
const StoreConfig = {
    state: {
        //从 store 实例中读取状态最简单的方法就是在计算属性 中返回某个状态
        auth: Boolean(sessionStorage.getItem('authFlag')),
        userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
        currentPlayList: [initSong],
        currentSong: initSong,
        // 详情页属性定义
        globalDetail: {
            type: 'song',
            id: initSong.sid,
            name: initSong.name,
            image: initSong.image,
            artistOrPublisherOrAuthor: initSong.artist,
            albumNameOrPubDateOrTag: initSong.albumName
        },
        songList: [],
        albumList: [],
        playlistList: [],
        navVisibility: true,//全局导航栏可见
        overlayVisibility: false,//全局弹窗幕布
        optionForRegistration: false,
        flashMsg: ''//即显消息
    },
    getters: {
        //通过让 getter 返回一个函数，来实现给 getter 传参
    },
    mutations: {
        //mutation 必须是同步函数
        setAuth(state, value) {
            state.auth = value;
        },
        setFlashMsg(state, msg) {
            state.flashMsg = msg;
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setList(state, payload) {
            let key = payload.type + 'List';
            state[key] = payload.data;
        },
        setNavVisibility(state, value) {
            if (state.navVisibility !== value) {
                state.navVisibility = value;
            } 
        },
        setLogOverlay(state) {
            state.overlayVisibility = state.auth ?
                state.overlayVisibility :
                !state.overlayVisibility;
        },
        setOptionForReg(state, value) {
            state.optionForRegistration = value;
        },
        setCurrentPlayList(state, payload) {
            function paddingWithoutRepetition(items) {
                //去除和待插入的列表有重复的歌曲，返回去重列表
                let currentIndex = 0,
                    newList = [];
                let oldList = state.currentPlayList,
                    len = state.currentPlayList.length,
                    currentSongId = state.currentSong.sid;
                for (let i = 0; i < len; i++) {
                    let j=items.length;
                    while (j--){
                        if (oldList[i].sid !== items[j].sid) {
                            newList.push(oldList[i]);
                        }
                    }
                    if (!currentIndex) {
                        currentIndex = oldList[i].sid === currentSongId ? newList.length : currentIndex;
                    }
                }
                newList.splice(currentIndex, 0, ...items);
                return newList;
            }
            //添加应在当前播放后，移除应避免影响当前播放状态
            switch (payload.method) {
                case 'add':
                    state.currentPlayList = paddingWithoutRepetition(payload.items);
                    break;
                case 'remove':
                    state.currentPlayList.splice(payload.index, 1);
                    break;
                case 'reset':
                    state.currentPlayList = payload.items;
            }
        },
        setCurrentSong(state, song) {
            state.currentSong = song;
            let id = song.sid;
            let { name, artist, image, albumName } = song;
            state.globalDetail = {
                type: 'song',
                id,
                name,
                image,
                artistOrPublisherOrAuthor: artist,
                albumNameOrPubDateOrTag: albumName
            }
        },
        setGlobalDetail(state, payload) {
            state.globalDetail = payload;
        }
    },
    actions: {
        //使用store.dispatch('increment')触发，返回Promise实例
        loginAuth(context, data) {
            if (!context.state.auth) {
                let token = localStorage.getItem('token');
                return axios.post('/api/user/auth', data, {
                    headers: { 'x-access-token': token?token:''}
                }).then((response) => {
                    let resData=response.data.data;
                    context.commit('setLogOverlay');
                    context.commit('setAuth', true);
                    context.commit('setUserInfo', resData);
                    sessionStorage.setItem('authFlag','setted');
                    sessionStorage.setItem('userInfo', JSON.stringify(resData));
                    if (data.remember) {
                        localStorage.setItem('token', resData.token);
                        localStorage.setItem('username', resData.username);
                    }
                    return response.data;
                });
            }
        },
        getSongById(context, sid) {
            let url = '/api/song?id=' + sid;
            return axios.get(url).then((response) => {
                let song = response.data.data;
                delete song.comment;
                delete song.collect;
                return response.data.success ? song : null;
            });
        },
        fetchData(context, type) {
            let rand = '?rand=' + new Date().getTime();
            axios.get('/api/' + type + rand).then((response) => {
                if (response.data.success && response.data.data.length >= 5) {
                    context.commit('setList', {
                        type: type,
                        data: response.data.data
                    });
                } else {
                    context.commit('setFlashMsg', '推荐获取中...')
                    return context.dispatch('fetchData', type);
                }
            }).catch(e => {
                console.error(e.response.data.info);;
            });
        }
    }
}

export default StoreConfig;