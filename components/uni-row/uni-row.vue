<template>
	<view :class="[ 'uni-row', typeClass , justifyClass, alignClass, ]" :style="{
		marginLeft:`${Number(marginValue)}rpx`,
		marginRight:`${Number(marginValue)}rpx`,
	}">
		<slot></slot>
	</view>
</template>

<script>
	/**
	 * uni-row	-
	 * @description	 24 
	 * @tutorial	https://ext.dcloud.net.cn/plugin?id=
	 *
	 * @property	{gutter} type = Number 
	 * @property	{justify} type = String flex 
	 * 							start/end/center/space-around/space-between	start
	 * 							start
	 * @property	{align} type = String flex 
	 * 							top/middle/bottom
	 * 							top
	 * @property	{width} type = String|Number nvue
	 * 						 750
	 */
	const ComponentClass = 'uni-row';
	const modifierSeparator = '--';

	export default {
		name: 'uniRow',
		componentName: 'uniRow',
		// #ifdef MP-WEIXIN
		options: {
			virtualHost: true // Vueflex
		},
		// #endif
		props: {
			type: String,
			gutter: Number,
			justify: {
				type: String,
				default: 'start'
			},
			align: {
				type: String,
				default: 'top'
			},
			// nvuespan
			width: {
				type: [String, Number],
				default: 750
			}
		},
		created() {
			// #ifdef APP-NVUE
			this.type = 'flex';
			// #endif
		},
		computed: {
			marginValue() {
				// #ifndef APP-NVUE
				if (this.gutter) {
					return -(this.gutter / 2);
				}
				// #endif
				return 0;
			},
			typeClass() {
				return this.type === 'flex' ? `${ComponentClass + modifierSeparator}flex` : '';
			},
			justifyClass() {
				return this.justify !== 'start' ? `${ComponentClass + modifierSeparator}flex-justify-${this.justify}` : ''
			},
			alignClass() {
				return this.align !== 'top' ? `${ComponentClass + modifierSeparator}flex-align-${this.align}` : ''
			}
		}
	};
</script>

<style scoped>
	.uni-row {
		position: relative;
		flex-direction: row;
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.uni-row::before,
	.uni-row::after {
		display: table;
		content: "";
	}

	.uni-row::after {
		clear: both;
	}

	/* #endif */
	/* #ifndef MP-QQ || MP-TOUTIAO || MP-BAIDU */
	.uni-row--flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		flex: 1;
	}

	.uni-row--flex:before,
	.uni-row--flex:after {
		/* #ifndef APP-NVUE */
		display: none;
		/* #endif */
	}

	.uni-row--flex-justify-center {
		justify-content: center;
	}

	.uni-row--flex-justify-end {
		justify-content: flex-end;
	}

	.uni-row--flex-justify-space-between {
		justify-content: space-between;
	}

	.uni-row--flex-justify-space-around {
		justify-content: space-around;
	}

	.uni-row--flex-align-middle {
		align-items: center;
	}

	.uni-row--flex-align-bottom {
		align-items: flex-end;
	}

	/* #endif */

	/* #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ */
	:host {
		display: block;
	}

	/* #endif */
</style>