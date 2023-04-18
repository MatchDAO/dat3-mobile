<template>
	<view v-if="showPopup" class="uni-popup" :class="[popupstyle, isDesktop ? 'fixforpc-z-index' : '']" @touchmove.stop.prevent="clear">
		<uni-transition v-if="maskShow" class="uni-mask--hook" :mode-class="['fade']" :styles="maskClass" :duration="duration" :show="showTrans" @click="onTap" />
		<uni-transition :mode-class="ani" :styles="transClass" :duration="duration" :show="showTrans" @click="onTap">
			<view class="uni-popup__wrapper-box" @click.stop="clear">
				<slot />
			</view>
		</uni-transition>
		<!-- #ifdef H5 -->
		<keypress v-if="maskShow" @esc="onTap" />
		<!-- #endif -->
	</view>
</template>

<script>
	import popup from './popup.js'
	// #ifdef H5
	import keypress from './keypress.js'
	// #endif
	/**
	 * PopUp 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
	 * @property {String} type = [top|center|bottom] 
	 * 	@value top 
	 * 	@value center 
	 * 	@value bottom 
	 * 	@value message 
	 * 	@value dialog 
	 * 	@value share 
	 * @property {Boolean} animation = [ture|false] 
	 * @property {Boolean} maskClick = [ture|false] 
	 * @event {Function} change e={show: false}
	 */

	export default {
		name: 'UniPopup',
		components: {
			// #ifdef H5
			keypress
			// #endif
		},
		props: {
			// 
			animation: {
				type: Boolean,
				default: true
			},
			// top: bottomcenter
			// message:  ; dialog : 
			type: {
				type: String,
				default: 'center'
			},
			// maskClick
			maskClick: {
				type: Boolean,
				default: true
			}
		},
		provide() {
			return {
				popup: this
			}
		},
		mixins: [popup],
		watch: {
			/**
			 * type
			 */
			type: {
				handler: function(newVal) {
					this[this.config[newVal]]()
				},
				immediate: true
			},
			isDesktop: {
				handler: function(newVal) {
					this[this.config[this.type]]()
				},
				immediate: true
			},
			/**
			 * 
			 * @param {Object} val
			 */
			maskClick: {
				handler: function(val) {
					this.mkclick = val
				},
				immediate: true
			}
		},
		data() {
			return {
				duration: 300,
				ani: [],
				showPopup: false,
				showTrans: false,
				maskClass: {
					'position': 'fixed',
					'bottom': 0,
					'top': 0,
					'left': 0,
					'right': 0,
					'backgroundColor': 'rgba(0, 0, 0, 0.4)'
				},
				transClass: {
					'position': 'fixed',
					'left': 0,
					'right': 0,
				},
				maskShow: true,
				mkclick: true,
				popupstyle: this.isDesktop ? 'fixforpc-top' : 'top'
			}
		},
		created() {
			this.mkclick = this.maskClick
			if (this.animation) {
				this.duration = 300
			} else {
				this.duration = 0
			}
		},
		methods: {
			clear(e) {
				// TODO nvue 
				e.stopPropagation()
			},
			open() {
				this.showPopup = true
				this.$nextTick(() => {
					new Promise(resolve => {
						clearTimeout(this.timer)
						this.timer = setTimeout(() => {
							this.showTrans = true
							// fixed by mehaotian  app 
							this.$nextTick(() => {
								resolve();
							})
						}, 50);
					}).then(res => {
						// 
						clearTimeout(this.msgtimer)
						this.msgtimer = setTimeout(() => {
							this.customOpen && this.customOpen()
						}, 100)
						this.$emit('change', {
							show: true,
							type: this.type
						})
					})
				})
			},
			close(type) {
				this.showTrans = false
				this.$nextTick(() => {
					this.$emit('change', {
						show: false,
						type: this.type
					})
					clearTimeout(this.timer)
					// 
					this.customOpen && this.customClose()
					this.timer = setTimeout(() => {
						this.showPopup = false
					}, 300)
				})
			},
			onTap() {
				if (!this.mkclick) return
				this.close()
			},
			/**
			 * 
			 */
			top() {
				this.popupstyle = this.isDesktop ? 'fixforpc-top' : 'top'
				this.ani = ['slide-top']
				this.transClass = {
					'position': 'fixed',
					'left': 0,
					'right': 0,
				}
			},
			/**
			 * 
			 */
			bottom() {
				this.popupstyle = 'bottom'
				this.ani = ['slide-bottom']
				this.transClass = {
					'position': 'fixed',
					'left': 0,
					'right': 0,
					'bottom': 0
				}
			},
			/**
			 * 
			 */
			center() {
				this.popupstyle = 'center'
				this.ani = ['zoom-out', 'fade']
				this.transClass = {
					'position': 'fixed',
					/* #ifndef APP-NVUE */
					'display': 'flex',
					'flexDirection': 'column',
					/* #endif */
					'bottom': 0,
					'left': 0,
					'right': 0,
					'top': 0,
					'justifyContent': 'center',
					'alignItems': 'center'
				}
			}
		}
	}
</script>
<style scoped>
	@charset "UTF-8";

	.uni-popup {
		position: fixed;
		/* #ifndef APP-NVUE */
		z-index: 999;
		/* #endif */
	}

	.fixforpc-z-index {
		/* #ifndef APP-NVUE */
		z-index: 999;
		/* #endif */
	}

	.uni-popup__mask {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		opacity: 0;
	}

	.mask-ani {
		transition-property: opacity;
		transition-duration: 0.2s;
	}

	.uni-top-mask {
		opacity: 1;
	}

	.uni-bottom-mask {
		opacity: 1;
	}

	.uni-center-mask {
		opacity: 1;
	}

	.uni-popup__wrapper {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: absolute;
	}

	.top {
		/* #ifdef H5 */
		top: var(--window-top);
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
	}

	.fixforpc-top {
		top: 0;
	}

	.bottom {
		bottom: 0;
	}

	.uni-popup__wrapper-box {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: relative;
		/* iphonex  */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.content-ani {
		transition-property: transform, opacity;
		transition-duration: 0.2s;
	}

	.uni-top-content {
		transform: translateY(0);
	}

	.uni-bottom-content {
		transform: translateY(0);
	}

	.uni-center-content {
		transform: scale(1);
		opacity: 1;
	}
</style>