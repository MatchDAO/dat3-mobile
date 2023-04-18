<!--
 * @Descripttion: 
 * @version: 
 * @Author: senlin
 * @Date: 2023-03-21 14:04:19
 * @LastEditors: senlin
 * @LastEditTime: 2023-04-08 21:06:14
-->
<template>
  <view class="label-container">
    <view class="title" @click="click">
      <image
        class="icon-arrow"
        src="/static/icon-arrow-bold-right.png"
        mode=""
        v-if="showArrow"
      />
      <text>{{ txt }}</text>
      <view v-show="showLeft" class="right">
        <text>{{ rightTxt }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "label-container",
  props: {
    txt: {
      type: String,
      default: "",
    },
    rightTxt: {
      type: String,
      default: "",
    },
    showLeft: {
      type: Boolean,
      default: false,
    },
    showArrow: {
      type: Boolean,
      default:true
    }
  },
  data() {
    return {};
  },
  methods: {
    click(){
      this.$emit('click')
    }
  },
};
</script>

<style scoped lang="scss">
.container {
  .title {
    display: flex;
    align-items: center;
    height: 90rpx;
    .icon-arrow {
      width: 18rpx;
      height: 29rpx;
      margin-right: 16rpx;
    }
    text {
      height: 40rpx;
      font-size: 40rpx;
      font-weight: bold;
      color: #0e0e0e;
      line-height: 1;
      flex: 1;
    }
    .right {
      display: flex;
      align-items: center;
      text{
        margin-right: 32rpx;
        font-size: 29rpx;
        font-family: IPix,PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0E0E0E;
        line-height: 40rpx;
      }
      .right-icon{
        width: 22rpx;
        height: 34rpx;
      }
    }
  }
}
</style>