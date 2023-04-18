<script>
import { getUserInfo, setUserInfo, getEmToken } from "@/config/auth";
import { getWalletBalanceInfo as fetchWalletBalanceInfo } from "@/api/wallet";
import { getWallet } from "@/config/wallet";
import { WebIMListen } from '@/config/listen';
import { viewContractService } from "@/api/viewContractService.js";
import { LANG_MAP } from "@/locale";

let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);

export default {
  onLaunch: function () {
    let me = this;
    // #ifdef APP-PLUS
    setTimeout(() => {
      plus.navigator.closeSplashscreen();
    }, 2000);
    // #endif

    this.globalData.$t = val => {
      return this.$t(val);
    };
   
    let langApi = uni.getStorageSync("lang") || "";
    !langApi && uni.setStorageSync("lang", "en_US");
    console.log("langApi", langApi, uni.getLocale(),);
    // let langUniapp = LANG_MAP[langApi]
    // uni.setLocale(langUniapp)

    uni.onLocaleChange((e) => {
      console.log("onLocaleChange", e);
      uni.setStorageSync("lang", LANG_MAP[e.locale]);
    });

    this.hideTabBar();
    WebIMListen();
    this.globalData.wallet = getWallet()
    this.globalData.getWalletBalanceInfo();
  },
  onShow: function () {
    const userInfo = getUserInfo();
    const emToken = getEmToken();
    if (userInfo.userCode && emToken && !WebIM.conn.isOpened()) {
      WebIM.conn.open({
        accessToken: emToken,
        user: userInfo.userCode,
      });
    }
    this.hideTabBar();
  },
  onHide: function () {
    console.log("App Hide");
  },
  globalData: {
    userInfo: getUserInfo(),
    walletBalanceInfo: [],
    walletAssetsInfo: {},
    getWalletBalanceInfo() {
      const me = this;
      const { address } = this.wallet || {};
      if (!address) {
        setTimeout(() => {
          uni.$emit("updateWalletBalanceInfo", { data: [], walletAssetsInfo: {} });
        }, 1000);
        return;
      };
      console.log('adress', address);
      viewContractService({ module: 'routel', func: 'assets', args: [address] }).then(res => {
        const [
          uid,
          fid,
          grade,
          user_apt,
          user_dat3,
          account_apt,
          claimable_dat3,
          claimed_dat3,
        ] = res.data || [];
        const walletAssetsInfo = {
          uid,
          fid,
          grade,
          user_apt,
          user_dat3,
          account_apt,
          claimable_dat3,
          claimed_dat3,
        };
        me.walletAssetsInfo = walletAssetsInfo;
        setTimeout(() => {
          uni.$emit("updateWalletBalanceInfo", { data: [], walletAssetsInfo });
        }, 1000);
      });
    },
    wallet: null
  },
  methods: {
    hideTabBar() {
      uni.hideTabBar({
        success() {
          console.log("hideTabBar:success");
        },
        fail() {
          console.log("hideTabBar:fail");
        },
      });
    },
  },
};
</script>

<style>
@import "./common/uni.css";
@import "./common/reset.scss";
</style>
