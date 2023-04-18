<template>
	<view class="container">
		<uni-nav-bar class="header-nav" :fixed="true" status-bar="true" :title="' '" background-color="#ffffff"
			@clickLeft="back" @clickRight="openReportPopup">
			<block slot="left">
				<view class="left">
					<image class="back-icon" src="/static/icon-back.png"></image>
				</view>
			</block>
			<view slot="right" class="header-nav-right" v-if="info.userCode !== me.userCode">
				<image src="/static/home/report-bg.png"></image>
				<text>{{ $t('home.friendDetails.report') }}</text>
			</view>
		</uni-nav-bar>
		<view class="body">
			<view class="picture">
				<swiper v-if="fileList.length" class="swiper" :indicator-dots="false" :autoplay="false">
					<swiper-item class="swiper-item-box"
						v-for="(item, index) in fileList" :key="index">
						<image class="pic" mode='aspectFit' :src="item.url"></image>
					</swiper-item>
				</swiper>
				<image v-else class="empty" mode='aspectFit' :src="info.portrait"></image>

			</view>
			<view class="content-1">
				<view class="top">
					<view class="friend-name-gender">
						<view class="friend-name">{{ info.userName || $t('common.empty.userName') }}</view>
						<view class="gender" v-if="info.gender == 0">/ {{ $t("my.non-disclosure") }}</view>
						<view class="gender" v-if="info.gender == 1">/ {{ $t("my.Boy") }}</view>
						<view class="gender" v-if="info.gender == 2">/ {{ $t("my.Girl") }}</view>
						<view class="gender" v-if="info.gender == 3">/ {{ $t("my.non-binary") }}</view>
					</view>
					<view class="top-right">
						<image class="cert-icon" v-if="info.show" src='/static/common/cert-icon.png'></image>
						<!-- <view class="friend-online" v-if="info.online">{{$t('common.online')}}</view> -->
					</view>
				</view>
				<view class="bottom">
					<view class="friend-tag" v-for="(item, index) in info.profession" :key="index">
						<text>{{ item }}</text>
					</view>
				</view>
			</view>
			<view class="content-2">
				<view class="top">{{ $t('home.friendDetails.bio') }}</view>
				<view class="bottom">{{ info.professionBio || $t('common.empty.professionBio') }}</view>
			</view>
			<view class="btns" v-if="info.userCode !== me.userCode">
				<view class="btn" @tap="goChat()">
					<image class="btn-bg" src="/static/home/small-btn-bg.png"></image>
					<view class="btn-content">
						<image src='/static/message.png'></image>
						<text>{{ $t("home.friendDetails.hi") }}</text>
					</view>
				</view>
				<view class="btn" @tap="goVideo()">
					<image class="btn-bg" src="/static/home/small-btn-bg.png"></image>
					<view class="btn-content">
						<image src='/static/home/video-icon.png'></image>
						<text>{{ $t("common.video") }}</text>
					</view>
				</view>
			</view>
		</view>
		<!--  -->
		<w-popup-dialog ref="videoPopup" :popupContentStyle="{ padding: '0', background: 'transparent' }">
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
						<view class="price-text">{{ $utilWithVue.formatAptos(Number(feeInfo.videoFee || 0), 5) }} /
							{{ $t('common.min') }}</view>
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
					<view class="confirm-title">{{ $t('home.friendDetails.videoPopup.title') }}</view>
				</view>
			</view>
		</w-popup-dialog>
		<!--  -->
		<w-popup-dialog ref="reportPopup" :popupContentStyle="{ padding: '0', background: 'transparent' }">
			<view class="dialog-wrapper">
				<image class="dialog-wrapper-bg" src="/static/home/report-dialog-bg.png"></image>
				<view class="dialog-content">
					<view class="title">{{ $t('home.friendDetails.reportTitle') }}</view>
					<view class="list">
						<view class="item" @tap="report('porn')">{{ $t('home.friendDetails.porn') }}</view>
						<view class="item" @tap="report('politicallySensitive')">
							{{ $t('home.friendDetails.politicallySensitive') }}</view>
						<view class="item" @tap="report('violentAndBloody')">{{ $t('home.friendDetails.violentAndBloody') }}
						</view>
						<view class="item" @tap="report('children')">{{ $t('home.friendDetails.children') }}</view>
						<view class="item" @tap="report('other')">{{ $t('home.friendDetails.other') }}</view>
					</view>
				</view>
			</view>
		</w-popup-dialog>
		<!-- - -->
		<w-popup-confirm ref="popup" :title="$t('chat.InsufficientBalance')"
			:content="$t('chat.InsufficientBalanceContent')" :cancelText="$t('chat.InsufficientBalanceCancelText')"
			:confirmText="$t('chat.InsufficientBalanceConfirmText')" @cancel="insufficientBalanceCancel"
			@confirm="insufficientBalanceConfirm" />
	</view>
