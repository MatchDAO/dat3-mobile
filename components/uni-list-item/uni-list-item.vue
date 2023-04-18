<template>
	<!-- #ifdef APP-NVUE -->
	<cell>
		<!-- #endif -->

		<view
			:class="{ 'uni-list-item--disabled': disabled }"
			:hover-class="(!clickable && !link) || disabled || showSwitch ? '' : 'uni-list-item--hover'"
			class="uni-list-item"
			@click.stop="onClick"
		>
			<view v-if="!isFirstChild" class="border--left" :class="{ 'uni-list--border': border }"></view>
			<view class="uni-list-item__container" :class="{ 'container--right': showArrow || link, 'flex--direction': direction === 'column' }">
				<slot name="header">
					<view class="uni-list-item__header">
						<view v-if="thumb" class="uni-list-item__icon"><image :src="thumb" class="uni-list-item__icon-img" :class="['uni-list--' + thumbSize]" /></view>
						<view v-else-if="showExtraIcon" class="uni-list-item__icon"><uni-icons :color="extraIcon.color" :size="extraIcon.size" :type="extraIcon.type" /></view>
					</view>
				</slot>
				<slot name="body">
					<view class="uni-list-item__content" :class="{ 'uni-list-item__content--center': thumb || showExtraIcon || showBadge || showSwitch }">
						<text v-if="title" class="uni-list-item__content-title" :class="[ellipsis !== 0 && ellipsis <= 2 ? 'uni-ellipsis-' + ellipsis : '']">{{ title }}</text>
						<text v-if="note" class="uni-list-item__content-note">{{ note }}</text>
					</view>
				</slot>
				<slot name="footer">
					<view v-if="rightText || showBadge || showSwitch" class="uni-list-item__extra" :class="{ 'flex--justify': direction === 'column' }">
						<text v-if="rightText" class="uni-list-item__extra-text">{{ rightText }}</text>
						<uni-badge v-if="showBadge" :type="badgeType" :text="badgeText" />
						<switch v-if="showSwitch" :disabled="disabled" :checked="switchChecked" @change="onSwitchChange" />
					</view>
				</slot>
			</view>
			<uni-icons v-if="showArrow || link" :size="16" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
		</view>
		<!-- #ifdef APP-NVUE -->
	</cell>
	<!-- #endif -->
</template>

<script>
/**
 * ListItem 
 * @description 
 * @tutorial https://ext.dcloud.net.cn/plugin?id=24
 * @property {String} 	title 							
 * @property {String} 	note 							
 * @property {String} 	thumb 							thumb
 * @property {String}  	thumbSize = [lg|base|sm]		
 * 	@value 	 lg			
 * 	@value 	 base		
 * 	@value 	 sm			
 * @property {String} 	badgeText						
 * @property {String} 	badgeType 						[uni-icons](https://ext.dcloud.net.cn/plugin?id=21)
 * @property {String} 	rightText 						
 * @property {Boolean} 	disabled = [true|false]			
 * @property {Boolean} 	clickable = [true|false] 		
 * @property {String} 	link = [navigateTo|redirectTo|reLaunch|switchTab] 
 *  @value 	navigateTo 	 uni.navigateTo()
 * 	@value redirectTo 	 uni.redirectTo()
 * 	@value reLaunch   	 uni.reLaunch()
 * 	@value switchTab  	 uni.switchTab()
 * @property {String | PageURIString} 	to  			
 * @property {Boolean} 	showBadge = [true|false] 		
 * @property {Boolean} 	showSwitch = [true|false] 		Switch
 * @property {Boolean} 	switchChecked = [true|false] 	Switch
 * @property {Boolean} 	showExtraIcon = [true|false] 	
 * @property {Object} 	extraIcon 						 {color: '#4cd964',size: '22',type: 'spinner'}
 * @property {String} 	direction = [row|column]		
 * @value row 			
 * @value column 		
 * @event {Function} 	click 							 uniListItem 
 * @event {Function} 	switchChange 					 Switch 
 */
