<template>
  <view class="container">
    <view
      :event="event"
      :change:event="renderjs.handleEvent"
      id="renderjs"
      class="renderjs"
      style="display: none"
    ></view>
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      background-color="#ffffff"
      @clickLeft="back"
    >
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png" />
        </view>
      </block>
      <block slot="right">
        <view class="right" @click="changeScanAddressModalVisible(true)">
          <image class="btn-save" src="/static/aptos-wallet/btn-small.png" />
          <text>{{ $t("aptosWallet.Received") }}</text>
        </view>
      </block>
    </uni-nav-bar>
    <view class="content">
      <!-- Assets -->
      <view class="assets">
        <view class="title-item">
          <view class="item-txt">{{ $t("aptosWallet.Assets") }}</view>
          <view class="item-right" @click="transfer">
            <image class="btn-save" src="/static/aptos-wallet/btn-small.png" />
            <text>{{ $t("aptosWallet.transfer") }}</text>
          </view>
        </view>
        <view class="wallet-item">
          <view class="item-left">
            <image src="/static/aptos-wallet/icon-apt.png" />
          </view>
          <view class="item-center">
            <view class="tit">{{ $t("aptosWallet.APT") }}</view>
            <view class="txt">{{ $t("aptosWallet.WalletBalance") }}</view>
          </view>
          <view class="item-right">{{
            $utilWithVue.formatAptos(walletAssetsInfo.user_apt)
          }}</view>
        </view>
        <view class="wallet-item">
          <view class="item-left">
            <image src="/static/aptos-wallet/icon-apt.png" />
          </view>
          <view class="item-center">
            <view class="tit">{{ $t("aptosWallet.APT") }}</view>
            <view class="txt">{{ $t("aptosWallet.PoolBalance") }}</view>
          </view>
          <view class="item-right">{{
            $utilWithVue.formatAptos(walletAssetsInfo.account_apt)
          }}</view>
        </view>
        <view class="tip">{{ $t("aptosWallet.AssetsTip") }}</view>
      </view>

      <!-- Rewards -->
      <view class="title-item">
        <view class="item-txt">{{ $t("aptosWallet.Rewards") }}</view>
        <custom-btn :disabled="!walletAssetsInfo.claimable_dat3 || walletAssetsInfo.claimable_dat3 == '0'" :onClick="claim">{{ $t('contract.claim') }}</custom-btn>
      </view>
      <view class="wallet-item">
        <view class="item-left">
          <image src="/static/aptos-wallet/icon-dat3.png" />
        </view>
        <view class="item-center">
          <view class="tit">{{ $t("aptosWallet.DAT3_beta") }}</view>
          <view class="txt">{{ $t("aptosWallet.claimable") }} {{ $utilWithVue.formatDat3(walletAssetsInfo.claimable_dat3,6) }}</view>
        </view>
        <view class="item-right">{{$utilWithVue.formatDat3(walletAssetsInfo.user_dat3, 6)}}</view>
      </view>
    </view>
    <custom-confirm-modal
      ref="claimConfirmPopup"
      title="Confirm"
      @confirm="claimConfirm"
      @cancel="claimCancel"
    >
      <view class="confirm-popup-content">
        <view class="des">{{$t('contract.claim') + $t('wallet.to') + $t('wallet.wallet')}}</view>
        <view class="list">
          <view class="item">
            <text class="label">APT</text>
            <text class="value">{{
              $utilWithVue.formatDat3(walletAssetsInfo.claimable_dat3, 8)
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
    <scan-address-qr-code-modal
      :scanAddress="wallet.address"
      v-if="scanAddressModalVisible"
      @onClose="changeScanAddressModalVisible(false)"
    >
    </scan-address-qr-code-modal>
  </view>
</template>
<script module="renderjs" lang="renderjs">

import { contractService } from "@/api/contract";
  import { getSimpleUni } from "@/utils/simpleUni";

	export default {
		data() {
			return {
			}
		},
    mounted(){
    },
		methods: {
      handleEvent(event) {
				if (!event.type) return;
				switch (event.type) {
					default:
						this.handleContractService(event);
						break;
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
          showLoading && simpleUni.hideLoading();
          this.$ownerInstance.callMethod('eventCallBack', { ...event, res: null, err });
        }
			}
		}
	}
</script>

<script>
import { getGasFee } from "@/api/viewContractService";

let app = getApp();
/**
 *  uid,
    fid,
    grade,
    user_apt,
    user_dat3,
    account_apt,
    claimable_dat3,
    claimed_dat3,
 */
export default {
  data() {
    return {
      event: {},
      wallet: {},
      walletAssetsInfo: {},
      scanAddressModalVisible: false,
      gasFeeInfo: {},
    };
  },
  onLoad(option) {
    this.wallet = app.globalData.wallet;
    this.walletAssetsInfo = app.globalData.walletAssetsInfo;
    console.log("walletAssetsInfo", this.walletAssetsInfo);

    uni.$on("updateWalletBalanceInfo", ({ walletAssetsInfo }) => {
      this.walletAssetsInfo = walletAssetsInfo;
    });

    this.initData();
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    initData() {
      this.fetchGasFee();
    },
    async fetchGasFee() {
      const res = await getGasFee();
      this.gasFeeInfo = res.data || {};
    },
    changeScanAddressModalVisible(visible) {
      this.scanAddressModalVisible = visible;
    },
    transfer() {
      uni.navigateTo({
        url: `/pages/aptos-wallet/transfer`,
      });
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
          func: "claim_reward",
          args: [
          ],
          code: this.wallet.code,
        },
      };
    },
    showTransferPopup() {
      this.$refs.transferPopup.open();
    },
    closeTransferPopup() {
      this.$refs.transferPopup.close();
    },
    eventCallBack({ type, payload, res, err }) {
      this.event = {};
      if (!err) {
        this.claimCancel();
        app.globalData.getWalletBalanceInfo();
        uni.showToast({
          title: this.$t("common.success"),
          icon: "none",
        });
      } else {
        uni.showToast({
          title: err.message ||  this.$t("common.fail"),
          icon: "none",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-nav .right,
.title-item .item-right {
  margin-right: 18rpx;
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
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    font-size: 28rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    color: #ffffff;
    font-weight: 600;
  }
}

.container {
  padding: 0 60rpx;
  height: 100vh;
  .assets {
    margin-bottom: 96rpx;
  }
  .content {
    padding-top: 54rpx;
    .title-item {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
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
    .wallet-item {
      height: 129rpx;
      box-sizing: border-box;
      padding: 0 42rpx 0 24rpx;
      margin-bottom: 22rpx;
      background: #f1eeff;
      border-radius: 7rpx;
      display: flex;
      align-items: center;
      .item-left {
        margin-right: 18rpx;
        image {
          width: 88rpx;
          height: 80rpx;
        }
      }
      .item-center {
        flex: 1;
        .tit {
          height: 45rpx;
          font-size: 33rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #000000;
          line-height: 45rpx;
        }
        .txt {
          height: 36rpx;
          font-size: 25rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #444444;
          line-height: 36rpx;
        }
      }
      .item-right {
        height: 45rpx;
        font-size: 33rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 45rpx;
      }
    }
    .tip {
      font-size: 22rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 31rpx;
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
