<template>
	<view class="container">
	  <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :border="false"
      status-bar="true"
      padding="16rpx 22rpx 16rpx 0"
      :title="''"
      background-color="#fff"
    >
			<view class="page-header">
				<view class="search-bar">
					<image src="/static/home/search-search-bg.png"></image>
					<view class="search-bar-content">
						<image src="/static/search-icon.png"></image>
						<input
							class="form-input"
							:placeholder="$t('home.searchTip')"
							placeholder-class="u-placeholder-class"
							@input="onKeyInput"
						/>
					</view>
				</view>
				<view class="cancel-btn" @tap="back">{{$t('common.cancel')}}</view>
			</view>
    </uni-nav-bar>
		<view class="search-list">
			<view class="search-item" v-for="(item, index) in list" :key="index" @tap="navigateTo(`/pages/home/friend-details?userCode=${item.userCode}`)">
				<view class="search-item-portrait">
					<image :src="item.portrait" mode='aspectFill'></image>
				</view>
				<view class="search-item-content">
					<view class="name">
						<text>{{item.userName}}</text>
						<image v-if="item.show" src='/static/common/cert-icon.png'></image>
					</view>
					<view class="adress">{{$utilWithVue.formatAddress(item.address)}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
 	import { getPopularUserList } from "@/api/user";
	export default {
		data() {
			return {
				searchValue: '',
				list: []
			};
		},
		methods: {
			onKeyInput(event) {
				this.searchValue = event.target.value || '';
				if (this.searchValue.length > 0) {
					this.getList(); 
				}
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			navigateTo(url) {
        uni.navigateTo({
          url,
        });
      },
			getList() {
				let me = this;
				getPopularUserList({ keyword: me.searchValue, size: 50 }).then(res => {
					me.list = (res.data || {}).records || []
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		.page-header {
			display: flex;
			align-items: center;
			margin: 0rpx auto 0;
			.search-bar {
				width: 545rpx;
				height: 80rpx;
				position: relative;
				margin-right: 27rpx;
				// background: #F6F6F6;
				border-radius: 20rpx;
				&>image {
					width: 100%;
					height: 100%;
				}
				.search-bar-content {
					width: 545rpx;
					height: 80rpx;
					position: absolute;
					left: 0;
					top: 0;
					display: flex;
					align-items: center;
					&>image {
						flex: 0 0 36rpx;
						width: 36rpx;
						height: 36rpx;
					 	margin: 0 24rpx 0 36rpx;
					}
					&>input {
						flex: 1;
						font-size: 25rpx;
						.u-placeholder-class {
							color: #D9D9D9;
							font-size: 25rpx;
						}
					}
				}
			}
			.cancel-btn {
				width: 90rpx;
				font-size: 29rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #D841FF;
			}
		}
		.search-list {
			margin-top: 120rpx;
			padding: 0 62rpx;
			.search-item {
				display: flex;
				align-items: center;
				margin-bottom: 36rpx;
				.search-item-portrait {
					width: 96rpx;
					height: 96rpx;
					margin-right: 22rpx;
					image {
						width: 96rpx;
						height: 96rpx;
						border-radius: 50%;
						background: #F1EEFF;
					}
				}
				.search-item-content {
					flex: 1;
					.name {
						display: flex;
						align-items: center;
						margin-bottom: 9rpx;
						text {
							font-size: 29rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #000000;
							height: 40rpx;
							line-height: 40rpx;
						}
						image {
							margin-left: 12rpx;
							width: 20rpx;
							height: 20rpx;
						}
					}
					.adress {
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #000000;
						height: 31rpx;
						line-height: 31rpx;
					}
				}
			}
		}
	}
</style>
