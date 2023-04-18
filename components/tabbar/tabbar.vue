<template>
	<view class="tabbar-container">
		<view class="tabbar-list">
			<view class="tabbar-item" @tap="navigateTo('/pages/home/index')">
				<image :src="`/static/home${activeKey === 'home' ? '-active' : ''}.png`"></image>
			</view>
			<view class="tabbar-item" @tap="navigateTo('/pages/contract/index')">
				<image :src="`/static/contract${activeKey === 'contract' ? '-active' : ''}.png`"></image>
			</view>
			<view class="tabbar-item" @tap="navigateTo('/pages/message/index')">
				<image :src="`/static/message${activeKey === 'message' ? '-active' : ''}.png`"></image>
				<view v-if="unread_num > 0" class="unreadCount">
					{{unreadCount}}
				</view>
			</view>
			<view class="tabbar-item" @tap="navigateTo('/pages/my/index')">
				<image :src="`/static/my${activeKey === 'my' ? '-active' : ''}.png`"></image>
			</view>
		</view>
	</view>
</template>

<script>
	let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
	export default {
		name:"tabbar",
		props: {
			activeKey: {
				type: String,
				default: 'home',
			}
		},
		created() {
			let me = this;
			me.walletAssetsInfo = getApp().globalData.walletAssetsInfo || {};
			me.getData();
			this.on();
		},
		beforeDestroy() {
			this.off();
		},
		data() {
			return {
				unread_num: 0,
				walletAssetsInfo: {}
			};
		},
		computed: {
			unreadCount() {
				return this.unread_num > 99 ? '99+' : this.unread_num;
			}
		},
		methods: {
			on() {
				let me = this;
				uni.$on('updateWalletBalanceInfo', me.getWalletAssetsInfo);
				uni.$on("WebIM.onOpened", me.getData);
				uni.$on("WebIM.onTextMessage", me.getData);
				uni.$on("WebIM.onPictureMessage", me.getData);
				uni.$on('readChannelMsg', me.getData);
			},
			off() {
				let me = this;
				uni.$off('updateWalletBalanceInfo', me.getWalletAssetsInfo);
				uni.$off("WebIM.onOpened", me.getData);
				uni.$off("WebIM.onTextMessage", me.getData);
				uni.$off("WebIM.onPictureMessage", me.getData);
				uni.$off('readChannelMsg', me.getData);
			},
			getWalletAssetsInfo({ data, walletAssetsInfo }) {
				this.walletAssetsInfo = walletAssetsInfo;
			},
			getData() {
				let me = this;
				if (WebIM.conn.isOpened()) {
					me.getSessionList();
				}	
			},
			getSessionList() {
				let me = this; 
				let unread_num = 0;
        WebIM.conn.getSessionList().then((res) => {
					const channel_infos = res && res.data && res.data.channel_infos || [];
					channel_infos.forEach(channel_info => {
						unread_num = unread_num + channel_info.unread_num;
					});
					me.unread_num = unread_num;
				})
			},
			navigateTo(url) {
				console.log('url', url);
				// uni.navigateTo({
				// 	url,
				// });
				uni.switchTab({
					url
				});
			}
		}
	}
</script>

<style>
.tabbar-container {
	width: 688rpx;
	height: 118rpx;
	background: linear-gradient(360deg, #DBD3FD 0%, #F8F7FF 100%);
	box-shadow: 0rpx 0rpx 9rpx 0rpx rgba(121,121,121,0.25);
	border-radius: 72rpx;
	padding: 14rpx 62rpx 14rpx 78rpx;
	box-sizing: border-box;
	position: fixed;
	z-index: 10;
	bottom: 29rpx;
	left: 0;
	right: 0;
	margin: auto;
}
.tabbar-container .tabbar-list {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.tabbar-container .tabbar-list .tabbar-item {
	position: relative;
}

.tabbar-container .tabbar-list .tabbar-item > image {
	width: 98rpx;
	height: 89rpx;
}
.tabbar-container .tabbar-list .tabbar-item .unreadCount {
	padding: 0 8rpx;
	height: 28rpx;
	line-height: 28rpx;
	text-align: center;
	font-size: 22rpx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #FFFFFF;
	background: #D841FF;
	border-radius: 14rpx;
	position: absolute;
	top: -10rpx;
	left: 60rpx;
}
</style>
