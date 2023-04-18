<template>
  <view class="container-box">
    <view class="container">
      <view class="bg"></view>
      <image class="top-logo" src="/static/login/login-logo.png" />
      <view class="top-tit">{{$t('login.signup')}}</view>
      <view class="login-form">
        <view class="form-item-label">{{$t('login.Email')}}</view>
        <view class="form-item">
          <input
            v-model="account"
            class="form-input"
            :placeholder="$t('login.emailTip')"
            placeholder-class="u-placeholder-class"
          />
        </view>
        <view class="form-item code">
          <input
            v-model="captcha"
            class="form-input"
            :placeholder="$t('login.codeTip')"
            placeholder-class="u-placeholder-class"
          />
          <view class="btn-code" @click="senCode">
            <text v-if="time === 0">{{ $t("login.sendCode") }}</text>
            <text v-else>{{ time }}s</text>
          </view>
        </view>
        <view class="form-item-label">{{$t('login.inviteTitle')}}</view>
        <view class="form-item">
          <input
            v-model="invitation"
            class="form-input"
            :placeholder="$t('login.inviteTip')"
            placeholder-class="u-placeholder-class"
          />
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
            <text class="pink underline" @click="goLink(1)">{{
              $t("my.termsOfUse")
            }}</text>
            <text class="txt">&</text>
            <text class="pink underline" @click="goLink(2)">{{
              $t("my.privacyPolicy")
            }}</text>
          </view>
        </view>
        
        <view class="btn-login btn" @click="save">
          <!-- <image src="/static/my/btn-login.png" /> -->
          <!-- <image src="/static/my/btn-middle.png" mode="" /> -->
          <image
            :src="`/static/my/btn-middle.png`"
            mode=""
          />
          <text>{{ $t("login.signup") }}</text>
        </view>
        <view class="btn-tip" @click="goLogin">{{$t('login.login')}}</view>
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
    </view>
  </view>
</template>

<script>
import config from "@/config/config";
import { setUserInfo, setToken, setEmToken } from "@/config/auth";
import { loginRegister, sendEmailCode } from "@/api/login";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
const { privacyPoliceUrl, termsOfUseUrl } = config;
export default {
  data() {
    return {
      time: 0,
      agree: false,
      captcha: null,
      account: null,
      invitation:null
    };
  },
  computed: {},
  onLoad() {},
  onUnload() {
    this.clearTimer();
  },
  methods: {
    senCode() {
      if (!this.account) {
        return uni.showToast({
          title: this.$t("login.emailTip"),
          icon: "none",
          duration: 2000,
        });
      }
      sendEmailCode({
        account: this.account,
        type: 3, //
      }).then((res) => {
        // 
        uni.showToast({
          // title: this.$t('login.sendSuccess'),
          title: res.msg || this.$t("login.sendSuccess"),
          duration: 2000,
          icon: "none",
        });
        this.setTimer();
      });
    },
    setTimer() {
      this.clearTimer();

      this.time = 60;
      this.timer = setInterval(() => {
        this.time--;
        if (this.time === 0) {
          this.clearTimer();
        }
      }, 1000);
    },
    clearTimer() {
      this.timer && clearInterval(this.timer);
      this.timer = null;
    },
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
        url: `/pages/web-view/index?url=${url}&title=${title}`,
      });
    },
    save() {
      let { account, captcha,invitation } = this;
      let me = this;
      if (!captcha) {
        return uni.showToast({
          title: this.$t("login.sendCodeTip"),
          duration: 2000,
          icon: "none",
        });
      }
      if (!this.agree) {
        return this.$refs.popup.open();
      }
      loginRegister({
        account,
        captcha,
        invitation
      }).then((res) => {
        // ---
        let userInfo = res.data;
        setUserInfo(userInfo);
        //  
        // todo 
        if (userInfo.firstLogin) {
          uni.navigateTo({
            url: "/pages/login/set-name",
          });
        } else {
          // 
          // tokenuserInfo
          setToken(userInfo.token);
          setEmToken(userInfo.emToken);
          getApp().globalData.getWalletBalanceInfo();
          if (WebIM.conn.isOpened()) {
            WebIM.conn.close();
          }
          //  app 
          WebIM.conn.open({
            accessToken: userInfo.emToken,
            user: userInfo.userCode,
          });
          uni.showToast({
            title: this.$t("login.success"),
            icon: "none",
            success: function () {
              uni.switchTab({
                url: "/pages/home/index",
              });
            },
          });
        }
      });
    },
    cancel() {
      uni.showToast({
        icon: "none",
        title: "",
        duration: 1000,
      });
      this.$refs.popup.close();
    },
    confirm() {
      this.agree = true;
      this.$refs.popup.close();
    },
    goLogin(){
      console.log('Login')
      uni.reLaunch({
        url:'/pages/login/index'
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.pink {
  color: $baseColor;
}
.underline {
  text-decoration: underline;
}

.container {
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  background: #f1eeff;
  position: relative;
  padding: 179rpx 54rpx 40rpx;
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
  .top-logo {
    display: block;
    position: relative;
    z-index: 2;
    width: 145rpx;
    height: 147rpx;
    margin: 0 auto;
  }
  .top-tit{
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
    .form-item-label{
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
      &.code{
        margin-bottom: 43rpx;
      }
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
      .agree-wrap {
        display: flex;
        align-items: center;
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
    // .btn-login {
    //   margin-top: 210rpx;
    //   display: flex;
    //   justify-content: center;
    //   image {
    //     width: 632rpx;
    //     height: 101rpx;
    //   }
    // }
    .btn {
      margin-top: 107rpx;
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
    .btn-tip{
      position: relative;
      margin-top: 43rpx;
      height: 51rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #DF75FF;
      line-height: 51rpx;
      text-align: center;
    }
  }
}
</style>
