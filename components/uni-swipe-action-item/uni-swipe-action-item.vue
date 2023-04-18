<template>
	<!--  app vue h5 wxs -->
	<!-- #ifdef APP-VUE || MP-WEIXIN || H5 -->
	<view class="uni-swipe">
		<view
		    class="uni-swipe_box"
		    :data-threshold="threshold"
		    :data-disabled="disabled"
		    :change:prop="swipe.sizeReady"
		    :prop="btn"
		    @touchstart="swipe.touchstart"
		    @touchmove="swipe.touchmove"
		    @touchend="swipe.touchend"
				@mousedown="swipe.mousedown"
				@mousemove="swipe.mousemove"
				@mouseup="swipe.mouseup"
				@mouseleave="swipe.mouseleave"
		>
			<!--  app vue h5 wxs -->
			<view class="uni-swipe_button-group button-group--left">
				<slot name="left">
					<view
					    v-for="(item,index) in leftOptions"
					    :data-button="btn"
					    :key="index"
					    :style="{
					  backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : '#C7C6CD',
					  fontSize: item.style && item.style.fontSize ? item.style.fontSize : '16px'
					}"
					    class="uni-swipe_button button-hock"
					    @touchstart="appTouchStart"
					    @touchend="appTouchEnd($event,index,item,'left')"
							@click.stop="onClickForPC(index,item,'left')"
					><text
						    class="uni-swipe_button-text"
						    :style="{color: item.style && item.style.color ? item.style.color : '#FFFFFF',}"
						>{{ item.text }}</text></view>
				</slot>
			</view>
			<view class="uni-swipe_text--center">
				<slot></slot>
			</view>
			<view class="uni-swipe_button-group button-group--right">
				<slot name="right">
					<view
					    v-for="(item,index) in rightOptions"
					    :data-button="btn"
					    :key="index"
					    :style="{
					  backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : '#C7C6CD',
					  fontSize: item.style && item.style.fontSize ? item.style.fontSize : '16px'
					}"
					    class="uni-swipe_button button-hock"
					    @touchstart="appTouchStart"
					    @touchend="appTouchEnd($event,index,item,'right')"
							@click.stop="onClickForPC(index,item,'right')"
					><text
						    class="uni-swipe_button-text"
						    :style="{color: item.style && item.style.color ? item.style.color : '#FFFFFF',}"
						>{{ item.text }}</text></view>
				</slot>
			</view>
		</view>
	</view>
	<!-- #endif -->
	<!-- app nvue  bindingx -->
	<!-- #ifdef APP-NVUE -->
	<view
	    ref="selector-box--hock"
	    class="uni-swipe"
	    @horizontalpan="touchstart"
	    @touchend="touchend"
	>
		<view
		    ref='selector-left-button--hock'
		    class="uni-swipe_button-group button-group--left"
		>
			<slot name="left">
				<view
				    v-for="(item,index) in leftOptions"
				    :data-button="btn"
				    :key="index"
				    :style="{
				  backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : '#C7C6CD',
				  fontSize: item.style && item.style.fontSize ? item.style.fontSize : '16px'
				}"
				    class="uni-swipe_button button-hock"
				    @click.stop="onClick(index,item,'left')"
				><text
					    class="uni-swipe_button-text"
					    :style="{color: item.style && item.style.color ? item.style.color : '#FFFFFF',}"
					>{{ item.text }}</text></view>
			</slot>
		</view>
		<view
		    ref='selector-right-button--hock'
		    class="uni-swipe_button-group button-group--right"
		>
			<slot name="right">
				<view
				    v-for="(item,index) in rightOptions"
				    :data-button="btn"
				    :key="index"
				    :style="{
				  backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : '#C7C6CD',
				  fontSize: item.style && item.style.fontSize ? item.style.fontSize : '16px'
				}"
				    class="uni-swipe_button button-hock"
				    @click.stop="onClick(index,item,'right')"
				><text
					    class="uni-swipe_button-text"
					    :style="{color: item.style && item.style.color ? item.style.color : '#FFFFFF',}"
					>{{ item.text }}</text></view>
			</slot>
		</view>
		<view
		    ref='selector-content--hock'
		    class="uni-swipe_box"
		>
			<slot></slot>
		</view>
	</view>
	<!-- #endif -->
	<!--  js -->
	<!-- #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ -->
	<view class="uni-swipe">
		<view
		    class="uni-swipe_box"
		    @touchstart="touchstart"
		    @touchmove="touchmove"
		    @touchend="touchend"
		    :style="{transform:moveLeft}"
		    :class="{ani:ani}"
		>
			<view class="uni-swipe_button-group button-group--left">
				<slot name="left">
					<view
					    v-for="(item,index) in leftOptions"
					    :data-button="btn"
					    :key="index"
					    :style="{
					  backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : '#C7C6CD',
					  fontSize: item.style && item.style.fontSize ? item.style.fontSize : '16px'
					}"
					    class="uni-swipe_button button-hock"
					    @touchstart="appTouchStart"
					    @touchend="appTouchEnd($event,index,item,'left')"
					><text
						    class="uni-swipe_button-text"
						    :style="{color: item.style && item.style.color ? item.style.color : '#FFFFFF',}"
						>{{ item.text }}</text></view>
				</slot>
			</view>
			<slot></slot>
			<view class="uni-swipe_button-group button-group--right">
				<slot name="right">
					<view
					    v-for="(item,index) in rightOptions"
					    :data-button="btn"
					    :key="index"
					    :style="{
					  backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : '#C7C6CD',
					  fontSize: item.style && item.style.fontSize ? item.style.fontSize : '16px'
					}"
					    @touchstart="appTouchStart"
					    @touchend="appTouchEnd($event,index,item,'right')"
					    class="uni-swipe_button button-hock"
					><text
						    class="uni-swipe_button-text"
						    :style="{color: item.style && item.style.color ? item.style.color : '#FFFFFF',}"
						>{{ item.text }}</text></view>
				</slot>
			</view>
		</view>
	</view>
	<!-- #endif -->

