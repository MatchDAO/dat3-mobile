<template>
	<view class="friend-card-container" @tap="navigateTo(`/pages/home/friend-details?userCode=${info.userCode}`)">
		<image mode='aspectFill' class="friend-image" :src="info.portrait"></image>
		<image class="friend-card-container-bg" src="/static/home/photo-frame.png"></image>
		<image v-if="info.show" class="cert-icon" src='/static/common/cert-icon.png'></image>
		<view @tap.stop>
			<image class="video-mark-image" src='/static/home/video-mark.png'></image>
			<view class="video-mark-btn" @tap.stop="goVideo" ></view>
		</view>
		<view class="friend-card-header">
			<view class="friend-tag" v-for="(item,index) in info.profession" :key="index" v-show="index === 0">
				<text>{{item}}</text>
			</view>
		</view>
		<view class="friend-card-footer">
			<view class="friend-card-footer-top">
				<view class="friend-name">{{info.userName || $t('common.empty.userName')}}</view>
				<!-- <view class="friend-online" v-if="info.online">{{$t('common.online')}}</view> -->
			</view>
			<view class="friend-card-footer-bottom">
				<view class="friend-des">{{info.professionBio || $t('common.empty.professionBio')}}</view>
			</view>
		</view>
		<!--  -->
    <w-popup-dialog 
      ref="videoPopup"
			:popupContentStyle="{ padding: '0', background: 'transparent' }"
    >
			<view class="video-dialog-wrapper">
				<image class="dialog-wrapper-bg" src="/static/home/report-dialog-bg.png"></image>
				<view class="dialog-content">
					<view class="portrait">
						<image mode='aspectFill' :src="info.portrait"></image>
						<!-- <view v-if="info.online" class="online-dot"></view> -->
					</view>
					<view class="requires-des">
						{{$t('home.friendDetails.videoPopup.des', { name: info.userName })}}
					</view>
					<view class="requires-price">
						<image class="price-icon" src='/static/aptos-icon.png'></image>
						<view class="price-text">{{$utilWithVue.formatAptos(Number(feeInfo.videoFee || 0), 5)}} / {{$t('common.min')}}</view>
					</view>
					<view class="gasfee-price">
            <text class="label"> {{ $t("contract.gasFee") }}</text>
            <text class="value">
              {{ $utilWithVue.formatAptos(gasFeeInfo.gas_estimate, { fixed: 6 }) }}APT
            </text>
          </view>
					<view class="video-dialog-content-btn" @tap="confirmGoVideo()">
						<image class="video-dialog-content-btn-bg" src="/static/my/btn-large.png"></image>
						<view class="video-dialog-content-btn-content">
							<text>{{ $t("common.yes") }}</text>
						</view>
					</view>
					<view class="confirm-title">{{$t('home.friendDetails.videoPopup.title')}}</view>
				</view>
			</view>
		</w-popup-dialog>
		 <!-- - -->
		 <w-popup-confirm
      ref="popup"
      :title="$t('chat.InsufficientBalance')"
      :content="$t('chat.InsufficientBalanceContent')"
      :cancelText="$t('chat.InsufficientBalanceCancelText')"
      :confirmText="$t('chat.InsufficientBalanceConfirmText')"
      @cancel="insufficientBalanceCancel"
      @confirm="insufficientBalanceConfirm"
    />
	</view>
</template>

<script>
	import { viewContractService, getGasFee } from "@/api/viewContractService.js";
	import { getUserGrade, getGradeList, setUserGrade } from "@/api/user";
	export default {
		name:"friend-card",
		props: {
			info: {
				type: Object,
				default: () => ({})
			},
			walletAssetsInfo: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				feeInfo: {},
				gasFeeInfo: {}
			};
		}, 
		methods: {
      navigateTo(url) {
        uni.navigateTo({
          url,
        });
      },
			async confirmGoVideo() {
				const { account_apt } = getApp().globalData.walletAssetsInfo;
				if (Number(account_apt) < Number(this.feeInfo.videoFee)) {
					this.$refs.videoPopup.close();
					this.$refs.popup.open();
					return;
				}
				this.$refs.videoPopup.close();
				const { userCode: from } = getApp().globalData.userInfo || {};
				uni.navigateTo({
          url: `/pages/agora-video/index?type=1&from=${from || ''}&to=${this.info.userCode || ''}`,
        });
			},
			async goVideo() {
				let me = this;
				const res = await getUserGrade({ userCode: this.info.userCode });
				const gasRes = await getGasFee();
				// const res = await viewContractService({ module: 'routel', func: 'fee_of_mine', args: [this.info.address], });
				// const [chatFee, grade, videoFee] = res.data || {};
        me.feeInfo = {
					videoFee: (res.data || {}).eprice
        };
				me.gasFeeInfo = gasRes.data || {};
				me.$refs.videoPopup.open();
			},
			insufficientBalanceCancel() {
        this.$refs.popup.close();
      },
      insufficientBalanceConfirm() {
				this.$refs.popup.close();
        uni.navigateTo({
					url: `/pages/aptos-wallet/index`,
				});
      },
    }
	}
