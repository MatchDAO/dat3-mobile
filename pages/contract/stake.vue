<template>
  <view class="container">
    <view
      id="renderJS"
      class="renderJS"
      :event="event"
      :change:event="renderJS.handleEvent"
    ></view>
    <view class="container-info">
      <view class="container-info-header">
        <text class="container-info-header-left">{{$t('contract.stake')}} $DAT3</text>
        <text class="container-info-header-right">{{$t('contract.apr')}} {{$utilWithVue.formatApr(apr)}}%</text>
      </view>
      <view class="info-card">
        <view class="info-card-body">
          <view class="info-card-body-left">
            <view class="info-card-body-left-title">{{ $t('contract.yourStaking') }}</view>
            <view class="info-card-body-left-type">
              <image src="/static/dat3-icon.png"></image>
              <text>DAT3</text>
            </view>
          </view>
          <view class="info-card-body-right">
            <text class="info-card-body-right-value">{{$utilWithVue.formatDat3(current_staking, 6)}}</text>
          </view>
        </view>
        <view class="info-card-footer">
          <view class="info-card-footer-left">{{ $t('contract.boost') }}: {{$utilWithVue.formatBoost(boost)}}x</view>
          <view class="info-card-footer-right">
            <custom-btn :disabled="!walletAssetsInfo.user_dat3 || walletAssetsInfo.user_dat3 == '0'" :onClick="add">{{ $t('contract.add') }}</custom-btn>
            <custom-btn :disabled="!isAdded" :onClick="extend">{{ $t('contract.extend') }}</custom-btn>
          </view>
        </view>
      </view>
      <view class="info-card">
        <view class="info-card-body">
          <view class="info-card-body-left">
            <view class="info-card-body-left-title">{{ $t('contract.rewards') }}</view>
            <view class="info-card-body-left-type">
              <image src="/static/dat3-icon.png"></image>
              <text>DAT3</text>
            </view>
          </view>
          <view class="info-card-body-right">
            <custom-btn :disabled="!isAdded || !current_rewards || current_rewards == '0'" :onClick="claim">{{ $t('contract.claim') }}</custom-btn>
          </view>
        </view>
        <view class="info-card-footer">
          <view class="info-card-footer-left">{{ $t('contract.claimable') }}</view>
          <view class="info-card-footer-right">
            <text class="info-card-footer-right-value">{{ $utilWithVue.formatDat3(current_rewards) }}</text>
          </view>
        </view>
      </view>
      <view class="info-card">
        <view class="info-card-body">
          <view class="info-card-body-left">
            <view class="info-card-body-left-title">{{ $t('contract.governance') }}</view>
            <view class="info-card-body-left-type">
              <image src="/static/vedat3-icon.png"></image>
              <text>veDAT3</text>
            </view>
          </view>
          <view class="info-card-body-right">
            <text class="info-card-footer-right-des">{{ $t('contract.comingSoon') }}</text>
            <text class="info-card-footer-right-value">{{ $utilWithVue.formatVedat3(vedat3) }}</text>
          </view>
        </view>
      </view>

    </view>
    <view class="container-total">
      <view class="container-total-left">{{$t('contract.totalStaking')}}</view>
      <view class="container-total-right">
        <image src="/static/dat3-icon.png"></image>
        <text>{{ $utilWithVue.formatDat3(total_staking, 6) }}</text>
      </view>
    </view>
    <custom-confirm-modal 
      ref="claimConfirmPopup" 
      :title="$t('common.confirm')"
      @confirm="claimConfirm"
      @cancel="claimCancel"
    >
      <view class="confirm-popup-content">
        <view class="des">{{ $t('contract.claimStakeRewards') }}</view>
        <view class="list">
          <view class="item">
            <text class="label">$DAT3_beta</text>
            <text class="value">{{ current_rewards }}</text>
          </view>
          <view class="item">
            <text class="label">{{ $t('contract.gasFee') }}</text>
            <text class="value">{{ $utilWithVue.formatAptos(gasFeeInfo.gas_estimate, { fixed: 6 }) }} APT</text>
          </view>
        </view>
      </view>
    </custom-confirm-modal>
    <custom-confirm-modal 
      ref="stakingConfirmPopup" 
      @confirm="confirmStaking"
      @cancel="cancelStaking"
    >
      <view class="confirm-popup-content">
        <view class="des">{{ $t('contract.claimStakeRewards') }}</view>
        <view class="list">
          <view class="item">
            <text class="label">$DAT3_beta</text>
            <text class="value">{{ formValues.staking || '0' }}</text>
          </view>
          <view class="item">
            <text class="label">{{ $t('contract.duration') }}</text>
            <text class="value">{{ formatDuration(formValues.duration) || '-' }}</text>
          </view>
          <view class="item">
            <text class="label">{{ $t('contract.gasFee') }}</text>
            <text class="value">{{ $utilWithVue.formatAptos(gasFeeInfo.gas_estimate, { fixed: 6 }) }} APT</text>
          </view>
        </view>
      </view>
    </custom-confirm-modal>
    <!--  -->
    <w-popup-dialog
      ref="stakingInPoolPopup"
			:popupContentStyle="{ padding: '0', background: 'transparent' }"
      @close="resetStaking"
    >
      <view class="dialog-wrapper">
        <image class="dialog-wrapper-bg" src="/static/home/report-dialog-bg.png"></image>
        <view class="dialog-content">
          <view class="title">{{ $t('contract.stakingInPool') }}</view>
          <scroll-view class="form-wapper-scroll-view" scroll-y>
            <view class="form-wapper">
              <view class="form-item">
                <view class="form-item-header">
                  <view class="form-item-header-left">{{ $t('contract.staking') }}</view>
                  <view class="form-item-header-right">
                    <image src="/static/dat3-icon.png"></image>
                    <text>DAT3</text>
                  </view>
                </view>
                <block v-if="actionType !== 'extend'">
                  <view class="form-item-body">
                    <input type="number" v-model="formValues.staking"/>
                  </view>
                  <view class="form-item-footer">
                    <view class="form-item-footer-left"></view>
                    <view class="form-item-footer-right">{{ $t('contract.balance') }}: {{ $utilWithVue.formatDat3(walletAssetsInfo.user_dat3, 2) }}</view>
                  </view>
                </block>
              </view>
              <view class="form-item" v-if="!isAdded || actionType === 'extend'">
                <view class="form-item-header">
                  <view class="form-item-header-left">{{ $t('contract.duration') }}</view>
                  <view class="form-item-header-right"></view>
                </view>
                <view class="form-item-body">
                  <view class="checkbox">
                    <view
                      class="checkbox-item"
                      v-for="(durationOption, index) in durationOptions"
                      :key="index"
                      :class="{active: durationOption.value === formValues.duration}"
                      @tap="changeDurationVal(durationOption.value)"
                    >
                      <image v-if="durationOption.value !== formValues.duration" :src="'/static/aptos-wallet/checkbox-item-bg.png'"></image>
                      <image v-if="durationOption.value === formValues.duration" :src="'/static/aptos-wallet/checkbox-item-active-bg.png'"></image>
                      <text>{{ durationOption.label }}</text>
                    </view>
                  </view>
                </view>
              </view>
              <view class="form-item">
                <view class="form-item-header">
                  <view class="form-item-header-left">{{ $t('contract.lockedRewards') }}</view>
                  <view class="form-item-header-right"></view>
                </view>
                <view class="form-item-body">
                  <view class="locked-rewards-info">
                    <view class="locked-rewards-info-item">
                      <view class="locked-rewards-info-item-label">veDAT3 </view>
                      <view class="locked-rewards-info-item-value">{{  $utilWithVue.formatVedat3(lockedRewards.vedat3) || 0 }}</view>
                    </view>
                    <view class="locked-rewards-info-item">
                      <view class="locked-rewards-info-item-label">{{ $t('contract.apr') }} </view>
                      <view class="locked-rewards-info-item-value">{{ $utilWithVue.formatApr(lockedRewards.apr) }}%</view>
                    </view>
                    <view class="locked-rewards-info-item">
                      <view class="locked-rewards-info-item-label">{{ $t('contract.duration') }} </view>
                      <view class="locked-rewards-info-item-value">{{ formatDuration(lockedRewards.duration) || '-' }}</view>
                    </view>
                    <view class="locked-rewards-info-item">
                      <view class="locked-rewards-info-item-label">{{ $t('contract.yieldBoost') }} </view>
                      <view class="locked-rewards-info-item-value">{{ $utilWithVue.formatBoost(lockedRewards.boost) }}x</view>
                    </view>
                    <view class="locked-rewards-info-item">
                      <view class="locked-rewards-info-item-label">{{ $t('contract.unlockOn') }} </view>
                      <view class="locked-rewards-info-item-value">{{ $utilWithVue.getStakingEnd(lockedRewards.start, lockedRewards.duration) }}</view>
                    </view>
                    <view class="locked-rewards-info-item">
                      <view class="locked-rewards-info-item-label">{{ $t('contract.expectedROI') }} </view>
                      <view class="locked-rewards-info-item-value">{{ $utilWithVue.formatRoi(lockedRewards.remaining_time_roi) }}</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
          <view class="footer">
            <custom-btn
              width="509rpx"
              height="101rpx"
              fontSize="36rpx"
              bgImageSrc="/static/my/btn-middle.png"
              :onClick="openStakingConfirmPopup"
            >
              {{ $t('common.confirm') }}
            </custom-btn>
          </view>
        </view>
      </view>
		</w-popup-dialog>
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
        const { payload, showLoading = true } = event;
        const simpleUni = getSimpleUni(this);
        showLoading && simpleUni.showLoading({ mask: true });
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
  import { viewContractService, getGasFee } from "@/api/viewContractService";

	export default {
		data() {
			return {
        event: {},
        actionType: '',
        isAdded: false,
        durationOptions: [],
        boost: 0,
        apr: 0,
        roi: 0,
        total_staking: 0,
        current_staking: 0,
        current_rewards: 0,
        vedat3: 0,
        walletAssetsInfo: {},
        formValues: {
          staking: '',
          duration: '0',
        },
        lockedRewards: {},
        gasFeeInfo: {},
        wallet: {}
			};
		},
    created() {
      this.wallet = getApp().globalData.wallet || {};
      this.walletAssetsInfo = getApp().globalData.walletAssetsInfo || {};
      this.viewPoolInfo();
      this.viewYourStaking();
      this.fetchGasFee()
      this.emitData();
    },
    watch: {
      formValues: {
				handler: function(val, oldVal) { 
          this.viewLockedRewards();
        },
				deep: true
			}
    },
		methods: {
      emitData() {
				let me = this;
				uni.$on('updateWalletBalanceInfo', function({ data, walletAssetsInfo }){
					me.walletAssetsInfo = walletAssetsInfo;
				})
			},
      async fetchGasFee() {
        const res = await getGasFee()
        this.gasFeeInfo = res.data || {};
      },
      formatDuration(duration) {
        const item = this.durationOptions.find(it => it.value == duration) || {};
        return item.label || duration || '';
      },
      eventCallBack({ type, payload, res, err }) {
        this.event = {};
        switch (type) {
          case 'claim': 
            if (!err) {
              this.claimCancel();
              this.viewYourStaking();
              getApp().globalData.getWalletBalanceInfo();
            }
            break;
          default:
            if (!err) {
              this.cancelStaking();
              this.viewYourStaking();
              getApp().globalData.getWalletBalanceInfo();
            } 
            break;
        }
      },
      async viewPoolInfo() {
        const res = await viewContractService({ module: 'stake', func: 'pool_info', args: [] });
        const [ total_staking, rewardsTotal, boost, boostDot, maxDuration ] = res.data || [];
        this.durationOptions = [
          { label: 'flexible', value: '0' },
          { label: '1W', value: '1' },
          { label: '5W', value: '5' },
          { label: '10W', value: '10' },
          { label: '25W', value: '25' },
          { label: 'Max', value: maxDuration },
        ];
      },
      async viewLockedRewards() {
        const { staking, duration } = this.formValues || {};
        const stakingVal = this.$utilWithVue.dat3ToValue(staking);
        if (this.actionType !== 'extend' && (stakingVal == '0' || !stakingVal)) {
          this.lockedRewards = {}
          return;
        }
        if (this.isAdded) {
          const res = await viewContractService({ module: 'stake', func: 'your_staking_more', args: [this.wallet.address, stakingVal, duration] });
          this.getLockedRewardsByApr(res);
        } else {
          const flexible = !duration || duration == '0';
          const res = await viewContractService({ module: 'stake', func: 'apr', args: [stakingVal, duration, flexible] });
          this.getLockedRewardsByApr(res);
        }
      },
      getLockedRewardsByApr(res) {
        const [ 
          staking, 
          duration, 
          flexible, 
          current_rewards, 
          start, 
          boost,
          all_simulate_reward, 
          total_staking, 
          remaining_time_roi, 
          apr, 
          remaining_time_vedat3,
          vedat3
        ] = res.data || {};
        this.lockedRewards = {
          staking, 
          duration, 
          flexible, 
          current_rewards, 
          start, 
          boost,
          all_simulate_reward, 
          total_staking,
          remaining_time_roi, 
          apr, 
          remaining_time_vedat3,
          vedat3
        };
      },
      async viewYourStaking() {
        const res = await viewContractService({ module: 'stake', func: 'your_staking', args: [this.wallet.address], showLoading: true });
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
          remaining_time_vedat3,
          vedat3
        ] = res.data || [];
        this.current_staking = current_staking;
        this.current_rewards = current_rewards;
        this.total_staking = total_staking;
        this.boost = boost;
        this.apr = apr;
        this.roi = roi;
        this.vedat3 = vedat3;
        this.isAdded = current_staking && current_staking != '0';
      },
      claim() {
        this.$refs.claimConfirmPopup.open();
      },
      claimConfirm() {
        this.event = {
          type: 'claim',
          payload: { module: 'stake', func: 'claim', args: [], code: this.wallet.code }
        };
      },
      claimCancel() {
        this.$refs.claimConfirmPopup.close();
      },
      add() {
        this.actionType = 'add';
        this.openStakingInPoolPopup();
      },
      extend() {
        this.actionType = 'extend';
        this.openStakingInPoolPopup();
      },
      openStakingInPoolPopup() {
        this.$refs.stakingInPoolPopup.open();
      },
      resetStaking() {
        this.actionType = '';
        this.formValues = {
          staking: '',
          duration: '0',
        };
      },
      changeDurationVal(val) {
        this.formValues.duration = val;
      },
      cancelStaking() {
        this.$refs.stakingConfirmPopup.close();
        this.resetStaking();
      },
      openStakingConfirmPopup() {
        if (this.actionType === 'add' && !this.formValues.staking || this.formValues.staking == '0') {
          uni.showToast({
            title: 'Please check the form',
            icon: 'none'
          });
          return;
        }  
        this.$refs.stakingInPoolPopup.close();
        this.$refs.stakingConfirmPopup.open();
      },
      async confirmStaking() {
        if (this.actionType === 'add') {
          if (this.isAdded) {
            this.event = {
              type: 'more_stake',
              payload: { module: 'stake', func: 'more_stake', args: [this.$utilWithVue.dat3ToValue(this.formValues.staking)], code: this.wallet.code }
            };
          } else {
            this.event = {
              type: 'deposit',
              payload: { module: 'stake', func: 'deposit', args: [this.$utilWithVue.dat3ToValue(this.formValues.staking), this.formValues.duration], code: this.wallet.code }
            };
          }
        } else if (this.actionType === 'extend') {
          this.event = {
            type: 'more_duration',
            payload: { module: 'stake', func: 'more_duration', args: [this.formValues.duration], code: this.wallet.code }
          };
        }
      }
		}
	}
