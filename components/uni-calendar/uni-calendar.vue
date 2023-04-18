<template>
	<view class="uni-calendar">
		<view v-if="!insert&&show" class="uni-calendar__mask" :class="{'uni-calendar--mask-show':aniMaskShow}" @click="clean"></view>
		<view v-if="insert || show" class="uni-calendar__content" :class="{'uni-calendar--fixed':!insert,'uni-calendar--ani-show':aniMaskShow}">
			<view v-if="!insert" class="uni-calendar__header uni-calendar--fixed-top">
				<view class="uni-calendar__header-btn-box" @click="close">
					<text class="uni-calendar__header-text uni-calendar--fixed-width"></text>
				</view>
				<view class="uni-calendar__header-btn-box" @click="confirm">
					<text class="uni-calendar__header-text uni-calendar--fixed-width"></text>
				</view>
			</view>
			<view class="uni-calendar__header">
				<view class="uni-calendar__header-btn-box" @click.stop="pre">
					<view class="uni-calendar__header-btn uni-calendar--left"></view>
				</view>
				<picker mode="date" :value="date" fields="month" @change="bindDateChange">
					<text class="uni-calendar__header-text">{{ (nowDate.year||'') +''+( nowDate.month||'') +''}}</text>
				</picker>
				<view class="uni-calendar__header-btn-box" @click.stop="next">
					<view class="uni-calendar__header-btn uni-calendar--right"></view>
				</view>
				<text class="uni-calendar__backtoday" @click="backtoday"></text>

			</view>
			<view class="uni-calendar__box">
				<view v-if="showMonth" class="uni-calendar__box-bg">
					<text class="uni-calendar__box-bg-text">{{nowDate.month}}</text>
				</view>
				<view class="uni-calendar__weeks">
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text"></text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text"></text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text"></text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text"></text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text"></text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text"></text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text"></text>
					</view>
				</view>
				<view class="uni-calendar__weeks" v-for="(item,weekIndex) in weeks" :key="weekIndex">
					<view class="uni-calendar__weeks-item" v-for="(weeks,weeksIndex) in item" :key="weeksIndex">
						<calendar-item class="uni-calendar-item--hook" :weeks="weeks" :calendar="calendar" :selected="selected" :lunar="lunar" @change="choiceDate"></calendar-item>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Calendar from './util.js';
	import calendarItem from './uni-calendar-item.vue'
	/**
	 * Calendar 
	 * @description 
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=56
	 * @property {String} date 
	 * @property {Boolean} lunar 
	 * @property {String} startDate -
	 * @property {String} endDate -
	 * @property {Boolean} range 
	 * @property {Boolean} insert = [true|false] ,false
	 * 	@value true 
	 * 	@value false 
	 * @property {Boolean} clearDate = [true|false] 
	 * @property {Array} selected [{date: '2019-06-27', info: '', data: { custom: '', name: '',xxx:xxx... }}]
	 * @property {Boolean} showMonth 
	 * @event {Function} change `insert :ture` 
	 * @event {Function} confirm `insert :false` 
	 * @event {Function} monthSwitch 
	 * @example <uni-calendar :insert="true":lunar="true" :start-date="'2019-3-2'":end-date="'2019-5-20'"@change="change" />
	 */
	export default {
		components: {
			calendarItem
		},
		props: {
			date: {
				type: String,
				default: ''
			},
			selected: {
				type: Array,
				default () {
					return []
				}
			},
			lunar: {
				type: Boolean,
				default: false
			},
			startDate: {
				type: String,
				default: ''
			},
			endDate: {
				type: String,
				default: ''
			},
			range: {
				type: Boolean,
				default: false
			},
			insert: {
				type: Boolean,
				default: true
			},
			showMonth: {
				type: Boolean,
				default: true
			},
			clearDate: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				show: false,
				weeks: [],
				calendar: {},
				nowDate: '',
				aniMaskShow: false
			}
		},
		watch: {
			date(newVal) {
				// this.cale.setDate(newVal)
				this.init(newVal)
			},
			startDate(val) {
				this.cale.resetSatrtDate(val)
			},
			endDate(val) {
				this.cale.resetEndDate(val)
			},
			selected(newVal) {
				this.cale.setSelectInfo(this.nowDate.fullDate, newVal)
				this.weeks = this.cale.weeks
			}
		},
		created() {
			// 
			this.cale = new Calendar({
				// date: new Date(),
				selected: this.selected,
				startDate: this.startDate,
				endDate: this.endDate,
				range: this.range,
			})
			// 
			// this.cale.setDate(this.date)
			this.init(this.date)
			// this.setDay
		},
		methods: {
			// 
			clean() {},
			bindDateChange(e) {
				const value = e.detail.value + '-1'
				console.log(this.cale.getDate(value));
				this.init(value)
			},
			/**
			 * 
			 * @param {Object} date
			 */
			init(date) {
				this.cale.setDate(date)
				this.weeks = this.cale.weeks
				this.nowDate = this.calendar = this.cale.getInfo(date)
			},
			/**
			 * 
			 */
			open() {
				// 
				if (this.clearDate && !this.insert) {
					this.cale.cleanMultipleStatus()
					// this.cale.setDate(this.date)
					this.init(this.date)
				}
				this.show = true
				this.$nextTick(() => {
					setTimeout(() => {
						this.aniMaskShow = true
					}, 50)
				})
			},
			/**
			 * 
			 */
			close() {
				this.aniMaskShow = false
				this.$nextTick(() => {
					setTimeout(() => {
						this.show = false
						this.$emit('close')
					}, 300)
				})
			},
			/**
			 * 
			 */
			confirm() {
				this.setEmit('confirm')
				this.close()
			},
			/**
			 * 
			 */
			change() {
				if (!this.insert) return
				this.setEmit('change')
			},
			/**
			 * 
			 */
			monthSwitch() {
				let {
					year,
					month
				} = this.nowDate
				this.$emit('monthSwitch', {
					year,
					month: Number(month)
				})
			},
			/**
			 * 
			 * @param {Object} name
			 */
			setEmit(name) {
				let {
					year,
					month,
					date,
					fullDate,
					lunar,
					extraInfo
				} = this.calendar
				this.$emit(name, {
					range: this.cale.multipleStatus,
					year,
					month,
					date,
					fulldate: fullDate,
					lunar,
					extraInfo: extraInfo || {}
				})
			},
			/**
			 * 
			 * @param {Object} weeks
			 */
			choiceDate(weeks) {
				if (weeks.disable) return
				this.calendar = weeks
				// 
				this.cale.setMultiple(this.calendar.fullDate)
				this.weeks = this.cale.weeks
				this.change()
			},
			/**
			 * 
			 */
			backtoday() {
				console.log(this.cale.getDate(new Date()).fullDate);
				let date = this.cale.getDate(new Date()).fullDate
				// this.cale.setDate(date)
				this.init(date)
				this.change()
			},
			/**
			 * 
			 */
			pre() {
				const preDate = this.cale.getDate(this.nowDate.fullDate, -1, 'month').fullDate
				this.setDate(preDate)
				this.monthSwitch()

			},
			/**
			 * 
			 */
			next() {
				const nextDate = this.cale.getDate(this.nowDate.fullDate, +1, 'month').fullDate
				this.setDate(nextDate)
				this.monthSwitch()
			},
			/**
			 * 
			 * @param {Object} date
			 */
			setDate(date) {
				this.cale.setDate(date)
				this.weeks = this.cale.weeks
				this.nowDate = this.cale.getInfo(date)
			}
		}
	}
