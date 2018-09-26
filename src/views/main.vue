<template>
	<div class="content">
		<div v-for="song in songs" id="song" class="content-songs">
			<song-card :song="song"></song-card>
		</div>
		<div id="playlist" class="content-play-list"></div>
		<div id="album" class="content-album-list"></div>
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
			return {
				songs:this.$store.state.songList
			}
		},
		methods:{
			setSongList(){
				this.songs=this.$store.state.songList;
			}
		},
		created(){
			this.$store.dispatch('getSongList').then((value)=>{
				if (value) {
					this.setSongList();
				}
			})
		}
	}
</script>
<style lang="scss" scoped>
	.content{

		&-songs{
			display: inline-block;
			box-sizing: border-box;
			width: 20%;
			padding: 2%;
		}
	}
</style>