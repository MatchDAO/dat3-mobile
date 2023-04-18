<template>
  <view class="home-container">
    <view
      id="renderjs"
      class="renderjs"
      :event="event"
      :change:event="renderjs.handleEvent"
      style="display:none"
    ></view>
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :border="false"
      status-bar="true"
      padding="16rpx 22rpx 16rpx 0"
      :title="''"
      background-color="#F1EEFF"
    >
			<view slot="right" class="header-nav-right">
        <suspensionbar></suspensionbar>
      </view>
    </uni-nav-bar>
    <view class="search-bar" @tap="navigateTo('/pages/home/search')">
      <image src="/static/home/home-search-bg.png"></image>
      <view class="search-bar-content">
        <image src="/static/search-icon.png"></image>
        <text>{{$t('home.searchTip')}}</text>
      </view>
    </view>
    <!--  -->
    <view class="friend-list" v-if="list && list.length || listParam.loading">
      <friend-card v-for="(item,index) in list" :walletAssetsInfo="walletAssetsInfo" :key="index" :info="item"></friend-card>
    </view>
    <!--  -->
    <view v-else class="no-data">
      {{$t('common.empty.data')}}
    </view>
    <!--  -->
    <w-popup-invitation-code @confirm="confirmCode" ref="invitationPopup" />
    <tabbar activeKey="home"></tabbar>
  </view>
</template>
<script module="renderjs" lang="renderjs">
import { contractService,apis,NODE_URL } from "@/api/contract.js"
import { getSimpleUni } from "@/utils/simpleUni";
export default {
		data() {
			return {}
		},
    mounted() {
		},
    methods: {
      handleEvent(event) {
        if (!event.type) return;
        switch (event.type) {
          case 'user_init':
            this.userInit(event);
            break;
          default:
            this.handleContractService(event);
            break;
        }
			},
      async userInit(event){
        // user_init assetsuser_init 
        try {
          const res = await contractService(event.payload);
          this.$ownerInstance.callMethod('eventCallBack', { ...event, res, err: null });
        } catch (err) {
          this.$ownerInstance.callMethod('eventCallBack', { ...event, res: null, err });
        }
      },
      async handleContractService(event) {
        const { payload, showLoading = true } = event;
        const simpleUni = getSimpleUni(this);
        showLoading && simpleUni.showLoading();
        try {
          const res = await contractService({ ...payload });
          showLoading && simpleUni.hideLoading();
          this.$ownerInstance.callMethod('eventCallBack', { ...event, res, err: null });
        } catch (err) {
          simpleUni.showToast({
            title: err.message,
            icon: 'none'
          });
          showLoading && simpleUni.hideLoading();
          this.$ownerInstance.callMethod('eventCallBack', { ...event, res: null, err });
        }
      },
    }
  }