export default {
	name: 'UniListItem',
	props: {
		direction: {
			type: String,
			default: 'row'
		},
		title: {
			type: String,
			default: ''
		},
		note: {
			type: String,
			default: ''
		},
		ellipsis: {
			type: [Number],
			default: 0
		},
		disabled: {
			type: [Boolean, String],
			default: false
		},
		clickable: {
			type: Boolean,
			default: false
		},
		showArrow: {
			type: [Boolean, String],
			default: false
		},
		link: {
			type: [Boolean, String],
			default: false
		},
		to: {
			type: String,
			default: ''
		},
		showBadge: {
			type: [Boolean, String],
			default: false
		},
		showSwitch: {
			type: [Boolean, String],
			default: false
		},
		switchChecked: {
			type: [Boolean, String],
			default: false
		},
		badgeText: {
			type: String,
			default: ''
		},
		badgeType: {
			type: String,
			default: 'success'
		},
		rightText: {
			type: String,
			default: ''
		},
		thumb: {
			type: String,
			default: ''
		},
		thumbSize: {
			type: String,
			default: 'base'
		},
		showExtraIcon: {
			type: [Boolean, String],
			default: false
		},
		extraIcon: {
			type: Object,
			default() {
				return {
					type: 'contact',
					color: '#000000',
					size: 20
				};
			}
		},
		border: {
			type: Boolean,
			default: true
		}
	},
	// inject: ['list'],
	data() {
		return {
			isFirstChild: false
		};
	},
	mounted() {
		this.list = this.getForm()
		//  uni-list 
		if(this.list){
			if (!this.list.firstChildAppend) {
				this.list.firstChildAppend = true;
				this.isFirstChild = true;
			}
		}
	},
	methods: {
		/**
		 * 
		 */
		getForm(name = 'uniList') {
			let parent = this.$parent;
			let parentName = parent.$options.name;
			while (parentName !== name) {
				parent = parent.$parent;
				if (!parent) return false
				parentName = parent.$options.name;
			}
			return parent;
		},
		onClick() {
			if (this.to !== '') {
				this.openPage();
				return;
			}
			if (this.clickable || this.link) {
				this.$emit('click', {
					data: {}
				});
			}
		},
		onSwitchChange(e) {
			this.$emit('switchChange', e.detail);
		},
		openPage() {
			if (['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'].indexOf(this.link) !== -1) {
				this.pageApi(this.link);
			} else {
				this.pageApi('navigateTo');
			}
		},
		pageApi(api) {
			uni[api]({
				url: this.to,
				success: res => {
					this.$emit('click', {
						data: res
					});
				},
				fail: err => {
					this.$emit('click', {
						data: err
					});
					console.error(err.errMsg);
				}
			});
		}
	}
};
</script>

<style lang="scss">
$list-item-pd: $uni-spacing-col-lg $uni-spacing-row-lg;

.uni-list-item {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	font-size: $uni-font-size-lg;
	position: relative;
	justify-content: space-between;
	align-items: center;
	background-color: #fff;
	flex-direction: row;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.uni-list-item--disabled {
	opacity: 0.3;
}

.uni-list-item--hover {
	background-color: $uni-bg-color-hover;
}

.uni-list-item__container {
	position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	padding: $list-item-pd;
	padding-left: $uni-spacing-row-lg;
	flex: 1;
	overflow: hidden;
	// align-items: center;
}

.container--right {
	padding-right: 0;
}

// .border--left {
// 	margin-left: $uni-spacing-row-lg;
// }

.uni-list--border {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	/* #ifdef APP-NVUE */
	border-top-color: $uni-border-color;
	border-top-style: solid;
	border-top-width: 0.5px;
	/* #endif */
}

/* #ifndef APP-NVUE */
.uni-list--border:after {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: $uni-border-color;
}

/* #endif */

.uni-list-item__content {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	padding-right: 8px;
	flex: 1;
	color: #3b4144;
	// overflow: hidden;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;
}

.uni-list-item__content--center {
	justify-content: center;
}

.uni-list-item__content-title {
	font-size: $uni-font-size-base;
	color: #3b4144;
	overflow: hidden;
}

.uni-list-item__content-note {
	margin-top: 6rpx;
	color: $uni-text-color-grey;
	font-size: $uni-font-size-sm;
	overflow: hidden;
}

.uni-list-item__extra {
	// width: 25%;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}

.uni-list-item__header {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
}

.uni-list-item__icon {
	margin-right: 18rpx;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.uni-list-item__icon-img {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	height: $uni-img-size-base;
	width: $uni-img-size-base;
	margin-right: 10px;
}

.uni-icon-wrapper {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	padding: 0 10px;
}

.flex--direction {
	flex-direction: column;
	/* #ifndef APP-NVUE */
	align-items: initial;
	/* #endif */
}

.flex--justify {
	/* #ifndef APP-NVUE */
	justify-content: initial;
	/* #endif */
}

.uni-list--lg {
	height: $uni-img-size-lg;
	width: $uni-img-size-lg;
}

.uni-list--base {
	height: $uni-img-size-base;
	width: $uni-img-size-base;
}

.uni-list--sm {
	height: $uni-img-size-sm;
	width: $uni-img-size-sm;
}

.uni-list-item__extra-text {
	color: $uni-text-color-grey;
	font-size: $uni-font-size-sm;
}
.uni-ellipsis-1 {
	/* #ifndef APP-NVUE */
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	/* #endif */
	/* #ifdef APP-NVUE */
	lines: 1;
	/* #endif */
}

.uni-ellipsis-2 {
	/* #ifndef APP-NVUE */
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	/* #endif */

	/* #ifdef APP-NVUE */
	lines: 2;
	/* #endif */
}
</style>