</template>

<script>
import { 
	getUserInfo, 
	getFiles,
	getUserGrade } from "@/api/user";
import { viewContractService, getGasFee } from "@/api/viewContractService.js";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
export default {
	data() {
		return {
			userCode: '',
			info: {},
			feeInfo: {},
			walletAssetsInfo: {},
			fileList: [],
			me: {},
			gasFeeInfo: {}
		};
	},
	onLoad(option) {
		let me = this;
		const userInfo = getApp().globalData.userInfo || {};
		me.me = userInfo;
		this.userCode = option.userCode;
		me.walletAssetsInfo = getApp().globalData.walletAssetsInfo || {};
		uni.$on('updateWalletBalanceInfo', function ({ data, walletAssetsInfo }) {
			me.walletAssetsInfo = walletAssetsInfo;
		})
		me.fetchGasFee()
	},
	onShow() {
		this.getInfo();
	},
	methods: {
		async fetchGasFee() {
			const res = await getGasFee();
			this.gasFeeInfo = res.data || {};
		},
		getInfo() {
			getUserInfo({
				userCode: this.userCode
			}).then((res) => {
				let it = res.data || {};
				if (it.online) {
					it.online = new Date().getTime() - it.online < 1000 * 60;
				} else {
					it.online = false;
				}
				if (!it.profession) {
					it.profession = [];
				} else if (it.profession.indexOf('[') !== -1) {
					it.profession = JSON.parse(it.profession) || [];
				} else {
					it.profession = [it.profession];
				}
				this.info = it;
				this.getChatFee();
			});
			this.getAlbums()
		},
		getAlbums(){
			getFiles({
				userCode: this.userCode
			}).then(res=>{
				this.fileList = res.data||[]
				console.log("🚀 ~ file: friend-details.vue:174 ~ getAlbums ~ res.data:", res.data)
			})
		},
		async getChatFee() {
			let me = this;
			const res = await getUserGrade({ userCode: this.info.userCode });
			// const res = await viewContractService({ module: 'routel', func: 'fee_of_mine', args: [this.info.address], });
			// const [chatFee, grade, videoFee] = res.data || {};
			me.feeInfo = {
				videoFee: (res.data || {}).eprice
			};
		},
		back() {
			uni.navigateBack({
				delta: 1,
			});
		},
		openReportPopup() {
			this.$refs.reportPopup.open();
		},
		goChat() {
			uni.navigateTo({
				url: `/pages/message/chat?userCode=${this.info.userCode || ''}`,
			});
		},
		confirmGoVideo() {
			const { account_apt } = getApp().globalData.walletAssetsInfo;
			if (Number(account_apt) < Number(this.feeInfo.videoFee)) {
				this.$refs.videoPopup.close();
				this.$refs.popup.open();
				return;
			}
			const { userCode: from } = getApp().globalData.userInfo || {};
			this.$refs.videoPopup.close();
			uni.navigateTo({
				url: `/pages/agora-video/index?type=1&from=${from || ''}&to=${this.info.userCode || ''}`,
			});
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
		goVideo() {
			this.$refs.videoPopup.open();
		},
		report(type) {
			this.$refs.reportPopup.close();
			uni.showToast({
				icon: "none",
				title: this.$t('home.friendDetails.reportSuccess'),
				duration: 1000,
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	.header-nav-right {
		position: relative;
		width: 129rpx;
		height: 49rpx;
		color: #E47AFF;
		font-size: 24rpx;
		font-family: PingFangSC-Semibold;
		font-weight: 600;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;

		image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}

	.body {
		padding: 40rpx 45rpx 160rpx;
		box-sizing: border-box;

		.picture {
			height: 828rpx;
			margin-bottom: 25rpx;
			.swiper{
				height: 828rpx;
				width: 100%;
				border-radius: 30rpx;
				.pic{
					width: 100%;
					height: 100%;
					background: #eee;
					border-radius: 30rpx;
				}	
			}
			image.empty {
				width: 100%;
				height: 100%;
				background: #eee;
				border-radius: 30rpx;
			}
		}

		.content-1 {
			margin-bottom: 51rpx;

			.top {
				height: 72rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-direction: row;
				margin-bottom: 20rpx;

				.friend-name-gender {
					margin-right: 24rpx;
					display: flex;
					flex-direction: row;
					align-items: center;

					.friend-name {
						font-size: 51rpx;
						font-weight: 600;
						font-family: PingFangSC-Semibold, PingFang SC;
					}

					.gender {
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #000000;
						line-height: 31rpx;
						margin: 0 0 -24rpx 16rpx;
						opacity: 0.6;
					}
				}

				.top-right {
					margin-bottom: -6rpx;
					display: flex;
					align-items: center;

					.cert-icon {
						width: 40rpx;
						height: 40rpx;
					}

					.friend-online {
						margin-left: 12rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #3BD726;
					}
				}
			}

			.bottom {
				display: flex;
				align-items: center;
				flex-direction: row;

				.friend-tag {
					height: 44rpx;
					line-height: 44rpx;
					font-size: 22rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					padding: 0 34rpx;
					background: #A1B3FF;
					border-radius: 22rpx;
					margin-right: 5rpx;
				}
			}
		}

		.content-2 {
			.top {
				font-size: 36rpx;
				line-height: 45rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #000000;
				margin-bottom: 5rpx;
			}

			.bottom {
				font-size: 25rpx;
				font-family: PingFangSC-Light, PingFang SC;
				font-weight: 300;
				color: #424242;
				line-height: 36rpx;
			}
		}

		.btns {
			position: fixed;
			width: 663rpx;
			height: 101rpx;
			line-height: 101rpx;
			text-align: center;
			left: 54rpx;
			bottom: 40rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			.btn {
				flex: 0 0 317rpx;
				height: 101rpx;
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

					image {
						width: 58rpx;
						height: 53rpx;
					}

					text {
						font-size: 36rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #FFFFFF;
						line-height: 51rpx;
					}
				}
			}
		}
	}
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

.dialog-wrapper {
	position: relative;
	width: 634rpx;
	height: 855rpx;

	.dialog-wrapper-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 634rpx;
		height: 855rpx;
	}

	.dialog-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 634rpx;
		height: 855rpx;
		padding: 76rpx 100rpx;
		box-sizing: border-box;

		.title {
			font-size: 38rpx;
			margin-bottom: 70rpx;
			font-weight: 600;
			color: #000000;
			text-align: center;
			font-family: PingFangSC-Semibold, PingFang SC;
		}

		.list {
			font-size: 30rpx;
			border-top: 2rpx solid #F1EEFF;
			font-weight: 400;
			color: #030303;
			text-align: center;

			.item {
				font-size: 28rpx;
				padding: 36rpx 0;
				border-bottom: 2rpx solid #F1EEFF;
			}
		}
	}
}</style>
