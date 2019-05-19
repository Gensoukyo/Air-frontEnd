<template>
    <div class="play-wrapper">
        <div class="display">
            <div class="display-info">
                <div>
                    <div class="display-info-name">
                        <span>{{ translateType() }}：</span>
                        <router-link :to="nameLink">{{globalDetail.name}}</router-link>
                    </div>
                    <div>
                        <span>{{globalDetail.type!=='playlist'?'歌手：':'创建者：'}}</span>
                        {{globalDetail.artistOrPublisherOrAuthor}}
                    </div>
                    <div>
                        <span v-if="globalDetail.type!=='album'">
							<span v-if="globalDetail.type==='playlist'">标签：{{globalDetail.albumNameOrPubDateOrTag}}</span>
                        <span v-else>所属专辑：<router-link class="display-info-link" :to="albumLink">{{globalDetail.albumNameOrPubDateOrTag}}</router-link></span>
                        </span>
                        <span v-else>
							<span>发行日期：</span>
                        <span>{{globalDetail.albumNameOrPubDateOrTag}}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div :class="[{'player-bar-content':!navVisibility},'player-bar-content-fix']">
                <div v-show="maskLayerVisibility" class="mask-layer">
                    <img class="mask-layer-cover"
                    	:src="currentSong.image" alt="封面">
				</div>
                <div v-if="autoplay" v-html="musicFrame"></div>
                <iframe v-else id="music-frame" frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height=86 :src="musicFrameSrc"></iframe>
            </div>
            <div :class="['display-controller',{'player-bar-controller':!navVisibility}]">
                <span @click="playListVisibility=!playListVisibility">
				<img v-show="!playListVisibility"
					src="../assets/svgFont/list.svg" alt="展开">
				<img v-show="playListVisibility"
					src="../assets/svgFont/unfold.svg" alt="收起">
				</span>
                    <span @click="likeSong()">
					<img v-show="!likeTheSong"
						src="../assets/svgFont/like.svg" alt="取消">
					<img v-show="likeTheSong"
						src="../assets/svgFont/like_fill.svg" alt="喜欢">
				</span>
                    <span @click="preSong()">
					<img src="../assets/svgFont/pre.svg" alt="上一首">
				</span>
                    <span @click="nextSong()">
					<img src="../assets/svgFont/next.svg" alt="下一首">
				</span>
                    <span>
					<img v-show="playModel==='one'"
						src="../assets/svgFont/one.svg" alt="单曲循环"
						@click="setListCirculation()">
					<img v-show="playModel==='cycle'"
						src="../assets/svgFont/cycle.svg" alt="列表循环"
						@click="setListCirculation(true)">
					<img v-show="playModel==='random'"
						src="../assets/svgFont/random.svg" alt="随机循环"
						@click="switchModel('one')">
				</span>
                <ul v-show="playListVisibility" class="display-list">
                    <li v-for="(song,index) in list">
                        <span :class="['display-list-name',{'display-list-current':song.sid===currentSong.sid}]"
							@click="setCurrentSong(song)">{{song.name}}</span>
                        <span class="display-list-artist">{{song.artist}}</span>
                        <img class="display-list-delete"
							@click="removeSong(index)" src="../assets/svgFont/close.svg" alt="移除">
				</li>
                </ul>
            </div>
        </div>
            <div class="play-cover">
                <img class="play-cover-img"
                	:src="globalDetail.image" @dblclick="autoplay=!autoplay" alt="封面">
		</div>
            </div>
