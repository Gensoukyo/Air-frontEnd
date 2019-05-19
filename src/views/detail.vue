<template>
    <div class="content">
        <div v-if="type!=='song'">
            <div class="info">
                <span class="info-title">歌曲列表</span>
                <span v-if="info.listInfo.length" class="info-counter">{{info.listInfo.length}}首歌</span>
                <span v-if="info.collect.length" class="info-collect">{{info.collect.length}}收藏</span>
            </div>
            <table class="list">
                <tr class="list-row list-header">
                    <th><span class="list-playall" @click="addAllSongs()"></span></th>
                    <th>
                        <div class="list-header-name">标题</div>
                    </th>
                    <th>
                        <div class="list-header-duration">时长</div>
                    </th>
                    <th>
                        <div class="list-header-artist">歌手</div>
                    </th>
                    <th v-if="type==='playlist'">
                        <div class="list-header-album">专辑</div>
                    </th>
                </tr>
                <tr v-for="(song,index) in info.listInfo"
                    class="list-row"
                    @click="setCurrentSongById(song.sid)">
                    <td>
                        <div class="cell">
                            <span class="list-item-counter">{{index+1}}</span>
						</div>
                    </td>
                    <td>
                        <div class="cell">
                            <router-link class="list-item-name" :to="{ path: '/song', query: { id: song.sid }}">{{song.name}}</router-link>
                        </div>
                    </td>
                    <td>
                        <div class="cell">
                            <div class="list-item-duration">{{parseTimestamp(song.duration)}}</div>
                            <span class="list-item-add"
                            	@click="addNextSongById($event,song.sid)">+</span>
                        </div>
                    </td>
                    <td>
                        <div class="cell">{{info.artist||song.artist}}</div>
                    </td>
                    <td v-if="type==='playlist'">
                        <div class="cell">
                            <router-link class="list-item-name"
                            	:to="{ path: '/album', query: { id: song.albumId }}">{{song.albumName}}</router-link>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <div class="info">
                <span class="info-title">评论</span>
                <span v-if="info.comment.length" class="info-counter">{{info.comment.length}}条评论</span>
            </div>
            <comment-list class="comment" :type="type" :id="id" :commentids="info.comment"></comment-list>
        </div>
    </div>
