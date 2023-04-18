<template>
  <view class="container">
    <view
      :inputMnemonic="inputMnemonic"
      :change:inputMnemonic="renderjs.updateInputMnemonic"
      id="renderjs"
      class="renderjs"
      :event="event"
      :change:event="renderjs.handleEvent"
    ></view>
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :title="$t('wallet.importWallet')"
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
      <view class="form-wrapper">
        <view class="form-item">
          <view class="form-item-label">{{$t('wallet.seedPhrase')}}</view>
          <view class="form-item-tip">{{$t('wallet.seedPhraseTip')}}</view>
          <view class="form-item-value">
            <textarea
              :maxlength="1000"
              v-model="inputMnemonic"
              :placeholder="$t('wallet.seedPhrasePlaceholder')"
              :controlled="true"
            />
          </view>
        </view>
        <view class="body-btn" @tap="renderjs.onImport">
          <image :src="`/static/my/btn-${inputMnemonic ? 'middle' : 'disabled'}.png`" />
          <text>{{ $t("wallet.confirm") }}</text>
        </view>
      </view>
    </view>
    
  </view>
</template>

<script module="renderjs" lang="renderjs">
import { apis} from "@/api/contract.js"
// import { viewContractService } from "@/api/contract";
const aptosWeb3 = require('@martiandao/aptos-web3-bip44.js');
	export default {
		data() {
			return {
				_inputMnemonic: '',
			}
		},
		async created() {
		
		},
		methods: {
      handleEvent(event) {
        if (!event.type) return;
        switch (event.type) {
          case 'onImport':
            this.onImport();
            break;
          default:
            break;
        }
			},
			updateInputMnemonic(val) {
				this._inputMnemonic = val;
			},
			async onImport() {
				// return this.test();
				let me = this;
				if (!me._inputMnemonic) {
					return;
				}
				me.$ownerInstance.callMethod('showLoading');
				try {
					const wallet = await apis.importWallet(me._inputMnemonic);
					console.log('wallet', wallet);
					const account = await aptosWeb3.WalletClient.getAccountFromMetaData(
						wallet.code,
						wallet.accounts[0]
					);
					console.log('account', account);
					me.$ownerInstance.callMethod('sign',{
						...wallet
					});
				} catch (error) {
          me.$ownerInstance.callMethod('hideLoading');
					me.$ownerInstance.callMethod('confirmError', error && error.message);
				}
			}
		}
	}
</script>

<script>
import { loginRegisterV1 } from "@/api/login";
import { setUserInfo, setToken, setEmToken } from "@/config/auth";
import { setWallet, getWallet } from "@/config/wallet";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
export default {
  data() {
    return {
      inputMnemonic: "",
      invitationCode: null,
      wallet: null, // 
      autoFill: false,
      event: {}
    };
  },
  onLoad(options) {
    this.autoFill = options.autoFill === 'Y';
    if (this.autoFill) {
      const inputMnemonic = 'awkward vendor bird thunder session topic view infant jewel tumble roast adult';
      this.inputMnemonic = inputMnemonic;
      // setTimeout(() => {
      //   this.event = { type: 'onImport' };
      // }, 300);
    }
  },
  methods: {
		back() {
      uni.navigateBack({
        delta: 1
      });
    },
    sign(wallet) {
      let { address } = wallet.accounts[0];
      let code = wallet.code;
      // 1.(address||publicKey)
      loginRegisterV1({
        account: address,
        ipV4: "112.10.220.33",
      }).then(res => {
        // 2.
        // // ---
        let userInfo = res.data;
        setUserInfo(userInfo);
        // userInfo
        setWallet({ code, address });
        this.hideLoading()
        if (userInfo.firstLogin) {
          uni.navigateTo({
            url: "/pages/login/set-name"
          });
        } else {
          // 
          // tokenuserInfo
          setToken(userInfo.token);
          setEmToken(userInfo.emToken);
      		getApp().globalData.getWalletBalanceInfo();

          // WebIM
          if (WebIM.conn.isOpened()) {
            WebIM.conn.close();
          }
          //  app 
          WebIM.conn.open({
            accessToken: userInfo.emToken,
            user: userInfo.userCode
          });
					let me = this;
          uni.$on("WebIM.onOpened", function([message]) {
            me.autoSendMsg(userInfo);
          });
          // 
          uni.showToast({
            title: this.$t("login.success"),
            icon: "none",
            success: function() {
              uni.switchTab({
                url: "/pages/home/index"
              });
            }
          });
        }
      });
    },
    confirmError(errMsg) {
      uni.showToast({
        title: errMsg,
        icon: "none"
      });
    },
    showLoading() {
      uni.showLoading({
        mask: true
      });
    },
    hideLoading() {
      uni.hideLoading();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  #renderjs {
    display: none;
  }
  .body {
    padding: 58rpx 60rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .form-wrapper {
      .form-item {
        width: 627rpx;
        .form-item-label {
          height: 40rpx;
          font-size: 40rpx;
          font-family: SourceHanSansCN-Bold, SourceHanSansCN;
          font-weight: bold;
          color: #0e0e0e;
          line-height: 60rpx;
          margin-bottom: 25rpx;
        }
        .form-item-tip {
          font-size: 24rpx;
          font-family: SourceHanSansCN-Bold, SourceHanSansCN;
          margin-bottom: 25rpx;
        }
        .form-item-value {
          width: 627rpx;
          height: 399rpx;
          padding: 45rpx 40rpx;
          box-sizing: border-box;
          background: #f1eeff;
          border-radius: 7rpx;
          margin-bottom: 67rpx;
          textarea {
            width: 547rpx;
            font-weight: 100;
          }
        }
      }
    }
    .body-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
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
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
    }
  }
}
</style>