</template>
<script
    src="./index.wxs"
    module="swipe"
    lang="wxs"
></script>
<script>
	// #ifdef APP-VUE|| MP-WEIXIN || H5
	import mpwxs from './mpwxs'
	// #endif

	// #ifdef APP-NVUE
	import bindingx from './bindingx.js'
	// #endif

	// #ifndef APP-PLUS|| MP-WEIXIN  ||  H5
	import mixins from './mpother'
	// #endif

	/**
	 * SwipeActionItem 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=181
	 * @property {Boolean} show = [left|rightnone] 	auto-close = false 
	 * @property {Boolean} disabled = [true|false] 		
	 * @property {Boolean} autoClose = [true|false] 	
	 * @property {Number}  threshold 					
	 * @property {Array} leftOptions 					
	 * @property {Array} rgihtOptions 					
	 * @event {Function} click 							e = {content,index} contentindex)
	 * @event {Function} change 						left\right\none
	 */

	export default {
		// #ifdef APP-VUE|| MP-WEIXIN||H5
		mixins: [mpwxs],
		// #endif

		// #ifdef APP-NVUE
		mixins: [bindingx],
		// #endif

		// #ifndef APP-PLUS|| MP-WEIXIN ||  H5
		mixins: [mixins],
		// #endif

		props: {
			// 
			show: {
				type: String,
				default: 'none'
			},

			// 
			disabled: {
				type: Boolean,
				default: false
			},

			// 
			autoClose: {
				type: Boolean,
				default: true
			},

			// 
			threshold: {
				type: Number,
				default: 20
			},

			// 
			leftOptions: {
				type: Array,
				default () {
					return []
				}
			},

			// 
			rightOptions: {
				type: Array,
				default () {
					return []
				}
			}

		},
		inject: ['swipeaction']
	}
</script>
<style
    lang="scss"
    scoped
>
	.uni-swipe {
		position: relative;
		/* #ifndef APP-NVUE */
		overflow: hidden;
		/* #endif */
	}

	.uni-swipe_box {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		position: relative;
	}

	.uni-swipe_content {
		// border: 1px red solid;
	}

	.uni-swipe_text--center {
		width:100%;
		/* #ifndef APP-NVUE */
		cursor: grab;
		/* #endif */
	}

	.uni-swipe_button-group {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
		flex-direction: row;
		position: absolute;
		top: 0;
		bottom: 0;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.button-group--left {
		left: 0;
		transform: translateX(-100%)
	}

	.button-group--right {
		right: 0;
		transform: translateX(100%)
	}

	.uni-swipe_button {
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0 20px;
	}

	.uni-swipe_button-text {
		/* #ifndef APP-NVUE */
		flex-shrink: 0;
		/* #endif */
		font-size: 14px;
	}

	.ani {
		transition-property: transform;
		transition-duration: 0.3s;
		transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
	}

	/* #ifdef MP-ALIPAY */
	.movable-area {
		/* width: 100%; */
		height: 45px;
	}

	.movable-view {
		display: flex;
		/* justify-content: center; */
		position: relative;
		flex: 1;
		height: 45px;
		z-index: 2;
	}

	.movable-view-button {
		display: flex;
		flex-shrink: 0;
		flex-direction: row;
		height: 100%;
		background: #C0C0C0;
	}

	/* .transition {
		transition: all 0.3s;
	} */

	.movable-view-box {
		flex-shrink: 0;
		height: 100%;
		background-color: #fff;
	}

	/* #endif */
</style>
