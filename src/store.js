import axios from 'axios'
const StoreConfig = {
    state: {
        //从 store 实例中读取状态最简单的方法就是在计算属性 中返回某个状态
        auth: false,
        currentPlayList: [{ sid: 488144, name: "鸟の诗", artist: "Lia", duration: 369398, albumName: "circle of fifth", image: "http://p1.music.126.net/Crwrz3uj35BBirBTpem9vQ==/516770465060643.jpg", albumId: 46731 }],
        songList: [],
        navVisibility: true,
        overlayVisibility:false,
        optionForRegistration: false,
        errorMsg: ''
    },
    getters: {
        //通过让 getter 返回一个函数，来实现给 getter 传参

    },
    mutations: {
        //mutation 必须是同步函数
        setAuth(state,value){
            state.auth=value;
        },
        newErrorMsg(state, msg) {
            state.errorMsg = msg;
        },
        setUserInfo(state,userInfo){
            state.userInfo=userInfo;
        },
        setSongList(state, data) {
            state.songList = data;
        },
        setNavVisibility(state, value){
            state.navVisibility=value;
        },
        setLogOverlay(state){
            state.overlayVisibility=state.auth
                ?state.overlayVisibility
                :!state.overlayVisibility;
        },
        setOptionForReg(state,value){
            state.optionForRegistration=value;
        },
        updateCurrentPlayList(state,payload){
            //添加应在当前播放后，移除应避免影响当前播放状态
            switch(payload.method){
                case 'add':
                    state.currentPlayList.push(payload.item);
                    break;
                case 'remove':
                    state.currentPlayList.splice(payload.index,1);
            }
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
                        localStorage.setItem('token',response.data.data.token);
                    }
                    return response.data;
                });
            }
        },
        getSongList({ commit }) {
            return axios.get('/api/song', {
                timeout: 5000
            }).then((response) => {
                return response.data.length < 5
                    ?(commit('newErrorMsg', '推荐获取失败，请刷新'),false)
                    :(commit('setSongList', response.data.data),true)
            })
        },
        getHistoryPlayList(context) {
            if (context.state.auth) {

            }
        }
    }
}

export default StoreConfig;