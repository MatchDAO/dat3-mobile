<template>
	<view :class="[
      'uni-tag--' + type,
      disabled === true || disabled === 'true' ? 'uni-tag--disabled' : '',
      inverted === true || inverted === 'true' ? type + '-uni-tag--inverted' : '',
      circle === true || circle === 'true' ? 'uni-tag--circle' : '',
      mark === true || mark === 'true' ? 'uni-tag--mark' : '',
      'uni-tag--' + size
    ]" @click="onClick()" class="uni-tag" v-if="text">
		<text :class="[type === 'default' ? 'uni-tag--default':'uni-tag-text',inverted === true || inverted === 'true' ? 'uni-tag-text--'+type : '',size === 'small' ? 'uni-tag-text--small':'' ]">{{ text }}</text>
	</view>
</template>

<script>
	/**
	 * Tag 
	 * @description 1
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=35
	 * @property {String} text 
	 * @property {String} size = [normal|small] 
	 * 	@value normal 
	 * 	@value small 
	 * @property {String} type = [default|primary|successwarningerrorroyal]  
	 * 	@value default 
	 * 	@value primary 
	 * 	@value success 
	 * 	@value warning 
	 * 	@value error 
	 * 	@value royal 
	 * @property {Boolean} disabled = [true|false] 
	 * @property {Boolean} inverted = [true|false] 
	 * @property {Boolean} circle = [true|false] 
	 * @event {Function} click  Tag 
	 */

	export default {
		name: "UniTag",
		props: {
			type: {
				// defaultprimarysuccesswarningerrorroyal
				type: String,
				default: "default"
			},
			size: {
				//  normal, small
				type: String,
				default: "normal"
			},
			// 
			text: {
				type: String,
				default: ""
			},
			disabled: {
				// 
				type: [Boolean, String],
				default: false
			},
			inverted: {
				// 
				type: [Boolean, String],
				default: false
			},
			circle: {
				// 
				type: [Boolean, String],
				default: false
			},
			mark: {
				// 
				type: [Boolean, String],
				default: false
			}
		},
		methods: {
			onClick() {
				if (this.disabled === true || this.disabled === "true") {
					return;
				}
				this.$emit("click");
			}
		}
	};
</script>

<style scoped>
	.uni-tag {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		padding: 0px 16px;
		height: 30px;
		line-height: 30px;
		justify-content: center;
		color: #333;
		border-radius: 3px;
		background-color: #f8f8f8;
		border-width: 1rpx;
		border-style: solid;
		border-color: #f8f8f8;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-tag--circle {
		border-radius: 15px;
	}

	.uni-tag--mark {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-top-right-radius: 15px;
		border-bottom-right-radius: 15px;
	}

	.uni-tag--disabled {
		opacity: 0.5;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}

	.uni-tag--small {
		height: 20px;
		padding: 0px 8px;
		line-height: 20px;
		font-size: 12px;
	}

	.uni-tag--default {
		color: #333;
		font-size: 14px;
	}

	.uni-tag-text--small {
		font-size: 12px !important;
	}

	.uni-tag-text {
		color: #fff;
		font-size: 14px;
	}

	.uni-tag-text--primary {
		color: #007aff !important;
	}

	.uni-tag-text--success {
		color: #4cd964 !important;
	}

	.uni-tag-text--warning {
		color: #f0ad4e !important;
	}

	.uni-tag-text--error {
		color: #dd524d !important;
	}

	.uni-tag--primary {
		color: #fff;
		background-color: #007aff;
		border-width: 1rpx;
		border-style: solid;
		border-color: #007aff;
	}

	.primary-uni-tag--inverted {
		color: #007aff;
		background-color: #ffffff;
		border-width: 1rpx;
		border-style: solid;
		border-color: #007aff;
	}

	.uni-tag--success {
		color: #fff;
		background-color: #4cd964;
		border-width: 1rpx;
		border-style: solid;
		border-color: #4cd964;
	}

	.success-uni-tag--inverted {
		color: #4cd964;
		background-color: #ffffff;
		border-width: 1rpx;
		border-style: solid;
		border-color: #4cd964;
	}

	.uni-tag--warning {
		color: #fff;
		background-color: #f0ad4e;
		border-width: 1rpx;
		border-style: solid;
		border-color: #f0ad4e;
	}

	.warning-uni-tag--inverted {
		color: #f0ad4e;
		background-color: #ffffff;
		border-width: 1rpx;
		border-style: solid;
		border-color: #f0ad4e;
	}

	.uni-tag--error {
		color: #fff;
		background-color: #dd524d;
		border-width: 1rpx;
		border-style: solid;
		border-color: #dd524d;
	}

	.error-uni-tag--inverted {
		color: #dd524d;
		background-color: #ffffff;
		border-width: 1rpx;
		border-style: solid;
		border-color: #dd524d;
	}

	.uni-tag--inverted {
		color: #333;
		background-color: #ffffff;
		border-width: 1rpx;
		border-style: solid;
		border-color: #f8f8f8;
	}
</style>