<template>
  <uni-popup
    ref="popup"
    :mask-click="false"
    :is-mask-click="false"
    background-color="#fff"
    mask-background-color="rgba(0,0,0,0)"
    type="center"
  >
    <view class="invitation-popup-content">
      <image class="bg" src="/static/invitation/invitation-code-bg.png" mode />
      <view class="content">
        <!-- <view @tap="cancel" class="popup-close">
          <image src="/static/login/icon-close.png" mode />
        </view> -->
        <view class="popup-title">{{ $t('invitation.InvitationVerification') }}</view>
        <view class="invitation-code">
          <input v-model="code" class="input" focus :placeholder="$t('invitation.IVPlaceholder')" />
        </view>
        <view class="body-btn" @click="verify">
          <image :src="`/static/invitation/btn-middle.png`" mode />
          <text>{{ $t("invitation.Verify") }}</text>
        </view>
        <view class="popup-tip">
          <view>{{ $t('invitation.IVTip1') }}</view>
          <view>{{ $t('invitation.IVTip2') }}</view>
          <view>{{ $t('invitation.IVTip3') }}</view>
        </view>
        <view class="contact-icon">
          <image @click="goLink(1)" src="/static/invitation/icon-twitter.png" mode />
          <image @click="goLink(2)" src="/static/invitation/icon-official-dat3.png" mode />
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { verifyCode } from "@/api/login";
import { getAppVerify } from '@/api/user';
export default {
  props: {},
  data() {
    return {
      code: null,
      twitterUrl: '',
      discordUrl: ''
    };
  },
  created() {
    this.initData()
  },
  methods: {
    initData(){
      getAppVerify().then(res => {
          const { twitter: twitterUrl, discord: discordUrl ,email:gmail} = res.data || {};
          this.twitterUrl = twitterUrl 
          this.discordUrl = discordUrl 
      })
    },
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    cancel() {
      this.close();
      this.$emit("cancel");
    },
    verify() {
      if (!this.code) {
        return uni.showToast({
          title: this.$t("invitation.IVPlaceholder"),
          icon: "none"
        });
      }
      verifyCode({
        code: this.code
      }).then(res => {
        this.$emit("confirm", this.code);
        this.code = null;
      });
    },
    goLink(type) {
      let url = null;
      // twitter
      if (type === 1) {
        url = this.twitterUrl;
      }
      // discord
      if (type === 2) {
        url = this.discordUrl;
      }
      // #ifdef APP-PLUS
      plus.runtime.openURL(url);
      // #endif
      // #ifdef H5
      window.open(url);
      // #endif
    }
  }
};
</script>

<style scoped lang="scss">
.invitation-popup-content {
  .bg {
    width: 634rpx;
    height: 855rpx;
  }
  .content {
    background: transparent;
    box-sizing: border-box;
    padding: 49rpx;
    width: 634rpx;
    height: 855rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .popup-close {
      display: flex;
      justify-content: flex-end;
      padding: 9rpx;
      image {
        width: 27rpx;
        height: 25rpx;
      }
    }
    .popup-title {
      box-sizing: border-box;
      padding: 47rpx 0 42rpx;
      font-size: 45rpx;
      font-weight: 600;
      color: #333333;
      line-height: 65rpx;
      text-align: center;
    }
    .invitation-code {
      background: #f1eeff;
      border-radius: 7rpx;
      padding-left: 34rpx;
      margin-bottom: 42rpx;
      .input {
        // width: 518rpx;
        height: 91rpx;
        line-height: 91rpx;
        font-size: 25rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
      }
    }
    .body-btn {
      margin-bottom: 42rpx;
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
        width: 509rpx;
        height: 101rpx;
      }
      text {
        position: relative;
        z-index: 9;
        font-size: 36rpx;
        color: #ffffff;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
    }
    .popup-tip {
      margin-bottom: 58rpx;
      text-align: center;
      font-size: 25rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 43rpx;
    }
    .contact-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        margin: 0 21rpx;
        width: 94rpx;
        height: 92rpx;
      }
    }
  }
}
</style>