</script>
<script>
import { viewContractService } from "@/api/viewContractService.js";
import { getPopularUserList } from "@/api/user";
import { setUserInfo, setUserInitStatus, getUserInitStatus } from "@/config/auth";
let app = getApp();
  export default {
    data() {
      return {
        list: [],
        listParam: { 
          pageNo: 1,
          pageSize: 10,
          loading: false,
          isEnd: false,
        },
        wallet: null,
        event: {},
        walletAssetsInfo: {},
      }
    },
    onLoad(){
      let me = this;
      this.wallet = app.globalData.wallet
      me.walletAssetsInfo = getApp().globalData.walletAssetsInfo || {};
			uni.$on('updateWalletBalanceInfo', function({ data, walletAssetsInfo }){
				me.walletAssetsInfo = walletAssetsInfo;
			})
      uni.hideTabBar({
        success(){
          console.log('tabbar:success')
        },
        fail(){
          console.log('tabbar:fail')
        }
      })
      uni.$on('eventChange', this.onEventChange);
    },
    onUnload() {
			this.off();
		},
    onShow() {
      this.checkInvitation()
      // this.checkUserInit()
      this.initData();
      getApp().globalData.getWalletBalanceInfo();
    },
    onPullDownRefresh() {
      console.log('onPullDownRefresh');
      this.initData();
    },
    onReachBottom() {
      console.log('onReachBottom');
      this.listParam.pageNo++;
      this.getList();
    },
    methods: {
      eventCallBack(event) {
        const { type, payload, res, err } = event;
        this.event = {};
        switch (type) {
          case 'user_init': 
            if (!err) {
              // setUserInitStatus(true);
            }
            break;
          case 'one_minute': 
            uni.$emit('eventCallBack.one_minute', event);
            break;
          default:
            break;
        }
      },
      onEventChange(event) {
        this.event = event;
      },
      off() {
        uni.$off('eventChange', this.onEventChange);
      },
      initData() {
        this.listParam = { 
          pageNo: 1,
          pageSize: 10,
          loading: false,
          isEnd: false,
        };
        this.getList();
      },
      getList() {
        let { pageNo, pageSize, isEnd, loading } = this.listParam;
        if (isEnd && pageNo > 1) return;
        if (loading) return;
        this.listParam.loading = true;
        getPopularUserList({ 
          current: pageNo,
          size: pageSize
        }).then((res) => {
          const list = ((res.data || {}).records || []).map(it => {
            if (it.online) {
              it.online = new Date().getTime() - it.online < 1000 * 60;
            } else {
              it.online = false;
            }
            if (!it.profession) {
              it.profession = [];
            } else if (it.profession.indexOf('[') !== -1) {
              it.profession = JSON.parse(it.profession) || [];
            } else {
              it.profession = [it.profession];
            }
            return it;
          });
          // 1
          if (this.listParam.pageNo === 1) {
            this.list = list;
          } else {
            this.list = [...this.list, ...list];
          }
          // 
          let { total } = res.data || {};
          this.listParam.isEnd = this.list.length >= total;
          this.listParam.pageNo = Math.ceil(this.list.length / pageSize);
        }).finally(() => {
          uni.stopPullDownRefresh();
          this.listParam.loading = false;
        });
      },
      navigateTo(url) {
        uni.navigateTo({
          url,
        });
      },
      checkUserInit() {
        const userIsInit = !!getUserInitStatus();
        const { userCode, invitationCode } = app.globalData.userInfo || {};
        if ((this.wallet || {}).code && !userIsInit && invitationCode) {
          viewContractService({ module: 'routel', func: 'assets', args: [this.wallet.address] }).then((res) => {
            const [
              uid,
              fid,
            ] = res.data || [];
            if (fid == invitationCode && uid == userCode) {
              setUserInitStatus(true);
            } else {
              this.event = {
                type: 'user_init',
                payload: { module: 'routel', func: 'user_init', args: [invitationCode, userCode], code: this.wallet.code }
              }
            }
          })
        }
      },
      checkInvitation(){
        const userInfo = app.globalData.userInfo || {};
        // 
        if(userInfo &&  !userInfo.invitationCode){
          this.$nextTick(()=>{
            this.$refs['invitationPopup'].open()
          })
        }
      },
       // 
      confirmCode(invitationCode) {
        this.$refs['invitationPopup'].close()
        let userInfo= app.globalData.userInfo
        userInfo.invitationCode=invitationCode
        setUserInfo(userInfo);

      }
    }
  }
</script>

<style scoped lang="scss">
  .header-nav-right {
    position: relative;
    width: 100%;
  }
  .no-data {
    height: 1000rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 220rpx;
      height: 278rpx;
    }
  }
  .home-container {
    background: #F1EEFF;
    min-height: 100vh;
  }
  .search-bar {
    width: 673rpx;
    height: 80rpx;
    position: relative;
    margin: 52rpx auto 0;
    // background: #fff;
    border-radius: 20rpx;
    &>image {
      width: 100%;
      height: 100%;
    }
    .search-bar-content {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      &>image {
        width: 36rpx;
        height: 36rpx;
        margin: 0 24rpx 0 36rpx;
      }
      &>text {
        font-size: 25rpx;
        color: #D9D9D9;
      }
    }
  }
  .friend-list {
    padding: 38rpx 28rpx 130rpx 28rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
</style>
