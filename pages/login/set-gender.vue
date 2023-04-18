<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      :title="$t('my.profile') + '2/3'"
      background-color="#F9F8FF"
      @clickLeft="back"
    >
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
    </uni-nav-bar>
    <view class="info">
      <view class="info-item name">
        <info-item-label :txt="$t('my.gender')" />
        <gender-list :value="gender" @change="changeGender" />
      </view>
    </view>
    <view class="btn-next btn" :class="{ gray: !setGender }" @click="save">
      <!-- <image src="/static/my/btn-middle.png" mode="" /> -->
      <image
        :src="`/static/my/btn-${setGender ? 'middle' : 'disabled'}.png`"
        mode=""
      />
      <text>{{ $t("login.next") }}</text>
    </view>
  </view>
</template>
<script>
import { setUserInfo, setToken, setEmToken } from "@/config/auth";
import { registerEnd } from "@/api/login";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
let app = getApp();

export default {
  data() {
    return {
      userName: null,
      gender: null,
      userInfo: app.globalData.userInfo,
     
    };
  },
  computed: {
    setGender(){
      return this.gender || this.gender=== 0
    }
  },
  onLoad(options) {
    this.userName = options.userName;
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    changeGender(value){
      console.log(value)
      this.gender = value
    },
    save() {
      if (!this.setGender) return;

      uni.navigateTo({
        url: `/pages/login/set-avatar?userName=${this.userName}&gender=${this.gender}`,
      });

    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 56rpx;
  .info {
    padding-top: 154rpx;
    .info-item {
      // .gender-radio-group {
      //   margin-top:32rpx;
      //   display: flex;
      //   .gender-radio {
      //     flex: 1;
      //     display: flex;
      //     flex-direction: column;
      //     align-items: center;
      //     color: #0e0e0e;
      //     transition: all 0.3s;
      //     &:nth-child(1) {
      //     }
      //     &.active {
      //       .radio-content {
      //         color: #fff;
      //         background: $baseColor;
      //       }
      //     }
      //     .radio-content {
      //       width: 145rpx;
      //       height: 145rpx;
      //       border-radius: 50%;
      //       background: #f1eeff;
      //       font-family: LLPixel;
      //       font-size: 45rpx;
      //       font-weight: bold;
      //       display: flex;
      //       align-items: center;
      //       justify-content: center;
      //       text-align: center;
      //       &.small{
      //         font-size: 28rpx;
      //         line-height: 28rpx;
      //       }
      //     }
      //     .radio-text {
      //       margin-top: 11rpx;
      //       font-size: 22rpx;
      //       text-align: center;
      //     }
      //   }
      // }
    }
  }
  .btn {
    margin-top: 76rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
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
}
</style>