</script>

<style lang="scss" scoped>
.container {
  .renderJS {
    display: none;
  }
	.container-info {
    background: #F1EEFF;
    border-radius: 7rpx;
    padding: 36rpx 42rpx 49rpx 45rpx ;
    margin-bottom: 13rpx;
    .container-info-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 33rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 45rpx;
      margin-bottom: 29rpx;
    }
    .info-card {
      background: #fff;
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
        border-top: 1px solid #F1EEFF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16rpx 20rpx 16rpx 33rpx;
        .info-card-footer-left {
          font-size: 29rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 40rpx;
        }
        .info-card-footer-right {
          display: flex;
          align-items: center;
          *:not(:nth-child(1)) {
            margin-left: 14rpx;
          }
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
  .container-total {
    background: #F1EEFF;
    border-radius: 7rpx;
    padding: 33rpx 53rpx;
    margin-bottom: 64rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .container-total-left {
      font-size: 29rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 40rpx;
    }
    .container-total-right {
      display: flex;
      align-items: center;
      image {
        width: 43rpx;
        height: 40rpx;
        margin-right: 14rpx;
      }
      text {
        font-size: 33rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
        line-height: 45rpx;
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
    background: #F1EEFF;
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

.dialog-wrapper {
  position: relative;
  width: 634rpx;
  height: 1100rpx;
  .dialog-wrapper-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 634rpx;
    height: 1100rpx;
  }
  .dialog-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 634rpx;
    height: 1100rpx;
    padding: 76rpx 0;
    box-sizing: border-box;
    & > .title {
      font-size: 38rpx;
      font-weight: 600;
      color: #000000;
      text-align: center;
      font-family: PingFangSC-Semibold, PingFang SC;
    }
    .form-wapper-scroll-view {
      max-height: 820rpx;

      .form-wapper {
        padding: 60rpx 42rpx 43rpx 54rpx;
        /* height: 720rpx; */
        /* box-sizing: border-box; */
        width: 534rpx;
        overflow-y: auto;
        .form-item {
          margin-bottom: 16rpx;
  
          .form-item-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12rpx;
            .form-item-header-left {
              display: flex;
              align-items: center;
              font-size: 29rpx;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #000000;
              line-height: 40rpx;
            }
            .form-item-header-right {
              display: flex;
              align-items: center;
              font-size: 29rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #000000;
              line-height: 40rpx;
              &>image {
                width: 49rpx;
                height: 45rpx;
                margin-right: 16rpx;
              }
            }
          }
  
          .form-item-body {
            margin-bottom: 12rpx;
            input {
              background: #F1EEFF;
              border-radius: 22rpx;
              height: 94rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #000000;
              text-align: right;
              padding: 0 40rpx;
            }
            .checkbox {
              display: flex;
              align-items: center;
              justify-content: start;
              flex-wrap: wrap;
              .checkbox-item {
                width: 141rpx;
                height: 49rpx;
                position: relative;
                text-align: center;
                font-size: 22rpx;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #232323;
                line-height: 49rpx;
                margin: 0 20rpx 20rpx 0;
                &.active {
                  color: #fff;
                }
                &>image {
                  width: 141rpx;
                  height: 49rpx;
                  position: absolute;
                  top: 0;
                  right: 0;
                }
                &>text {
                  position: relative;
                  top: 0;
                  right: 0;
                  text-align: center;
                }
              }
            }
            .locked-rewards-info {
              background: #F1EEFF;
              border-radius: 22px;
              padding: 24rpx 36rpx 24rpx 25rpx;
              .locked-rewards-info-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 22rpx;
                .locked-rewards-info-item-label {
                  font-size: 29rpx;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: #7658FF;
                  line-height: 40rpx;
                  opacity: 0.51;
                }
                .locked-rewards-info-item-value {
                  font-size: 29rpx;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #000000;
                  line-height: 40rpx;
                }
              }
            }
          }
  
          .form-item-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .form-item-footer-left {}
            .form-item-footer-right {
              font-size: 29rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #000000;
              line-height: 40rpx;
            }
          }
        }
      }
    }

    & > .footer {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
