<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      :title="$t('my.VideocallPrice')"
      background-color="#ffffff"
      @clickLeft="back"
    >
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
    </uni-nav-bar>

    <view class="info">
      <view class="info-item">
        <view class="item-left">
          {{ $t("my.myPrice") }}
        </view>
        <view class="item-txt">
          <image class="item-txt-icon" src="/static/my/icon-eth.png" />
          <text> {{ grade.price }}/min</text>
        </view>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
      <view class="list">
        <view
          class="item"
          :class="{
            active: item.id === grade.rangeId,
          }"
          v-for="item in gradeList"
          :key="item.id"
          @click="changeGrade(item)"
        >
          <view class="item-txt">
            <image class="item-txt-icon" src="/static/my/icon-eth.png" />
            <text> {{ item.price }}/min</text>
          </view>
          <image class="right-icon" src="/static/my/icon-selected.png" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { logout } from "@/api/login";
import { getUserGrade, getGradeList, setUserGrade } from "@/api/user";
let app = getApp();

export default {
  data() {
    return {
      grade: {
        price: null,
        id: null,
      },
      gradeList: [],
    };
  },
  computed: {},
  onLoad() {
    this.userInfo = app.globalData.userInfo || {};
    this.initData();
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    initData() {
      this.getGrade();
      this.getGradeList();
    },
    getGrade() {
      getUserGrade({ userCode: this.userInfo.userCode }).then((res) => {
        console.log("getGrade:res", res);
        this.grade = res.data || {};
      });
    },
    getGradeList() {
      getGradeList({}).then((res) => {
        console.log("getGrade:res", res);
        this.gradeList = res.data || {};
      });
    },
    changeGrade(item) {
      setUserGrade({
        id: item.id,
      }).then((res) => {
        uni.showToast({
          title: this.$t("my.saveTip"),
          icon: "none",
          success: () => {
            this.getGrade();
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .info {
    padding: 90rpx 53rpx 40rpx;
    .info-item {
      display: flex;
      height: 110rpx;
      align-items: center;
      justify-content: space-between;
      .item-left {
        flex: 1;
        font-size: 36rpx;
        font-family: SourceHanSansCN-Bold, SourceHanSansCN;
        font-weight: bold;
        color: #0e0e0e;
        line-height: 54rpx;
      }
      .item-txt {
        font-size: 25rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #030303;
        height: 110rpx;
        display: flex;
        align-items: center;
        text-align: right;
        .item-txt-icon {
          margin-right: 12rpx;
          width: 35rpx;
          height: 33rpx;
        }
        text {
          margin-right: 16rpx;
        }
      }
      image.right-icon {
        width: 22rpx;
        height: 34rpx;
      }
    }
    .list {
      padding: 0 12rpx;
      .item {
        display: flex;
        align-items: center;
        width: 627rpx;
        height: 82rpx;
        background: #e7e7e7;
        border-radius: 7rpx;
        padding: 0 29rpx 0 18rpx;
        margin-bottom: 24rpx;
        box-sizing: border-box;
        &.active {
          background: #f1eeff;
          image.right-icon {
            display: block;
          }
        }
        .item-txt {
          font-size: 25rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #030303;
          height: 110rpx;
          display: flex;
          align-items: center;
          text-align: right;
          flex: 1;
          .item-txt-icon {
            margin-right: 12rpx;
            width: 35rpx;
            height: 33rpx;
          }
          text {
            margin-right: 16rpx;
          }
        }
        image.right-icon {
          display: none;
          width: 45rpx;
          height: 45rpx;
        }
      }
    }
  }
}
</style>
