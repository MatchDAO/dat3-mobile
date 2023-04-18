<template>
  <view class="container">
    <uni-nav-bar class="header-nav" :fixed="true" :border="false" status-bar="true" padding="16rpx 22rpx 16rpx 0"
      :title="''" background-color="transparent">
      <!-- <block slot="left">
        <view v-if="isLogin" class="left" @click="openSharePopup">
          <image class="share-icon" src="/static/my/icon-share.png"></image>
        </view>
      </block> -->
      <view slot="right" class="header-nav-right">
        <suspensionbar></suspensionbar>
      </view>
    </uni-nav-bar>
    <view class="top">
      <view class="avatar-box">
        <view class="avatar-wrap" @click="goHomePage">
          <image class="avatar" :src="userInfo.portrait || ''" mode="aspectFit" />
        </view>
        <view v-if="!isLogin" class="user-name" @tap="goLogin">
          <text>{{ $t('my.toLogin') }}</text>
        </view>
        <view v-else>
          <view class="user-name">
            <text>{{ userInfo.userName }}</text>
            <image v-if="userInfo.show" src='/static/common/cert-icon.png'></image>
          </view>
          <view class="user-address">{{ $t('my.address') }}: {{ $utilWithVue.formatAddress(this.userInfo.address) }}</view>
        </view>
        <!-- <view class="invite-info" @click="goRewardRecord">
          <image class="bg-invite" src="/static/my/bg-invite.png" />
          <view class="info-top">
            <view class="record">
              <text>{{$t('my.rewardRecord')}}</text>
              <image class="arrow-right" src="/static/my/arrow-right.png" />
            </view>
            <image @click.stop="open" class="icon-info" src="/static/my/icon-info.png" />
          </view>
          <view class="invite-num">
            <view class="item-num item-num-eth">
              <image class="icon-left" src="/static/aptos-icon.png" />
              <view class="num-info">
                <view class="num-name">{{$t('my.chatEarnETH')}}</view>
                <view class="num">+{{formatEther(rewards.rewardETH, 5)}}</view>
              </view>
            </view>
            <view class="item-num">
              <image class="icon-left" src="/static/my/icon-dat3.png" />
              <view class="num-info">
                <view class="num-name">{{$t('my.rewardsDAT3')}}</view>
                <view class="num">+{{formatEther(rewards.rewardDAT3)}}</view>
              </view>
            </view>
          </view>
          <view class="record-time">
            <image class="icon-time" src="/static/my/icon-time.png" />
            <text>{{$t('my.nextDistribution')}}{{ afterTime }}</text>
          </view>
        </view> -->
      </view>
    </view>
    <view class="info-list">
      <view class="info-item item-user" @tap="goProfile">
        <image class="left-icon" src="/static/my/icon-user.png" />
        <text class="item-title">{{ $t("my.profile") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
      <view class="info-item item-invite" @tap="goInvite">
        <image class="left-icon" src="/static/my/icon-invite.png" />
        <text class="item-title">{{ $t("my.InvitationNFT") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
      <view class="info-item item-video-price" @tap="goVideocallPrice">
        <image class="left-icon" src="/static/my/icon-video.png" />
        <text class="item-title">{{ $t("my.videoPrice") }}</text>
        <view class="item-txt">
          <image class="item-txt-icon" src="/static/aptos-icon.png" />
          <text> {{ $utilWithVue.formatAptos(grade.eprice, 4) }}/min</text>
        </view>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
      <view class="info-item item-setting" @tap="goSetting">
        <image class="left-icon" src="/static/my/icon-setting.png" />
        <text class="item-title">{{ $t("my.setting") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
      <view class="info-item item-language" @tap="goSettingLanguage">
        <image class="left-icon" src="/static/my/icon-language.png" />
        <text class="item-title">{{ $t("my.Language") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
      <view class="info-item item-linktree" @tap="goLinktree">
        <image class="left-icon" src="/static/my/icon-linktree.png" />
        <text class="item-title">{{ $t("my.Linktree") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>


    </view>
    <!-- app https://www.html5plus.org/doc/zh_cn/messaging.html -->
    <!-- <view class="contact-us">
      <text>
        {{ $t("my.contactus") }}:
        <a :href="`mailto:${gmail}`">{{ gmail }}</a>
      </text>
    </view> -->
    <tabbar activeKey="my"></tabbar>

    <!--  -->
    <uni-popup ref="popup" :mask-click="false" :is-mask-click="false" background-color="#fff"
      mask-background-color="rgba(0,0,0,0)" type="center">
      <view class="popup-content">
        <image class="dialog-bg" src="/static/my/dialog-bg.png" mode=""></image>
        <view class="dialog-content">
          <image @click="close" class="dialog-close" src="/static/my/icon-close.png" mode=""></image>
          <image class="logo" src="/static/my/info-logo.png" mode=""></image>
          <view class="title">
            {{ $t("my.infoTip") }}
          </view>
          <view class="info-btn" @click="confirm">
            <image src="/static/my/btn-middle.png" />
            <text>{{ $t("my.infoBtn") }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
    <!-- share popup -->
    <uni-popup ref="sharePopup" :mask-click="false" :is-mask-click="false" background-color="#fff"
      mask-background-color="rgba(0,0,0,0)" type="center">
      <view class="share-popup">
        <image class="dialog-bg" src="/static/my/dialog-bg2.png" mode=""></image>
        <view class="dialog-content">
          <image @click="closeSharePopup" class="dialog-close" src="/static/my/icon-close-pink2.png" mode=""></image>
          <view class="title">
            {{ $t("my.HomepageLink") }}
          </view>
          <view class="tip">
            {{ $t("my.HomepageLinkTip") }}
          </view>
          <image class="logo" src="/static/my/icon-homepagelink.png" mode=""></image>
          <view class="link" hover-class="none">
            <text class="" selectable="false" space="false" decode="false">
              {{ homepageLink }}
            </text>
          </view>
          <view class="info-btn" @click="copyLink">
            <image src="/static/my/btn-small2.png" />
            <text>{{ $t("my.CopyLink") }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { getUserInitStatus } from "@/config/auth";
import { getToken, setUserInfo } from "@/config/auth";
import { getUserInfo } from "@/api/user";
import { viewContractService } from "@/api/viewContractService.js";
import config from "@/config/config";
import { formatEther } from '@/utils/wallet';
import { getUserGrade } from "@/api/user";
const { tokenomicsUrl, gmail } = config;
let app = getApp();

export default {
  data() {
    return {
      gmail,
      userInfo: {
        portrait: null,
        userName: null
      },
      rewards: {
        rewardDAT3: null,
        rewardETH: null,
      },
      grade: {},
      wallet: null,
      isLogin: false,
      afterTime: null,
      userIsInit: false
    };
  },
  computed: {
    homepageLink() {
      const { address } = this.userInfo;
      return `https://dat3.app/${address}`
    }
  },
  onLoad() {
    uni.hideTabBar({
      success() {
        console.log("tabbar:success");
      },
      fail() {
        console.log("tabbar:fail");
      }
    });
  },
  onShow() {
    this.userIsInit = !!getUserInitStatus();
    this.isLogin = getToken();
    this.userInfo = app.globalData.userInfo || {};
    this.wallet = app.globalData.wallet;
    this.initData();
    getApp().globalData.getWalletBalanceInfo();
  },
  onHide() {
    this.clearTimer();
  },
  onUnload() {
    this.clearTimer();
  },
  methods: {
    clearTimer() {
      this.timer && clearInterval(this.timer)
      this.timer = null
    },
    getAfterTime() {
      let afterTime = null
      // 24
      const local24 = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000;
      const diff = new Date().getTimezoneOffset() * 60 * 1000;
      const now = new Date().getTime();
      const mistime = local24 - diff - now;
      if (mistime < 0) {
        afterTime = '00:00:00';
      }
      //
      let leave1 = mistime % (24 * 3600 * 1000); //
      let hours = Math.floor(leave1 / (3600 * 1000));
      hours = hours >= 10 ? hours : `0${hours}`;
      //
      let leave2 = leave1 % (3600 * 1000);        //
      let minutes = Math.floor(leave2 / (60 * 1000));
      minutes = minutes >= 10 ? minutes : `0${minutes}`;
      //
      let leave3 = leave2 % (60 * 1000);     //
      let seconds = Math.round(leave3 / 1000);
      seconds = seconds >= 10 ? seconds : `0${seconds}`;

      afterTime = hours + ':' + minutes + ':' + seconds;
      this.afterTime = afterTime
    },
    formatEther(val, toFixedNum = 3) {
      return formatEther((Number(val || 0).toFixed(0)), toFixedNum);
    },
    // 
    initData() {
      if (this.isLogin) {
        // todo 
        getUserInfo({ userCode: this.userInfo.userCode }).then(res => {
          let userInfo = res.data || {};
          setUserInfo({ ...this.userInfo, ...userInfo });

          this.userInfo = userInfo;
          console.log("🚀 ~ file: index.vue:259 ~ getUserInfo ~ userInfo:", userInfo)
        });
        // this.getRewardDetail()

        this.clearTimer()
        this.timer = setInterval(() => {
          this.getAfterTime()
        }, 1000);

        this.getGrade()
      }
     
    },
    getRewardDetail() {
      if (!this.userIsInit) return;
      getUserRewards({ userCode: this.userInfo.userCode }).then(res => {
        console.log('res', res)
        this.rewards = res.data || {}
      });
    },
    // async getGrade(){
    //   if (!this.userIsInit) return ;
    //   let res = await viewContractService({
    //     module: "routel",
    //     func: "fee_of_mine",
    //     args: [this.wallet.address],
    //   });

    //   console.log("getGrade", res);
    //   let [systemPrice,id,price] = res.data || []
    //   this.grade = {
    //     systemPrice,id,price
    //   }
    // },
    getGrade() {
      getUserGrade({ userCode: this.userInfo.userCode }).then((res) => {
        console.log("getGrade:res", res);
        this.grade = res.data || {};
      });
    },
    goProfile() {
      if (!this.isLogin) return this.goLogin();
      uni.navigateTo({
        url: "/pages/my/profile"
      });
    },
    goSetting() {
      if (!this.isLogin) return this.goLogin();
      uni.navigateTo({
        url: "/pages/my/setting"
      });
    },
    goVideocallPrice() {
      if (!this.isLogin) return this.goLogin();
      // if (!this.userIsInit) return ;
      uni.navigateTo({
        url: "/pages/my/videocall-price"
      });
    },
    goInvite() {
      if (!this.isLogin) return this.goLogin();
      // if (!this.userIsInit) return ;
      uni.navigateTo({
        url: "/pages/invitation/index"
      });
    },
    goSettingLanguage() {
      if (!this.isLogin) return this.goLogin();
      // if (!this.userIsInit) return ;
      uni.navigateTo({
        url: "/pages/my/setting-language"
      });
    },
    goLinktree() {
      if (!this.isLogin) return this.goLogin();
      // if (!this.userIsInit) return ;
      uni.navigateTo({
        url: "/pages/my/link-tree"
      });
    },
    goLogin() {
      uni.reLaunch({
        url: "/pages/login/index"
      });
    },
    goRewardRecord() {
      if (!this.isLogin) return this.goLogin();
      uni.navigateTo({
        url: "/pages/invitation/reward-record"
      });
    },
    goHomePage(){
      uni.navigateTo({
        url: `/pages/home/friend-details?userCode=${this.userInfo.userCode}`
      });
    },
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    cancel() {
      uni.showToast({
        icon: "none",
        title: this.$t("my.cancel"),
        duration: 1000,
      });
      this.$refs.popup.close();
    },
    confirm(response) {
      console.log('')
      // uni.navigateTo({
      //   url: "/pages/invitation/index"
      // });
      //#ifdef APP-PLUS
      plus.runtime.openURL(tokenomicsUrl);  //web
      //#endif
    },
    openSharePopup() {
      this.$refs.sharePopup.open();
    },
    closeSharePopup() {
      this.$refs.sharePopup.close();
    },
    copyLink() {
      this.copy(
        this.homepageLink
      );
    },
    copy(val) {
      //#ifdef APP-PLUS
      if (plus && plus.android) {
        var Context = plus.android.importClass("android.content.Context");
        var main = plus.android.runtimeMainActivity();
        var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
        plus.android.invoke(clip, "setText", val);
        uni.showToast({
          icon: "none",
          title: this.$t("common.success"),
          duration: 1000,
        });
      }
      //#endif
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;

  .header-nav {
    height: 0;

    .left {
      display: flex;
      align-items: center;

      .share-icon {
        width: 78rpx;
        height: 52rpx;
      }
    }

    .header-nav-right {
      position: relative;
      width: 100%;
    }
  }

  .top {
    height: auto;
    padding-top: 170rpx;
    background: linear-gradient(65deg, #e4e9ff 0%, #faf7ff 46%, #ecc0ff 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    .avatar-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 90rpx;

      .avatar-wrap {
        width: 224rpx;
        height: 224rpx;
        border-radius: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .avatar {
          width: 206rpx;
          height: 206rpx;
          border-radius: 100%;
          background: gray;
        }
      }

      .user-name {
        margin-top: 14rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        text {
          font-weight: bold;
        }

        image {
          margin-left: 12rpx;
          width: 20rpx;
          height: 20rpx;
        }
      }

      .user-address {
        margin-top: 18rpx;
        width: 627rpx;
        font-size: 29rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        line-height: 40rpx;
        word-break: break-all;
        white-space: pre-wrap;
        text-align: center;
      }

      .invite-info {
        margin-top: 43rpx;
        position: relative;
        width: 678rpx;
        height: 301rpx;
        padding: 36rpx 36rpx 24rpx;
        box-sizing: border-box;

        .bg-invite {
          position: absolute;
          left: 0;
          top: 0;
          width: 678rpx;
          height: 301rpx;
        }

        .info-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          line-height: 43rpx;
          height: 43rpx;

          .record {
            flex: 1;
          }

          text {
            font-size: 36rpx;
            font-family: SFProDisplay-Bold, SFProDisplay;
            font-weight: bold;
            color: #333333;
          }

          .arrow-right {
            margin-left: 8rpx;
            width: 29rpx;
            height: 29rpx;
          }

          .icon-info {
            width: 36rpx;
            height: 36rpx;
          }
        }

        .invite-num {
          margin-top: 43rpx;
          z-index: 2;
          position: relative;
          display: flex;

          .item-num {
            display: flex;
            flex: 1;

            &.item-num-eth {
              margin-right: 40rpx;
            }

            .icon-left {
              margin-right: 14rpx;
              width: 77rpx;
              height: 71rpx;
              min-width: 77rpx;
            }

            .num-info {
              .num-name {
                height: 31rpx;
                font-size: 22rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #666666;
                line-height: 31rpx;
                margin-bottom: 7rpx;
              }

              .num {
                height: 36prx;
                font-size: 33rpx;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 36rpx;
                word-break: break-all;
                white-space: pre-wrap;
              }
            }
          }
        }

        .record-time {
          margin: 40rpx auto 0;
          position: relative;
          z-index: 2;
          display: flex;
          width: 400rpx;
          height: 43rpx;
          background: #FFFFFF;
          border-radius: 22rpx;
          align-items: center;
          justify-content: center;

          .icon-time {
            margin-right: 6rpx;
            width: 36rpx;
            height: 36rpx;
          }

          text {
            font-size: 22rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #666666;
          }
        }

      }
    }
  }

  .info-list {
    background: #ffffff;
    border-radius: 45rpx 45rpx 0 0;
    margin-top: -45rpx;
    padding: 30rpx 62rpx 40rpx;

    .info-item {
      display: flex;
      height: 110rpx;
      align-items: center;
      justify-content: space-between;

      &.item-user {
        font-size: 29rpx;
        color: #0e0e0e;
        line-height: 110rpx;
      }

      &.item-video-price {
        image.left-icon {
          width: 64rpx;
          height: 38rpx;
        }
      }

      &.item-language {
        image.left-icon {
          width: 60rpx;
          height: 63rpx;
        }
      }

      &.item-linktree {
        image.left-icon {
          width: 63rpx;
          height: 66rpx;
        }
      }

      .item-title {
        flex: 1;
        margin-left: 33rpx;
        font-weight: bold;
        font-size: 29rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #0e0e0e;
      }

      .item-txt {
        font-size: 25rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #030303;
        height: 110rpx;
        display: flex;
        align-items: center;

        .item-txt-icon {
          margin-right: 12rpx;
          width: 35rpx;
          height: 33rpx;
        }

        text {
          margin-right: 16rpx;
        }
      }

      image.left-icon {
        width: 58rpx;
        height: 58rpx;
      }

      image.right-icon {
        width: 22rpx;
        height: 34rpx;
      }
    }
  }

  .contact-us {
    margin-top: 0rpx;
    font-size: 25rpx;
    color: #030303;
    line-height: 36rpx;
    text-align: center;
    text-decoration: underline;
    padding-bottom: 200rpx;
  }
}


// 
.popup-content {
  position: relative;

  .dialog-bg {
    width: 634rpx;
    height: 603rpx;
    position: relative;
  }

  .dialog-content {
    width: 634rpx;
    height: 603rpx;
    z-index: 2;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    .dialog-close {
      position: absolute;
      right: 42rpx;
      top: 42rpx;
      width: 27rpx;
      height: 25rpx;
      z-index: 2;
    }

    .logo {
      margin-top: 53rpx;
      width: 199rpx;
      height: 199rpx;
    }

    .title {
      margin-top: 29rpx;
      width: 560rpx;
      word-break: break-all;
      white-space: pre-wrap;
      text-align: center;
      font-size: 36rpx;
      color: #000000;
      line-height: 51rpx;
    }

    .info-btn {
      margin-top: 40rpx;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 582rpx;
        height: 101rpx;
        position: relative;
      }

      text {
        width: 582rpx;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 9;
        text-align: center;

        font-size: 36rpx;
        color: #ffffff;
        font-weight: bold;
        font-family: PingFangSC-Semibold, PingFang SC;
      }
    }
  }

}

.share-popup {
  position: relative;

  .dialog-bg {
    width: 648rpx;
    height: 867rpx;
    position: relative;
  }

  .dialog-content {
    width: 648rpx;
    height: 867rpx;
    z-index: 2;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    .dialog-close {
      position: absolute;
      right: 42rpx;
      top: 42rpx;
      width: 38rpx;
      height: 38rpx;
      z-index: 2;
    }



    .title {
      margin-top: 95rpx;
      width: 560rpx;
      word-break: break-all;
      white-space: pre-wrap;
      text-align: center;
      font-size: 36rpx;
      color: #000000;
      line-height: 51rpx;
      font-family: LLPixel;
      font-style: Regular
    }

    .tip {
      font-size: 24rpx;
      color: #6B6B6B;
      margin-top: 16rpx;
      font-family: Unifont;
    }

    .logo {
      margin-top: 63rpx;
      width: 230rpx;
      height: 230rpx;
    }

    .link {
      margin-top: 65rpx;
      width: 540rpx;
      height: 93rpx;
      background: url('/static/my/icon-border.png') no-repeat;
      background-size: 540rpx 93rpx;
      display: flex;
      align-items: center;
      word-break: break-all;
      font-size: 12px;

      text {
        margin: 0rpx 20rpx;
      }
    }

    .info-btn {
      margin-top: 40rpx;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 366rpx;
        height: 73rpx;
        position: relative;
      }

      text {
        width: 366rpx;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 9;
        text-align: center;

        font-size: 36rpx;
        color: #ffffff;
        font-weight: bold;
        font-family: PingFangSC-Semibold, PingFang SC;
      }
    }
  }
}</style>