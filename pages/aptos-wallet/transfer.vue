<template>
  <view class="container">
    <view
      style="display: none"
      :event="event"
      :change:event="renderjs.handleEvent"
      id="renderjs"
      class="renderjs"
    >
    </view>
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :title="$t('wallet.transfer')"
      status-bar="true"
      background-color="#F9F8FF"
      @clickLeft="back"
      :border="false"
    >
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png" />
        </view>
      </block>
    </uni-nav-bar>
    <view class="body">
      <view class="transfer-wrapper">
        <view class="transfer-item">
          <view class="transfer-item-label">{{ $t("aptosWallet.From") }}</view>
          <view class="transfer-item-value">{{
            !reverseFromTo
              ? $t("aptosWallet.WalletBalance")
              : $t("aptosWallet.PoolBalance")
          }}</view>
        </view>
        <view class="transfer-item">
          <view class="transfer-item-label">{{ $t("aptosWallet.To") }}</view>
          <view class="transfer-item-value">{{
            !reverseFromTo
              ? $t("aptosWallet.PoolBalance")
              : $t("aptosWallet.WalletBalance")
          }}</view>
        </view>
        <image
          @tap="switchReverseFromTo"
          class="transfer-switch-btn"
          src="/static/wallet/transfer_switch.png"
        />
      </view>

      <view class="form-item">
        <view class="form-item-label">{{ $t("aptosWallet.Amout") }}</view>
        <view class="form-item-control form-item-inputNumber">
          <input
            v-model="amount"
            :controlled="true"
            type="number"
            class="form-item-inputNumber-value"
          />
          <view class="form-item-inputNumber-btn" @tap="toMaxAmount">{{
            $t("aptosWallet.Max")
          }}</view>
        </view>
        <view class="form-item-tip">
          <view class="form-item-tip-left"
            >{{ $t("aptosWallet.Available") }}{{
              $utilWithVue.formatAptos(availableValue)
            }}{{ $t("aptosWallet.APT") }}</view
          >
        </view>
      </view>
      <view v-if="!disabledBtn" class="body-btn" @tap="showTransferPopup">
        <image src="/static/my/btn-middle.png" mode />
        <text>{{ $t("aptosWallet.Transfer") }}</text>
      </view>
      <view v-if="disabledBtn" class="body-btn">
        <image src="/static/my/btn-disabled.png" mode />
        <text>{{ $t("aptosWallet.Transfer") }}</text>
      </view>
      <view class="body-btn-tip">
        <text class="bold">{{ $t("aptosWallet.Tips") }}</text>
        <text class="txt">{{ $t("aptosWallet.TipsContent") }}</text>
      </view>
    </view>
    <custom-confirm-modal
      ref="transferPopup"
      @confirm="confirmTransferPopup"
      @cancel="closeTransferPopup"
    >
      <view class="confirm-popup-content">
        <view class="des-list">
          <view class="item">
            <view class="">{{ $t("aptosWallet.From") }}</view>
            <view class="">{{
              !reverseFromTo
                ? $t("aptosWallet.WalletBalance")
                : $t("aptosWallet.PoolBalance")
            }}</view>
          </view>
          <view class="item">
            <view class="">{{ $t("aptosWallet.To") }}</view>
            <view class="">{{
              !reverseFromTo
                ? $t("aptosWallet.PoolBalance")
                : $t("aptosWallet.WalletBalance")
            }}</view>
          </view>
        </view>
        <view class="list">
          <view class="item">
            <text class="label">APT</text>
            <text class="value">{{ amount }}</text>
          </view>
          <view class="item">
            <text class="label">{{ $t("contract.gasFee") }}</text>
            <text class="value"
              >{{ $utilWithVue.formatAptos(gasFeeInfo.gas_estimate, { fixed: 6 }) }} APT</text
            >
          </view>
        </view>
      </view>
    </custom-confirm-modal>
  </view>
</template>

