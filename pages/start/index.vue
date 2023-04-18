<template>
  <view class="container">
    <image class="bg" src="/static/login/start-bg.png" mode />
    <view class="content">
      <image class="logo" src="/static/login/start-logo.png" mode />
      <image class="title" src="/static/login/start-title.png" mode />
    </view>
  </view>
</template>
<script>
import { getToken } from "@/config/auth";
export default {
  onLoad() {
    let isLogin = getToken();
    if (isLogin) {
      // home
      uni.switchTab({
        url: "/pages/home/index",
      });
    } else {
      uni.reLaunch({
        url: "/pages/login/index",
      });
    }

    // 
    //  key 
    // const value = uni.getStorageSync("launchFlag");
    // if (value) {
    //   if (isLogin) {
    //     // home
    //     uni.switchTab({
    //       url: "/pages/home/index"
    //     });
    //   }else{
    //     uni.reLaunch({
    //       url: "/pages/login/index"
    //     })
    //   }
    // } else {
    //   // 
    //   uni.setStorage({
    //     key: "launchFlag",
    //     data: true
    //   });
    //   uni.redirectTo({
    //     url: "/pages/start/guide"
    //   });
    // }
  },
  method: {},
};
</script>
<style lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: rgb(228, 172, 254);
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 750rpx;
    height: 1623rpx;
  }
  .content {
    height: 75vh;
    position: relative;
    z-index: 9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .logo {
      width: 205rpx;
      height: 205rpx;
    }
    .title {
      margin-top: 67rpx;
      width: 556rpx;
      height: 123rpx;
    }
  }
}
</style>