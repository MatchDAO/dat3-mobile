<template>
	<view class="page-container">
		<uni-nav-bar
      class="header-nav"
      :fixed="true"
      :border="false"
      status-bar="true"
      padding="16rpx 22rpx 16rpx 0"
      :title="''"
    >
			<view slot="right" class="header-nav-right">
        <suspensionbar :bgColor="true"></suspensionbar>
      </view>
    </uni-nav-bar>
		<view class="page-body">
			<view class="page-body-title">
				<image class="switch-control-bg" :src="`/static/wallet/wallet-switch-${switchKey === 'stake' ? 'left' : 'right'}.png`"></image>
				<view class="switch-control">
					<view class="switch-control-item" @tap="onSwitch('stake')" :class="{ active: switchKey === 'stake'}">{{$t('contract.stake')}}</view>
					<view class="switch-control-item" @tap="onSwitch('unstake')" :class="{ active: switchKey === 'unstake'}">{{$t('contract.unstake')}}</view>
				</view>
			</view>
			<view class="page-body-content">
				<stake v-if="switchKey === 'stake'"></stake>
				<unstake v-if="switchKey === 'unstake'"></unstake>
			</view>
		</view>
		<tabbar activeKey="contract"></tabbar>
	</view>
</template>

<script>
	import stake from './stake.vue';
	import unstake from './unstake.vue';
	export default {
		components: {
			stake,
			unstake
		},
		data() {
			return {
				switchKey: 'stake',
			};
		},
		onLoad() {
			uni.hideTabBar()
		},
		methods: {
			onSwitch(key) {
				this.switchKey = key;
			},
		}
	}
</script>

<style lang="scss" scoped>

.page-container {
	.header-nav {
		.header-nav-right {
			position: relative;
			width: 100%;
		}
	}

	.page-body {
		margin-top: 36rpx;
		padding: 0rpx 49rpx 105rpx 43rpx;
		.page-body-title {
			width: 313rpx;
			height: 62rpx;
			margin-bottom: 31rpx;
			position: relative;
			.switch-control-bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
			.switch-control {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				padding: 4rpx;
				// background: #CAD4FF;
				// border-radius: 30rpx;
				display: flex;
				align-items: center;
				flex-direction: row;
			
				.switch-control-item {
					flex: 1;
					text-align: center;
					color: #fff;
					height: 70rpx;
					line-height: 70rpx;
					font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					font-size: 25rpx;
				}
			}
		}
	}
}
</style>
