<template>
	<div class="play-wrapper">
		<div class="display">
			<div class="display-info">
				<div class="display-info-name">
					<a :href="songLink">{{list[currentIndex].name}}</a>
				</div>
				<div>
					<span>{{list[currentIndex].artist}}</span> - <a :href="albumLink">{{list[currentIndex].albumName}}</a>
				</div>
			</div>
			<div :class="{'player-bar-content':!navVisibility}">
				<div v-show="maskLayerVisibility" class="mask-layer">
					<img :src="list[currentIndex].image" alt="">
				</div>
				<iframe id="music-frame" frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height=86 :src="outChain">
				</iframe>
			</div>
			<div :class="['display-controller',{'player-bar-controller':!navVisibility}]">
				<span @click="playListVisibility=!playListVisibility">
					<img v-show="!playListVisibility"
						src="../assets/svgFont/list.svg" alt="展开">
					<img v-show="playListVisibility"
						src="../assets/svgFont/unfold.svg" alt="收起">
				</span>
				<span @click="likeSong()">
					<img v-show="!likeTheSong"
						src="../assets/svgFont/like.svg" alt="取消">
					<img v-show="likeTheSong"
						src="../assets/svgFont/like_fill.svg" alt="喜欢">
				</span>
				<span @click="preSong()">
					<img src="../assets/svgFont/pre.svg" alt="上一首">
				</span>
				<span @click="nextSong()">
					<img src="../assets/svgFont/next.svg" alt="下一首">
				</span>
				<span>
					<img v-show="playModel==='one'"
						src="../assets/svgFont/one.svg" alt="单曲循环"
						@click="setListCirculation()">
					<img v-show="playModel==='cycle'"
						src="../assets/svgFont/cycle.svg" alt="列表循环"
						@click="setListCirculation(true)">
					<img v-show="playModel==='random'"
						src="../assets/svgFont/random.svg" alt="随机循环"
						@click="switchModel('one')">
				</span>
				<ul v-show="playListVisibility" class="display-list">
					<li v-for="(song,index) in list">
						<span
							:class="['display-list-name',{'display-list-current':index===currentIndex}]"
							@click="setCurrentSong(index)">{{song.name}}</span>
						<span class="display-list-artist">{{song.artist}}</span>
						<img class="display-list-delete"
							@click="removeSong(index)"
							src="../assets/svgFont/close.svg" alt="移除">
					</li>
				</ul>
			</div>
		</div>
		<div class="play-cover">
			<img :src="list[currentIndex].image" alt="">
		</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				currentIndex:0,
				playListVisibility: false,
				likeTheSong:false,
				playModel: 'one',
				timer:null
			}
		},
		computed:{
			list(){
				return this.$store.state.currentPlayList;
			},
			outChain(){
				return '//music.163.com/outchain/player?type=2&id='+this.list[this.currentIndex].sid+'&auto=1&height=66';
			},
			songLink(){
				return '/play?sid='+this.list[this.currentIndex].sid;
			},
			albumLink(){
				return '/play?pid='+this.list[this.currentIndex].albumId;
			},
			maskLayerVisibility(){
				return this.playModel==='cycle'||this.playModel==='random';
			},
			navVisibility(){
				return this.$store.state.navVisibility;
			}
		},
		methods:{
			setCurrentSong(index){
				this.currentIndex=index;
				if(this.playModel!=='one'){
					this.setListCirculation(false);
				}
			},
			preSong(){
				this.currentIndex=this.currentIndex===0
					?this.list.length-1
					:--this.currentIndex;
				if(this.playModel!=='one'){
					this.setListCirculation(false);
				}
			},
			nextSong(){
				this.currentIndex=this.currentIndex===this.list.length-1
					?0
					:++this.currentIndex;
				if(this.playModel!=='one'){
					this.setListCirculation(false);
				}
			},
			likeSong(){
				if (this.$store.state.auth) {
					this.likeTheSong=!this.likeTheSong;
					//修改user的state
				}else{
					this.$store.commit('setLogOverlay');
				}
			},
			removeSong(index){
				if (this.list.length>1) {
					this.$store.commit('updateCurrentPlayList',{
						method: 'remove',
						index: index
					});
					index<this.currentIndex
						?this.preSong()
						:null;
				}
			},
			switchModel(model){
				clearTimeout(this.timer);
				this.playModel=model;
			},
			setListCirculation(shuffle=false){
				clearTimeout(this.timer);
				document.getElementById('music-frame').src=this.outChain;
				if (shuffle) {
					this.list.sort(() => Math.random() - 0.5);
					this.switchModel('random');
				} else {
					this.switchModel('cycle');
				}
				function circulate() {
					this.timer=setTimeout(()=>{
						this.currentIndex=this.currentIndex===this.list.length-1
							?0
							:++this.currentIndex;
						circulate.bind(this)();
					},this.list[this.currentIndex].duration);
				}
				circulate.bind(this)();
			}
		},
		beforeDestroy(){
			clearTimeout(this.timer);
		}
	}
</script>
<style lang="scss" scoped>
	$header_height:96px;
	$main_height:400px;
	$player_width:330px;
	$icon_font_size:32px;
	$list_lineheight:25px;
	$current_mark_width:24px;
	.play-wrapper{
		min-height: $main_height;
	}
	.play-cover{
		margin-right: $player_width;
		padding: 10px 0;
		text-align: center;

		img{
			width: 100%;
		    height: auto;
		}
	}
	.mask-layer{
		position: absolute;
		width: $player_width - 20px;
		height: 66px;
		margin: 10px;
		z-index: 99;
		background-color: rgba(255,255,255,.93);
		box-shadow: 0 0 10px #ccc;

		img{
			width: 66px;
			height: 100%;
			border-top-left-radius: 2px;
		}
	}
	.display{
		box-sizing: border-box;
		float: right;
		width: $player_width;
		height: 100%;

		&-info{
			padding: 10px 20px;
			font-size: 15px;

			&-name{
				font-size: 25px;
			}
		}

		&-controller{
			padding: 10px;
			font-size: 14px;

			img{
				width: $icon_font_size;
				height: $icon_font_size;
				margin: 0 10px;
				cursor: pointer;
			}
		}

		&-list{
			padding: 17px;
			background-color: rgba(250, 250, 250, 0.93);
		    box-shadow: 0 0 1px #ccc;

			li{
				position: relative;
				height: $list_lineheight;
				color: #666;
			}

			&-current{
				color: #000;

				&:before{
					content:url(../assets/svgFont/play_fill.svg);
					float:left;
				}
			}

			&-name,&-artist{
				position: absolute;
				line-height: $list_lineheight;
				overflow:hidden;
				white-space:nowrap;/*不显示的地方用省略号...代替*/
				text-overflow:ellipsis;
			}
			&-name{
				left:0;
				width: 45%;
				cursor: pointer;
			}
			&-artist{
				left: 50%;
				width: 30%;
			}
			.display-list-delete{
				position: absolute;
				right: 0;
				width: $list_lineheight;
				height: 100%;
				margin: 0;
			}
		}
	}
	.player-bar{
		&-content{
			position: fixed;
			top: 0;
			right: 50%;
			width: $player_width;
			z-index: 10;
		}

		&-controller{
			position: fixed;
			top: 0;
			left: 50%;
			line-height: $header_height;
			z-index: 10;
		}
	}
</style>