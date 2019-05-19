<template>
    <div class="content">
        <section v-if="albums.length" class="part">
            <div class="content-header">
                <h1 id="album">热门专辑</h1>
                <span class="content-header-more"
                	@click="nextPage('album')">换一批>></span>
            </div>
            <div v-for="album in albums" class="content-card">
                <list-card :item="album"></list-card>
            </div>
        </section>
        <section v-if="playlists.length" class="part">
            <div class="content-header">
                <h1 id="playlist">精选歌单</h1>
                <span class="content-header-more"
                	@click="nextPage('playlist')">换一批>></span>
            </div>
            <div v-for="playlist in playlists" class="content-card">
                <list-card :item="playlist"></list-card>
            </div>
        </section>
    </div>
</template>
<script>
import listCard from '../components/sub/list-card.vue'
export default {
    components: {
        listCard
    },
    data() {
        return {}
    },
    computed: {
        albums() {
            return this.$store.state.albumList;
        },
        playlists() {
            return this.$store.state.playlistList;
        }
    },
    methods: {
        fetchData(type){
            this.$store.dispatch('fetchData', type);
        },
        nextPage(type) {
            this.fetchData(type);
        }
    },
    created() {
        this.albums.length ? null : this.fetchData('album');
        this.playlists.length ? null : this.fetchData('playlist');
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
        width: 50%;
    }
}
</style>