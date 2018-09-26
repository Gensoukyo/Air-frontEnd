<template>
    <div class="search">
    	<div class="search-bar">
    		<input class="search-bar-input" type="text" name="search" placeholder="用户/音乐/专辑/歌单" v-model="keyword" @keyup.enter="getSearch()" @blur="clearState()" @focus="showState()">
    		<img class="search-bar-icon" src="../assets/svgFont/search.svg" alt="搜索" @click="getSearch()">
    	</div>
        <div v-show="resultShow" class="search-result">
        	<div v-show="users.length" class="search-part">
        	    <span class="search-part-type">用户</span>
        	    <ul class="search-part-list">
        	        <li v-for="user in users">
        	        	<router-link class="search-part-link"
        	        		:to="{ path: 'user', query: { uid: user.uid }}">{{user.username}}</router-link>
        	        </li>
        	    </ul>
        	</div>
        	<div v-show="songs.length" class="search-part">
        	    <span class="search-part-type">单曲</span>
        	    <ul class="search-part-list">
        	        <li v-for="song in songs">
        	        	<router-link class="search-part-link"
        	        		:to="{ path: 'play', params: { type: 'song' }, query: { sid: song.sid }}">{{song.name}} - {{song.artist}}</router-link>
        	        </li>
        	    </ul>
        	</div>
        	<div v-show="albums.length" class="search-part">
        	    <span class="search-part-type">专辑</span>
        	    <ul class="search-part-list">
        	        <li v-for="album in albums">
        	        	<router-link class="search-part-link"
        	        		:to="{ path: 'play', params: { type: 'album' }, query: { aid: album.aid }}">{{album.name}} - {{album.artist}}</router-link>
        	        </li>
        	    </ul>
        	</div>
        	<div v-show="playlists.length" class="search-part">
        	    <span class="search-part-type">歌单</span>
        	    <ul class="search-part-list">
        	        <li v-for="playlist in playlists">
        	        	<router-link class="search-part-link"
        	        		:to="{ path: 'play', params: { type: 'playlist' }, query: { pid: playlist.pid }}">{{playlist.name}} - {{playlist.author}}</router-link>
        	        </li>
        	    </ul>
        	</div>
        </div>
    </div>
</template>

<script>
	export default {
		data(){
			return {
				resultShow:false,
				keyword:'',
				timer:null,
				users:[],
				songs:[],
				playlists:[],
				albums:[]
			}
		},
		methods:{
			getSearch(){
				if (!this.keyword) {
					[this.users,this.songs,this.albums,this.playlists]=[[],[],[],[]];
					return this.clearState();
				}
				this.axios.get('/api/search',{
					params:{ keyword: this.keyword}
				}).then((response)=>{
					let result=response.data;
					if (result.success) {
						let data=result.data;
						let _this=this;
						this.users=data.user;
						this.songs=data.song;
						this.albums=data.album;
						this.playlists=data.playlist;
						this.$nextTick(()=>{
							_this.resultShow=data.user+data.song+data.album+data.playlist
								?true
								:false;
						});
					}
				}).catch(e=>console.log(e));
			},
			clearState(){
				this.resultShow=false;
			},
			showState(){
				if (this.keyword) {
					this.resultShow=true;
				}
			}
		},
		watch:{
			keyword(){
				clearTimeout(this.timer);
				this.timer=setTimeout(this.getSearch,500);
			}
		}
	}
</script>
<style lang="scss" scoped>
	$bar_height:32px;
	.search{
		width: 100%;
		min-height: 100%;

		&-bar{
			position: relative;
			width: 100%;
			height: $bar_height;
			padding: 0 10px;
			border: 1px solid #ccc;
			border-radius: $bar_height/2;
			background-color: #fff;

			&-input{
				width: 100%;
				height: 100%;
				border: none;

				&:focus{
					border:none;
					outline: 0;
				}
			}

			&-icon{
				position: absolute;
			    right: 10px;
			    top: 50%;
			    margin-top: -12px;

			    &:hover{
			    	cursor: pointer;
			    }
			}
		}

		&-result{
			margin: 3px;
			border: 1px solid #ccc;
			background-color: #fff;
			box-shadow: 0 0 10px #ccc;
		}

		&-part{
			width: 100%;
			overflow: hidden;
			font-size: 12px;

			&:nth-child(even) .search-part-list{
				background-color: #eee;
			}

			&:not(:last-child) .search-part-list{
				border-bottom: 1px solid #ccc;
			}

			&-type{
				float: left;
				width: 20%;
				line-height: 1.4;
				font-size: 16px;
			}

			&-list{
				float: right;
				width: 75%;
				text-align: left;
				border-left: 1px solid #ccc;
			}

			&-link{
				display: block;
				padding: 5px 10px;
				overflow: hidden;
				white-space:nowrap;
				text-overflow: ellipsis;

				&:hover{
					background-color:#ddd;
				}
			}
		}
	}

</style>