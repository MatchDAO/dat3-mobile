<template>
	<view class="uni-popup-dialog">
		<view class="uni-dialog-title">
			<text class="uni-dialog-title-text" :class="['uni-popup__'+dialogType]">{{title}}</text>
		</view>
		<view class="uni-dialog-content">
			<text class="uni-dialog-content-text" v-if="mode === 'base'">{{content}}</text>
			<input v-else class="uni-dialog-input" v-model="val" type="text" :placeholder="placeholder" :focus="focus">
		</view>
		<view class="uni-dialog-button-group">
			<view class="uni-dialog-button" @click="close">
				<text class="uni-dialog-button-text"></text>
			</view>
			<view class="uni-dialog-button uni-border-left" @click="onOk">
				<text class="uni-dialog-button-text uni-button-color"></text>
			</view>
		</view>
		<view v-if="popup.isDesktop" class="uni-popup-dialog__close" @click="close">
			<span class="uni-popup-dialog__close-icon "></span>
		</view>
		<!-- #ifdef H5 -->
		<keypress @esc="close" @enter="onOk"/>
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef H5
	import keypress from './keypress.js'
	// #endif
	/**
	 * PopUp -
	 * @description -
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
	 * @property {String} value input 
	 * @property {String} placeholder input 
	 * @property {String} type = [success|warning|info|error] 
	 *  @value success 
	 * 	@value warning 
	 * 	@value info 
	 * 	@value error 
	 * @property {String} mode = [base|input] 
	 * 	@value base 
	 * 	@value input 
	 * @property {String} content 
	 * @property {Boolean} beforeClose 
	 * @event {Function} confirm 
	 * @event {Function} close 
	 */

	export default {
		name: "uniPopupDialog",
		components: {
			// #ifdef H5
			keypress
			// #endif
		},
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			placeholder: {
				type: [String, Number],
				default: ''
			},
			/**
			 *  success/warning/info/error	   success
			 */
			type: {
				type: String,
				default: 'error'
			},
			/**
			 *  base/input
			 */
			mode: {
				type: String,
				default: 'base'
			},
			/**
			 * 
			 */
			title: {
				type: String,
				default: ''
			},
			/**
			 * 
			 */
			content: {
				type: String,
				default: ''
			},
			/**
			 *  close done()
			 */
			beforeClose: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dialogType: 'error',
				focus: false,
				val: ""
			}
		},
		inject: ['popup'],
		watch: {
			type(val) {
				this.dialogType = val
			},
			mode(val) {
				if (val === 'input') {
					this.dialogType = 'info'
				}
			},
			value(val) {
				this.val = val
			}
		},
		created() {
			// 
			this.popup.mkclick = false
			if (this.mode === 'input') {
				this.dialogType = 'info'
				this.val = this.value
			} else {
				this.dialogType = this.type
			}
		},
		mounted() {
			this.focus = true
		},
		methods: {
			/**
			 * 
			 */
			onOk() {
				this.$emit('confirm', () => {
					this.popup.close()
					if (this.mode === 'input') this.val = this.value
				}, this.mode === 'input' ? this.val : '')
			},
			/**
			 * 
			 */
			close() {
				if (this.beforeClose) {
					this.$emit('close', () => {
						this.popup.close()
					})
					return
				}
				this.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-popup-dialog {
		width: 300px;
		border-radius: 5px;
		background-color: #fff;
	}

	.uni-dialog-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 15px;
		padding-bottom: 5px;
	}

	.uni-dialog-title-text {
		font-size: 16px;
		font-weight: 500;
	}

	.uni-dialog-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 5px 15px 15px 15px;
	}

	.uni-dialog-content-text {
		font-size: 14px;
		color: #6e6e6e;
	}

	.uni-dialog-button-group {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		border-top-color: #f5f5f5;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-dialog-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */

		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 45px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-border-left {
		border-left-color: #f0f0f0;
		border-left-style: solid;
		border-left-width: 1px;
	}

	.uni-dialog-button-text {
		font-size: 14px;
	}

	.uni-button-color {
		color: $uni-color-primary;
	}

	.uni-dialog-input {
		flex: 1;
		font-size: 14px;
	}

	.uni-popup__success {
		color: $uni-color-success;
	}

	.uni-popup__warn {
		color: $uni-color-warning;
	}

	.uni-popup__error {
		color: $uni-color-error;
	}

	.uni-popup__info {
		color: #909399;
	}

	.uni-popup-dialog__close {
		/* #ifndef APP-NVUE */
		display: block;
		cursor: pointer;
		/* #endif */
		position: absolute;
		top: 9px;
		right: 17px;
	}

	.uni-popup-dialog__close-icon {
		/* #ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
		width: 13px;
		height: 1px;
		background: #909399;
		transform: rotate(45deg);
	}

	.uni-popup-dialog__close-icon::after {
		/* #ifndef APP-NVUE */
		content: '';
		display: block;
		/* #endif */
		width: 13px;
		height: 1px;
		background: #909399;
		transform: rotate(-90deg);
	}
</style>
