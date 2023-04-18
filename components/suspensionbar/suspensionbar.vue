<template>
	<view class="suspensionbar-container" @tap="goWalletPage">
		<image class="wallet-balance-bg" :src="bgColor ? '/static/wallet/wallet-balance-has-bg.png' : '/static/wallet/wallet-balance-bg.png'"></image>
		<view class="suspensionbar-list">
			<view class="suspensionbar-item">
				<image src='/static/aptos-icon.png'></image>
				<text>{{ $utilWithVue.formatAptos(Number(walletAssetsInfo.user_apt) + Number(walletAssetsInfo.account_apt), 2) }}</text>
			</view>
			<view class="suspensionbar-item">
				<image src='/static/dat3-icon.png'></image>
				<text>{{ $utilWithVue.formatDat3(walletAssetsInfo.user_dat3, 2) }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"suspensionbar",
		props: {
			bgColor: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				event: {},
				walletAssetsInfo: {}
			}
		},
		created() {
			this.walletAssetsInfo = getApp().globalData.walletAssetsInfo;
			this.emitData();
		},
		methods: {
			emitData() {
				let me = this;
				uni.$on('updateWalletBalanceInfo', function({ data, walletAssetsInfo }){
					me.walletAssetsInfo = walletAssetsInfo;
				})
			},
			goWalletPage() {
        uni.navigateTo({
          url: `/pages/aptos-wallet/index`,
        });
      },
		}
	}
</script>

<style>
.suspensionbar-container {
	min-width: 240rpx;
	height: 80rpx;
	border-radius: 28rpx;
	position: absolute;
	top: -40rpx;
	right: 0;
}
image.wallet-balance-bg {
	position: absolute;
	width: 100%;
	height: 80rpx;
}
.suspensionbar-container .suspensionbar-list {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	min-width: 240rpx;
	height: 100%;
	box-sizing: border-box;
	padding: 18rpx 24rpx;
}
.suspensionbar-container .suspensionbar-list .suspensionbar-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 29rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #000000;
	margin-right: 20rpx;
}
.suspensionbar-container .suspensionbar-list .suspensionbar-item:last-child {
	margin-right: 0;
}
.suspensionbar-container .suspensionbar-list .suspensionbar-item image {
	width: 44rpx;
	height: 44rpx;
	margin-right: 2rpx;
}
</style>
