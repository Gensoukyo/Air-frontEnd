<template>
	<div class="overlay">
	    <div class="log-content">
	    	<h2 v-show="!$store.state.optionForRegistration" class="log-title">欢迎来到Air, 请登录</h2>
	    	<h2 v-show="$store.state.optionForRegistration" class="log-title">欢迎来到Air, 请注册</h2>
	    	<img class="log-quit" src="../assets/svgFont/close.svg" @click="setLogOverlay()">
	        <!-- <input name="referer" type="hidden" value=""> -->
	        <div class="log-field">
	            <input name="name" class="log-field-item" type="text" placeholder="邮箱 / 用户名" v-model="username">
	            <span class="log-field-tips">{{usernameTip}}</span>
	        </div>
	        <div class="log-field">
	            <input name="password" class="log-field-item" type="password" placeholder="密码" v-model="password">
	            <span class="log-field-tips">{{passwordTip}}</span>
	        </div>
	        <div v-if="$store.state.optionForRegistration" class="log-field">
	            <input name="captcha" class="log-field-vcode" type="text" placeholder="验证码" v-model="vcode">
	            <span class="log-field-warning">{{vcodeTip}}</span>
	            <div class="log-field-captcha" v-html="captchaSvg" @click="setCaptcha()"></div>
	        </div>
	        <div class="log-field">
	        	<button v-show="!$store.state.optionForRegistration" type="button"
	        		class="log-field-item log-field-btn"
	        		@click="handleAuth()"> 登录 </button>
	        	<button v-show="$store.state.optionForRegistration" type="button"
	        		class="log-field-item log-field-btn"
	        		@click="handleRegister()"> 注册 </button>
	        </div>
	        <div v-show="!$store.state.optionForRegistration" class="log-field log-field-suggestion">
	            <label class="log-field-remember">
	                <input name="remember" type="checkbox" v-model="remember"> 下次自动登录
	            </label>
	            <span class="log-field-forget">忘记密码？</span>
	        </div>
	    </div>
    </div>
</template>
<script>
	export default {
		data(){
            return {
            	registration:false,
            	username:'',
            	usernameTip:'',
            	password:'',
            	passwordTip:'',
            	vcode:'',
            	vcodeTip:'',
            	captchaSvg:'',
            	remember:true
            }
        },
        methods:{
        	validateUsername(username) {
    			return (/^[A-Za-z0-9_-\u4e00-\u9fa5]{2,20}$/u.test(username)
    			||/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(username));
    		},
    		validatePassword(password){
    			return /^[\w_-]{6,16}$/.test(password);
    		},
    		setLogOverlay(){
    			this.$store.commit('setLogOverlay');
    			this.$store.commit('setOptionForReg',false);
    		},
	        setCaptcha(){
	        	this.axios.get('/api/user/verify').then((response)=>{
                    this.captchaSvg=response.data.captcha;
                })
	        },
	        handleAuth(){
	        	let _this=this;
        		this.$store.dispatch('loginAuth',{
        			username:this.username,
        			password:this.password
        		}).then((result)=>{
        			if (!result.success) {
        				switch(result.info.target){
        					case 'username':
        						_this.usernameTip=result.info.message;
        						break;
        					case 'password':
        						_this.passwordTip=result.info.message;
        						break;
        					default :_this.$store.commit('newFlashMsg',result.info.message);
        				}
        			}
        		})
	        },
	        handleRegister(){
	        	if(!this.validateUsername(this.username)) return this.usernameTip='需2位起合法字符！';
	        	if(!this.validatePassword(this.username)) return this.passwordTip='需6位起合法字符';
	        	let _this=this;
	        	this.$store.dispatch('loginAuth',{
	        		username:this.username,
	        		password:this.password,
	        		vcode:this.vcode
	        	}).then((result)=>{
	        		if (!result.success) {
	        			switch(result.info.target){
	        				case 'username':
	        					_this.usernameTip=result.info.message;
	        					break;
	        				case 'password':
	        					_this.passwordTip=result.info.message;
	        					break;
	        				case 'vcode':
	        					_this.vcodeTip=result.info.message;
	        					break;
	        				default :_this.$store.commit('newFlashMsg',result.info.message);
	        			}
	        		}
	        	}).catch(e=>console.log(e));
	        }
        },
        mounted(){
        	if(this.$store.state.optionForRegistration){
        		this.setCaptcha();
        	}
        }
	}
</script>
<style lang="scss" scoped>
	.overlay {
	    position: fixed;
	    top:0;
	    left:0;
	    width: 100%;
	    height: 100%;
	    z-index: 99;
	    background-color: rgba(255,255,255,.7);
	}

	.log-content {
	    position: absolute;
	    top: 0;
	    left: 0;
	    bottom: 0;
	    right: 0;
	    width: 30%;
	    height: 280px;
	    margin: auto;
	    padding: 60px;
	    z-index: 100;
	    text-align: center;
	    overflow: auto;
	    border: 1px solid #ddd;
	    border-radius: 3px;
	    background-color: #fff;
	}
	.log-title{
	    text-align: center;
	    font-size: 25px;
	    margin-bottom: 30px;
	}
	.log-quit{
		position: absolute;
		top: 17px;
		right:17px;
		vertical-align: middle;
		cursor: pointer;

	}
	.log-field{
		position: static;
		width: 72%;
		margin: 10px auto;
		white-space: nowrap;
		overflow: hidden;

		&-item{
			box-sizing: border-box;
			width: 100%;
			height: 40px;
			line-height: 14px;
			padding: 12px 10px;
			outline: 0 none;
			border: 1px solid #ccc;
			border-radius: 3px;
		}

		&-btn{
			cursor: pointer;
			color: #fff;
			background-color: #00a7de;
			font-size: 16px;

			&:hover{
				background-color: #00bee7;
			}
		}

		&-warning{
			line-height: 40px;
			font-size: 13px;
			padding: 0 10px;
			color: #f00;
		}

		&-tips{
			position: absolute;
			@extend .log-field-warning;
		}

		&-suggestion{
			width: 72%;
			line-height: 14px;
			padding: 12px 10px;
		}

		&-vcode{
			box-sizing: border-box;
			width: 30%;
			height: 40px;
			float: left;
			padding: 12px 10px;
			border: 1px solid #ccc;
			outline: 0 none;
			border-radius: 3px;
		}

		&-captcha{
			float: right;
			cursor: pointer;
			border: 1px solid #ccc;
		}

		&-remember{
			float: left;
		}

		&-forget{
			float: right;
			cursor: pointer;
		}
	}
</style>