</template>
<script>
import commentList from '../components/comment-list.vue';
export default {
    components: {
        commentList
    },
    props: ['type', 'id'],
    data() {
        return {
            info: {
                listInfo: [],
                collect: [],
                comment: []
            },
            list: []
        }
    },
    watch: {
        '$route': 'fetchData'
    },
    created() {
        this.fetchData();
    },
    beforeRouteLeave(to, from, next) {
        let id = this.$store.state.currentSong.sid;
        let { name, artist, image, albumName } = this.$store.state.currentSong;
        this.$store.commit('setGlobalDetail', {
            type: 'song',
            id,
            name,
            image,
            artistOrPublisherOrAuthor: artist,
            albumNameOrPubDateOrTag: albumName
        });
        next();
    },
    methods: {
        fetchData() {
            let url = '/api/' + this.type + '?id=' + this.id;
            return this.axios.get(url).then((response) => {
                if (response.data.success && response.data) {
                    this.info = response.data.data;
                    this.setData();
                } else {
                    this.$store.commit('setFlashMsg', '获取信息失败');
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 5000);
                }
            });
            // let stateListType=this.type+'List';
            // let idType=this.type.charAt(0)+'id';
            // this.info=this.$store.state[stateListType].find(item => item[idType] === this.id);
            // this.setData();
        },
        updateCurrentSong(song){
            this.$store.commit('setCurrentPlayList', {
                method: 'add',
                items: [song]
            });
            this.$store.commit('setCurrentSong', song);
        },
        setData() {
            //更新歌曲列表，设置当前歌曲，页面标题
            if (this.type === 'song') {
                this.updateCurrentSong(this.info);
                document.title = this.info.name + ' - ' + this.info.artist + ' - 单曲';
            } else {
                if (this.type === 'album') {
                    this.list = this.info.listInfo.map((s) => {
                        let { sid, name, duration } = s;
                        return {
                            sid,
                            name,
                            duration,
                            artist: this.info.artist,
                            image: this.info.image,
                            albumName: this.info.name,
                            albumId: this.info.aid
                        };
                    });
                    // 将第一首歌设为当前播放
                    this.updateCurrentSong(this.list[0]);
                    this.$store.commit('setGlobalDetail', {
                        type: 'album',
                        id: this.info.aid,
                        name: this.info.name,
                        image: this.info.image,
                        artistOrPublisherOrAuthor: this.info.publisher,
                        albumNameOrPubDateOrTag: this.info.pubDate
                    });
                } else {
                    let song=this.info.listInfo[0];
                    let url='/api/song?id=' + song.sid;
                    this.updateCurrentSong(song);
                    this.axios.get(url)
                    .then((response) => {
                        let cover=response.data.data.image;
                        this.$store.commit('setGlobalDetail', {
                            type: 'playlist',
                            id: this.info.pid,
                            name: this.info.name,
                            image: cover,
                            artistOrPublisherOrAuthor: this.info.author,
                            albumNameOrPubDateOrTag: this.info.tag.join(',')
                        });
                    })
                    .catch( e =>{
                        console.error(e);
                    })
                }
                document.title = this.type === 'album' ?
                    this.info.name + ' - ' + this.info.artist + ' - 专辑' :
                    this.info.name + ' - 歌单';
            }
        },
        parseTimestamp(t) {
            let m, s;
            m = Math.floor(Number.parseInt(t) / 60000);
            s = Math.floor(Number.parseInt(t) % 60000 / 1000);
            return (m < 10 ? ('0' + m) : m) + ':' + (s < 10 ? ('0' + s) : s);
        },
        setCurrentSongById(sid) {
            if (this.type === 'album') {
                let song = this.list.find(s => s.sid === sid);
                this.$store.commit('setCurrentPlayList', {
                    method: 'add',
                    items: [song]
                });
                this.$store.commit('setCurrentSong', song);
            } else {
                this.$store.dispatch('getSongById', sid).then((result) => {
                    if (result) {
                        this.$store.commit('setCurrentPlayList', {
                            method: 'add',
                            items: [result]
                        });
                        this.$store.commit('setCurrentSong', result);
                    } else {
                        throw new Error('歌曲不存在');
                    }
                }).catch(e => {
                    this.$store.commit('setFlashMsg', e.message);
                });
            }
        },
        addNextSongById(e,sid) {
            e.stopPropagation();
            if (this.type === 'album') {
                let song = this.list.find(s => s.sid === sid);
                this.$store.commit('setCurrentPlayList', {
                    method: 'add',
                    items: [song]
                });
            } else {
                this.$store.dispatch('getSongById', sid).then((result) => {
                    if (result) {
                        this.$store.commit('setCurrentPlayList', {
                            method: 'add',
                            items: [result]
                        });
                    } else {
                        throw new Error('歌曲不存在');
                    }
                }).catch(e => {
                    this.$store.commit('setFlashMsg', e.message);
                });
            }
        },
        addAllSongs() {
            this.$store.commit('setCurrentPlayList', {
                method: 'reset',
                items: this.list
            });
            this.$store.commit('setCurrentSong', this.list[0]);
        }
    }
}
</script>
<style lang="scss" scoped>
$player_width:330px;
$list_header_height:38px;

.content {
    margin-left: 15px;
    margin-right: $player_width;
}

.info {
    margin-top: 15px;
    padding: 5px;
    font-size: 12px;
    border-bottom: 2px solid #C10D0C;

    &-title {
        font-size: 20px;
        line-height: 1.5;
        margin-right: 20px;
    }

    &-collect {
        float: right;
        margin-top: 10px;
    }
}

.list {
    display: block;
    border: 1px solid #d9d9d9;
    border-spacing: 0;
    font-size: 13px;

    &-row {
        height: 30px;

        &:nth-child(odd) {
            background-color: #f7f7f7;
        }

        &:hover {
            .list-item-duration {
                display: none;
            }

            .list-item-add {
                display: inline;
                line-height: 1;
                color: #000;
            }
        }
    }

    &-header {
        width: $list_header_height;
        text-align: left;
        padding: 10px 0;

        th {
            width: 1%;
        }
    }

    &-playall {
        line-height: $list_header_height;
        margin: 1em;
        padding:5px 25px;
        background: no-repeat url(../assets/svgFont/playall.svg);
        background-position: left;
        cursor: pointer;
    }

    &-item {
        &-counter {
            margin: 0 1em;
            text-align: center;
        }

        &-name:hover {
            text-decoration: underline;
        }

        &-add {
            display: none;
            font-size: 23px;
            color: #666;
            cursor: pointer;
        }
    }
}

.cell {
    max-width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: normal;
}

@media screen and (max-width: 1024px){
    .content{
        margin: 0 15px;
    }
}
@media screen and (max-width: 650px){
    .cell{
        max-width: 20vw;
    }
}
</style>