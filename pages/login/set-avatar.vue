<template>
  <view class="container">
      <view
      :submitSuccess="submitSuccess"
       :change:submitSuccess="renderjs.updateSubmitSuccess" 
      :wallet="wallet"
      :change:wallet="renderjs.updateWallet"
      id="renderjs"
      class="renderjs"
      style="display:none"
    ></view>
    <uni-nav-bar class="header-nav" :fixed="true" status-bar="true" :title="$t('my.profile') + '3/3'"
      background-color="#F9F8FF" @clickLeft="back">
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png" />
        </view>
      </block>
    </uni-nav-bar>
    <view class="info">
      <view class="info-item name">
        <info-item-label :txt="$t('login.avatarTip')" />
        <view class="input" @click="choosePic">
          <image class="icon-upload" v-if="!file" src="/static/login/icon-plus.png" mode />
          <image class="image-url" v-else :src="file" mode="aspectFit" />
        </view>
      </view>
    </view>
    <view class="btn-next btn" @click="save">
      <image :src="`/static/my/btn-${file ? 'middle' : 'disabled'}.png`" mode />
      <!-- <image src="/static/my/btn-middle.png" mode="" /> -->
      <text>{{ $t("login.start") }}</text>
    </view>
  </view>
</template>

<script module="renderjs" lang="renderjs">
  import {contractService, apis, NODE_URL} from "@/api/contract.js"
  const aptosWeb3 = require('@martiandao/aptos-web3-bip44.js');
  import {CoinClient, AptosClient, WalletClient} from '@martiandao/aptos-web3-bip44.js'

  const client = new AptosClient(NODE_URL);
  const coinClient = new CoinClient(client);
  export default {
    data() {
      return {
        _wallet: null,
        _inputMnemonic: '',
        _mnemonic: ''
      }
    },
    mounted() {
      console.log('created');
      console.log('mounted', this._wallet);
      // this.getDetail()
      // this.updateSubmitSuccess()
    },
    methods: {
      updateWallet(val) {
        console.log('updateWallet', val);
        this._wallet = val
      },
      async getDetail() {
        const res = await apis.getBalance(this._wallet.address)
        console.log("checkBalance", res);
      },
      //  
      async updateSubmitSuccess(val) {
        if (val) {
          this.$ownerInstance.callMethod('showLoading');
          try {
            // 
            const res = await apis.getBalance(this._wallet.address)
            // user_init assetsuser_init 
            const hash = await contractService({
              module: 'routel',
              func: 'user_init',
              args: [
                999999999999999, // fid
                123456 //uid
              ],
              code: this._wallet.code
            });
            console.log('user_init hash', hash);
            this.$ownerInstance.callMethod('initSuccess');
          } catch (error) {
            console.log('error', error);
            this.$ownerInstance.callMethod('confirmError', error && error.message);
          }
          this.$ownerInstance.callMethod('hideLoading');
        }
      },
    }
  }
</script>
<script>
  import {setUserInfo, setToken, setEmToken} from "@/config/auth";
  import {registerV1End} from "@/api/login";
  import {viewContractService} from "@/api/viewContractService.js";
  let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
  let app = getApp();

  export default {
    data() {
      return {
        wallet: null,
        userInfo: app.globalData.userInfo,
        userName: null,
        avatarUrl: null,
        file: null,
        gender: null,
        submitSuccess: false,
      };
    },
    computed: {},
    onLoad(options) {
      console.log("globalData", app.globalData);
      this.wallet = app.globalData.wallet;
      this.userName = options.userName;
      this.gender = options.gender;
      // let portrait = this.userInfo.portrait;
      // this.avatarUrl = portrait === "default" ? null : portrait;
      this.initData();
    },
    methods: {
      back() {
        uni.navigateBack({
          delta: 1,
        });
      },
      initData() {
        this.getBalance();
      },
      async getBalance() {
        const info = await viewContractService({
          module: "routel",
          func: "assets",
          args: [this.wallet.address],
        });
        console.log("getBalance", info);
        return info;
      },
      choosePic() {
        uni.chooseImage({
          sizeType: ["compressed"],
          count: 1,
          success: (chooseImageRes) => {
            const tempFilePaths = chooseImageRes.tempFilePaths;
            this.file = tempFilePaths[0];
          },
        });
      },
      initSuccess() {
        uni.showToast({
          title: this.$t("my.saveTip"),
          icon: "none",
          success() {
            uni.switchTab({
              url: "/pages/home/index",
            });
          },
        });
      },
      save() {
        console.log("save:file", this.file);
        if (!this.file) return;

        let fileParam = {
          filePath: this.file,
        };
        uni.showLoading({
          mask: true,
        });
        registerV1End(
          {
            userCode: this.userInfo.userCode,
            userName: this.userName,
            gender: this.gender,
          },
          {...fileParam}
        )
          .then(async (res) => {
            let userInfo = res.data || {};
            setUserInfo({...this.userInfo, ...userInfo});
            // tokenuserInfo
            setToken(userInfo.token);
            setEmToken(userInfo.emToken);
            getApp().globalData.getWalletBalanceInfo();

            if (WebIM.conn.isOpened()) {
              WebIM.conn.updateUserInfo({
                nickname: userInfo.userName,
                avatarurl: userInfo.portrait,
              });
            } else {
              //  app 
              WebIM.conn.open({
                accessToken: userInfo.emToken,
                user: userInfo.userCode,
              });
            }
            // 
            this.initSuccess()
            // let info = await this.getBalance();
            // console.log(info);
            // //  assets
            // this.submitSuccess = true;
          })
          .finally(() => {
            uni.hideLoading();
          });
      },
      confirmError(errMsg) {
        uni.showToast({
          title: errMsg,
          icon: "none",
        });
      },
      showLoading() {
        uni.showLoading({
          mask: true,
        });
      },
      hideLoading() {
        uni.hideLoading();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .container {
    padding: 0 56rpx;

    #renderjs {
      display: none;
    }

    .info {
      padding-top: 120rpx;

      .info-item {
        .input {
          margin-top: 54rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          background: #f1eeff;
          border-radius: 7px;
          line-height: 31rpx;
          font-size: 26rpx;
          color: #0e0e0e;

          image.icon-upload {
            width: 72rpx;
            height: 85rpx;
          }

          .image-url {
            height: 770rpx;
          }
        }

        &.name {
          .input {
            height: 770rpx;
          }
        }
      }
    }

    .btn {
      margin-top: 107rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

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
        font-weight: bold;
        font-family: PingFangSC-Semibold, PingFang SC;
      }
    }
  }
</style>