<template>
  <uni-popup
    ref="popup"
    :mask-click="false"
    :is-mask-click="false"
    background-color="#fff"
    mask-background-color="rgba(0,0,0,0)"
    type="center"
  >
    <view class="popup-content">
      <image class="dialog-bg" src="/static/login/dialog-bg.png" mode="">
        <view v-if="title" class="title">{{ title }}</view>
        <text class="content" :class="{content2:!!title}">
          <!-- {{ $t("my.saveModified") }} -->
          {{content}}
        </text>
        <view class="btns">
          <view class="btn btn-cancel" @click="cancel">
            <!-- {{ $t("my.cancel") }} -->
            {{cancelText}}
          </view>
          <view class="btn btn-confirm" @click="confirm">
            <!-- {{ $t("my.confirm") }} -->
            {{confirmText}}
          </view>
        </view>
      </image>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "w-popup-confirm",
  props: {
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    cancelText: {
      type: String,
      default: "",
    },
    confirmText: {
      type: String,
      default(){
        return this.$t('my.confirm')
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    open(){
      this.$refs.popup.open();
    },
    close() {
			this.$refs.popup.close()
		},
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm')
    },
  },
};
</script>

<style scoped lang="scss">
.popup-content {
  position: relative;
  .dialog-bg {
    width: 560rpx;
    height: 384rpx;
    position: relative;
  }
  .title{
    width: 506rpx;
    position: absolute;
    left: 50%;
    top: 42rpx;
    transform: translate(-50%,0%);
    text-align: center;
    font-size: 45rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
  .content {
    width: 506rpx;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-100%);
    font-size: 33rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 45rpx;
    &.content2{
      top: 120rpx;
      transform: translate(-50%,0);
    }
  }
  .btns {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 560rpx;
    display: flex;
    .btn {
      flex: 1;
      text-align: center;
      line-height: 124rpx;
      font-size: 33rpx;
      &.btn-cancel {
        color: #d841ff;
      }
      &.btn-confirm {
        color: #fff;
      }
    }
  }
}
</style>