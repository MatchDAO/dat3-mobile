<template>
	<view class="uni-pagination">
		<view class="uni-pagination__total is-phone-hide"> {{ total }} </view>
		<view class="uni-pagination__btn" :class="currentIndex === 1 ? 'uni-pagination--disabled' : 'uni-pagination--enabled'" :hover-class="currentIndex === 1 ? '' : 'uni-pagination--hover'" :hover-start-time="20" :hover-stay-time="70" @click="clickLeft">
			<template v-if="showIcon === true || showIcon === 'true'">
				<uni-icons color="#666" size="16" type="arrowleft" />
			</template>
			<template v-else>
				<text class="uni-pagination__child-btn">{{ prevText }}</text>
			</template>
		</view>
		<view class="uni-pagination__num uni-pagination__num-flex-none">
			<view class="uni-pagination__num-current">
				<text class="uni-pagination__num-current-text is-pc-hide" style="color:#409EFF">{{ currentIndex }}</text>
				<text class="uni-pagination__num-current-text is-pc-hide">/{{ maxPage || 0 }}</text>

				<view v-for="(item, index) in paper" :key="index" :class="{ 'page--active': item === currentIndex }" class="uni-pagination__num-tag tag--active is-phone-hide" @click.top="selectPage(item, index)">
					<text>{{ item }}</text>
				</view>
			</view>
		</view>
		<view class="uni-pagination__btn" :class="currentIndex >= maxPage ? 'uni-pagination--disabled' : 'uni-pagination--enabled'" :hover-class="currentIndex === maxPage ? '' : 'uni-pagination--hover'" :hover-start-time="20" :hover-stay-time="70" @click="clickRight">
			<template v-if="showIcon === true || showIcon === 'true'">
				<uni-icons color="#666" size="16" type="arrowright" />
			</template>
			<template v-else>
				<text class="uni-pagination__child-btn">{{ nextText }}</text>
			</template>
		</view>
	</view>
</template>

