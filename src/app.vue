<template>
    <div class="inner">
        <div class="wrapper">
            <header class="header">
                <router-link to="/" class="header-logo"><img src="./assets/img/logo.png" alt="网站logo"></router-link>
                <ul v-show="navVisibility" class="header-list">
                    <li>
                    	<a href="#song"><img src="./assets/svgFont/recommend.svg" alt="推荐">推荐</a>
                    </li>
                    <li>
                    	<a href="#playlist"><img class="bigger-fix" src="./assets/svgFont/playlist.svg" alt="歌单">歌单</a>
                    </li>
                    <li @click="setLogOverlay()">
                        <router-link to="/user"><img src="./assets/svgFont/like.svg" alt="我的">我的</router-link>
                    </li>
                    <li @click="navVisibility=!navVisibility" style="cursor: pointer;">
                        <img src="./assets/svgFont/search.svg" alt="搜索">搜索
                    </li>
                </ul>
                <div v-show="!navVisibility&&searchBarVisiable" class="header-search">
                    <search-bar @hiddenbar="hiddenBar()"></search-bar>
                    <span class="header-search-back" @click="hiddenBar()">取消</span>
                </div>
                <div v-if="!$store.state.auth" class="header-log">
                	<span @click="setLogOverlay()">登录</span>&nbsp;|&nbsp;<span @click="prepareRegister()">注册</span>
                </div>
                <div v-else class="header-log">
                	<router-link to="/user"><img class="header-log-avatar" :src="userInfo.avatar" alt="头像"></router-link>
                	<span class="header-log-quit" @click="logOut()">退出</span>
                </div>
            </header>
        </div>
        <log-popup v-if="$store.state.overlayVisibility"></log-popup>
        <router-view class="content content-begin" name="play"></router-view>
        <router-view class="content"></router-view>
        <footer class="footer">
            <p>Created by Gensoukyo!</p>
        </footer>
    </div>
</template>
<script>
	import searchBar from './components/search-bar.vue'
	import logUser from './components/log-user.vue'
	import logPopup from './components/log-popup.vue'
	export default {
	    components: {
	        searchBar,
	        logUser,
	        logPopup
	    },
	    data() {
	        return {
	        	navVisibility: this.$store.state.navVisibility,
	            searchBarVisiable:true,
	            timer:null
	        }
	    },
	    computed:{
	    	userInfo(){
	    		return this.$store.state.userInfo||'http://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=50y50';
	    	}
	    },
	    methods: {
	        handleScroll() {
	        	let whitePathList=['/user','/message'];
	        	let visable=window.scrollY<300 ? true:false;
	        	if (whitePathList.includes(this.$route.path)) return ;
	            this.timer=setTimeout(() => {
	                this.$store.commit('setNavVisibility',visable);
	                this.navVisibility=visable;
	                this.searchBarVisiable=visable;
	            }, 1000);
	        },
	        setLogOverlay(){
	        	this.$store.commit('setLogOverlay');
	        },
	        hiddenBar(){
	        	this.navVisibility=!this.navVisibility
	        },
	        prepareRegister(){
	        	this.$store.commit('setOptionForReg',true);
	        	this.$store.commit('setLogOverlay');
	        },
	        logOut(){
	        	this.$store.commit('setAuth',false);
	        	this.$store.commit('setUserInfo',{});
	        }
	    },
	    mounted() {
	        window.addEventListener('scroll', this.handleScroll);
	    },
	    beforeDestroy() {
	        window.removeEventListener('scroll', this.handleScroll);
	        clearTimeout(this.timer);
	    }
	}
</script>
<style lang="scss">
	* {
	    margin: 0;
	    padding: 0;
	}

	body {
	    min-height: 100%;
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
	    text-align: center;

	    &-logo {
	        display: inline-block;
	        position: absolute;
	        left: 0;
	        width: $header_height;
	        height: 100%;

	        img {
	            width: 100%;
	            height: 100%;
	        }
	    }

	    &-list {
	        display: inline-block;
	        margin: 0 auto;
	        padding: 0;
	        overflow: hidden;

	        li {
	            display: inline;
	            line-height: $header_height/3;
	            margin: $header_height/3 40px;
	            float: left;
	            vertical-align: middle;
	        }

	        img {
	            width: $header_height/3;
	            height: $header_height/3;
	            margin: 0 10px;
	            vertical-align: middle;
	        }
	    }

	    &-search {
	        display: inline-block;
	        width: 30%;
	        height: $header_height/3;
	        margin: $header_height/3 0;

	        &-back {
                position: absolute;
	            line-height: $header_height/3;
                top: $header_height/3;
                right: 30%;
                margin-right: -10px;
                font-size: 12px;

                &:hover{
                	cursor: pointer;
                }
	        }
	    }

	    &-log {
	        display: inline-block;
	        position: absolute;
	        right: 0;
	        height: $header_height/2;
	        line-height: $header_height/2;
	        margin: $header_height/4 0;

	        span{
	        	cursor: pointer;
	        }

	        &-avatar{
	        	width: $header_height/2;
	        	border-radius: 50%;
	        	vertical-align: middle;
	        }

	        &-quit{
	        	margin: 0 15px;
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
	    margin: 0 auto;
	    margin-top: 10px;
	    padding: 15px 0;
	    text-align: center;
	    background-color: rgba(250, 250, 250, 0.93);
	}

	.bigger-fix{
		box-sizing:border-box;
		padding: 3px;
	}
</style>