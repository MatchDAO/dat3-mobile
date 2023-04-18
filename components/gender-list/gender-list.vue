<template>
  <view class="gender-radio-group">
    <view
      class="gender-radio"
      :class="{
        active: item.value === gender,
      }"
      v-for="item in genderList"
      :key="item.value"
      @click="changeGender(item)"
    >
      <view v-if="item.value !== gender" class="radio-image-box">
        <image
          v-if="item.value === 1"
          class="radio-image"
          src="/static/my/boy.png"
        >
        </image>
        <image
          v-if="item.value === 2"
          class="radio-image"
          src="/static/my/girl.png"
        >
        </image>
        <image
          v-if="item.value === 3"
          class="radio-image"
          src="/static/my/non-binary.png"
        >
        </image>
        <image
          v-if="item.value === 0"
          class="radio-image"
          src="/static/my/non-disclosure.png"
        >
        </image>
      </view>
      <view v-else class="radio-image-box">
        <image
          v-if="item.value === 1"
          class="radio-image"
          src="/static/my/boy-active.png"
        >
        </image>
        <image
          v-if="item.value === 2"
          class="radio-image"
          src="/static/my/girl-active.png"
        >
        </image>
        <image
          v-if="item.value === 3"
          class="radio-image"
          src="/static/my/non-binary-active.png"
        >
        </image>
        <image
          v-if="item.value === 0"
          class="radio-image"
          src="/static/my/non-disclosure-active.png"
        >
        </image>
      </view>

      <view class="radio-text">{{ item.name }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "gender-radio-group",
  props: {
    value: {
      type: Number,
      default: "",
    },
  },
  data() {
    return {
      gender: null,
      genderList: [
        {
          name: this.$t("my.Boy"),
          value: 1,
        },
        {
          name: this.$t("my.Girl"),
          value: 2,
        },
        {
          name: this.$t("my.non-binary"),
          value: 3,
        },
        {
          name: this.$t("my.non-disclosure"),
          value: 0,
        },
      ],
    };
  },
  watch: {},
  created() {
    this.gender = this.value;
  },
  methods: {
    changeGender(item) {
      this.gender = item.value;
      this.$emit("change", item.value);
    },
  },
};
</script>

<style scoped lang="scss">
.gender-radio-group {
  margin-top: 32rpx;
  display: flex;
  .gender-radio {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #0e0e0e;
    transition: all 0.3s;
    &:nth-child(1) {
    }
    &.active {
      // .radio-content {
      //   color: #fff;
      //   background: $baseColor;
      // }
    }
    // .radio-content {
    //   width: 145rpx;
    //   height: 145rpx;
    //   border-radius: 50%;
    //   background: #f1eeff;
    //   font-family: LLPixel;
    //   font-size: 45rpx;
    //   font-weight: bold;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   text-align: center;
    //   &.small{
    //     font-size: 28rpx;
    //     line-height: 28rpx;
    //   }
    // }
    .radio-image-box {
      display: flex;
      // align-items: center;
      justify-content: center;
      flex: 1;
      .radio-image {
        width: 147rpx;
        height: 147rpx;
      }
    }
    .radio-text {
      margin-top: 11rpx;
      font-size: 22rpx;
      text-align: center;
    }
  }
}
</style>