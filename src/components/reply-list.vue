<template>
	<div>
		<div v-for="reply in list" class="reply-item-content">
			<router-link class="reply-item-username"
				:to="{ path: '/user', query: { id: reply.user.uid }}">{{reply.user.username}}</router-link>
			：{{reply.content}}
		</div>
	</div>
</template>
<script>
	export default {
		props:['cid','replyIds','newReply'],
		data(){
			return {
				list:[]
			}
		},
		watch:{
			replyIds(){
				this.fetchData(1);
			},
			newReply(val){
				this.handSend(val);
			}
		},
		methods:{
			handSend(msg){
				let token=localStorage.getItem('token');
				this.axios.post('/api/comment/reply',{
					cid: this.cid,
					content: msg
				},{
					headers: {'x-access-token': token}
				}).then((response)=>{
					if (response.data.success) {
						//整理回复信息并插入列表
						let reply=response.data.data;
						reply.user.avatar=this.$store.state.userInfo.avatar;
						reply.user.username=this.$store.state.userInfo.username;
						this.list.push(reply);
						this.$emit('handled');
					} else {
						this.$store.commit('setFlashMsg','回复失败');
					}
				}).catch(e=>{
					this.$store.commit('setFlashMsg',e.message);
				});
			},
			fetchData(page){
				this.axios.get('/api/comment/reply',{
					params:{
						page:page,
						id:this.replyIds
					},
					timeout:5000
				}).then((response)=>{
					if (response.data.success) {
						this.list=response.data.data;
					} else {
						this.remindMsg='回复内容获取失败';
					}
				}).catch(e=>{
					this.$store.commit('setFlashMsg',e.message);
				});
			}
		},
		created(){
			this.fetchData(1);
		}
	}
</script>
<style lang="scss" scoped>
	.reply-item-content{
		word-break: break-word;
		margin: 15px 0;
	}
	.reply-item-username:hover{
		text-decoration: underline;
	}
</style>