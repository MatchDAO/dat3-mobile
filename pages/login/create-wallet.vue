<template>
  <view class="container">
    <view
      :inputMnemonic="inputMnemonic"
      :change:inputMnemonic="renderjs.updateInputMnemonic"
      :mnemonic="mnemonic"
      :change:mnemonic="renderjs.updateMnemonic"
      id="renderjs"
      class="renderjs"
    ></view>
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :title="$t('wallet.createWallet')"
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
      <view class="remember-wrapper" v-if="!hasRemember">
        <view class="remember-content">
          <view class="rememberTip">{{$t('wallet.rememberTip')}}</view>
          <view class="mnemonic-list">
            <view
              class="mnemonic-item"
              v-for="(item, index) in mnemonicList"
              :key="index"
            >{{index+1}}. {{item}}</view>
          </view>
        </view>
        <view class="body-btn" @tap="onRemember">
          <image src="/static/my/btn-middle.png" mode />
          <text>{{ $t("wallet.rememberIt") }}</text>
        </view>
      </view>
      <view class="form-wrapper" v-if="hasRemember">
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
        <view class="body-btn" @tap="renderjs.confirm">
          <image
            :src="`/static/my/btn-${inputMnemonic === mnemonic ? 'middle' : 'disabled'}.png`"
            mode
          />
          <text>{{ $t("wallet.confirm") }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script module="renderjs" lang="renderjs">
import { apis} from "@/api/contract.js"
const aptosWeb3 = require('@martiandao/aptos-web3-bip44.js');

	export default {
		data() {
			return {
				_inputMnemonic: '',
				_mnemonic: ''
			}
		},
		created() {
			this.genMnemonic();
		},
		methods: {
			updateInputMnemonic(val) {
				this._inputMnemonic = val;
			},
			updateMnemonic(val) {
				this._mnemonic = val;
			},
			async genMnemonic() {
				const wallet = await apis.createWallet();
				console.log('', wallet);
				let mnemonic = wallet.code;
			
				this.$ownerInstance.callMethod('changeMnemonic', mnemonic);

			},
			async confirm() {
				let me = this;
				if (me._inputMnemonic !== me._mnemonic) {
					return;
				}
				me.$ownerInstance.callMethod('showLoading');
				try {
					const wallet = await apis.importWallet(me._mnemonic);
					const account = await aptosWeb3.WalletClient.getAccountFromMetaData(wallet.code, wallet.accounts[0]);
					console.log('1', account);
					me.$ownerInstance.callMethod('sign',{
						...wallet,
					});
				} catch (error) {
					console.log('error', error);
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
      hasRemember: false,
      mnemonic: "",
      invitationCode: null,
      wallet: null, // 
      autoFill: false
    };
  },
  computed: {
    mnemonicList() {
      if (!this.mnemonic) {
        return [];
      }
      const list = this.mnemonic.split(" ");
      return list;
    }
  },
  onLoad(options) {
    this.autoFill = options.autoFill === 'Y';
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1
      });
    },
    onRemember() {
      this.hasRemember = true;
      if (this.autoFill) {
        this.inputMnemonic = this.mnemonic;
      }
    },
    changeMnemonic(mnemonic) {
      this.mnemonic = mnemonic;
    },

    showInvitationPopup(wallet) {
      this.wallet = wallet;
      this.$refs["invitationPopup"].open();
    },
    // 
   
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
          // WebIM
          if (WebIM.conn.isOpened()) {
            WebIM.conn.close();
          }
          //  app 
          WebIM.conn.open({
            accessToken: userInfo.emToken,
            user: userInfo.userCode
          });

					let me = this
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
    showToast(opt) {
      uni.showToast(opt);
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
    .remember-wrapper {
      .remember-content {
        margin-bottom: 58rpx;
        width: 627rpx;
        box-sizing: border-box;
        background: #f1eeff;
        border-radius: 7rpx;
        padding: 54rpx 36rpx;
        .rememberTip {
          font-size: 25rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
        }
        .mnemonic-list {
          font-size: 29rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #000000;
          line-height: 60rpx;
          text-align: center;
          margin-top: 42rpx;
          .mnemonic-item {
          }
        }
      }
    }
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
