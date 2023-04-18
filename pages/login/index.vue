<template>
  <view class="container">
    <uni-nav-bar
      :fixed="true"
      status-bar="true"
      :title="$t('login.SignInOrUp')"
      background-color="transparent"
    ></uni-nav-bar>
    <view class="bg"></view>
    <view class="content">
      <image class="top-logo" src="/static/login/login-logo.png" />
      <image class="login-title" src="/static/login/login-title.png" />
      <view class="login-form">
        <view class="btn-login btn" @click="showPopup">
          <image :src="`/static/my/btn-middle.png`" />
          <text>{{ $t("login.ConnectWallet") }}</text>
        </view>
        <view class="form-agree">
          <view class="agree-wrap">
            <radio
              class="agree-radio"
              :checked="agree"
              value="1"
              style="transform: scale(0.7)"
              color="#d841ff"
              @click="agree = !agree"
            />
            <text class="txt">{{ $t("login.agreeTip") }}</text>
            <text class="pink underline" @click="goLink(1)">
              {{
              $t("my.termsOfUse")
              }}
            </text>
            <text class="txt">&</text>
            <text class="pink underline" @click="goLink(2)">
              {{
              $t("my.privacyPolicy")
              }}
            </text>
          </view>
        </view>
      </view>
    </view>
    <!--  -->
    <w-popup-confirm
      ref="popup"
      :content="`${$t('login.agreeTip')}${$t('my.termsOfUse')} & ${$t(
        'my.privacyPolicy'
      )}`"
      :cancelText="$t('my.cancel')"
      :confirmText="$t('my.confirm')"
      @cancel="cancel"
      @confirm="confirm"
    />
    <uni-popup
      ref="walletPopup"
      :mask-click="false"
      :is-mask-click="false"
      background-color="#fff"
      mask-background-color="rgba(0,0,0,0)"
      type="center"
    >
      <view class="wallet-popup-content">
        <image class="sign-bg" src="/static/login/sign-bg.png" />
        <view class="sign-content">
          <view class="wallet-popup-close" @tap="closePopup">
            <image src="/static/login/icon-close.png" />
          </view>
          <view class="sign-title">{{ $t('login.SignInOrUp') }}</view>
          <block>
            <view class="sign-tip1">{{ $t('login.ConnectWalletTip1') }}</view>
            <view class="sign-item">
              <image class="sign-item-icon" src="/static/login/icon-import.png" />
              <text class="sign-item-tit">{{ $t('login.ImportWallet') }}</text>
              <view class="sign-item-btn" @click="goImport">
                <image :src="`/static/login/btn-mini.png`" />
                <text>{{ $t("login.Aptos") }}</text>
              </view>
            </view>
          </block>
          <view class="sign-tip1 sign-tip2">{{ $t('login.ConnectWalletTip2') }}</view>
          <view class="sign-item sign-item-new">
            <image class="sign-item-icon" src="/static/login/icon-new.png" />
            <text class="sign-item-tit">{{ $t('login.NewWallet') }}</text>
            <view class="sign-item-btn" @click="goNew">
              <image :src="`/static/login/btn-mini.png`" />
              <text>{{ $t("login.Create") }}</text>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import config from '@/config/config.js';
import { getAppVerify } from '@/api/user';
const { twitterUrl, discordUrl } = config;

export default {
  data() {
    return {
      agree: false,
      appVerify: false
    };
  },
  computed: {},
  onLoad() {
    getAppVerify().then(res => {
      const { appVerify, v } = res.data || {};
      this.appVerify = this.$defineWithVue.VERSION_NAME === v && appVerify == '1';
    })
    // uni.switchTab({
    // 			url: '/pages/contract/index'
    // 		});
  },
  onUnload() {},
  methods: {
    goLink(type) {
      let url = null;
      let title = null;
      // 
      if (type === 1) {
        title = this.$t("my.termsOfUse");
        url = termsOfUseUrl;
      }
      // 
      if (type === 2) {
        title = this.$t("my.privacyPolicy");
        url = privacyPoliceUrl;
      }
      uni.navigateTo({
        url: `/pages/web-view/index?url=${url}&title=${title}`
      });
    },
    showPopup() {
      if (!this.agree) {
        return this.$refs.popup.open();
      }
      this.$refs.walletPopup.open();
    },
    closePopup() {
      this.$refs.walletPopup.close();
    },
    goNew() {
      uni.navigateTo({
        url: `/pages/login/create-wallet?autoFill=${this.appVerify ? 'Y' : 'N'}`
      });
    },
    goImport() {
      uni.navigateTo({
        url: `/pages/login/import-wallet?autoFill=${this.appVerify ? 'Y' : 'N'}`
      });
    },
    cancel() {
      this.$refs.popup.close();
    },
    confirm() {
      this.agree = true;
      this.$refs.popup.close();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .uni-navbar{
  .uni-navbar__placeholder{
    height: 0;
  }
  .uni-navbar__content{
    border:none;
  }
}
.pink {
  color: $baseColor;
}
.underline {
  text-decoration: underline;
}
.container {
  height: 100vh;
  width: 100vw;
  position: relative;
}
.bg {
  position: absolute;
  right: -100rpx;
  top: -20rpx;
  z-index: 1;
  width: 533rpx;
  height: 550rpx;
  background: #d841ff;
  opacity: 0.8;
  filter: blur(150rpx);
  // background: linear-gradient(45deg,#F1EEFF,#D841FF);
}
.content {
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #f1eeff;
  position: relative;
  padding: 200rpx 54rpx 0;

  .top-logo {
    display: block;
    position: relative;
    z-index: 2;
    width: 243rpx;
    height: 243rpx;
    margin: 0 auto;
  }
  .login-title {
    display: block;
    position: relative;
    z-index: 2;
    width: 556rpx;
    height: 123rpx;
    margin: 63rpx auto 0;
  }
  .top-tit {
    margin-top: 26rpx;
    height: 56rpx;
    font-size: 47rpx;
    font-family: LLPixel;
    color: #333333;
    line-height: 56rpx;
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .login-form {
    position: relative;
    z-index: 2;
    margin-top: 100rpx;
    .form-item-label {
      margin-bottom: 22rpx;
      height: 45rpx;
      font-size: 33rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 45rpx;
    }
    .form-item {
      padding: 0 12rpx 0 27rpx;
      width: 626rpx;
      height: 91rpx;
      background: #fff;
      border-radius: 7rpx;
      margin-bottom: 54rpx;
      display: flex;
      align-items: center;
      .form-input {
        line-height: 91rpx;
        flex: 1;
        font-size: 29rpx;
      }
      .btn-code {
        width: 164rpx;
        height: 69rpx;
        background: #f9f5ff;
        border-radius: 7px;
        text-align: center;
        font-size: 25rpx;
        font-family: SourceHanSansCN-Heavy, SourceHanSansCN;
        font-weight: bold;
        color: #d841ff;
        line-height: 69rpx;
      }
    }
    .form-agree {
      margin-top: 47rpx;
      .agree-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        font-weight: bold;
        .agree-radio {
          margin-left: -10rpx;
        }
        .txt {
          color: #0e0e0e;
          margin: 0 4rpx;
        }
      }
    }

    .btn {
      margin-top: 205rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      height: 101rpx;
      image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        width: 632rpx;
        height: 101rpx;
      }
      text {
        position: relative;
        z-index: 9;
        font-size: 36rpx;
        color: #ffffff;
        font-weight: bold;
        font-family: PingFangSC-Semibold, PingFang SC;
      }
    }
    .btn-tip {
      position: relative;
      margin-top: 43rpx;
      height: 51rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #df75ff;
      line-height: 51rpx;
      text-align: center;
    }
  }
}
.wallet-popup-content {
  .sign-bg {
    width: 634rpx;
    height: 855rpx;
  }
  .sign-content {
    background: transparent;
    box-sizing: border-box;
    padding: 49rpx;
    width: 634rpx;
    height: 855rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .wallet-popup-close {
      display: flex;
      justify-content: flex-end;
      padding: 9rpx;
      image {
        width: 27rpx;
        height: 25rpx;
      }
    }
    .sign-title {
      box-sizing: border-box;
      padding: 47rpx 0 80rpx;
      font-size: 45rpx;
      font-weight: 600;
      color: #333333;
      line-height: 65rpx;
      text-align: center;
    }
    .sign-tip1 {
      font-size: 29rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 40rpx;
    }
    .sign-item {
      margin-top: 16rpx;
      display: flex;
      align-items: center;
      padding: 0 14rpx 0 18rpx;
      width: 518rpx;
      height: 116rpx;
      background: #f1eeff;
      border-radius: 7rpx;
      &.sign-item-new {
        .sign-item-icon {
          width: 48rpx;
          height: 50rpx;
        }
      }
      .sign-item-icon {
        width: 42rpx;
        height: 38rpx;
        margin: 0 14rpx 0 7rpx;
      }

      .sign-item-tit {
        flex: 1;
        width: 208px;
        font-size: 33rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
      }
      .sign-item-btn {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 49rpx;
        width: 141rpx;

        image {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          width: 141rpx;
          height: 49rpx;
        }
        text {
          position: relative;
          z-index: 9;
          font-size: 22rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 31rpx;
        }
      }
    }
  }
}
</style>
