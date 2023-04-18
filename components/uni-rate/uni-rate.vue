<template>
	<view>
		<view ref="uni-rate" class="uni-rate">
			<view v-if="" class="uni-rate__icon" :class="{'uni-cursor-not-allowed': disabled}" :style="{ 'margin-right': marginNumber + 'px' }" v-for="(star, index) in stars" :key="index" @touchstart.stop="touchstart" @touchmove.stop="touchmove" @mousedown.stop="mousedown" @mousemove.stop="mousemove" @mouseleave="mouseleave">
				<uni-icons :color="color" :size="size" :type="isFill ? 'star-filled' : 'star'" />
				<!-- #ifdef APP-NVUE -->
				<view :style="{ width: star.activeWitch.replace('%','')*size/100+'px'}" class="uni-rate__icon-on">
					<uni-icons style="text-align: left;" :color="disabled?'#ccc':activeColor" :size="size" type="star-filled" />
				</view>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<view :style="{ width: star.activeWitch}" class="uni-rate__icon-on">
					<uni-icons :color="disabled?disabledColor:activeColor" :size="size" type="star-filled" />
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom');
	// #endif
	/**
	 * Rate 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=33
	 * @property {Boolean} 	isFill = [true|false] 		, 
	 * @property {String} 	color 						 "#ececec"
	 * @property {String} 	activeColor 				 "#ffca3e"
	 * @property {String} 	disabledColor 				 "#c0c0c0"
	 * @property {Number} 	size 						
	 * @property {Number} 	value/v-model 				
	 * @property {Number} 	max 						
	 * @property {Number} 	margin 						 px
	 * @property {Boolean} 	disabled = [true|false] 	 false
	 * @property {Boolean} 	readonly = [true|false] 	 false
	 * @property {Boolean} 	allowHalf = [true|false] 	 false
	 * @property {Boolean} 	touchable = [true|false] 	 true
	 * @event {Function} change 						uniRate  value e={value:Number}
	 */

	export default {
		name: "UniRate",
		props: {
			isFill: {
				// 
				type: [Boolean, String],
				default: true
			},
			color: {
				// 
				type: String,
				default: "#ececec"
			},
			activeColor: {
				// 
				type: String,
				default: "#ffca3e"
			},
			disabledColor: {
				// 
				type: String,
				default: "#c0c0c0"
			},
			size: {
				// 
				type: [Number, String],
				default: 24
			},
			value: {
				// 
				type: [Number, String],
				default: 1
			},
			max: {
				// 
				type: [Number, String],
				default: 5
			},
			margin: {
				// 
				type: [Number, String],
				default: 0
			},
			disabled: {
				// 
				type: [Boolean, String],
				default: false
			},
			readonly: {
				// 
				type: [Boolean, String],
				default: false
			},
			allowHalf: {
				// 
				type: [Boolean, String],
				default: false
			},
			touchable: {
				// 
				type: [Boolean, String],
				default: true
			}
		},
		data() {
			return {
				valueSync: "",
				userMouseFristMove: true,
				userRated: false,
				userLastRate: 1
			};
		},
		watch: {
			value(newVal) {
				this.valueSync = Number(newVal);
			},
		},
		computed: {
			stars() {
				const value = this.valueSync ? this.valueSync : 0;
				const starList = [];
				const floorValue = Math.floor(value);
				const ceilValue = Math.ceil(value);
				for (let i = 0; i < this.max; i++) {
					if (floorValue > i) {
						starList.push({
							activeWitch: "100%"
						});
					} else if (ceilValue - 1 === i) {
						starList.push({
							activeWitch: (value - floorValue) * 100 + "%"
						});
					} else {
						starList.push({
							activeWitch: "0"
						});
					}
				}
				return starList;
			},

			marginNumber() {
				return Number(this.margin)
			}
		},
		created() {
			this.valueSync = Number(this.value);
			this._rateBoxLeft = 0
			this._oldValue = null
		},
		mounted() {
			setTimeout(() => {
				this._getSize()
			}, 100)
			// #ifdef H5
			this.PC = this.IsPC()
			// #endif
		},
		methods: {
			touchstart(e) {
				// #ifdef H5
				if (this.IsPC()) return
				// #endif
				if (this.readonly || this.disabled) return
				const {
					clientX,
					screenX
				} = e.changedTouches[0]
				// TODO  Nvue  screenX clientX
				this._getRateCount(clientX || screenX)
			},
			touchmove(e) {
				// #ifdef H5
				if (this.IsPC()) return
				// #endif
				if (this.readonly || this.disabled || !this.touchable) return
				const {
					clientX,
					screenX
				} = e.changedTouches[0]
				this._getRateCount(clientX || screenX)
			},

			/**
			 *  PC @tian
			 */

			mousedown(e) {
				// #ifdef H5
				if (!this.IsPC()) return
				if (this.readonly || this.disabled) return
				const {
					clientX,
				} = e
				this.userLastRate = this.valueSync
				this._getRateCount(clientX)
				this.userRated = true
				// #endif
			},
			mousemove(e) {
				// #ifdef H5
				if (!this.IsPC()) return
				if (this.userRated) return
				if (this.userMouseFristMove) {
					console.log('---mousemove----', this.valueSync);
					this.userLastRate = this.valueSync
					this.userMouseFristMove = false
				}
				if (this.readonly || this.disabled || !this.touchable) return
				const {
					clientX,
				} = e
				this._getRateCount(clientX)
				// #endif
			},
			mouseleave(e) {
				// #ifdef H5
				if (!this.IsPC()) return
				if (this.readonly || this.disabled || !this.touchable) return
				if (this.userRated) {
					this.userRated = false
					return
				}
				this.valueSync = this.userLastRate
				// #endif
			},
			// #ifdef H5
			IsPC() {
				var userAgentInfo = navigator.userAgent;
				var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
				var flag = true;
				for (let v = 0; v < Agents.length - 1; v++) {
					if (userAgentInfo.indexOf(Agents[v]) > 0) {
						flag = false;
						break;
					}
				}
				return flag;
			},
			// #endif

			/**
			 * 
			 */
			_getRateCount(clientX) {
				this._getSize()
				const size = Number(this.size)
				if (size === NaN) {
					return new Error('size ')
				}
				const rateMoveRange = clientX - this._rateBoxLeft
				let index = parseInt(rateMoveRange / (size + this.marginNumber))
				index = index < 0 ? 0 : index;
				index = index > this.max ? this.max : index;
				const range = parseInt(rateMoveRange - (size + this.marginNumber) * index);
				let value = 0;
				if (this._oldValue === index && !this.PC) return;
				this._oldValue = index;
				if (this.allowHalf) {
					if (range > (size / 2)) {
						value = index + 1
					} else {
						value = index + 0.5
					}
				} else {
					value = index + 1
				}

				value = Math.max(0.5, Math.min(value, this.max))
				this.valueSync = value
				this._onChange()
			},

			/**
			 * 
			 */
			_onChange() {

				this.$emit("input", this.valueSync);
				this.$emit("change", {
					value: this.valueSync
				});
			},
			/**
			 * 
			 */
			_getSize() {
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					.in(this)
					.select('.uni-rate')
					.boundingClientRect()
					.exec(ret => {
						if (ret) {
							this._rateBoxLeft = ret[0].left
						}
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['uni-rate'], (ret) => {
					const size = ret.size
					if (size) {
						this._rateBoxLeft = size.left
					}
				})
				// #endif
			}
		}
	};
</script>

<style scoped>
	.uni-rate {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		line-height: 1;
		font-size: 0;
		flex-direction: row;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-rate__icon {
		position: relative;
		line-height: 1;
		font-size: 0;
	}

	.uni-rate__icon-on {
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		line-height: 1;
		text-align: left;
	}

	.uni-cursor-not-allowed {
		/* #ifdef H5 */
		cursor: not-allowed !important;
		/* #endif */
	}
</style>