<template>
  <view class="container">
    <view
      :wallet="wallet"
      :change:wallet="renderjs.updateWallet"
      :event="event"
      :change:event="renderjs.handleEvent"
      id="renderjs"
      class="renderjs"
      style="display: none"
    ></view>
    <uni-nav-bar
      class="header-nav"
      :title="' '"
      :border="false"
      :fixed="true" 
      status-bar="true" 
      background-color="#F9F8FF"
      @clickLeft="back"
    >
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png" />
        </view>
      </block>
      <block slot="right">
        <view class="right" @click="buyNft">
          <image class="btn-save" src="/static/aptos-wallet/btn-small.png" />
          <text>{{ $t("invitation.BuyNFT") }}</text>
        </view>
      </block>
    </uni-nav-bar>
    <view class="top">
      <view class="banner-tit">
        {{ $t("invitation.YouHave") }}
        {{ list.length }}
        {{ $t("invitation.NFT") }}
      </view>
      <view class="banner">
        <swiper
          v-if="list.length"
          class="swiper"
          :indicator-dots="false"
          :autoplay="false"
          @change="changeIndex"
        >
          <swiper-item
            class="swiper-item-box"
            :class="{ active: index === current }"
            v-for="(item, index) in list"
            :key="index"
          >
            <view class="swiper-item">
              <view class="item-top">{{ $t("invitation.InvitationNFT") }}</view>
              <view class="item-content">
                <image
                  class="item-content-left"
                  :src="item.current_token_data.metadata_uri"
                />
                <view class="item-content-right">
                  <view class="info-item">
                    <!-- <text class="tit">{{ $t("invitation.name") }}: </text> -->
                    <text class="txt">{{ item.current_token_data.name }}</text>
                  </view>
                  <custom-btn v-if="item.amount != 0" :onClick="claimToken">{{ $t('contract.claim') }}</custom-btn>
                  <!-- <view class="info-item">
                    <text class="tit"
                      >{{ $t("invitation.invitationCode") }}: </text
                    >
                    <text class="txt">{{
                      item.token.collection
                    }}</text>
                  </view> -->
                  <!-- <view class="info-item">
                    <text class="tit">{{ $t("invitation.ownedBy") }}: </text>
                    <text class="txt">{{
                      item.token.royalty.payee_address
                    }}</text>
                  </view> -->
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <view v-else class="swiper" :indicator-dots="false" :autoplay="false">
          <view class="swiper-item-box nothing">
            <view class="swiper-item">
              <view class="item-top">{{ $t("invitation.InvitationNFT") }}</view>
              <view class="empty">{{ $t("invitation.ThereIsNothing") }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="content">
      <!-- NFT Rewards -->
      <view class="title-item">
        <view class="item-txt">{{ $t("invitation.NFTRewards") }}</view>
      </view>
      <view class="rewards-list">
        <view class="item">
          <view class="item-no">1 {{ $t("invitation.Boxes") }}</view>
          <view class="image-list">
            <image
              src="/static/invitation/icon-box.png"
              v-for="i in 5"
              :key="i"
            />
          </view>
        </view>
        <view class="item">
          <view class="item-no">2 {{ $t("invitation.FriendsSpendAPT") }}</view>
          <view class="item-txt">{{ $t("invitation.NFTRewardsTip") }}</view>
        </view>
        <view class="item">
          <view class="item-no">3 {{ $t("invitation.FriendsEarnAPT") }}</view>
          <view class="item-txt">{{ $t("invitation.NFTRewardsTip") }}</view>
        </view>
      </view>
      <!-- Invitation Revenue -->
      <view class="title-item">
        <view class="item-txt">{{ $t("invitation.InvitationRevenue") }}</view>
        <custom-btn :disabled="!currentNftInfo.amount || currentNftInfo.amount == '0'" :onClick="claim">{{ $t("aptosWallet.claim") }}</custom-btn>
      </view>
      <view class="revenue">
        <view class="item" @click="goDetail">
          <view class="tit"
            >{{ currentNftInfo.users && currentNftInfo.users.length }} {{ $t("invitation.users") }} ></view
          >
          <view class="txt">{{ $t("invitation.TotalInvite") }}</view>
        </view>
        <view class="item">
          <view class="tit"
            >{{
              $utilWithVue.formatAptos(
                currentNftInfo.earn + currentNftInfo.spend
              )
            }}
            APT
          </view>
          <view class="txt">{{ $t("invitation.TotalInvitationRewards") }}</view>
        </view>
        <view class="item">
          <view class="tit"
            >{{ $utilWithVue.formatAptos(currentNftInfo.amount, 4) }} APT
          </view>
          <view class="txt">{{ $t("invitation.AvailableClaim") }}</view>
        </view>
      </view>
      <view class="footer-btn" @click="copyLink()">
        <image src="/static/my/btn-large.png" />
        <text>{{ $t("invitation.Invite") }}</text>
      </view>
    </view>

    <custom-confirm-modal
      ref="claimConfirmPopup"
      :title="$t('common.confirm')"
      @confirm="claimConfirm"
      @cancel="claimCancel"
    >
      <view class="confirm-popup-content">
        <view class="des">{{$t('contract.claim') + $t('wallet.to') + $t('wallet.wallet')}}</view>
        <view class="list">
          <view class="item">
            <text class="label">APT</text>
            <text class="value">{{
              $utilWithVue.formatAptos(currentNftInfo.amount, 8)
            }}</text>
          </view>
          <view class="item">
            <text class="label">{{ $t("contract.gasFee") }}</text>
            <text class="value">
              {{ $utilWithVue.formatAptos(gasFeeInfo.gas_estimate, { fixed: 6 }) }}APT
            </text>
          </view>
        </view>
      </view>
    </custom-confirm-modal>
    <custom-confirm-modal
      ref="claimTokenConfirmPopup"
      :title="$t('common.confirm')"
      @confirm="claimTokenConfirm"
      @cancel="claimTokenCancel"
    >
      <view class="confirm-popup-content">
        <view class="des">{{ $t('invitation.claimTokenConfirmPopup.toWallet') }}</view>
        <view class="list">
          <view class="item">
            <text class="label">{{ $t('invitation.claimTokenConfirmPopup.invitationNFT') }}</text>
            <text class="value">{{
              $utilWithVue.formatAptos(currentNft.amount)
            }}</text>
          </view>
          <view class="item">
            <text class="label">{{ $t("contract.gasFee") }}</text>
            <text class="value">
              {{ $utilWithVue.formatAptos(gasFeeInfo.gas_estimate, { fixed: 6 }) }}APT
            </text>
          </view>
        </view>
      </view>
    </custom-confirm-modal>
  </view>
</template>

<script module="renderjs" lang="renderjs">
import {  apis, getAccount, contractService } from "@/api/contract.js"

import { getSimpleUni } from "@/utils/simpleUni";

export default {
		data() {
			return {
				_wallet: null,
			}
		},
    mounted() {
      console.log('mounted',this._wallet);
      // this.init()
		},
    methods: {
      async init(){
         // let account = await getAccount(this._wallet.code)
        // console.log('init',account);
        // let balance = await apis.getBalance(this._wallet.address)
         
        try{
          let list = await apis.getTokens(this._wallet.address)
          console.log('init',list);
          this.$ownerInstance.callMethod('getNfts',list);
        }catch(error){
          console.log('init:error',error);
        }
       
      },
      updateWallet(val){
        console.log('updateWallet',val);
        this._wallet = val
      },
      handleEvent(event) {
				if (!event.type) return;
				switch (event.type) {
          case 'claimToken':
            this.handleClaimToken(event)
            break;
					default:
						this.handleContractService(event);
						break;
				}
			},
      async handleClaimToken(event) {
        const { payload = {}, showLoading = true } = event;
        const { name, from_address, current_token_data } = payload.token;
        const { collection_name, payee_address, creator_address } = current_token_data;
        let account = await getAccount(this._wallet.code);
        const simpleUni = getSimpleUni(this);
        showLoading && simpleUni.showLoading();
        try {
          const res = await apis.claimToken(
            account,
            from_address,
            creator_address,
            collection_name,
            name
          )
          showLoading && simpleUni.hideLoading();
          this.$ownerInstance.callMethod('eventCallBack', { ...event, res, err: null });
        } catch (err) {
          showLoading && simpleUni.hideLoading();
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
			}
    }
  }

</script>
<script>
import { address, viewContractService, getGasFee } from "@/api/viewContractService.js";
import * as graphQLApi from "@/api/graphQLApi.js";
import { getInviteUsers } from "@/api/user";
let app = getApp();
export default {
  data() {
    return {
      event: {},
      list: [],
      current: 0,
      wallet: {},
      userInfo: null,
      currentNftInfo: {
        spend: null,
        amount: null,
        earn: null,
        users: [],
        all: null,
      },
      gasFeeInfo: {},
    };
  },
  computed: {
    currentFid() {
      let nft = this.list[this.current];
      let name = (nft && nft.name) || null;
      let fid = (name && name.split("#")[1]) || null;
      return fid;
    },
    currentNft() {
      let nft = this.list[this.current]||{};
      return nft;
    },
  },
  onShow() {
    this.wallet = app.globalData.wallet;
    this.userInfo = app.globalData.userInfo;
    this.initData();
  },
  onPullDownRefresh() {
    this.current = 0
    // 刷新
    this.initData();
  },
  methods: {
    buyNft() {
      const url = 'https://www.topaz.so/collection/DAT-Invitation-Pass-alpha-d7b5138df5';
      // #ifdef APP-PLUS
      plus.runtime.openURL(url);
      // #endif
      // #ifdef H5
      window.open(url);
      // #endif
    },
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    async initData() {
      await this.fetchGasFee();
      await this.getNfts();
      uni.stopPullDownRefresh();
    },
    async fetchGasFee() {
      const res = await getGasFee();
      this.gasFeeInfo = res.data || {};
    },
    async getDetail() {
      if(this.list && this.list.length > 0 && this.currentNft && this.currentNft.amount == 0){
        let res = await getInviteUsers(this.currentFid);
        const {
          inviteReward: amount,
          spendReward: spend,
          earnReward: earn,
          inviteePage,
        } = res.data || {};
        const { data: users } = inviteePage || {};
        this.currentNftInfo = {
          amount,
          spend: +spend,
          earn: +earn,
          users: users || [],
        };
      }
    },
    changeIndex(event) {
      let { current } = event.detail;
      this.current = current;
      this.getDetail();
    },
    goDetail() {
      if(!this.currentFid) return;
      uni.navigateTo({
        url: `/pages/invitation/reward-record?fid=${this.currentFid}`,
      });
    },
    claimToken() {
      this.$refs.claimTokenConfirmPopup.open();
    },
    claimTokenCancel() {
      this.$refs.claimTokenConfirmPopup.close();
    },
    claimTokenConfirm() {
      this.event = {
        type: "claimToken",
        payload: {
         token: this.currentNft
        },
      };
    },
    claim() {
      this.$refs.claimConfirmPopup.open();
    },
    claimCancel() {
      this.$refs.claimConfirmPopup.close();
    },
    claimConfirm() {
      this.event = {
        type: "claim",
        payload: {
          module: "routel",
          func: "claim_invite_reward",
          args: [this.currentFid],
          code: this.wallet.code,
        },
      };
    },
    eventCallBack({ type, payload, res, err }) {
      this.event = {};
      switch (type) {
        case 'claimToken':
          if (!err) {
            this.claimTokenCancel();
            this.getNfts();
            uni.showToast({
              title: this.$t("common.success"),
              icon: "none",
            });
          } else {
            uni.showToast({
              title: err.message || this.$t("common.fail"),
              icon: "none",
            });
          }
          break;
        default:
          if (!err) {
            app.globalData.getWalletBalanceInfo();
            this.cancelStaking();
            uni.showToast({
              title: this.$t("common.success"),
              icon: "none",
            });
          } else {
            uni.showToast({
              title: err.message || this.$t("common.fail"),
              icon: "none",
            });
          }
          break;
      }
    },
    async getNfts() {
      const pending_claims_res = await graphQLApi.current_token_pending_claims({
        to_address: this.wallet.address,
        payee_address: address
      });
      const ownerships_res = await graphQLApi.current_token_ownerships({
        owner_address: this.wallet.address,
        payee_address: address
      });
      const { current_token_pending_claims } = pending_claims_res.data || {};
      const { current_token_ownerships } = ownerships_res.data || {};
      this.list = [
        ...(current_token_pending_claims || []).map(it => ({ ...it, amount: '1' })), 
        ...(current_token_ownerships || []).map(it => ({ ...it, amount: '0' }))
      ];
      this.getDetail();
    },
    // getNfts(list) {
    //   this.list = list.filter(item=>{
    //     console.log("getNfts:address",item.token.royalty.payee_address === address);
    //     return item.token.royalty.payee_address === address
    //   });
    //   console.log("getNfts:address",this.list);
    //   this.getDetail();
    // },
    copyLink() {
      this.copy(
        "https://play.google.com/store/apps/details?id=com.dat3.social"
      );
    },
    copy(val) {
      //#ifdef APP-PLUS
      if (plus && plus.android) {
        var Context = plus.android.importClass("android.content.Context");
        var main = plus.android.runtimeMainActivity();
        var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
        plus.android.invoke(clip, "setText", val);
        uni.showToast({
          icon: "none",
          title: "copy success",
          duration: 1000,
        });
      }
      //#endif
    },
  },
};
</script>

<style lang="scss" scoped>
 .header-nav{
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 156rpx;

    .btn-save {
      width: 156rpx;
      height: 56rpx;
      position: relative;
      z-index: 2;
    }

    text {
      width: 156rpx;
      height: 56rpx;
      position: absolute;
      left: 0;
      top: 0;
      text-align: center;
      line-height: 56rpx;
      z-index: 9;
      font-size: 28rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #ffffff;
      font-weight: 600;
    }
  }
 }
 
.container {
  .title-item .item-right {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .btn-save {
      width: 156rpx;
      height: 56rpx;
      position: relative;
      z-index: 2;
    }
    text {
      width: 100%;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 9;
      font-size: 28rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #ffffff;
      font-weight: 600;
    }
  }
  .top {
    margin-bottom: 50rpx;
    .banner-tit {
      padding: 33rpx 0 22rpx 0;
      text-align: center;
      height: 40rpx;
      font-size: 29rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #d841ff;
      line-height: 40rpx;
    }
    .banner {
      .swiper {
        height: 319rpx;

        .swiper-item-box {
          box-sizing: border-box;
          padding: 0 50rpx;
          margin-left: -80rpx;
          &.nothing{
            margin-left: 0;
          }
          &.active {
            margin-left: 0rpx;
          }
          .swiper-item {
            height: 319rpx;
            background: #f1eeff;
            border-radius: 7px;
            .item-top {
              padding: 24rpx 0 29rpx 0;
              text-align: center;
              height: 36rpx;
              font-size: 25rpx;
              font-family: PingFangSC-Thin, PingFang SC;
              font-weight: 100;
              color: #000000;
              line-height: 36rpx;
            }
            .item-content {
              margin: 0 29rpx;
              display: flex;
              align-items: self-start;
              .item-content-left {
                width: 158rpx;
                height: 158rpx;
                background: #dbd3ff;
                border-radius: 8px;
              }
              .item-content-right {
                flex: 1;
                margin-left: 10rpx;
                .info-item {
                  display: flex;
                  margin: 7rpx 0 44rpx 0;
                  .tit {
                    height: 36rpx;
                    font-size: 25rpx;
                    font-family: PingFangSC-Thin, PingFang SC;
                    font-weight: 100;
                    color: #000000;
                    line-height: 36rpx;
                  }
                  .txt {
                    flex: 1;
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
            }

            .empty {
              margin-top: 50rpx;
              text-align: center;
              font-size: 29rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #000000;
            }
          }
        }
      }
    }
  }
  .content {
    padding: 0 63rpx 0 54rpx;
    .title-item {
      display: flex;
      align-items: center;
      margin-bottom: 25rpx;
      .item-txt {
        flex: 1;
        font-size: 40rpx;
        font-family: SourceHanSansCN-Bold, SourceHanSansCN;
        font-weight: bold;
        color: #0e0e0e;
        line-height: 60rpx;
      }
      .item-right {
        margin-right: 0;
      }
    }

    .rewards-list {
      margin-bottom: 60rpx;
      .item {
        margin-bottom: 11rpx;
        width: 627rpx;
        height: 132rpx;
        background: #f1eeff;
        border-radius: 7rpx;
        .item-no {
          height: 53rpx;
          background: #dbd3ff;
          border-radius: 7rpx;
          padding: 0 30rpx;
          display: inline-block;
          font-size: 22rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 53rpx;
        }
        .item-txt {
          margin-top: 20rpx;
          height: 36rpx;
          font-size: 25rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #000000;
          line-height: 36rpx;
          text-align: center;
        }
        .image-list {
          padding-top: 6rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          image {
            margin: 0 26rpx;
            width: 64rpx;
            height: 64rpx;
          }
        }
      }
    }
    .revenue {
      width: 627rpx;
      height: 154rpx;
      background: #f1eeff;
      border-radius: 7rpx;
      display: flex;
      margin-bottom: 47rpx;
      .item {
        flex: 1;
        border-left: 2rpx solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        &:nth-child(1) {
          border-left: none;
        }
        .tit {
          height: 36rpx;
          font-size: 25rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #000000;
        }
        .txt {
          // margin-top: 14rpx;
          height: 31rpx;
          font-size: 22rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #545454;
        }
      }
    }
    .footer-btn {
      position: relative;
      width: 632rpx;
      height: 101rpx;
      line-height: 101rpx;
      text-align: center;
      image {
        width: 100%;
        height: 100%;
      }
      text {
        width: 560rpx;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 9;
        font-size: 36rpx;
        color: #ffffff;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
    }
  }
}
.confirm-popup-content {
  .des {
    font-size: 25rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #393939;
    line-height: 43rpx;
    margin-bottom: 20rpx;
  }
  .list {
    background: #f1eeff;
    border-radius: 7px;
    padding: 33rpx;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 29rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
      line-height: 43rpx;
      &:not(:nth-child(1)) {
        padding-top: 25rpx;
        margin-top: 25rpx;
        border-top: 2rpx solid #fff;
      }
    }
  }
}
</style>
