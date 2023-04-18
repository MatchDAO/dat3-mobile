<template>
	<view v-if="visibleSync" :class="{ 'uni-drawer--visible': showDrawer }" class="uni-drawer" @touchmove.stop.prevent="clear">
		<view class="uni-drawer__mask" :class="{ 'uni-drawer__mask--visible': showDrawer && mask }" @tap="close('mask')" />
		<view class="uni-drawer__content" :class="{'uni-drawer--right': rightMode,'uni-drawer--left': !rightMode, 'uni-drawer__content--visible': showDrawer}" :style="{width:drawerWidth+'px'}">
			<slot />
		</view>
		<!-- #ifdef H5 -->
		<keypress @esc="close('mask')" />
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef H5
	import keypress from './keypress.js'
	// #endif
	/**
	 * Drawer 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=26
	 * @property {Boolean} mask = [true | false] 
	 * @property {Boolean} maskClick = [true | false] 
	 * @property {Boolean} mode = [left | right] Drawer 
	 * 	@value left 
	 * 	@value right 
	 * @property {Number} width   vue 
	 * @event {Function} close 
	 */
	export default {
		name: 'UniDrawer',
		components: {
			// #ifdef H5
			keypress
			// #endif
		},
		props: {
			/**
			 * 
			 */
			mode: {
				type: String,
				default: ''
			},
			/**
			 * 
			 */
			mask: {
				type: Boolean,
				default: true
			},
			/**
			 * 
			 */
			maskClick: {
				type: Boolean,
				default: true
			},
			/**
			 * 
			 */
			width: {
				type: Number,
				default: 220
			}
		},
		data() {
			return {
				visibleSync: false,
				showDrawer: false,
				rightMode: false,
				watchTimer: null,
				drawerWidth: 220
			}
		},
		created() {
			// #ifndef APP-NVUE
			this.drawerWidth = this.width
			// #endif
			this.rightMode = this.mode === 'right'
		},
		methods: {
			clear() {},
			close(type) {
				// fixed by mehaotian 
				if ((type === 'mask' && !this.maskClick) || !this.visibleSync) return
				this._change('showDrawer', 'visibleSync', false)
			},
			open() {
				// fixed by mehaotian 
				if (this.visibleSync) return
				this._change('visibleSync', 'showDrawer', true)
			},
			_change(param1, param2, status) {
				this[param1] = status
				if (this.watchTimer) {
					clearTimeout(this.watchTimer)
				}
				this.watchTimer = setTimeout(() => {
					this[param2] = status
					this.$emit('change', status)
				}, status ? 50 : 300)
			}
		}
	}
</script>

<style scoped>
	.uni-drawer {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		z-index: 999;
	}

	.uni-drawer__content {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: absolute;
		top: 0;
		width: 220px;
		bottom: 0;
		background-color: #ffffff;
		transition: transform 0.3s ease;
	}

	.uni-drawer--left {
		left: 0;
		/* #ifdef APP-NVUE */
		transform: translateX(-220px);
		/* #endif */
		/* #ifndef APP-NVUE */
		transform: translateX(-100%);
		/* #endif */
	}

	.uni-drawer--right {
		right: 0;
		/* #ifdef APP-NVUE */
		transform: translateX(220px);
		/* #endif */
		/* #ifndef APP-NVUE */
		transform: translateX(100%);
		/* #endif */
	}

	.uni-drawer__content--visible {
		transform: translateX(0px);
	}

	.uni-drawer__mask {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		transition: opacity 0.3s;
	}

	.uni-drawer__mask--visible {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		opacity: 1;
	}
</style>