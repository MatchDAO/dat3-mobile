<template>
  <uni-popup
    ref="popup"
    :mask-click="false"
    :is-mask-click="false"
    background-color="#fff"
    mask-background-color="rgba(0,0,0,0)"
    type="center"
  >
    <view class="modal-wrapper">
      <view class="modal-header">
        <image src="/static/components/custom-confirm-modal-header-bg.png"></image>
      </view>
      <view class="modal-body">
        <view class="modal-title">{{ title }}</view>
        <view class="modal-content">
          <slot />
        </view>
      </view>
      <view class="modal-footer">
        <image src="/static/components/custom-confirm-modal-footer-bg.png">
        </image>
        <view class="btns">
          <view class="btn cancelText" @tap="cancel">
            {{ cancelText }}
          </view>
          <view class="btn confirmText" @tap="confirm">
            {{ confirmText }}
          </view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "custom-confirm-modal",
  props: {
    title: {
      type: String,
      default(){
        return this.$t('common.confirm')
      },
    },
    cancelText: {
      type: String,
      default(){
        return this.$t('common.cancel')
      },
    },
    confirmText: {
      type: String,
      default(){
        return this.$t('common.confirm')
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
.modal-wrapper {
  position: relative;
  width: 560rpx;
  height: auto;
  .modal-header {
    width: 562rpx;
    height: 47rpx;
    image {
      width: 100%;
      height: 100%;
    }
   
  }
  .modal-body {
    background: #fff;
    margin: -2rpx 0;
    .modal-title {
      padding: 31rpx 14rpx 27rpx 29rpx;
      font-size: 45rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 65rpx;
      text-align: center;
    }
    .modal-content {
      padding: 0 60rpx 78rpx;
    }
  }
  .modal-footer {
    width: 562rpx;
    height: 107rpx;
    position: relative;
    image {
      width: 100%;
      height: 100%;
    }
    .btns {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      .btn {
        flex: 1;
        text-align: center;
        font-size: 33rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        line-height: 45rpx;
        &.cancelText {
          color: #D841FF;
        }
        &.confirmText {
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>