</script>

<style scoped lang="scss">
.friend-card-container {
	width: 326rpx;
	height: 443rpx;
	margin: 0 11rpx 36rpx;
	padding: 12rpx;
	box-sizing: border-box;
	border-radius: 28rpx;
	position: relative;
	.friend-card-container-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
	.cert-icon {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		top: 36rpx;
		right: 36rpx;
	}
	.video-mark-image {
		position: absolute;
		width: 56rpx;
		height: 28rpx;
		bottom: 56rpx;
		right: 36rpx;
		padding: 14rpx 0rpx;
		background: #F1EEFF;
		border-radius: 50%;
	}
	.video-mark-btn {
		position: absolute;
		width: 56rpx;
		height: 56rpx;
		bottom: 40rpx;
		right: 20rpx;
		padding: 16rpx;
		z-index: 1;
	}
	
}
.friend-card-container .friend-card-header {
	position: absolute;
	top: 28rpx;
	left: 32rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.friend-card-container .friend-card-header .friend-tag {
	height: 32rpx;
	line-height: 32rpx;
	font-size: 18rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #FFFFFF;
	padding: 0 12rpx;
	background: #A1B3FF;
	border-radius: 16rpx;
	margin-right: 5rpx;
}
.friend-card-container .friend-card-footer {
	position: absolute;
	bottom: 34rpx;
	left: 32rpx;
}
.friend-card-container .friend-card-footer .friend-card-footer-top {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 40rpx;
}
.friend-card-container .friend-card-footer .friend-name {
	font-size: 29rpx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #FFFFFF;
	margin-right: 16rpx;
}
.friend-card-container .friend-card-footer .friend-online {
	font-size: 18rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #3BD726;
	margin-bottom: -6rpx;
}
.friend-card-container .friend-card-footer .friend-des {
	font-size: 22rpx;
	font-family: PingFangSC-Light, PingFang SC;
	font-weight: 300;
	color: #FFFFFF;
	line-height: 31rpx;
	height: 31rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 240rpx;
	opacity: 0.8;
}
.friend-card-container .friend-image {
	width: 303rpx;
	height: 421rpx;
	background: #000;
	border-radius: 30rpx;
}
.video-dialog-wrapper {
	position: relative;
	width: 634rpx;
	height: 880rpx;
	.dialog-wrapper-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 634rpx;
    height: 880rpx;
	}
	.dialog-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 634rpx;
		height: 880rpx;
		padding: 100rpx 62rpx 0rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		.portrait {
			width: 277rpx;
			height: 277rpx;
			flex: 0  0 277rpx;
			border-radius: 50%;
			position: relative;
			image {
				width: 277rpx;
				height: 277rpx;
				border-radius: 50%;
				background: #F1EEFF;
			}
			.online-dot {
				position: absolute;
				width: 41rpx;
				height: 41rpx;
				border-radius: 50%;
				background: #3DD42D;
				box-sizing: border-box;
				border: 4rpx solid #fff;
				right: 29rpx;
				bottom: 11rpx;
			}
		}
		.requires-des {
			font-size: 33rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			line-height: 45rpx;
			margin: 26rpx 0 26rpx;
		}
		.requires-price {
			display: flex;
			align-items: center;
			.price-icon {
				width: 57rpx;
				height: 53rpx;
				flex: 0 0 57rpx;
				margin-right: 13rpx;
			}
			.price-text {
				font-size: 36rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #000000;
				line-height: 51rpx;
			}
		}
    .gasfee-price {
      margin: 18rpx 0 32rpx;
      color: #808080;
      font-size: 30rpx;
      .label {
        margin-right: 24rpx;
      }
    }
	  .confirm-title {
			margin: 34rpx 0 16rpx;
			font-size: 25rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			line-height: 36rpx;
		}
		.video-dialog-content-btn {
			width: 545rpx;
			height: 101rpx;
			flex: 0 0 101rpx;
			position: relative;
			.video-dialog-content-btn-bg {
				width: 545rpx;
				height: 101rpx;
			}
			.video-dialog-content-btn-content {
				position: absolute;
				width: 545rpx;
				height: 101rpx;
				top: 0;
				left: 0;
				text-align: center;
				line-height: 101rpx;
				font-size: 36rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
			}
		}
  
	}
}
</style>