<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      :title="$t('invitation.InviteUserDetails')"
      background-color="#F9F8FF"
      @clickLeft="back"
    >
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png" />
        </view>
      </block>
    </uni-nav-bar>
    <view v-if="(list && list.length) || loading" class="list">
      <view class="item" v-for="(item, index) in list" :key="index">
        <image :src="item.portrait" mode="aspectFit"/>
        <text>{{ $utilWithVue.formatAddress(item.address) }}</text>
      </view>
    </view>
    <view v-else class="empty">{{ $t("common.empty.data") }}</view>
  </view>
</template>
<script>
import {  viewContractService } from "@/api/viewContractService.js";
import { getUserInfo, getUserRewards } from "@/api/user";
import { getInviteUsers } from "@/api/user";
let app = getApp();

export default {
  data() {
    return {
      userInfo: app.globalData.userInfo,
      loading: false,
      wallet: {},
      list: [], // [{}, {}]
    };
  },
  onLoad(options){
    this.fid = options.fid
  },
  onShow() {
    this.wallet = app.globalData.wallet;
    this.initData();
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    initData() {
      this.getDetail()
    },
    async getDetail() {
      let res = await getInviteUsers(this.fid);
      const {
        inviteReward: amount,
        spendReward: spend,
        earnReward: earn,
        inviteePage,
      } = res.data || {};
      const { data: users } = inviteePage || {};
      this.list = users || [];
    },
    getRewardDetail() {
      this.loading = true;
      getUserRewards({ userCode: this.userInfo.userCode })
        .then((res) => {
          console.log("res", res);
          this.rewards = res.data || {};
          let list = this.rewards.rewardDAT3Record || [];
          list.map((item) => {
            item.time = item.time.split("T")[0].replace(/-/g, "/");
          });
          this.list = list;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
// 
.header-nav {
  .left {
    .back-icon {
      margin-left: 36rpx;
      width: 20rpx;
      height: 31rpx;
    }
  }
}
.list {
  display: flex;
  flex-direction: column;
  padding: 54rpx 62rpx;
  .item {
    margin-bottom: 60rpx;
    display: flex;
    align-items: center;
    
    image {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;
      background: #ccc;
    }
    text {
      flex: 1;
      margin-left: 25rpx;
      height: 36rpx;
      font-size: 25rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 36rpx;
      word-break: break-all;
    }
  }
}
.empty {
  height: 20vh;
  text-align: center;
  line-height: 20vh;
}
</style>