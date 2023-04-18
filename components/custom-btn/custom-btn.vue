<template>
  <view class="btn" @tap="!disabled && onClick()" :style="{ width, height }">
    <image v-if="!disabled" class="btn-bg" :src="bgImageSrc"></image>
    <image v-if="disabled" class="btn-bg" :src="bgImageDisabledSrc"></image>
    <view class="btn-content" :style="{ fontSize }">
			<slot />
    </view>
  </view>
</template>

<script>
	export default {
		name:"custom-btn",
		props: {
			disabled: {
				type: Boolean,
				default: false,
			},
			width: {
				type: String,
				default: '141rpx',
			},
			bgImageSrc: {
				type: String,
				default: '/static/home/small-btn-bg.png',
			},
			bgImageDisabledSrc: {
				type: String,
				default: '/static/home/small-btn-disabled-bg.png',
			},
			height: {
				type: String,
				default: '49rpx',
			},
			fontSize: {
				type: String,
				default: '22rpx',
			},
			onClick: {
				type: Function,
				default: () => {},
			}
		},
		created() {
		
		},
		data() {
			return {
			};
		},
		computed: {
			
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.btn {
		width: 141rpx;
		height: 49rpx;
		position: relative;
		.btn-bg {
			width: 100%;
			height: 100%;
		}
		.btn-content {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
		}
	}
</style>
