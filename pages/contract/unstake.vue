<template>
  <view class="container">
    <view
      id="renderJS"
      class="renderJS"
      :event="event"
      :change:event="renderJS.handleEvent"
    ></view>
    <view class="info-card">
      <view class="info-card-body">
        <view class="info-card-body-left">
          <view class="info-card-body-left-title">{{ $t('contract.yourStaking') }}</view>
          <view class="info-card-body-left-type">
            <image src="/static/dat3-icon.png"></image>
            <text>{{$utilWithVue.formatDat3(current_staking, 6)}}</text>
          </view>
        </view>
        <view class="info-card-body-right">
          <custom-btn :onClick="unstake" :disabled="!current_staking || current_staking == '0' || !overEndTime">{{ $t('contract.unstake') }}</custom-btn>
        </view>
      </view>
      <view class="info-card-footer">
        <view class="info-card-footer-left">
          <image src="/static/aptos-wallet/unlocked-icon.png"></image>
          <text> {{ $t('contract.unlockIn') }} {{ $utilWithVue.getStakingEnd(start, duration) }}</text>
        </view>
      </view>
    </view>
    <!-- confirm modal -->
    <custom-confirm-modal 
      ref="unstakeConfirmPopup" 
      :title="$t('common.confirm')"
      @confirm="unstakeConfirm"
      @cancel="unstakeCancel"
    >
      <view class="confirm-popup-content">
        <view class="list">
          <view class="item">
            <text class="label">$DAT3_beta</text>
            <text class="value">{{ $utilWithVue.formatDat3(current_staking, 6) }}</text>
          </view>
        </view>
        <view class="des">
          <text>{{ $t('contract.unStackTip') }}</text>
          {{ ' ' }}
          <text class="keynote">10%</text>
        </view>
      </view>
    </custom-confirm-modal>
  </view>
</template>

<script module="renderJS" lang="renderjs">
  import { contractService } from "@/api/contract";
  import { getSimpleUni } from "@/utils/simpleUni";
	export default {
		data() {
      return {}
		},
    created() {
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
        const { payload, loading = true } = event;
        const simpleUni = getSimpleUni(this);
        loading && simpleUni.showLoading({ mask: true });
        try {
          const res = await contractService({ ...payload });
          loading && simpleUni.hideLoading();
          this.$ownerInstance.callMethod('eventCallBack', { ...event, res, err: null });
        } catch (err) {
          simpleUni.showToast({
            title: err.message,
            icon: 'none'
          });
          loading && simpleUni.hideLoading();
          this.$ownerInstance.callMethod('eventCallBack', { ...event, res: null, err });
        }
      },
		}
	}
</script>

<script>
  import { viewContractService } from "@/api/viewContractService";
	export default {
		data() {
			return {
        current_staking: 0,
        start: null,
        duration: null,
        event: {},
        wallet: {},
			};
		},
    created() {
      this.wallet = getApp().globalData.wallet || {};
      this.viewYourStaking();
    },
    computed: {
      overEndTime() {
        const endTime = this.$utilWithVue.getStakingEndTime(this.start, this.duration);
        const nowTime = new Date().getTime();
        return nowTime > endTime;
      }
    },
		methods: {
      eventCallBack({ type, payload, res, err }) {
        this.event = {};
        switch (type) {
          default:
            if (!err) {
              this.unstakeCancel();
              this.viewYourStaking();
              getApp().globalData.getWalletBalanceInfo();
            }
            break;
        }
      },
      unstake() {
        this.$refs.unstakeConfirmPopup.open();
      },
      unstakeConfirm() {
        this.event = {
          type: 'withdraw',
          payload: { module: 'stake', func: 'withdraw', args: [], code: this.wallet.code }
        };
      },
      unstakeCancel() {
        this.$refs.unstakeConfirmPopup.close();
      },
      async viewYourStaking() {
        const res = await viewContractService({ module: 'stake', func: 'your_staking', args: [this.wallet.address] });
        const [
          current_staking, 
          duration, 
          flexible, 
          current_rewards, 
          start, 
          boost, 
          total_staking,
          all_simulate_reward, 
          roi, 
          apr, 
          vedat3
        ] = res.data || [];
        this.current_staking = current_staking;
        this.duration = duration;
        this.start = start;
      },
		}
	}
</script>

<style lang="scss" scoped>
.container {
  .renderJS {
    display: none;
  }
  .info-card {
    background: #F1EEFF;
    border-radius: 7rpx;
    margin-bottom: 16rpx;
    .info-card-body {
      padding: 36rpx 20rpx 33rpx 33rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .info-card-body-left {
        .info-card-body-left-title {
          font-size: 25rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #000000;
          line-height: 36rpx;
          margin-bottom: 12rpx;
        }
        .info-card-body-left-type {
          display: flex;
          align-items: center;
          &>image {
            width: 43rpx;
            height: 40rpx;
            margin-right: 12rpx;
          }
          &>text {
            font-size: 29rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 40rpx;
          }
        }
      }
      .info-card-body-right {
        display: flex;
        flex-direction: column;
        align-items: end;
        .info-card-footer-right-des {
          font-size: 25rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #8F8F8F;
          line-height: 36rpx;
          margin-bottom: 12rpx;
        }
        .info-card-body-right-value {
          font-size: 33rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 45px;
        }
      }
    }
    .info-card-footer {
      border-top: 1px solid #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16rpx 20rpx 16rpx 33rpx;
      .info-card-footer-left {
        display: flex;
        align-items: center;
        image {
          width: 27rpx;
          height: 29rpx;
          margin-right: 9rpx;
        }
        text {
          font-size: 25rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 36rpx;
        }
      }
      .info-card-footer-right {
        display: flex;
        align-items: center;
        gap: 14rpx;
        .info-card-footer-right-value {
          font-size: 33rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 45rpx;
        }
      }
    }
  }
}

.confirm-popup-content {
  .list {
    background: #F1EEFF;
    border-radius: 7px;
    padding: 33rpx;
    margin-top: 27rpx;
    margin-bottom: 27rpx;
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
  .des {
    font-size: 25rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #393939;
    line-height: 43rpx;
    .keynote {
      color: #D841FF;
    }
  }
}
</style>
