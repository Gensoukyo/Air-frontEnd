<template>
	<div class="card">
		<router-link :to="{ path: '/'+listType, query: { id: item.aid||item.pid }}">
			<img class="card-cover" :src="setImgSourseSize(item.image)" :alt="item.name">
		</router-link>
		<router-link class="card-info card-info-name" :to="{ path: '/'+listType, query: { id: item.aid||item.pid }}">
			{{item.name}}
		</router-link>
		<span class="card-info card-info-artist">{{item.artist||item.author}}</span>
	</div>
</template>

<script>
	export default {
		props:['item'],
		data(){
			return {}
		},
		computed:{
			listType(){
				return this.item.aid?'album':'playlist';
			}
		},
		methods:{
			setImgSourseSize(url,size=200){
				return url+'?param='+size+'y'+size;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.card{
		position: relative;
		overflow: hidden;

		&-cover{
			display: inline-block;
			box-sizing: border-box;
		    width: auto;
		    height: auto;
		    max-width: 100%;
		    max-height: 100%;
	        border: 1px solid #ddd;
	        overflow: hidden;
		}

        &-info{
        	display: inline-block;
        	width: 100%;
        	white-space:nowrap;
        	overflow: hidden;
        	text-overflow: ellipsis;

        	&-name{
        		font-size: 14px;

        		&:hover{
        			text-decoration: underline;
        		}
        	}

        	&-artist{
        		color: #666;
        		font-size: 12px;
        	}
        }
	}
</style>