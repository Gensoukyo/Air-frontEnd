<template>
	<div class="comment">
		<div class="comment-input">
			<div class="comment-input-user">
				<img :src="defaultAvatar" alt="头像">
			</div>
			<div class="comment-input-area">
				<textarea name="comment" class="txt" id="comment" placeholder="评论"
					v-model="comment" :maxlength="maxlength" @focus="auth()"></textarea>
				<span class="btn" @click="handleSend()">发送</span>
			</div>
		</div>	
		<div v-if="list.length" class="comment-list">
			<h3 class="comment-list-header">精彩评论</h3>
			<div v-for="(comment,index) in list" class="comment-item">
				<div class="comment-item-avatar">
					<router-link :to="{ path: '/user', query: { id: comment.user.uid }}">
						<img :src="comment.user.avatar+'?param=50y50'" alt="头像"></router-link>
				</div>
				<div class="comment-item-info">
					<div class="comment-item-content">
						<router-link class="comment-item-username"
							:to="{ path: '/user', query: { id: comment.user.uid }}">{{comment.user.username}}</router-link>
						：{{comment.content}}
					</div>
					<reply-list v-show="comment.reply.length||comment.newReply"
						class="comment-item-replylist"
						:cid="comment.cid"
						:replyIds="comment.reply" 
						:newReply="comment.newReply"
						@handled="prepareReply(index)"></reply-list>
					<div>
						<span>{{ parseTimestamp(comment.comment_time) }}</span>
						<span class="comment-item-action">
							<span v-if="isOwnComment(index)" class="delete" @click="handleDelete(index)">删除 | </span>
							<span class="reply" @click="prepareReply(index)">回复</span>
						</span>
					</div>
					<div v-show="currentReplyIndex===index" class="comment-item-replyarea">
						<textarea name="reply" class="txt" id="reply" placeholder="回复"
							v-model="newReply" :maxlength="maxlength" @focus="auth()"></textarea>
						<span class="btn" @click="handleReply(index)">发送</span>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="comment-remind">{{remindMsg}}~</div>
	</div>
</template>
<script>
	import replyList from './reply-list.vue';
	import dateFormat from '../lib/data-format.js';
	export default {
		components:{
			replyList
		},
		props:['type','id','commentids'],
		data(){
			return {
				comment:'',
				maxlength:140,
				list:[],
				newReply: '',
				currentReplyIndex: -1,
				remindMsg:'暂无评论'
			}
		},
		watch:{
			commentids(){
				this.list=[];
				this.fetchData(1);
			}
		},
		computed:{
			defaultAvatar(){
				return this.$store.state.auth
					?this.$store.state.userInfo.avatar
					:'http://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=50y50';
			}
		},
		created(){
			if (this.commentids.length) {
				this.fetchData(1);
			}
		},
		methods:{
			handleSend(){
				if (this.auth&&this.comment!==''&&!/ +/.test(this.comment)) {
					let token=localStorage.getItem('token');
					this.axios.post('/api/comment',{
						target: {
							ttype: this.type,
							tid: this.id
						},
						content: this.comment
					},{
						headers: {'x-access-token': token}
					}).then((response)=>{
						if (response.data.success) {
							//新添加评论，整理评论信息并插入列表
							let comment=response.data.data;
							comment.user.avatar=this.$store.state.userInfo.avatar;
							comment.user.username=this.$store.state.userInfo.username;
							this.comment='';
							this.list.unshift(comment);
						} else {
							this.$store.commit('setFlashMsg','评论失败');
						}
					}).catch(e=>{
						this.$store.commit('setFlashMsg',e.message);
					});
				}
			},
			handleDelete(index){
				let token=localStorage.getItem('token');
				this.axios.delete('/api/comment',{
					data:{
						cid: this.list[index].cid
					},
					headers: {'x-access-token': token}
				}).then((response)=>{
					if (response.data.success) {
						this.list.splice(index,1);
					}
				}).catch(e=>{
					this.$store.commit('setFlashMsg',e.message);
				});
			},
			prepareReply(index){
				//先验证权限，传入同一个下标即关闭回复框
				this.currentReplyIndex=this.auth()&&this.currentReplyIndex!==index?index:-1;
			},
			handleReply(index){
				if (this.auth()&&this.newReply!==''&&!/ +/.test(this.newReply)) {
					let item=this.list[index];
					item['newReply']=this.newReply;
					this.$set(this.list,index,item);
					this.newReply='';
				}
			},
			parseTimestamp(t){
				return dateFormat(t);
			},
			auth(){
				return this.$store.state.auth
					?true
					:(this.$store.commit('setLogOverlay'),false);
			},
			isOwnComment(index){
				return this.$store.state.auth&&this.list[index].user.uid===this.$store.state.userInfo.uid;
			},
			fetchData(page=1){
				//根据评论id拿到评论信息
				this.axios.get('/api/comment',{
					params:{
						page:page,
						id:this.commentids
					},
					timeout:5000
				}).then((response)=>{
					if (response.data.success) {
						this.list=response.data.data;
					}
				}).catch(e=>{
					this.$store.commit('setFlashMsg',e.message);
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	$input_area_height:50px;	
	.txt{
		box-sizing: border-box;
		width: 100%;
		height: $input_area_height;
		padding: 5px;
		border: 1px solid #cdcdcd;
	    outline: 0 none;
		border-radius: 3px;
		font-family: inherit;
	}
	.btn{
		float: right;
		line-height: 25px;
		margin: 5px 0;
		padding: 0 10px;
		border-radius: 3px;
		font-size: 13px;
		color: #fff;
		text-align: center;
		background-color: #00a7de;
	    cursor: pointer;
	}
	.comment{
		img{
			width: 100%;
		}

		&-input{
			margin: 20px 0;

			&-user{
				float: left;
				width: 50px;
				height: $input_area_height;
			}
			&-area{
				margin-left: 60px;
			}
		}

		&-list{
			clear: both;
			font-size: 12px;

			&-header{
				height: 20px;
			    border-bottom: 1px solid #cfcfcf;
			}
		}

		&-item{
			padding: 15px 0;
			border-bottom: 1px dotted #ccc;

			&-avatar{
				@extend .comment-input-user;
			}

			&-info{
				margin-left: 60px;
				overflow: hidden;
			}

			&-username:hover{
				text-decoration: underline;
			}

			&-content{
				word-break: break-word;
				margin-bottom: 15px;
			}

			&-replylist{
				padding: 1px 15px;
				margin: 15px 0;
				background-color: #f4f4f4;
			}

			&-action{
				float: right;
				.delete{
					display: none;
					cursor: pointer;
				}
				.reply{
					cursor: pointer;
				}
			}

			&:hover .delete{
				display: inline;
			}

			&-replyarea{
				margin: 10px 0;
			}
		}
		&-remind{
			clear: both;
			font-size: 14px;
			border-bottom: 1px solid #cfcfcf;
		}
	}
</style>