</template>
<script>
let auto=0;
setTimeout(()=>{auto=1},1000);
export default {
    data() {
        return {
            playListVisibility: false,
            likeTheSong: false,
            playModel: 'one',
            autoplay: false,
            timer: null,
            flag: 0
        }
    },
    computed: {
        list() {
            return this.$store.state.currentPlayList;
        },
        currentSong() {
            return this.$store.state.currentSong;
        },
        globalDetail() {
            return this.$store.state.globalDetail;
        },
        navVisibility() {
            return this.$store.state.navVisibility;
        },
        musicFrameSrc() {
            return `//music.163.com/outchain/player?type=2&id=${this.currentSong.sid}&auto=${auto}&height=66`
        },
        musicFrame() {
            return `<iframe id="music-frame" frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height=86 src="${this.musicFrameSrc}"></iframe>`
        },
        nameLink() {
            return '/' + this.globalDetail.type + '?id=' + this.globalDetail.id;
        },
        albumLink() {
            return 'album?id=' + this.currentSong.albumId;
        },
        maskLayerVisibility() {
            return this.playModel === 'cycle' || this.playModel === 'random';
        }
    },
    watch: {
        currentSong(val) {
            this.$store.commit('setGlobalDetail', {
                type: 'song',
                id: val.sid,
                name: val.name,
                image: val.image,
                artistOrPublisherOrAuthor: val.artist,
                albumNameOrPubDateOrTag: val.albumName
            });
        },
        navVisibility(val) {
            this.playListVisibility = val;
        }
    },
    beforeDestroy() {
        clearTimeout(this.timer);
    },
    methods: {
        setCurrentSong(song) {
            this.$store.commit('setCurrentSong', song);
        },
        preSong() {
            let currentIndex = this.list.findIndex(s => s.sid === this.currentSong.sid);
            this.setCurrentSong(currentIndex ?
                this.list[currentIndex - 1] :
                this.list[this.list.length - 1]
            );
        },
        nextSong() {
            let currentIndex = this.list.findIndex(s => s.sid === this.currentSong.sid);
            this.setCurrentSong(currentIndex !== this.list.length - 1 ?
                this.list[currentIndex + 1] :
                this.list[0]
            );
        },
        likeSong() {
            if (this.$store.state.auth) {
                let token = localStorage.getItem('token');
                let target = {
                    ttype: 'song',
                    tid: this.currentSong.sid
                }
                //根据当前歌曲是否被收藏发送不同请求
                let promise = this.likeTheSong ?
                    this.axios.delete('/api/user/collect', {
                        data: { target },
                        headers: { 'x-access-token': token }
                    }) :
                    this.axios.post('/api/user/collect', { target }, {
                        headers: { 'x-access-token': token }
                    })
                promise.then((response) => {
                    if (response.data.success) {
                        this.likeTheSong = !this.likeTheSong;
                    } else {
                        this.$store.commit('setFlashMsg', '操作失败');
                    }
                }).catch(e => {
                    this.$store.commit('setFlashMsg', e.message);
                });
            } else {
                this.$store.commit('setLogOverlay');
            }
        },
        removeSong(index) {
            if (this.list.length > 1) {
                if (this.list[index].sid === this.currentSong.sid) {
                    this.nextSong()
                }
                this.$store.commit('setCurrentPlayList', {
                    method: 'remove',
                    index: index
                });
            }
        },
        switchModel(model) {
            clearTimeout(this.timer);
            this.playModel = model;
        },
        setListCirculation(shuffle = false) {
            clearTimeout(this.timer);
            if(this.autoplay){
                let resumeObj=Object.assign({},this.currentSong);
                this.setCurrentSong(resumeObj);
            }else{
                document.getElementById('music-frame').src = this.musicFrameSrc;
            }
            if (shuffle) {
                this.list.sort(() => Math.random() - 0.5);
                this.switchModel('random');
            } else {
                this.switchModel('cycle');
            }

            function circulate() {
                this.timer = setTimeout(() => {
                    let currentIndex = this.list.findIndex(s => s.sid === this.currentSong.sid);
                    this.$store.commit('setCurrentSong', currentIndex !== this.list.length - 1 ?
                        this.list[currentIndex - 1] :
                        this.list[0]);
                    circulate.bind(this)();
                }, this.currentSong.duration);
            }
            circulate.bind(this)();
        },
        translateType() {
            let typeMap = new Map([
                ['song', '单曲'],
                ['album', '专辑'],
                ['playlist', '歌单']
            ]);
            return typeMap.get(this.globalDetail.type);
        }
    }
}
</script>
<style lang="scss" scoped>
$header_height:96px;
$main_height:400px;
$player_width:330px;
$icon_font_size:32px;
$list_lineheight:25px;
$current_mark_width:24px;

