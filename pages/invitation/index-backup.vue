<template>
	<view class="container">
		<uni-nav-bar
      class="header-nav"
      :fixed="false"
      status-bar="true"
      :title="' '"
			:border="false"
      background-color="transparent"
      @clickLeft="back"
    >
			<block slot="left">
				<view class="left">
					<image class="back-icon" src="/static/icon-back.png"></image>
				</view>
			</block>
		</uni-nav-bar>
		<view class="header">
			<image src="/static/invitation/invitation-header-bg.png"></image>
		</view>
		<view class="body">
			<view class="rule">
				<image src="/static/invitation/rule-bg.png"></image>
				<view class="rule-content">
					<view class="top">
						<view class="box">
							<image src="/static/invitation/rule-box-bg.png"></image>
							<view class="box-content">
								<view class="name">
									<view>{{$t('invitation.friends')}}</view>
									<view>{{$t('invitation.consumeTitle')}}</view>
								</view>
								<view class="des">{{$t('invitation.consumeDes')}}</view>
							</view>
						</view>
						<view class="box">
							<image src="/static/invitation/rule-box-bg.png"></image>
							<view class="box-content">
								<view class="name">
									<view>{{$t('invitation.friends')}}</view>
									<view>{{$t('invitation.earnTitle')}}</view>
								</view>
								<view class="des">{{$t('invitation.earnDes')}}</view>
							</view>
						</view>
					</view>
					<view class="middle">{{$t('invitation.tip')}}</view>
					<view class="bottom">
						<view class="title">{{$t('invitation.bonusExampleTitle')}}</view>
						<view class="content">
							<view>{{$t('invitation.bonusExampleContent1')}}</view>
							<view>{{$t('invitation.bonusExampleContent2')}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<image src="/static/invitation/content-bg.png"></image>
				<view class="content-content">
					<view class="switch">
						<image src="/static/invitation/switch-bg.png"></image>
						<view class="switch-list">
							<view class="switch-item" :class="{active: activeKey === 'code'}" @tap="changeActiveKey('code')">
								<image src="/static/invitation/switch-active-bg.png"></image>
								<view>{{$t('invitation.code')}}</view>
							</view>
							<view class="switch-item" :class="{active: activeKey === 'rewards'}" @tap="changeActiveKey('rewards')">
								<image src="/static/invitation/switch-active-bg.png"></image>
								<view>{{$t('invitation.rewards')}}</view>
							</view>
						</view>
					</view>
					<view class="switch-content" v-if="activeKey === 'code'">
						<view class="tip">{{$t('invitation.codeTip')}}</view>
						<view class="code-list">
							<block v-for="(item, index) in codeList" :key="index">
								<view class="code-item" :class="{used: item.state == 1}">
									<view class="code-item-index">{{index + 1}}</view>
									<view class="code-item-value">{{item.ic}}</view>
									<view class="code-item-btn" @tap="item.state == 0 && copy(item.ic)">{{item.state == 0 ? $t('invitation.copy') : $t('invitation.used')}}</view>
								</view>
							</block>
						</view>
					</view>
					<view class="switch-content" v-if="activeKey === 'rewards'">
						<view class="tip">{{$t('invitation.rewardsTip')}}</view>
						<view class="rewards-list">
							<block v-for="(item, index) in rewardsList" :key="index">
								<view class="rewards-item">
									<view class="rewards-item-portrait">
										<image :src="item.portrait" mode='aspectFill'></image>
									</view>
									<view class="rewards-item-content">
										<view class="name">{{item.userName}}</view>
										<view class="info">
											<view class="text">{{$t('invitation.cumulativeSpend')}} {{item.amount}}</view>
											<image src="/static/aptos-icon.png"></image>
										</view>
									</view>
									<view class="rewards-item-extra">
										<view class="text">+{{item.rewards}}</view>
										<image src="/static/aptos-icon.png"></image>
									</view>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer-btn" @tap="copyLink()">
			<image src="/static/my/btn-large.png"></image>
			<text>{{ $t("invitation.footerBtnText") }}</text>
		</view>
	</view>
</template>

<script>
	import { fetchCodeList, invitationRewards as fetchRewardsList } from "@/api/invitation";
	export default {
		data() {
			return {
				activeKey: 'code',
				codeList: [],
				rewardsList: []
			}
		},
		onShow() {
			this.getCodeList();
			this.getRewardsList();
    },
		methods: {
			getCodeList() {
				fetchCodeList().then(res => {
					this.codeList = res.data || [];
				})
			},
			getRewardsList() {
				fetchRewardsList().then(res => {
					this.rewardsList = res.data || [];
				})
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			changeActiveKey(key) {
				this.activeKey = key;
			},
			copyLink() {
				this.copy('https://play.google.com/store/apps/details?id=com.dat3.social')
			},
			copy(val) {
				//#ifdef APP-PLUS
				if (plus && plus.android) {
					var Context = plus.android.importClass("android.content.Context");  
					var main = plus.android.runtimeMainActivity();  
					var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);  
					plus.android.invoke(clip,"setText", val); 
					uni.showToast({
						icon: "none",
						title: 'copy success',
						duration: 1000,
					});
				}
				//#endif
			},
		}
	}
</script>

<style lang="scss" scoped>
.container {
	.header-nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		z-index: 10;
	}
	// background: linear-gradient(180deg, #D841FF 0%, rgba(240,46,255,0.57) 32%, #D841FF 100%);
	.header {
		width: 750rpx;
		height: 634rpx;
		// position: fixed;
		// top: 0;
		// left: 0;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.body {
		min-height: calc(100vh - 643rpx);
		background: linear-gradient(180deg, #F582FF 0%, rgba(240,46,255,0.57), rgba(216, 65, 255, 1));
		display: flex;
		flex-direction: column;
		align-items: center;
		.rule {
			width: 641rpx;
			height: 629rpx;
			margin-bottom: 78rpx;
			position: relative;
			&>image {
				width: 100%;
				height: 100%;
			}
			.rule-content {
				display: flex;
				flex-direction: column;
				align-items: center;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				padding: 56rpx 0 54rpx;
				box-sizing: border-box;
				.top {
					width: 571rpx;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.box {
						width: 272rpx;
						height: 236rpx;
						position: relative;
						&>image {
							width: 100%;
							height: 100%;
						}
						&>.box-content {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							display: flex;
							flex-direction: column;
							align-items: center;
							&>.name {
								width: 250rpx;
								height: 87rpx;
								margin: 24rpx 0;
								&>view {
									font-size: 33rpx;
									font-family: SourceHanSansCN-Bold, SourceHanSansCN;
									font-weight: bold;
									color: #FFFFFF;
									line-height: 43rpx;
									text-align: center;
								}
							}
							&>.des {
								width: 250rpx;
								height: 72rpx;
								font-size: 25rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #FFFFFF;
								line-height: 36rpx;
								text-align: center;
							}
						}
					}
				}
				.middle {
					margin: 45rpx 0 54rpx;
					width: 580rpx;
					height: 50rpx;
					line-height: 50rpx;
					background: #fff;
					border-radius: 25rpx;
					text-align: center;
					font-size: 22rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #666666;
				}
				.bottom {
					width: 580rpx;
					text-align: left;
					color: #333333;
					line-height: 38rpx;
					font-size: 27rpx;
					&>.title {
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
					}
					&>.content {
						font-family: PingFangSC-Regular, PingFang SC;
					}
				}
			}
		}

		&>.content {
			width: 641rpx;
			min-height: 763rpx;
			position: relative;
			padding-bottom: 160rpx;
			background: #F1EEFF;
			border-top-left-radius: 100rpx;
			border-top-right-radius: 100rpx;
			&>image {
				position: absolute;
				width: 100%;
				height: 763rpx;
			}
			&>.content-content {
				position: relative;
				// top: 0;
				// left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				
				&>.switch {
					width: 583rpx;
					height: 78rpx;
					position: relative;
					margin: 43rpx 0 54rpx;
					&>image {
						width: 583rpx;
						height: 78rpx;
					}	
					&>.switch-list {
						position: absolute;
						top: 0;
						left: 0;
						width: 583rpx;
						height: 78rpx;
						display: flex;
						align-items: center;
						.switch-item {
							flex: 1;
							min-width: 0;
							height: 78rpx;
							position: relative;
							&>image {
								width: 100%;
								height: 100%;
								display: none;
							}	
							&>view {
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 78rpx;
								line-height: 78rpx;
								font-size: 25rpx;
								font-family: PingFangSC-Semibold, PingFang SC;
								font-weight: 600;
								color: #D841FF;
								text-align: center;
							}
							&.active {
								&>view {
									color: #fff;
								}
								&>image {
									display: block;
								}
							}
						}
					}
				}
				&>.switch-content {
					display: flex;
					flex-direction: column;
					align-items: center;
					&>.tip {
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #333333;
						line-height: 31rpx;
						text-align: center;
						margin-bottom: 36rpx;
					}
					&>.code-list {
						.code-item {
							width: 600rpx;
							height: 76rpx;
							box-sizing: border-box;
							display: flex;
							align-items: center;
							background: #fff;
							padding: 0 22rpx 0 27rpx;
							margin-bottom: 14rpx;
							border-radius: 14rpx;
							.code-item-index {
								min-width: 24rpx;
								text-align: center;
								font-size: 33rpx;
								color: #333333;
								line-height: 40rpx;
								font-style: oblique;
								font-weight: 900;
								font-family: none;
							}
							.code-item-value {
								flex: 1;
								text-align: center;
								font-size: 24rpx;
								font-family: PingFangSC-Medium, PingFang SC;
								font-weight: 500;
								color: #333333;
							}
							.code-item-btn {
								width: 118rpx;
								height: 51rpx;
								background: #FBECFF;
								border-radius: 14rpx;
								text-align: center;
								line-height: 51rpx;
								font-size: 25rpx;
								font-family: PingFangSC-Medium, PingFang SC;
								font-weight: 500;
								color: #D841FF;
							}
							&.used {
								background: #CAD4FF;
								.code-item-value {
									color: #666666;
								}
								.code-item-btn {
									background: #ffff;
									color: #999999;
								}
							}
						}
					}
					&>.rewards-list {
						.rewards-item {
							width: 600rpx;
							height: 87rpx;
							box-sizing: border-box;
							display: flex;
							align-items: center;
							padding: 0 29rpx 0 20rpx;
							margin-bottom: 22rpx;
							.rewards-item-portrait {
								width: 72rpx;
								height: 72rpx;
								margin-right: 22rpx;
								image {
									width: 72rpx;
									height: 72rpx;
									border-radius: 50%;
									background: #fff;
								}
							}
							.rewards-item-content {
								flex: 1;
								min-width: 0;
								.name {
									height: 36rpx;
									font-size: 25rpx;
									font-family: PingFangSC-Semibold, PingFang SC;
									font-weight: 600;
									color: #333333;
									line-height: 36rpx;
									margin-bottom: 2rpx;
								}
								.info {
									display: flex;
									align-items: center;
									.text {
										font-size: 22rpx;
										font-family: PingFangSC-Regular, PingFang SC;
										font-weight: 400;
										color: #999999;
										line-height: 31rpx;
										margin-right: 7rpx;
									}
									image {
										width: 29rpx;
										height: 27rpx;
									}
								}
							}
							.rewards-item-extra {
								display: flex;
								align-items: center;
								.text {
									font-size: 33rpx;
									font-family: PingFangSC-Semibold, PingFang SC;
									font-weight: 600;
									color: #333333;
									line-height: 45rpx;
									margin-right: 7rpx;
								}
								image {
									width: 29rpx;
									height: 27rpx;
								}
							}
						}
					}
				}
			}
		}
	}
	.footer-btn {
		position: fixed;
		width: 560rpx;
		height: 101rpx;
		line-height: 101rpx;
		text-align: center;
		left: 95rpx;
		bottom: 40rpx;
		image {
			width: 100%;
			height: 100%;
		}
		text {
			width: 560rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: 9;
			font-size: 36rpx;
			color: #ffffff;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
		}
	}
}
</style>