</script>

<style scoped>
	.uni-calendar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-calendar__mask {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		transition-property: opacity;
		transition-duration: 0.3s;
		opacity: 0;
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--mask-show {
		opacity: 1;
	}

	.uni-calendar--fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		transition-property: transform;
		transition-duration: 0.3s;
		transform: translateY(460px);
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--ani-show {
		transform: translateY(0);
	}

	.uni-calendar__content {
		background-color: #fff;
	}

	.uni-calendar__header {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 50px;
		border-bottom-color: #e5e5e5;
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}

	.uni-calendar--fixed-top {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		border-top-color: #e5e5e5;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-calendar--fixed-width {
		width: 50px;
	}

	.uni-calendar__backtoday {
		position: absolute;
		right: 0;
		top: 25rpx;
		padding: 0 5px;
		padding-left: 10px;
		height: 25px;
		line-height: 25px;
		font-size: 12px;
		border-top-left-radius: 25px;
		border-bottom-left-radius: 25px;
		color: #333;
		background-color: #f1f1f1;
	}

	.uni-calendar__header-text {
		text-align: center;
		width: 100px;
		font-size: 14px;
		color: #333;
	}

	.uni-calendar__header-btn-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
	}

	.uni-calendar__header-btn {
		width: 10px;
		height: 10px;
		border-left-color: #808080;
		border-left-style: solid;
		border-left-width: 2px;
		border-top-color: #555555;
		border-top-style: solid;
		border-top-width: 2px;
	}

	.uni-calendar--left {
		transform: rotate(-45deg);
	}

	.uni-calendar--right {
		transform: rotate(135deg);
	}

	.uni-calendar__weeks {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-calendar__weeks-item {
		flex: 1;
	}

	.uni-calendar__weeks-day {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 45px;
		border-bottom-color: #F5F5F5;
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}

	.uni-calendar__weeks-day-text {
		font-size: 14px;
	}

	.uni-calendar__box {
		position: relative;
	}

	.uni-calendar__box-bg {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.uni-calendar__box-bg-text {
		font-size: 200px;
		font-weight: bold;
		color: #999;
		opacity: 0.1;
		text-align: center;
		/* #ifndef APP-NVUE */
		line-height: 1;
		/* #endif */
	}
</style>