import axios from 'axios'
const StoreConfig = {
    state: {
        //从 store 实例中读取状态最简单的方法就是在计算属性 中返回某个状态
        auth: false,
        userInfo: {},
        currentPlayList: [{ sid: 488144, name: "鸟の诗", artist: "Lia", duration: 369398, albumName: "circle of fifth", image: "http://p1.music.126.net/Crwrz3uj35BBirBTpem9vQ==/516770465060643.jpg", albumId: 46731 }],
        currentSong: { sid: 488144, name: "鸟の诗", artist: "Lia", duration: 369398, albumName: "circle of fifth", image: "http://p1.music.126.net/Crwrz3uj35BBirBTpem9vQ==/516770465060643.jpg", albumId: 46731 },
        globalDetail: {
            type: 'song',
            id: 488144,
            name: "鸟の诗",
            image: "http://p1.music.126.net/Crwrz3uj35BBirBTpem9vQ==/516770465060643.jpg",
            artistOrPublisherOrAuthor: "Lia",
            albumNameOrPubDateOrTag: "circle of fifth"
        },
        songList: [],
        albumList: [],
        playlistList: [],
        navVisibility: true,
        overlayVisibility:false,
        optionForRegistration: false,
        flashMsg: ''
    },
    getters: {
        //通过让 getter 返回一个函数，来实现给 getter 传参

    },
    mutations: {
        //mutation 必须是同步函数
        setAuth(state,value){
            state.auth=value;
        },
        setFlashMsg(state, msg) {
            state.flashMsg = msg;
        },
        setUserInfo(state,userInfo){
            state.userInfo=userInfo;
        },
        setList(state, payload) {
            let key=payload.type+'List';
            state[key] = payload.data;
        },
        setNavVisibility(state, value){
            if (state.navVisibility!==value) {
                state.navVisibility=value;
            }
        },
        setLogOverlay(state){
            state.overlayVisibility=state.auth
                ?state.overlayVisibility
                :!state.overlayVisibility;
        },
        setOptionForReg(state,value){
            state.optionForRegistration=value;
        },
        setCurrentPlayList(state,payload){
            function addWithNorepeat(items) {
                //去除和待插入的列表有重复的歌曲，返回去重列表
                let currentIndex=0,
                    len=state.currentPlayList.length,
                    newList=[];
                let oldList=state.currentPlayList,
                    currentSongId=state.currentSong.sid;
                for (let i=0; i<len; i++){
                    for (let j = items.length - 1; j >= 0; j--) {
                        if (oldList[i].sid!==items[j].sid) {
                            newList.push(oldList[i]);
                        }
                    }
                    currentIndex=oldList[i].sid===currentSongId?newList.length:currentIndex;
                }
                newList.splice(currentIndex,0,...items);
                return newList;
            }
            //添加应在当前播放后，移除应避免影响当前播放状态
            switch(payload.method){
                case 'add':
                    state.currentPlayList=addWithNorepeat(payload.items);
                    break;
                case 'remove':
                    state.currentPlayList.splice(payload.index,1);
                    break;
                case 'reset':
                    state.currentPlayList=payload.items;
            }
        },
        setCurrentSong(state,song){
            state.currentSong=song;
            let id=song.sid;
            let {name,artist,image,albumName}=song;
            state.globalDetail={
                type: 'song',
                id,
                name,
                image,
                artistOrPublisherOrAuthor:artist,
                albumNameOrPubDateOrTag:albumName
            }
        },
        setGlobalDetail(state,payload){
            state.globalDetail=payload;
        }
    },
    actions: {
        //使用store.dispatch('increment')触发，返回Promise实例
        loginAuth(context,data){
            if (!context.state.auth) {
                return axios.post('/api/user/auth',data).then((response)=>{
                    if (response.data.success) {
                        context.commit('setLogOverlay');
                        context.commit('setAuth',true);
                        context.commit('setUserInfo',response.data.data);
                        localStorage.setItem('token',response.data.data.token);
                    }
                    return response.data;
                });
            }
        },
        getSongById(context,sid){
            let url='/api/song?id='+sid;
            return axios.get(url).then((response) => {
                let song=response.data.data[0];
                delete song.comment;
                delete song.collect;
                return response.data.success
                    ? song
                    :null;
            });
        },
        getHistoryPlayList(context) {
            if (context.state.auth) {

            }
        }
    }
}

export default StoreConfig;