<template>
	<div class="card">
		<img class="card-cover" :src="song.image+'?param=200y200'" :alt="song.name">
		<div class="card-action">
			<router-link class="card-action-play" :to="{ path: '/song', query: { id: song.sid }}"></router-link>
			<span class="card-action-add" @click="setNextToPlay()"> + </span>
		</div>
		<router-link class="card-info card-info-name" :to="{ path: '/song', query: { id: song.sid }}">
			{{song.name}}
		</router-link>
		<span class="card-info card-info-artist">{{song.artist}}</span>
	</div>
</template>

<script>
	export default {
		props:['song'],
		methods:{
			setNextToPlay(){
				this.$store.commit('setCurrentPlayList',{
					method: 'add',
					items: [this.song]
				})
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
		}

        &-action{
        	position: absolute;
        	top: 0;
        	width: 100%;
        	padding: 50% 0;
        	opacity: 0;
        	background-color: rgba(0,0,0,.5);
        	overflow: hidden;
        	transition: opacity .5s;

        	&:hover{
	        	opacity: 1;
	        }

	        &-play{
	        	position: absolute;
	        	top: 0;
	        	left: 0;
	        	bottom: 0;
	        	right: 0;
	        	margin: auto;
	        	width: 0;
        	    height: 0;
        	    border-top: 1vw solid transparent;
        	    border-left: 1.5vw solid #fff;
        	    border-bottom: 1vw solid transparent;
	        }

	        &-add{
	        	position: absolute;
	        	right: 0;
	        	bottom: 0;
	        	color: #fff;
	        	font-size: 30px;
	        	cursor: pointer;

	        	&:active{
	        		transform: scale(1.5);
	        	}
	        }
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