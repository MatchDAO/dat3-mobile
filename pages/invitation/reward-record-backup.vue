<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      :title="$t('my.rewardRecord')"
      background-color="#F9F8FF"
      @clickLeft="back"
    >
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
    </uni-nav-bar>
    <view v-if="(list && list.length) || loading" class="list">
      <view class="item" v-for="(item,index) in list" :key="index">
        <image v-if="item.type === 'ETH'" class="left-icon" src="/static/aptos-icon.png" />
        <image v-else-if="item.type === 'DAT3'" class="left-icon" src="/static/dat3-icon.png" />
        <image v-else-if="item.type === 'USDT'" class="left-icon" src="/static/dat3-icon.png" />
        <image v-else-if="item.type === 'VEDAT3'" class="left-icon" src="/static/vedat3-icon.png" />
        <view class="content">
          <view class="time">{{item.time}}</view>
          <view class="info">{{$t('invitation.chatToEarn')}}</view>
        </view>
        <view class="item-right">
          <view class="num">+{{formatEther(item.value)}}</view>
          <view class="pre-num"> </view>
        </view>
      </view>
    </view>
    <view v-else class="empty">
      {{$t('common.empty.data')}}
    </view>
  </view>
</template>
<script>
import { getUserInfo,getUserRewards } from "@/api/user";
let app = getApp();
import { formatEther } from '@/utils/wallet';

export default {
  data() {
    return {
      userInfo: app.globalData.userInfo,
      loading:false,
      rewards:{
        rewardDAT3:null,
        rewardETH:null,
      },
      list: [] // [{}, {}]

    };
  },
  onLoad() {
    this.initData();
  },
  onShow() {
  },
  methods: {
    formatEther(val) {
      return formatEther((Number(val || 0).toFixed(0)), 3); 
    },
    back() {
      uni.navigateBack({
        delta: 1
      });
    },
    initData() {
      this.getRewardDetail()
    },
    getRewardDetail(){
      this.loading = true
      getUserRewards({ userCode: this.userInfo.userCode }).then(res => {
          console.log('res',res)
          this.rewards = res.data ||{}
          let list = this.rewards.rewardDAT3Record || []
          list.map(item=>{
            item.time =  item.time.split('T')[0].replace(/-/g,'/')
          })
          this.list =  list
        }).finally(()=>{
          this.loading = false
        })
    },
  }
};
</script>
<style lang="scss" scoped>
// 
.header-nav {
  .left {
    .back-icon {
      margin-left:36rpx;
      width: 20rpx;
      height: 31rpx;
    }
  }
}
.list{
  display: flex;
  flex-direction: column;
  padding:54rpx 62rpx;
  .item{
    margin-bottom: 60rpx;
    display: flex;
    .left-icon{
      width: 101rpx;
      height: 99rpx;
      margin-right: 31rpx;
    }
    .content{
      flex:1;
      .time{
        margin-top: 7rpx;
        height: 45rpx;
        font-size: 33rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 45rpx;
      }
      .info{
        margin-top: 7rpx;
        height: 31rpx;
        font-size: 22rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 31rpx;
      }
    }
    .item-right{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      .num{
        height: 51rpx;
        font-size: 25rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 36rpx;
      }
      .pre-num{
        height: 36rpx;
        font-size: 25rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #D841FF;
        line-height: 36rpx;
      }
    }
  }
}
.empty{
  height: 20vh;
  text-align: center;
  line-height: 20vh;
}
</style>