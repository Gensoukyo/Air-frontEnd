<template>
    <div class="profile">
        <div class="profile-header">
            <div class="profile-header-content">
                <router-link class="profile-header-avatar"
                    :to="{ path: '/user', query: { id: userInfo.uid }}">
                    <img :src="setImgSourseSize(userInfo.avatar,100)" alt="头像">
                 </router-link>
                <h1 class="profile-name">{{userInfo.username}}</h1>
            </div>
        </div>
        <div v-if="!id" class="profile-main">
            <ul class="profile-nav-list">
                <li class="profile-nav-item"
                	@click="switchNavIndex(0)">单曲</li>
                <li class="profile-nav-item"
                	@click="switchNavIndex(1)">专辑</li>
                <li class="profile-nav-item"
                	@click="switchNavIndex(2)">歌单</li>
                <li class="profile-nav-item"
                	@click="switchNavIndex(3)">评论</li>
            </ul>
            <div v-show="navIndex===0" class="profile-content">
                <ul>
                    <li class="profile-content-tab width-per40">单曲</li>
                    <li class="profile-content-tab width-per20">歌手</li>
                    <li class="profile-content-tab width-per20">专辑</li>
                    <li class="profile-content-tab width-per15 profile-content-last">时长</li>
                </ul>
                <ul v-if="songs.length">
                    <li v-for="(song,index) in songs" class="profile-content-item">
                        <div class="profile-content-name">
                            <img class="profile-content-cover"
                            	:src="setImgSourseSize(song.image,50)" alt="封面">
                            <router-link class="profile-content-link"
                            	:to="{ path: '/song', query: { id: song.sid }}">{{song.name}}</router-link>
                            <div class="profile-content-action">
                                <img src="../assets/svgFont/trash.svg" alt="删除"
									@click="deleteCollect(index,'song',song.sid)">
                                <img src="../assets/svgFont/add.svg" alt="下一首"
									@click="addNextSong(index)">
							</div>
                            </div>
                            <span class="profile-content-inline width-per20">{{song.artist}}</span>
                            <router-link class="profile-content-link width-per20"
                            	:to="{ path: '/album', query: { id: song.albumId }}">{{song.albumName}}</router-link>
                            <span class="profile-content-inline width-per15 profile-content-last">{{parseTimestamp(song.duration)}}</span>
                    </li>
                </ul>
            </div>
            <div v-show="navIndex===1" class="profile-content">
                <ul>
                    <li class="profile-content-tab width-per40">专辑</li>
                    <li class="profile-content-tab width-per15">曲数</li>
                    <li class="profile-content-tab width-per20">歌手</li>
                    <li class="profile-content-tab width-per20 profile-content-last">发行日</li>
                </ul>
                <ul v-if="albums.length">
                    <li v-for="(album,index) in albums" class="profile-content-item">
                        <div class="profile-content-name profile-content-long">
                            <img class="profile-content-cover"
                            	:src="setImgSourseSize(album.image,50)" alt="封面">
                            <router-link class="profile-content-link"
                            	:to="{ path: '/album', query: { id: album.aid }}">{{album.name}}</router-link>
                            <div class="profile-content-action">
                                <img src="../assets/svgFont/trash.svg" alt="删除"
									@click="deleteCollect(index,'album',album.aid)">
							</div>
                            </div>
                            <span class="profile-content-inline width-per10">{{album.listInfo.length}}</span>
                            <span class="profile-content-inline width-per20">{{album.artist}}</span>
                            <span class="profile-content-inline width-per20 profile-content-last">{{album.pubDate}}</span>
                    </li>
                </ul>
            </div>
            <div v-show="navIndex===2" class="profile-content">
                <ul>
                    <li class="profile-content-tab width-per40">歌单</li>
                    <li class="profile-content-tab width-per10">曲目数</li>
                    <li class="profile-content-tab width-per20">创建者</li>
                    <li class="profile-content-tab width-per10 profile-content-last">标签</li>
                </ul>
                <ul v-if="playlists.length" class="profile-content-list">
                    <li v-for="(playlist,index) in playlists" class="profile-content-item">
                        <div class="profile-content-name">
                            <img class="profile-content-cover"
                            	:src="setImgSourseSize(playlist.image,50)" alt="封面">
                            <router-link class="profile-content-link"
                            	:to="{ path: '/playlist', query: { id: playlist.pid }}">{{playlist.name}}</router-link>
                            <div class="profile-content-action">
                                <img src="../assets/svgFont/trash.svg" alt="删除"
									@click="deleteCollect(index,'playlist',playlist.pid)">
							</div>
                            </div>
                            <span class="profile-content-inline width-per15">{{playlist.listInfo.length}}</span>
                            <span class="profile-content-inline width-per20">{{playlist.author}}</span>
                            <span class="profile-content-inline width-per15 profile-content-last">{{playlist.tag.join('，')}}</span>
                    </li>
                </ul>
            </div>
            <div v-show="navIndex===3" class="profile-content">
                <div v-if="comments.length" class="profile-comment-list">
                    <div v-for="(comment,index) in comments" class="profile-content-item">
                        <div v-if="comment.target.data">
                            <img class="profile-content-cover"
                            	:src="setImgSourseSize(comment.target.data.image,50)" alt="封面">
                            <router-link class="profile-content-link"
                            	:to="{ path: '/'+comment.target.ttype , query: { id: comment.target.tid }}">{{comment.target.data.name}}</router-link>
                            <span class="profile-comment-info">
								<span>{{dateFormat(comment.comment_time)}}</span>
                            <span class="profile-comment-action"
									@click="deleteComment()">删除</span>
                            </span>
                        </div>
                        <div class="profile-comment-content">{{comment.content}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="profile-content">
            <div class="profile-avatar">
                <div class="profile-header-avatar">
                    <img :src="setImgSourseSize(userInfo.avatar,100)" alt="头像">
                </div>
                <input id="avatar" type="file" accept="image/*" style="display: none;"
                    @change="handlefile($event)">
                <label class="profile-action" for="avatar">修改</label>
            </div>
            <div class="profile-detail">
                <h1 class="profile-name">{{userInfo.username}}</h1><span>{{userInfo.sex}}</span>
                <p>{{userInfo.desc||'这个人很懒，什么都没写~'}}</p>
            </div>
        </div>
        <div>
        </div>
    </div>
</template>
<script>
import dateFormat from '../lib/date-format.js';
export default {
    props: ['id'],
    data() {
        return {
            songs: [],
            albums: [],
            playlists: [],
            comments: [],
            navIndex: 0
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.getAndSetData('song');
            this.getAndSetData('album');
            this.getAndSetData('playlist');
            //获取用户本人评论
            this.getAndSetComments(1);
        },
        getAndSetData(type) {
            let token = localStorage.getItem('token');
            this.axios.get('/api/user/collect?type=' + type, {
                headers: { 'x-access-token': token }
            }).then((resopnse) => {
                if (resopnse.data.success) {
                    type = type + 's';
                    this[type] = resopnse.data.data;
                } else {
                    this.$store.commit('setFlashMsg', '获取收藏失败');
                }
            }).catch(e => {
                this.$store.commit('setFlashMsg', e.message);
            })
        },
        getAndSetComments(page) {
            this.axios.get('/api/comment', {
                params: {
                    page: page,
                    id: this.userInfo.comment
                },
                timeout: 5000
            }).then((response) => {
                if (response.data.success) {
                    this.comments = response.data.data;
                    let promises = this.comments.map((item, index) => {
                        return new Promise((resolve, reject) => {
                            let url = '/api/' + item.target.ttype + '?id=' + item.target.tid;
                            this.axios.get(url).then((resopnse) => {
                                if (resopnse.data.success) {
                                    item.target.data = resopnse.data.data;
                                    this.$set(this.comments, index, item);
                                } else {
                                    this.comments.splice(index, 1);
                                }
                                resolve();
                            })
                        })
                    });
                    Promise.all(promises).catch(e => console.log(e));
                } else {
                    this.$store.commit('setFlashMsg', '获取评论失败');
                }
            }).catch(e => console.error(e))
        },
        addNextSong(index) {
            this.$store.commit('setCurrentPlayList', {
                method: 'add',
                items: [this.songs[index]]
            });
        },
        deleteCollect(index, type, id) {
            let token = localStorage.getItem('token')||'';
            this.axios.delete('/api/user/collect', {
                data: {
                    target: {
                        ttype: type,
                        tid: id
                    }
                },
                headers: { 'x-access-token': token }
            }).then((response) => {
                if (response.data.success) {
                    type = type + 's';
                    this[type].splice(index, 1);
                } else {
                    this.$store.commit('setFlashMsg', '取消收藏失败');
                }
            }).catch(e => {
                this.$store.commit('setFlashMsg', e.message);
            });
        },
        deleteComment(index) {
            let token = localStorage.getItem('token')||'';
            this.axios.delete('/api/comment', {
                data: {
                    cid: this.comments[index].cid
                },
                headers: { 'x-access-token': token }
            }).then((response) => {
                if (response.data.success) {
                    this.comments.splice(index, 1);
                } else {
                    this.$store.commit('setFlashMsg', '删除评论失败');
                }
            }).catch(e => {
                this.$store.commit('setFlashMsg', e.message);
            });
        },
        handlefile(e){
            var file = e.target.files[0];
            var imageType = /^image\/(png|jpg|jpeg)/i;
            if (!imageType.test(file.type)){
                return this.$store.commit('setFlashMsg','不支持该图片格式！');
            }
            var objectURL = window.URL.createObjectURL(file);
            this.userInfo.avatar=objectURL;
            this.$store.commit('setUserInfo',this.userInfo);
            let token = localStorage.getItem('token')||'';
            let data = new FormData();
            data.append('imgType',file.type);
            data.append('avatar', file);
            this.axios.put('/api/user/info', data, {
                headers: { 'x-access-token': token}
            }).then((response) => {
                if(response.data.success){
                    this.$store.commit('setFlashMsg','修改成功！');
                } else {
                    throw new Error('上传失败！');
                }
            }).catch(e =>this.$store.commit('setFlashMsg',e.message))
        },
        setImgSourseSize(url, size) {
            return /^http/.test(url)
                ?url + '?param=' + size + 'y' + size
                :url;
        },
        parseTimestamp(t) {
            let m, s;
            m = Math.floor(Number.parseInt(t) / 60000);
            s = Math.floor(Number.parseInt(t) % 60000 / 1000);
            return (m < 10 ? ('0' + m) : m) + ':' + (s < 10 ? ('0' + s) : s);
        },
        switchNavIndex(index) {
            this.navIndex = index;
        },
        dateFormat(t) {
            return dateFormat(t);
        }
    }
}
</script>
<style lang="scss" scoped="">
$header_height:96px;
$bg_image_height:300px;
$content_item_height:50px;

.text-overflow {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.width-per10 {
    width: 10%
}

.width-per15{
    width: 15%;
}

.width-per20 {
    width: 20%
}

.width-per30 {
    width: 30%
}

.width-per40 {
    width: 40%
}

.profile {
    padding-top: $header_height;

    &-header {
        height: $bg_image_height;
        line-height: $bg_image_height;
        text-align: center;
        background: no-repeat url(http://wx4.sinaimg.cn/large/006RXp8Mgy1fxzgzjsqd8j30nm0aamxy.jpg);
        background-size: cover;

        &-content {
            display: inline-block;
            line-height: 1.5;
            vertical-align: middle;
        }

        &-avatar {
            display: inline-block;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;

            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    &-nav {
        &-list {
            margin-top: -40px;
            margin-left: 15px;
        }

        &-item {
            display: inline-block;
            width: 20%;
            padding: 10px 0;
            color: #fff;
            cursor: pointer;
        }
    }

    &-content {
        overflow: hidden;

        &-tab {
            display: inline-block;
            box-sizing: border-box;
            padding: 10px;
        }

        &-item {
            line-height: 0;
            margin-bottom: 10px;
            padding: 10px;

            &:nth-child(odd) {
                background-color: #f7f7f7;
            }

            &:hover .profile-content-action {
                display: inline-block;
            }
        }

        &-name {
            position: relative;
            box-sizing: border-box;
            width: 40%;
            @extend .text-overflow;
        }

        &-cover {
            margin-right: 10px;
        }

        &-action {
            display: none;
            position: absolute;
            right: 0;
            line-height: $content_item_height;
            margin: 0 10px;

            img {
                vertical-align: middle;
                cursor: pointer;
            }
        }

        &-inline {
            line-height: $content_item_height;
            @extend .text-overflow;
        }

        &-link {
            line-height: $content_item_height;
            @extend .text-overflow;

            &:hover {
                text-decoration: underline;
            }
        }

        &-long {
            width: 40%;
        }

        &-last {
            padding-right: 0;
            text-align: right;
        }
    }

    &-comment {
        &-info {
            float: right;
            line-height: $content_item_height;
        }

        &-action {
            margin: 0 15px;
        }

        &-content {
            display: inline-block;
            text-indent: 65px;
            padding: 20px 0;
        }
    }

    &-avatar{
        float: left;
        width: 100px;
        margin-right: 50px;
        margin-top: 20px;
    }

    &-action{
        display: block;
        text-align: center;
        cursor: pointer;
    }

    &-detail{
        margin-top: 20px;
    }
}

@media screen and (max-width: 860px){
    .profile{
        padding-top: 60px;
    }
}
@media screen and (max-width: 650px){
    .profile{
        padding-top: 10vw;
    }
}
</style>