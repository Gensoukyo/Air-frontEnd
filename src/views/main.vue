<template>
	<div class="content">
		<section class="part">
			<div class="content-header">
				<h1 id="song">推荐</h1>
				<span class="content-header-playall" @click="addAllSongs()">播放全部</span>
			</div>
			<div v-for="song in songs" class="content-card">
				<song-card :song="song"></song-card>
			</div>
		</section>
		<section class="part">
			<div class="content-header">
				<h1 id="album">热门专辑</h1>
				<span class="content-header-more" @click="nextPage('album')">换一批>></span>
			</div>
			<div v-for="album in albums" class="content-card">
				<list-card :item="album"></list-card>
			</div>
		</section>
		<section class="part">
			<div class="content-header">
				<h1 id="playlist">精选歌单</h1>
				<span class="content-header-more" @click="nextPage('playlist')">换一批>></span>
			</div>
			<div v-for="playlist in playlists" class="content-card">
				<list-card :item="playlist"></list-card>
			</div>
		</section>
	</div>
</template>

<script>
	import songCard from '../components/sub/song-card.vue'
	import listCard from '../components/sub/list-card.vue'
	export default {
		components:{
			songCard,
			listCard
		},
		data(){
			return {}
		},
		computed:{
			songs(){
				return this.$store.state.songList;
			},
			albums(){
				return this.$store.state.albumList;
			},
			playlists(){
				return this.$store.state.playlistList;
			}
		},
		methods:{
			addAllSongs(){
				this.$store.commit('setCurrentPlayList',{
					method: 'reset',
					items: this.songs
				});
				this.$store.commit('setCurrentSong',this.songs[0]);
			},
			fetchData(type){
				let rand='?rand='+new Date().getTime();
				this.axios.get('/api/'+type+rand).then((response)=>{
					if (response.data.success&&response.data.length>=5) {
						this.$store.commit('setList',{
							type: type,
							data: response.data.data
						});
					} else {
						this.$store.commit('setFlashMsg', '推荐获取失败，请刷新')
					}
				}).catch(e=>{
					this.$store.commit('setFlashMsg',e.message);
				});
			},
			nextPage(type){
				this.fetchData(type);
			}
		},
		created(){
			this.songs.length?null:this.fetchData('song');
			this.albums.length?null:this.fetchData('album');
			this.playlists.length?null:this.fetchData('playlist');
		}
	}
</script>
<style lang="scss" scoped>
	$img_width:200px;
	$img_gap_width:20px;
	.content{
		&-header{
			overflow: hidden;
			margin: 0 2%;
			padding: 3px 0;
			border-bottom: 2px solid #C10D0C;

			h1{
				display: inline;
			    padding-top: 96px;
				font-size: 20px;
			    font-weight: normal;
			}

			&-playall{
				display: inline-block;
				float: right;
				cursor: pointer;

				&:before{
					content:url(../assets/svgFont/playall.svg);
					float: left;
				}
			}

			&-more{
				display: inline-block;
				float: right;
				cursor: pointer;
			}
		}

		&-card{
			display: inline-block;
			box-sizing: border-box;
			width: 20%;
			padding: $img_gap_width;
		}
	}
	.part{
		margin-left: -$img_gap_width;
	}
</style>