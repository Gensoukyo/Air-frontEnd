<template>
	<div class="content">
		<section v-if="songs.length" class="part">
		    <div class="content-header">
		        <h1 id="song">推荐</h1>
		        <span class="content-header-playall"
		        	@click="addAllSongs()">播放全部</span>
		    </div>
		    <div v-for="song in songs" class="content-card">
		        <song-card :song="song"></song-card>
		    </div>
		</section>
	</div>
</template>
<script>
import songCard from '../components/sub/song-card.vue'
export default {
	components:{
        songCard
	},
    data() {
        return {}
    },
    computed: {
        songs(){
        	return this.$store.state.songList;
        }
    },
    methods:{
    	addAllSongs() {
    	    this.$store.commit('setCurrentPlayList', {
    	        method: 'reset',
    	        items: this.songs
    	    });
    	    this.$store.commit('setCurrentSong', this.songs[0]);
    	}
    },
    created(){
    	this.songs.length ? null : this.$store.dispatch('fetchData', 'song');
    }
}
</script>
<style lang="scss" scoped>
$img_width:200px;
$img_gap_width:20px;

.content {
    padding: 30px 0;

    &-header {
        overflow: hidden;
        margin: 0 2%;
        margin-bottom: 20px;
        padding: 3px 0;
        border-bottom: 2px solid #C10D0C;

        h1 {
            display: inline;
            padding-top: 96px;
            font-size: 20px;
            font-weight: normal;
        }

        &-playall {
            display: inline-block;
            float: right;
            cursor: pointer;

            &:before {
                content: url(../assets/svgFont/playall.svg);
                float: left;
            }
        }

        &-more {
            display: inline-block;
            float: right;
            cursor: pointer;
        }
    }

    &-card {
        display: inline-block;
        box-sizing: border-box;
        width: 20%;
        padding: $img_gap_width;
        padding-top: 0;
    }
}

@media screen and (max-width: 650px){
    .content-card{
        width: 100%;
        padding: 0 4vw;
        margin-bottom: 4vw;
    }
}
</style>