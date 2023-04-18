<template>
	<view class="uni-grid-wrap">
		<view :id="elId" ref="uni-grid" class="uni-grid" :class="{ 'uni-grid--border': showBorder }" :style="{ 'border-left-color':borderColor}">
			<slot />
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom');
	// #endif

	/**
	 * Grid 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=27
	 * @property {Number} column 
	 * @property {String} borderColor 
	 * @property {Boolean} showBorder 
	 * @property {Boolean} square 
	 * @property {Boolean} Boolean 
	 * @event {Function} change  grid e={detail:{index:0}}index  gird 
	 */
	export default {
		name: 'UniGrid',
		props: {
			// 
			column: {
				type: Number,
				default: 3
			},
			// 
			showBorder: {
				type: Boolean,
				default: true
			},
			// 
			borderColor: {
				type: String,
				default: '#e5e5e5'
			},
			// , true
			square: {
				type: Boolean,
				default: true
			},
			highlight: {
				type: Boolean,
				default: true
			}
		},
		provide() {
			return {
				grid: this
			}
		},
		data() {
			const elId = `Uni_${Math.ceil(Math.random() * 10e5).toString(36)}`
			return {
				elId,
				width: 0
			}
		},
		created() {
			this.children = []
		},
		mounted() {
			this.$nextTick(() => {
				this.init()
			})
		},
		methods: {
			init() {
				setTimeout(() => {
					this._getSize((width) => {
						this.children.forEach((item, index) => {
							item.width = width
						})
					})
				}, 50)
			},
			change(e) {
				this.$emit('change', e)
			},
			_getSize(fn) {
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					.in(this)
					.select(`#${this.elId}`)
					.boundingClientRect()
					.exec(ret => {
						this.width = parseInt((ret[0].width - 1) / this.column) + 'px'
						fn(this.width)
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['uni-grid'], (ret) => {
					this.width = parseInt((ret.size.width - 1) / this.column) + 'px'
					fn(this.width)
				})
				// #endif
			}
		}
	}
</script>

<style scoped>
	.uni-grid-wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: column;
		/* #ifdef H5 */
		width: 100%;
		/* #endif */
	}

	.uni-grid {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
	}

	.uni-grid--border {
		position: relative;
		/* #ifdef APP-NVUE */
		border-left-color: #e5e5e5;
		border-left-style: solid;
		border-left-width: 0.5px;
		/* #endif */
		/* #ifndef APP-NVUE */
		z-index: 1;
		border-left: 1px #e5e5e5 solid;
		/* #endif */
	}
</style>