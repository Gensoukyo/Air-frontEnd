<template>
	<div v-show="msg" class="msg">
		<p class="msg-content">{{flashMsg}}</p>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				msg:''
			}
		},
		computed:{
			flashMsg(){
				return this.$store.state.flashMsg;
			}
		},
		watch:{
			flashMsg(val){
				this.msg=val;
				this.$nextTick(()=>{
					setTimeout(()=>{
						this.msg='';
					},1500);
				});
			}
		}
	}
</script>
<style scoped>
	.msg{
	    position: absolute;
	    top: 50%;
	    left: 0;
	    right: 0;
	    margin: 0 auto;
	    z-index: 999;
	    text-align: center;
	}
	.msg-content{
		display: inline;
		line-height: 1.8;
		text-align: center;
		padding: 5px 10px;
		color: #fff;
		background-color: rgba(0,0,0,.5);
		border-radius: 3px;
	}
</style>