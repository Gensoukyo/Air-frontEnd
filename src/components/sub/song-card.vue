<template>
	<div class="card">
		<img class="card-cover" 
			:src="resizeImg(song.image)" 
			:alt="song.name">
		<div class="card-action">
			<router-link class="card-action-play" 
				:to="{ path: '/song', query: { id: song.sid }}"></router-link>
			<span class="card-action-add"
				@click="setNextToPlay()"> + </span>
		</div>
		<router-link class="card-info card-info-name" 
			:to="{ path: '/song', query: { id: song.sid }}">
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
			},
			resizeImg(url,size=200){
				return (url||'//p3.music.126.net/OgPzb1xGmGp0xDzEbcF-MA==/3285340745280611.jpg')+'?param='+size+'y'+size;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.card{
		position: relative;
		overflow: hidden;
		font-size: 0;

		&-cover{
			display: block;
			box-sizing: border-box;
		    max-width: 100%;
		    max-height: 100%;
	        border: 1px solid #ddd;
		}

        &-action{
        	position: relative;
        	width: 100%;
        	padding: 50% 0;
        	margin-top: -100%;
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
        		line-height: 2;
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


	$pic_width: 14vw;
	@media screen and (max-width: 650px){
		.card{
			&-cover{
				display: inline-block;
			    width: $pic_width;
			}
			&-action{
				display: none;
			}
			&-info{
				line-height: $pic_width;

				&-name{
					width: 42vw;
					padding: 0 4vw;
				}

				&-artist{
					width: 28vw;
				}
			}
		}
	}
</style>