.play-wrapper {
    min-height: $main_height;
}

.play-cover {
    margin-right: $player_width;
    padding: 10px 0;
    text-align: center;

    &-img {
        width: 72%;
        border-radius: 1%;
    }
}

.mask-layer {
    position: absolute;
    width: $player_width - 20px;
    height: 66px;
    margin: 10px;
    z-index: 99;
    background-color: rgba(255, 255, 255, .93);
    box-shadow: 0 0 10px #ccc;

    &-cover {
        width: 66px;
        height: 100%;
        border-top-left-radius: 2px;
    }
}

.display {
    box-sizing: border-box;
    float: right;
    width: $player_width;
    height: 100%;

    &-info {
        padding: 10px 20px;
        font-size: 15px;

        &-name {
            font-size: 20px;
            color: #666;
        }

        &-link:hover {
            text-decoration: underline;
        }
    }

    &-controller {
        position: relative;
        padding: 10px;
        font-size: 14px;
        z-index: 0;
        left: 0;
        transition: all .5s;

        img {
            width: $icon_font_size;
            height: $icon_font_size;
            margin: 0 10px;
            cursor: pointer;
        }
    }

    &-list {
        padding: 17px;
        background-color: rgba(250, 250, 250, 0.93);
        box-shadow: 0 0 1px #ccc;

        li {
            position: relative;
            height: $list_lineheight;
            color: #666;
        }

        &-current {
            color: #000;

            &:before {
                content: url(../assets/svgFont/play_fill.svg);
                float: left;
            }
        }

        &-name,
        &-artist {
            position: absolute;
            line-height: $list_lineheight;
            overflow: hidden;
            white-space: nowrap;
            /*不显示的地方用省略号...代替*/
            text-overflow: ellipsis;
        }

        &-name {
            left: 0;
            width: 45%;
            cursor: pointer;
        }

        &-artist {
            left: 50%;
            width: 30%;
        }

        .display-list-delete {
            position: absolute;
            right: 0;
            width: $list_lineheight;
            height: 100%;
            margin: 0;
        }
    }
}

.player-bar {
    &-content {
        position: fixed;
        top: 0;
        right: 50%;
        width: $player_width;
        z-index: 10;
    }

    &-controller {
        position: fixed;
        top: 0;
        left: 50%;
        line-height: $header_height;
        z-index: 10;
        transition: all .5s;
    }
}

@media screen and (min-width: 650px) and (max-width: 860px){
    .player-bar-content-fix{
        width: 280px;
        transform-origin: top left;
        transform: scale(0.7);
    }
    .display-controller{
        transform-origin: top left;
        transform: scale(.7);
    }
}

$cover_width: 68vw;
$cover_offsetY: 35vw;
$play_icon_width: 86px;
$player_bar_offsetY: 45vh;
@media screen and (max-width: 650px){

    .play-wrapper{
        position: relative;
        text-align: center;
        margin-top: 10vw;
        min-height: 86vh;
    }
    .display{
        width: 100%;
        float: none;
    }
    .player-bar-content-fix{
        position: absolute;
        left: 0;
        right: 0;
        top: $cover_width/2+$cover_offsetY;
        z-index: 1;
        width: $play_icon_width;
        height: $play_icon_width;
        border-radius: 50%;
        margin: auto;
        margin-top: -$play_icon_width/2;
        overflow: hidden;
    }
    #music-frame{
        transform-origin: $play_icon_width/2 $play_icon_width/2;
        transform: scale(1.3);
    }
    .display-controller{
        position: initial;
        margin: 0 auto;
        margin-top: 90vw;
    }
    .mask-layer{
        display: none;
    }
    .play-cover{
        position: absolute;
        left: 0;
        right: 0;
        width: $cover_width;
        margin: 0 auto;
        top: $cover_offsetY;
        padding: 0;
        border-radius: 50%;
        overflow: hidden;

        &>img{
            width: 100%;
        }
    }
}
</style>