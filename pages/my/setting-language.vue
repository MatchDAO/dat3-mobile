<template>
  <view class="pages">
    <uni-nav-bar class="header-nav" :fixed="true" status-bar="true" background-color="#ffffff" @clickLeft="back">
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
    </uni-nav-bar>
    <view class="list">
        <view v-for="(item, index) in langList" :key="index" class="item" @click="radioChange(item)">
          <text class="info-item-center">
            {{ item.name }}
          </text>
          <image v-if="item.code === current" class="item-image" src="/static/my/icon-right.png" mode="widthFix" lazy-load="false" binderror=""
            bindload="">
          </image>
        </view>
    </view>
  </view>
</template>

<script>
import { LANG_MAP } from "@/locale";
export default {
  data() {
    return {
      langList: [
        {
          code: 'zh_CN',
          name: '简体中文',
        },
        {
          code: "en_US",
          name: "English",
        },
      ],
      current: null,
    };
  },
  onLoad() {
    console.log("language", uni.getLocale());
    this.current = LANG_MAP[uni.getLocale()] || "en_US";
  },
  methods: {
    radioChange(item) {
      console.log(item.code);
      uni.setLocale(LANG_MAP[item.code]);
      this.$i18n.locale = LANG_MAP[item.code];
      this.current =  item.code
    },
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.pages {
  min-height: 100vh;
}

.header-nav {
  .left {}

  .right {}
}

.list {
  padding-top: 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .item {
    margin-bottom: 40rpx;
    display: flex;
    align-items: center;
    background: url('/static/my/icon-border.png') no-repeat;
    background-size: 684rpx 106rpx;
    width: 684rpx;
    height: 106rpx;

    .item-image {
      margin-right: 48rpx;
      width: 68rpx;
    }

    text {
      flex:1;
      margin-left: 48rpx;
      font-family: 'IPix';
      font-style: normal;
      font-weight: 400;
      font-size: 24rpx;
      line-height: 44rpx;
    }
  }
}
</style>