<script>
	/**
	 * Pagination 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=32
	 * @property {String} prevText 
	 * @property {String} nextText 
	 * @property {Number} current 
	 * @property {Number} total 
	 * @property {Number} pageSize 
	 * @property {Number} showIcon = [true|false]  icon 
	 * @event {Function} change  ,e={type,current} currenttypenext/prev
	 */

	export default {
		name: 'UniPagination',
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			prevText: {
				type: String,
				default: ''
			},
			nextText: {
				type: String,
				default: ''
			},
			current: {
				type: [Number, String],
				default: 1
			},
			total: {
				// 
				type: [Number, String],
				default: 0
			},
			pageSize: {
				// 
				type: [Number, String],
				default: 10
			},
			showIcon: {
				//  icon 
				type: [Boolean, String],
				default: false
			},
			pagerCount: {
				type: Number,
				default: 7
			}
		},
		data() {
			return {
				currentIndex: 1,
				paperData: []
			}
		},
		computed: {
			maxPage() {
				let maxPage = 1
				let total = Number(this.total)
				let pageSize = Number(this.pageSize)
				if (total && pageSize) {
					maxPage = Math.ceil(total / pageSize)
				}
				return maxPage
			},
			paper() {
				const num = this.currentIndex
				// TODO 
				const pagerCount = this.pagerCount
				// const total = 181
				const total = this.total
				const pageSize = this.pageSize
				let totalArr = []
				let showPagerArr = []
				let pagerNum = Math.ceil(total / pageSize)
				for (let i = 0; i < pagerNum; i++) {
					totalArr.push(i + 1)
				}
				showPagerArr.push(1)
				const totalNum = totalArr[totalArr.length - (pagerCount + 1) / 2]
				totalArr.forEach((item, index) => {
					if ((pagerCount + 1) / 2 >= num) {
						if (item < pagerCount + 1 && item > 1) {
							showPagerArr.push(item)
						}
					} else if (num + 2 <= totalNum) {
						if (item > num - (pagerCount + 1) / 2 && item < num + (pagerCount + 1) / 2) {
							showPagerArr.push(item)
						}
					} else {
						if ((item > num - (pagerCount + 1) / 2 || pagerNum - pagerCount < item) && item < totalArr[totalArr.length - 1]) {
							showPagerArr.push(item)
						}
					}
				})
				if (pagerNum > pagerCount) {
					if ((pagerCount + 1) / 2 >= num) {
						showPagerArr[showPagerArr.length - 1] = '...'
					} else if (num + 2 <= totalNum) {
						showPagerArr[1] = '...'
						showPagerArr[showPagerArr.length - 1] = '...'
					} else {
						showPagerArr[1] = '...'
					}
					showPagerArr.push(totalArr[totalArr.length - 1])
				} else {
					if ((pagerCount + 1) / 2 >= num) {} else if (num + 2 <= totalNum) {} else {
						showPagerArr.shift()
						showPagerArr.push(totalArr[totalArr.length - 1])
					}
				}

				return showPagerArr
			}
		},
		watch: {
			current(val) {
				this.currentIndex = val
			},
			value(val) {
				if (val < 1) {
					this.currentIndex = 1
				} else {
					this.currentIndex = val
				}
			}
		},
		created() {
			this.currentIndex = +this.value
		},
		methods: {
			// 
			selectPage(e, index) {
				if (parseInt(e)) {
					this.currentIndex = e
					this.change('current')
				} else {
					let pagerNum = Math.ceil(this.total / this.pageSize)
					// let pagerNum = Math.ceil(181 / this.pageSize)
					// 
					if (index <= 1) {
						if (this.currentIndex - 5 > 1) {
							this.currentIndex -= 5
						} else {
							this.currentIndex = 1
						}
						return
					}
					// 
					if (index >= 6) {
						if (this.currentIndex + 5 > pagerNum) {
							this.currentIndex = pagerNum
						} else {
							this.currentIndex += 5
						}
						return
					}
				}
			},
			clickLeft() {
				if (Number(this.currentIndex) === 1) {
					return
				}
				this.currentIndex -= 1
				this.change('prev')
			},
			clickRight() {
				if (Number(this.currentIndex) >= this.maxPage) {
					return
				}
				this.currentIndex += 1
				this.change('next')
			},
			change(e) {
				this.$emit('input', this.currentIndex)
				this.$emit('change', {
					type: e,
					current: this.currentIndex
				})
			}
		}
	}
</script>

<style scoped>
	.uni-pagination {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		position: relative;
		overflow: hidden;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.uni-pagination__total {
		font-size: 14px;
		color: #999;
		margin-right: 15px;
	}

	.uni-pagination__btn {
		/* #ifndef APP-NVUE */
		display: flex;
		cursor: pointer;
		/* #endif */
		padding: 0 8px;
		line-height: 30px;
		font-size: 14px;
		position: relative;
		background-color: #f4f4f5;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.uni-pagination__child-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		font-size: 14px;
		position: relative;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.uni-pagination__num {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		color: #333;
		margin: 0 5px;
	}

	.uni-pagination__num-tag {
		/* #ifdef H5 */
		cursor: pointer;
		min-width: 30px;
		/* #endif */
		margin: 0 5px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		color: #666;
	}

	.uni-pagination__num-current {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-pagination__num-current-text {
		font-size: 15px;
	}

	.uni-pagination--enabled {
		color: #333333;
		opacity: 1;
	}

	.uni-pagination--disabled {
		opacity: 0.5;
		/* #ifdef H5 */
		cursor: default;
		/* #endif */
	}

	.uni-pagination--hover {
		color: rgba(0, 0, 0, 0.6);
		background-color: #f1f1f1;
	}

	.tag--active:hover {
		color: #007aff;
	}

	.page--active {
		color: #fff;
		background-color: #007aff;
	}

	.page--active:hover {
		color: #fff;
	}

	/* #ifdef H5 */
	.is-pc-hide {
		display: block;
	}

	.is-phone-hide {
		display: none;
	}

	@media screen and (min-width: 450px) {
		.is-pc-hide {
			display: none;
		}

		.is-phone-hide {
			display: block;
		}

		.uni-pagination__num-flex-none {
			flex: none;
		}
	}

	/* #endif */
</style>