<template>
    <div class="inner">
        <div class="wrapper">
            <header class="header">
                <span class="header-menu cursor" @click="hiddenBar"><img src="./assets/svgFont/other.svg" alt=""></span>
                <router-link to="/" class="header-logo">
                    <img src="./assets/img/logo.png" alt="网站logo"></router-link>
                <ul v-show="navVisibility" :class="['header-list',{'visible': navVisibility}]">
                    <li>
                        <router-link to="/recommend">
                    		<img src="./assets/svgFont/recommend.svg" alt="推荐">推荐
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/discover">
                    		<img class="bigger-fix" src="./assets/svgFont/playlist.svg" alt="歌单">精选
                        </router-link>
                    </li>
                    <li @click="setLogOverlay()">
                        <router-link to="/user">
                            <img src="./assets/svgFont/like.svg" alt="我的">我的
                        </router-link>
                    </li>
                    <li class="cursor " @click="hiddenBar">
                        <img src="./assets/svgFont/search.svg" alt="搜索">搜索
                    </li>
                </ul>
                <div v-show="!navVisibility&&searchBarVisiable" class="header-search">
                    <search-bar @hiddenbar="hiddenBar"></search-bar>
                    <span class="header-search-back"
                    	@click="hiddenBar">取消</span>
                </div>
                <div v-if="!$store.state.auth" class="header-log">
                    <span class="cursor"
                		@click="setLogOverlay()">登录</span>&nbsp;|&nbsp;
                    <span class="cursor"
                		@click="prepareRegister()">注册</span>
                </div>
                <div v-else class="header-log">
                    <router-link to="/user" class="header-log-avatar">
                        <img class="img" :src="userInfo.avatar" alt="头像">
                    </router-link>
                    <span class="header-log-quit cursor"
                		@click="logOut()">退出</span>
                </div>
            </header>
        </div>
        <log-popup v-if="$store.state.overlayVisibility"></log-popup>
        <main>
            <router-view class="content content-begin" name="play"></router-view>
            <router-view class="content"></router-view>
        </main>
        <flash-msg></flash-msg>
        <footer class="footer">
            <p>Designed & Powered By <a href="http://blog.wyyx.me">Gensoukyo</a></p>
        </footer>
    </div>
</template>
<script>
import searchBar from './components/search-bar.vue'
import logPopup from './components/log-popup.vue'
import flashMsg from './components/flash-msg.vue'
const defaultAvatarUrl = 'http://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=50y50';
const isSmallScreen = () => document.documentElement.clientWidth<=650;
export default {
    components: {
        searchBar,
        logPopup,
        flashMsg
    },
    data() {
        return {
            navVisibility: this.$store.state.navVisibility,
            searchBarVisiable: true,
            timer: null
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo || defaultAvatarUrl;
        }
    },
    methods: {
        handleScroll() {
            if(isSmallScreen()) return;
            let whitePathList = ['/user', '/message'];
            let visable = window.scrollY < 300;
            if (whitePathList.indexOf(this.$route.path)>=0) return;
            this.timer = setTimeout(() => {
                this.setNavVisibility(visable);
                this.searchBarVisiable = visable;
            }, 1000);
        },
        setNavVisibility(visable){
            this.$store.commit('setNavVisibility', visable);
            this.navVisibility=visable;
        },
        setLogOverlay() {
            this.$store.commit('setLogOverlay');
        },
        hiddenBar(e) {
            e.stopPropagation();
            this.navVisibility = !this.navVisibility;
        },
        prepareRegister() {
            this.$store.commit('setOptionForReg', true);
            this.$store.commit('setLogOverlay');
        },
        logOut() {
            this.$store.commit('setAuth', false);
            this.$store.commit('setUserInfo', {});
            sessionStorage.clear();
            localStorage.removeItem('token');
            this.$router.replace('');
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        if(isSmallScreen()){
            this.setNavVisibility(false);
        }
        window.addEventListener('click', () => isSmallScreen()?this.setNavVisibility(false):false);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        clearTimeout(this.timer);
    }
}
</script>
<style lang="scss">
html,body {
    margin: 0;
    padding: 0;
    min-height: 100%;
}

ul{
    margin: 0;
    padding: 0;
}

a {
    text-decoration: none;
    color: #666;
}

a:hover {
    color: #000;
}

ul {
    list-style-type: none;
}
</style>
<style lang="scss" scoped>
$total_width:1024px;
$header_height:96px;

/*PC样式优先，固定布局*/

.inner {
    width: $total_width;
    margin: 0 auto;
}

.wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    background-color: rgba(250, 250, 250, 0.93);
}

