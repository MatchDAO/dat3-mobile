<template>
	<view class="uni-swiper__warp">
		<slot />
		<view v-if="mode === 'default'" :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box" key='default'>
			<view v-for="(item,index) in info" @click="clickItem(index)" :style="{
        'width': (index === current? dots.width*2:dots.width ) + 'px','height':dots.width/3 +'px' ,'background-color':index !== current?dots.backgroundColor:dots.selectedBackgroundColor,'border-radius':'0px'}" :key="index" class="uni-swiper__dots-item uni-swiper__dots-bar" />
		</view>
		<view v-if="mode === 'dot'" :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box" key='dot'>
			<view v-for="(item,index) in info" @click="clickItem(index)" :style="{
        'width': dots.width + 'px','height':dots.height +'px' ,'background-color':index !== current?dots.backgroundColor:dots.selectedBackgroundColor,'border':index !==current ? dots.border:dots.selectedBorder}" :key="index" class="uni-swiper__dots-item" />
		</view>
		<view v-if="mode === 'round'" :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box" key='round'>
			<view v-for="(item,index) in info" @click="clickItem(index)" :class="[index === current&&'uni-swiper__dots-long']" :style="{
		    'width':(index === current? dots.width*3:dots.width ) + 'px','height':dots.height +'px' ,'background-color':index !== current?dots.backgroundColor:dots.selectedBackgroundColor,'border':index !==current ? dots.border:dots.selectedBorder}" :key="index" class="uni-swiper__dots-item " />
		</view>
		<view v-if="mode === 'nav'" key='nav' :style="{'background-color':dotsStyles.backgroundColor,'bottom':'0'}" class="uni-swiper__dots-box uni-swiper__dots-nav">
			<text :style="{'color':dotsStyles.color}" class="uni-swiper__dots-nav-item">{{ (current+1)+"/"+info.length +' ' +info[current][field] }}</text>
		</view>
		<view v-if="mode === 'indexes'" key='indexes' :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box">
			<view v-for="(item,index) in info" @click="clickItem(index)" :style="{
        'width':dots.width + 'px','height':dots.height +'px' ,'color':index === current?dots.selectedColor:dots.color,'background-color':index !== current?dots.backgroundColor:dots.selectedBackgroundColor,'border':index !==current ? dots.border:dots.selectedBorder}" :key="index" class="uni-swiper__dots-item uni-swiper__dots-indexes"><text class="uni-swiper__dots-indexes-text">{{ index+1 }}</text></view>
		</view>
	</view>
</template>

<script>
	/**
	 * SwiperDod 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=284
	 * @property {Number} current  `swiper`  `change`  `e.detail.current`
	 * @property {String} mode = [default|round|nav|indexes] 
	 * 	@value defualt 
	 * 	@value round 
	 * 	@value nav 
	 * 	@value indexes 
	 * @property {String} field mode  nav mode = nav 
	 * @property {String} info 
	 * @property {Object} dotsStyles 
	 * @event {Function} clickItem e={currentIndex}
	 */

	export default {
		name: 'UniSwiperDot',
		props: {
			info: {
				type: Array,
				default () {
					return []
				}
			},
			current: {
				type: Number,
				default: 0
			},
			dotsStyles: {
				type: Object,
				default () {
					return {}
				}
			},
			//  default() indexes long nav
			mode: {
				type: String,
				default: 'default'
			},
			//  nav 
			field: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				dots: {
					width: 8,
					height: 8,
					bottom: 10,
					color: '#fff',
					backgroundColor: 'rgba(0, 0, 0, .3)',
					border: '1px rgba(0, 0, 0, .3) solid',
					selectedBackgroundColor: '#333',
					selectedBorder: '1px rgba(0, 0, 0, .9) solid'
				}
			}
		},
		watch: {
			dotsStyles(newVal) {
				this.dots = Object.assign(this.dots, this.dotsStyles)
			},
			mode(newVal) {
				if (newVal === 'indexes') {
					this.dots.width = 20
					this.dots.height = 20
				} else {
					this.dots.width = 8
					this.dots.height = 8
				}
			}

		},
		created() {
			if (this.mode === 'indexes') {
				this.dots.width = 20
				this.dots.height = 20
			}
			this.dots = Object.assign(this.dots, this.dotsStyles)
		},
		methods: {
			clickItem(index) {
				this.$emit('clickItem', index)
			}
		}
	}
</script>

<style scoped>
	.uni-swiper__warp {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: column;
		position: relative;
		overflow: hidden;
	}

	.uni-swiper__dots-box {
		position: absolute;
		bottom: 10px;
		left: 0;
		right: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.uni-swiper__dots-item {
		width: 8px;
		border-radius: 100px;
		margin-left: 6px;
		background-color: rgba(0, 0, 0, 0.4);
		/* #ifndef APP-NVUE */
		cursor: pointer;
		/* #endif */
		/* #ifdef H5 */
		/* #endif */
	}

	.uni-swiper__dots-item:first-child {
		margin: 0;
	}

	.uni-swiper__dots-default {
		border-radius: 100px;
	}

	.uni-swiper__dots-long {
		border-radius: 50px;
	}

	.uni-swiper__dots-bar {
		border-radius: 50px;
	}

	.uni-swiper__dots-nav {
		bottom: 0px;
		height: 40px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.uni-swiper__dots-nav-item {
		/* overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
		font-size: 14px;
		color: #fff;
		margin: 0 15px;
	}

	.uni-swiper__dots-indexes {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
	}

	.uni-swiper__dots-indexes-text {
		color: #fff;
		font-size: 12px;
	}
</style>