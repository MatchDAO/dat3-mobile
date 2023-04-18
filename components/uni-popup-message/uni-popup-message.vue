<template>
	<view class="uni-popup-message">
		<view class="uni-popup-message__box fixforpc-width" :class="'uni-popup__'+[type]">
			<text class="uni-popup-message-text" :class="'uni-popup__'+[type]+'-text'">{{message}}</text>
		</view>
	</view>
</template>

<script>
	/**
	 * PopUp -
	 * @description -
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
	 * @property {String} type = [success|warning|info|error] 
	 *  @value success 
	 * 	@value warning 
	 * 	@value info 
	 * 	@value error 
	 * @property {String} message 
	 * @property {String} duration  0 
	 */

	export default {
		name: 'UniPopupMessage',
		props: {
			/**
			 *  success/warning/info/error	   success
			 */
			type: {
				type: String,
				default: 'success'
			},
			/**
			 * 
			 */
			message: {
				type: String,
				default: ''
			},
			/**
			 *  0 
			 */
			duration: {
				type: Number,
				default: 3000
			}
		},
		inject: ['popup'],
		data() {
			return {}
		},
		created() {
			this.popup.childrenMsg = this
		},
		methods: {
			open() {
				if (this.duration === 0) return
				clearTimeout(this.popuptimer)
				this.popuptimer = setTimeout(() => {
					this.popup.close()
				}, this.duration)
			},
			close() {
				clearTimeout(this.popuptimer)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.uni-popup-message {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
	}

	.uni-popup-message__box {
		background-color: #e1f3d8;
		padding: 10px 15px;
		border-color: #eee;
		border-style: solid;
		border-width: 1px;
		flex: 1;
	}

	@media screen and (min-width: 500px) {
		.fixforpc-width {
			margin-top: 20px;
			border-radius: 4px;
			flex: none;
			min-width: 380px;
			/* #ifndef APP-NVUE */
			max-width: 50%;
			/* #endif */
			/* #ifdef APP-NVUE */
			max-width: 500px;
			/* #endif */
		}
	}

	.uni-popup-message-text {
		font-size: 14px;
		padding: 0;
	}

	.uni-popup__success {
		background-color: #e1f3d8;
	}

	.uni-popup__success-text {
		color: #67C23A;
	}

	.uni-popup__warn {
		background-color: #faecd8;
	}

	.uni-popup__warn-text {
		color: #E6A23C;
	}

	.uni-popup__error {
		background-color: #fde2e2;
	}

	.uni-popup__error-text {
		color: #F56C6C;
	}

	.uni-popup__info {
		background-color: #F2F6FC;
	}

	.uni-popup__info-text {
		color: #909399;
	}
</style>