<script module="renderjs" lang="renderjs">
  import { contractService } from "@/api/contract";
  import { getSimpleUni } from "@/utils/simpleUni";
	export default {
		data() {
			return {}
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
import { getGasFee } from "@/api/viewContractService";
let app = getApp();
export default {
  data() {
    return {
      event: {},
      reverseFromTo: false, // false wallet---> pool
      wallet: {},
      walletAssetsInfo: {},
      amount: null,
      gasFeeInfo: {},
    };
  },
  computed: {
    availableValue() {
      let key = !this.reverseFromTo ? "user_apt" : "account_apt";
      return this.walletAssetsInfo[key];
    },
    disabledBtn() {
      return this.availableValue <= 0 || this.amount <= 0;
    },
  },
  onLoad(option) {
    this.wallet = app.globalData.wallet;
    this.walletAssetsInfo = app.globalData.walletAssetsInfo;
    console.log("walletAssetsInfo", this.walletAssetsInfo);
    uni.$on("updateWalletBalanceInfo", ({ walletAssetsInfo }) => {
      this.walletAssetsInfo = walletAssetsInfo;
    });
    this.fetchGasFee();
  },
  onShow() {},

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    async fetchGasFee() {
      const res = await getGasFee();
      this.gasFeeInfo = res.data || {};
    },
    switchReverseFromTo() {
      this.reverseFromTo = !this.reverseFromTo;
    },
    toMaxAmount() {
      this.amount = this.$utilWithVue.formatAptos(this.availableValue);
    },
  
    confirmTransferPopup() {
      let amount = 100000000 * this.amount;
      const max = this.$utilWithVue.formatAptos(this.availableValue);
      if (Number(this.amount) > Number(max)) {
        uni.showToast({
          title: this.$t('wallet.insufficientFunds'),
          icon: "none",
        })
        return;
      }
      if (this.reverseFromTo) {
        this.event = {
          type: "withdraw",
          payload: {
            module: "routel",
            func: "withdraw",
            args: [amount],
            code: this.wallet.code,
          },
        };
      } else {
        this.event = {
          type: "deposit",
          payload: {
            module: "routel",
            func: "deposit",
            args: [amount],
            code: this.wallet.code,
          },
        };
      }
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
        this.closeTransferPopup();
        app.globalData.getWalletBalanceInfo();
        uni.showToast({
          title: this.$t('common.success'),
          icon: "none",
        })
      } else {
        uni.showToast({
          title: err.message,
          icon: "none",
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  .confirm-popup-content {
    .des-list {
      margin-bottom: 42rpx;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 25rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #393939;
        line-height: 43rpx;
      }
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
  .body {
    padding: 58rpx 60rpx;

    .transfer-wrapper {
      width: 627rpx;
      position: relative;
      margin-bottom: 89rpx;

      .transfer-item {
        width: 100%;
        height: 133rpx;
        border-radius: 7rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 42rpx;
        background: #f1eeff;

        &:first-child {
          border-bottom: 5rpx solid #fff;
        }

        .transfer-item-label {
          font-size: 36rpx;
          font-family: PingFangSC-Thin, PingFang SC;
          font-weight: 100;
          color: #000000;
          width: 160rpx;
          text-align: left;
        }

        .transfer-item-value {
          font-size: 45rpx;
          width: 230px;
          font-size: 33rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #000000;
          line-height: 45rpx;
        }
      }

      .transfer-switch-btn {
        position: absolute;
        width: 98rpx;
        height: 100rpx;
        top: 83rpx;
        right: 27rpx;
      }
    }

    .form-item {
      width: 627rpx;
      margin-bottom: 58rpx;

      .form-item-label {
        font-size: 40rpx;
        font-family: SourceHanSansCN-Bold, SourceHanSansCN;
        font-weight: bold;
        color: #0e0e0e;
        line-height: 60rpx;
        margin-bottom: 25rpx;
      }

      .form-item-control {
        width: 627rpx;
        height: 123rpx;
        box-sizing: border-box;
        background: #f1eeff;
        border-radius: 7px;

        &.form-item-select {
          display: flex;
          align-items: center;
          padding: 0 20rpx;

          .form-item-select-icon {
            width: 77rpx;
            height: 71rpx;
            margin-right: 22rpx;
          }

          .form-item-select-label {
            flex: 1;
            font-family: SourceHanSansCN-Bold, SourceHanSansCN,
              PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #000000;
          }
        }

        &.form-item-inputNumber {
          display: flex;
          align-items: center;
          padding: 0 42rpx;

          .form-item-inputNumber-value {
            flex: 1;
            font-size: 45rpx;
            font-family: SourceHanSansCN-Bold, SourceHanSansCN,
              PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #000000;
          }

          .form-item-inputNumber-btn {
            font-size: 36rpx;
            font-family: SourceHanSansCN-Bold, SourceHanSansCN,
              PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #d841ff;
          }
        }
      }

      .form-item-tip {
        margin-top: 11rpx;
        display: flex;
        // align-items: center;
        justify-content: space-between;
        font-size: 29rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0e0e0e;
        line-height: 40rpx;
        // .form-item-tip-left {
        // 	max-width: 50%;
        // }
        // .form-item-tip-right {
        // 	max-width: 50%;
        // }
      }
    }

    .body-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      margin-top: 89rpx;
      margin-bottom: 58rpx;
      height: 101rpx;

      image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        width: 632rpx;
        height: 101rpx;
      }

      text {
        position: relative;
        z-index: 9;
        font-size: 36rpx;
        color: #ffffff;
        font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
      }
    }

    .body-btn-tip {
      width: max-content;
      margin: 0 auto;
      text-align: left;
      font-size: 22rpx;
      color: #0e0e0e;
      line-height: 31rpx;

      .blod {
        font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
      }

      .txt {
        color: #666;
      }
    }
  }
}
</style>