.header {
    height: $header_height;
    position: relative;
    width: $total_width;
    margin: 0 auto;

    &-menu{
        display: none;
    }

    &-logo {
        display: inline-block;
        height: 100%;

        img {
            height: 100%;
        }
    }

    &-list {
        display: inline-block;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 80%;
        height: 2em;
        margin: auto;

        li {
            display: inline;
            height: 100%;
            margin: 0 2em;
            float: left;
        }

        img {
            width: 2em;
            height: 2em;
            margin: 0 .8em;
            vertical-align: middle;
        }
    }

    &-search {
        position: absolute;
        width: 45%;
        height: 2em;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;

        &-back {
            position: absolute;
            font-size: 12px;
            right: 0;
            top: 50%;
            margin-top: -6px;

            &:hover {
                cursor: pointer;
            }
        }
    }

    &-log {
        display: inline-block;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        height: 2em;
        margin: auto 1em;

        span {
            cursor: pointer;
        }

        &-avatar {
            display: inline-block;
            width: 3em;
            height: 3em;
            border-radius: 50%;
            margin-top: -.5em;
            vertical-align: middle;
            overflow: hidden;

            .img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        &-quit {
            margin: 0 .3em;
        }
    }
}

.content {
    background-color: #fff;

    &-begin {
        margin-top: $header_height;
    }
}

.footer {
    position: absolute;
    left: 0;
    right: 0;
    padding: 15px 0;
    text-align: center;
    background-color: rgba(250, 250, 250, 0.93);
    outline: 1000px solid rgba(250, 250, 250, 0.93);
    clip: rect(0 9999px 9999px 0);
}

.hidden{
    display: block;
}
.cursor {
    cursor: pointer;
}

.bigger-fix {
    box-sizing: border-box;
    padding: .25em;
}

/*宽屏移动设备，流式布局*/
@media screen and (max-width: $total_width){
    .header{
        width: 100%;
    }
    .inner{
        width: 100%;
    }
}

@media screen and (min-width: 650px) and (max-width: 860px){
    .header{
        font-size: 12px;
        height: 60px;
    }
    .header-list>li{
        margin: 0 4%;
    }
}

$header_height: 10vw;
$side_bar_color: #fff;
@media screen and (max-width: 650px){
    .header{
        height: $header_height;
        font-size: 3vw;

        &-menu{
            display: inline-block;
            width: 5vw;
            height: 5vw;
            margin: 2vw 4vw;
            vertical-align: top;
        }

        &-logo{
            width: 20vw;
            height: 100%;
            background: url(./assets/img/logo2.png) no-repeat;
            background-size: contain;

            img{
                display: none;
            }
        }

        &-list{
            left: 0;
            bottom: auto;
            height: auto;
            width: 100%;
            margin-top: $header_height;
            font-size: 16px;
            border-radius: .3em;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            text-align: left;
            background-color: $side_bar_color;

            &>li{
                display: block;
                float: none;
                margin: 0;

                &>a{
                    display: block;
                }

                &:hover{
                    background: rgba(250, 250, 250, 0.8);
                }

                &:last-child{
                    display: none;
                }
            }

            img{
                width: 5vw;
                visibility: hidden;
            }
        }

        &-search{
            display: block !important;
            width: 40vw;
            margin-left: 36vw;

            &-back{
                visibility: hidden;
            }
        }

        &-log{
            height: $header_height;
            line-height: $header_height;
            margin: auto 2vw;
        }
    }
    .footer{
        padding: 0;
    }
}
</style>