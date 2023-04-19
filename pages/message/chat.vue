<template>
  <view class="container">
    <view
      id="renderJS"
      class="renderJS"
      :event="event"
      :change:event="renderJS.handleEvent"
      :style="{display: 'none'}"
    ></view>
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :border="false"
      status-bar="true"
      background-color="#F1EEFF"
      @clickLeft="back"
    >
      <block>
        <view class="user-title-wrapper" @tap="goFriendDetailPage">
          <image mode='aspectFill' :src="other.portrait"></image>
          <text>{{other.userName}}</text>
        </view>
      </block>
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
    </uni-nav-bar>
    <scroll-view 
      class="body" 
      scroll-y="true" 
      :scroll-into-view="toView"
      scroll-with-animation="true"
    >
      <view class="message-list">
        <block v-for="(item,index) in list" :key="index">
          <view class="message-item" v-if="!item.isAutoMsg && !item.hide" :class="{isOther: item.isOther}">
            <view class="picture">
              <image @tap="item.isOther && goFriendDetailPage()" mode='aspectFill' :src="item.isOther ? other.portrait : me.portrait"></image>
            </view> 
            <view class="message-box">
              <view class="message-content" :class="{'message-image-content': item.contentsType === 'IMAGE'}">
                <view class="trangle"></view>
                <view class="profit-box" v-if="item.isOther && chatRel === 'receiver' && !item.videoCall">
                  <image src='/static/aptos-icon.png'></image>
                  <text>+{{$utilWithVue.formatAptos(Number(feeInfo.chatFee || 0) * 0.7, 5)}}</text>
                </view>
                <text v-if="item.contentsType === 'TEXT'">{{item.data}}</text>
                <view v-if="item.videoCall" class="videoCall-view">
                  <image src='/static/chat/video-message-icon.png'></image>
                  <text v-if="item.action === 'videoCancel'">{{item.isOther ? $t('chat.videoCall.otherVideoCancel') : $t('chat.videoCall.videoCancel')}}</text>
                  <text v-if="item.action === 'videoReject'">{{item.isOther ? $t('chat.videoCall.otherVideoReject') : $t('chat.videoCall.videoReject')}}</text>
                  <text v-if="item.action === 'videoEnd'">{{$t('chat.videoCall.videoEnd')}}  {{((item.ext || {}).data || {}).showTime}}</text>
                </view>
                <image 
                  mode='aspectFill'
                  @tap="clickImg([item.url])"
                  v-if="item.contentsType === 'IMAGE'" 
                  :src="item.url"
                ></image>
              </view>
            </view> 
          </view>
          <view class="auto-message" v-if="item.isAutoMsg">
            <view>{{$t('chat.autoMsgTitle')}}</view>
            <view>{{$t('chat.autoMsgDes')}}: {{item.data}}</view>
          </view>
        </block>
        <view class="message-item" v-if="extraMsg" id="extraMsg">
          <view class="picture">
            <image mode='aspectFill' :src="me.portrait"></image>
          </view> 
          <view class="message-box">
            <view class="message-content" :class="{'message-image-content': extraMsg.type === 'image'}">
              <view class="trangle"></view>
              <view class="status-icon">
                <image class="loading-icon" v-if="extraMsg.status === 'loading'" src="/static/chat/loading-icon.png"></image>
                <image class="fail-icon" v-if="extraMsg.status === 'fail'" src="/static/chat/fail-icon.png"></image>
              </view>
              <text v-if="extraMsg.type === 'text'">{{extraMsg.content}}</text>
              <image 
                mode='aspectFill'
                v-if="extraMsg.type === 'image'" 
                :src="extraMsg.content"
              ></image>
            </view>
          </view> 
        </view>
      </view>
      <view :id="'dade'+(list.length)"></view>
    </scroll-view>
    <view class="control-box">
      <view class="input-box">
        <input v-model="inputMessage" @confirm="sendMessage" class="input" :placeholder="$t('chat.typing') + '...'"/>
      </view>
      <image @tap="sendMessage" class="send-icon" src="/static/chat/send-icon.png"></image>
      <view class="action-btns">
        <image @tap="sendImage" class="image-type-icon" src="/static/chat/image-type-icon.png"></image>
        <image @tap="goVideo" class="video-type-icon" src="/static/home/video-mark.png"></image>
      </view>
    </view>
    <custom-confirm-modal 
      ref="mintConfirmPopup" 
      :title="$t('common.confirm')"
      :confirmText="$t('invitation.claimTokenConfirmPopup.mintConfirm')"
      @confirm="mintConfirm"
      @cancel="closeMint"
    >
      <view class="confirm-popup-content">
        <view class="des">{{ $t('invitation.claimTokenConfirmPopup.toWallet') }}</view>
        <view class="list">
          <view class="item">
            <text class="label">{{ $t('invitation.claimTokenConfirmPopup.invitationNFT') }}</text>
            <text class="value">1</text>
          </view>
          <view class="item">
            <text class="label">{{ $t('contract.gasFee') }}</text>
            <text class="value">{{ $utilWithVue.formatAptos(gasFeeInfo.gas_estimate, { fixed: 6 }) }} APT</text>
          </view>
        </view>
      </view>
    </custom-confirm-modal>
    <!--  -->
    <uni-popup ref="replyModalPopup" :mask-click="false" :is-mask-click="false" background-color="#fff"
      mask-background-color="rgba(0,0,0,0)" type="center">
      <view class="popup-content">
        <image class="dialog-bg" src="/static/my/dialog-bg.png" mode=""></image>
        <view class="dialog-content">
          <image @click="close" class="dialog-close" src="/static/my/icon-close.png" mode=""></image>
          <view class="title">
            {{ $t("chat.replyModal.title") }}
          </view>
          <view class="des">
            {{ $t("chat.replyModal.des") }}
          </view>
          <view class="content-list">
            <view class="content-item">
              <image class="content-item-icon" src="/static/aptos-icon.png"></image>
              <view class="content-item-content">
                <view class="title">
                  {{$t("chat.replyModal.contentTitle1")}}
                </view>
                <view class="content">
                  <text>+{{$utilWithVue.formatAptos(Number(feeInfo.chatFee || 0) * 0.7 * replyMsgNum, 5)}}</text>
                </view>
              </view>
            </view>
            <view class="content-item">
              <image class="content-item-icon" src="/static/dat3-icon.png"></image>
              <view class="content-item-content">
                <view class="title">
                  {{$t("chat.replyModal.contentTitle2")}}
                </view>
                <view class="content">
                  <text>After {{afterTime}}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="info-btn" @click="close">
            <image src="/static/my/btn-middle.png" />
            <text>{{ $t("chat.replyModal.btn") }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="sendModalPopup" :mask-click="false" :is-mask-click="false" background-color="#fff"
      mask-background-color="rgba(0,0,0,0)" type="center">
      <view class="send-popup-content">
        <image class="dialog-bg" src="/static/my/dialog-bg.png" mode=""></image>
        <view class="dialog-content">
          <image @click="closeSendModal" class="dialog-close" src="/static/my/icon-close.png" mode=""></image>
          <view class="msg-icon">
            <image src="/static/chat/msg-icon.png"></image>
          </view>
          <view class="des">
            {{ $t("chat.sendConfirm.des", { name: other.userName }) }}
          </view>
          <view class="content-list">
            <view class="content-item">
              <image class="content-item-icon" src="/static/aptos-icon.png"></image>
              <view class="content-item-content">
                <view class="content">
                  <text>{{$utilWithVue.formatAptos(Number(feeInfo.chatFee || 0))}}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="gasfee-price">
            <text class="label"> {{ $t("contract.gasFee") }}</text>
            <text class="value">
              {{ $utilWithVue.formatAptos(gasFeeInfo.gas_estimate, { fixed: 6 }) }}APT
            </text>
          </view>
          <view class="info-btn" @click="confirmSend">
            <view class="title">{{ $t('chat.sendConfirm.title') }}</view>
            <image src="/static/my/btn-middle.png" />
            <text>{{ $t("common.yes") }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
    <!-- insufficientBalancePopup -->
    <w-popup-confirm
      ref="popup"
      :title="$t('chat.InsufficientBalance')"
      :content="$t('chat.InsufficientBalanceContent')"
      :cancelText="$t('chat.InsufficientBalanceCancelText')"
      :confirmText="$t('chat.InsufficientBalanceConfirmText')"
      @cancel="insufficientBalanceCancel"
      @confirm="insufficientBalanceConfirm"
      />
    <w-popup-dialog 
      ref="videoPopup"
			:popupContentStyle="{ padding: '0', background: 'transparent' }"
    >
			<view class="video-dialog-wrapper">
				<image class="dialog-wrapper-bg" src="/static/home/report-dialog-bg.png"></image>
				<view class="dialog-content">
					<view class="portrait">
						<image mode='aspectFill' :src="other.portrait"></image>
						<!-- <view v-if="info.online" class="online-dot"></view> -->
					</view>
					<view class="requires-des">
            {{$t('home.friendDetails.videoPopup.des', { name: other.userName })}}
					</view>
					<view class="requires-price">
						<image class="price-icon" src='/static/aptos-icon.png'></image>
						<view class="price-text">{{$utilWithVue.formatAptos(Number(feeInfo.videoFee || 0))}} / {{$t('common.min')}}</view>
					</view>
          <view class="gasfee-price">
            <text class="label"> {{ $t("contract.gasFee") }}</text>
            <text class="value">
              {{ $utilWithVue.formatAptos(gasFeeInfo.gas_estimate, { fixed: 6 }) }}APT
            </text>
          </view>
					<view class="video-dialog-content-btn" @tap="confirmGoVideo()">
						<image class="video-dialog-content-btn-bg" src="/static/my/btn-large.png"></image>
						<view class="video-dialog-content-btn-content">
              <text>{{ $t("common.yes") }}</text>
						</view>
					</view>
          <view class="confirm-title">{{$t('home.friendDetails.videoPopup.title')}}</view>
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
          // simpleUni.showToast({
          //   title: err.message,
          //   icon: 'none'
          // });
          showLoading && simpleUni.hideLoading();
          this.$ownerInstance.callMethod('eventCallBack', { ...event, res: null, err });
        }
      },
		}
	}
</script>

<script>
  let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
  import { getUserInfo as fetchUserInfo, getUserGrade } from "@/api/user";
  import { sendMsgBefore, sendMsgv1, botSendMsg, replyMsgAfter, getChatRel as fetchChatRel } from "@/api/message";
  import { getChatFee as fetchChatFee } from "@/api/wallet";
  import { formatEther } from '@/utils/wallet';
  import { msgType, autoMsgPrefix, setChatReply, getChatReply } from '@/config/message';
  import { setUserSendMsg, getUserSendMsg } from '@/config/auth';
  import { viewContractService, getGasFee } from "@/api/viewContractService.js";
  
  export default {
    data() {
      return {
        other: {},
        chatType: 'singleChat',
        me: {},
        list: [],
        option: {},
        inputMessage: "", // render input 
        toView: "",
        chatFeeInfo: {},
        feeInfo: {},
        replyMsgNum: 0,
        event: {},
        walletAssetsInfo: {},
        wallet: {},
        // sender:
        // receiver:
        // null 
        chatRel: null, 
        sendImgRes: null,
        gasFeeInfo: {},
        sendType: null,
        extraMsg: null,
        mintMsg: null
      }
    },
    onLoad(option) {
      let me = this;
      me.option = option;
      me.walletAssetsInfo = getApp().globalData.walletAssetsInfo;
      uni.$on("WebIM.onTextMessage", function([message]) {
        me.getMessageList();
      });
      uni.$on("WebIM.onPictureMessage", function([message]) {
        me.getMessageList();
      });
      me.fetchGasFee()
    },
    onShow() {
      let me = this;
      const userInfo = getApp().globalData.userInfo || {};
      me.wallet = getApp().globalData.wallet;
      me.getUserInfo(me.option.userCode);
      me.getVideoFee(me.option.userCode)
      me.getChatFee();
      me.me = userInfo;
      uni.$on('updateWalletBalanceInfo', function({ data, walletAssetsInfo }){
        me.walletAssetsInfo = walletAssetsInfo;
      })
    },
    computed: {
      afterTime() {
        // 24
        const local24 =  new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000;
        const diff = new Date().getTimezoneOffset() * 60 * 1000;
        const now = new Date().getTime();
        const mistime = local24 - diff - now;
        if (mistime < 0) {
          return '00:00:00';
        }
        //
				let leave1 = mistime%(24*3600*1000); //
				let hours = Math.floor(leave1/(3600*1000));
        hours = hours >= 10 ? hours : `0${hours}`;
				//
				let leave2 = leave1%(3600*1000);        //
				let minutes = Math.floor(leave2/(60*1000));
        minutes = minutes >= 10 ? minutes : `0${minutes}`;
				//
				let leave3 = leave2%(60*1000) ;     //
				let seconds = Math.round(leave3/1000);
        seconds = seconds >= 10 ? seconds : `0${seconds}`;
        return hours + ':' + minutes + ':' + seconds;
      }
    },
    methods: { 
      eventCallBack(event) {
        const { type, payload, res, err } = event;
        console.log('eventCallBack', event);
        let me = this;
        me.event = {};
        switch (type) {
          case 'mint': 
            if (!err) {
              me.closeMint();
              me.viewMintState();
            } else {
              uni.showToast({
                title: err.message || 'mint error',
                icon: 'none'
              });
            }
            break;
          case 'call_1.text': 
            me.callAfter();
            break;
          case 'call_1.image': 
            me.callAfter();
            break;
          default:
            break;
        }
      },
      async getVideoFee(userCode) {
        let me = this;
				const res = await getUserGrade({ userCode });
        me.feeInfo.videoFee = (res.data || {}).eprice;
      },
      goVideo() {
				this.$refs.videoPopup.open();
			},
      confirmGoVideo() {
				const { account_apt } = getApp().globalData.walletAssetsInfo;
				if (Number(account_apt) < Number(this.feeInfo.videoFee)) {
					this.$refs.videoPopup.close();
					this.$refs.popup.open();
					return;
				}
				const { userCode: from } = getApp().globalData.userInfo || {};
				this.$refs.videoPopup.close();
				uni.navigateTo({
          url: `/pages/agora-video/index?type=1&from=${from || ''}&to=${this.other.userCode || ''}`,
        });
			},
      callAfter() {
        let me = this;
        if (me.chatRel == 'receiver') {
          replyMsgAfter({
            from: me.other.userCode,
            to: me.me.userCode,
            userCode: me.me.userCode
          }).then(res => {
            getApp().globalData.getWalletBalanceInfo();
          })
        } else {
          getApp().globalData.getWalletBalanceInfo();
        }
      },
      async fetchGasFee() {
        const res = await getGasFee();
        this.gasFeeInfo = res.data || {};
      },
      open() {
        this.$refs.replyModalPopup.open();
        setChatReply('1');
      },
      close() {
        this.$refs.replyModalPopup.close();
      },
      openSendModal() {
        this.$refs.sendModalPopup.open();
      },
      closeSendModal() {
        this.sendType = null;
        this.$refs.sendModalPopup.close();
      },
      confirmSend() {
        this.beforeSend(this.sendType);
        setUserSendMsg(true);
        this.closeSendModal();
      },
      insufficientBalanceCancel() {
        this.$refs.popup.close();
      },
      insufficientBalanceConfirm() {
        this.$refs.popup.close();
        uni.navigateTo({
					url: `/pages/aptos-wallet/index`,
				});
      },
      getChatFee() {
        let me = this;
        fetchChatFee().then(res => {
          const { chatFee } = res.data || {};
          me.feeInfo.chatFee = me.$utilWithVue.aptosToValue(chatFee);
        });
      },
      // async getChatFee() {
      //   let me = this;
      //   const res = await viewContractService({ module: 'routel', func: 'fee_of_mine', args: [me.wallet.address], });
      //   const [chatFee] = res.data || {};
      //   me.feeInfo = {
      //     chatFee
      //   };
      // },
      async getChatRel() {
        let me = this;
        const res = await viewContractService({ module: 'routel', func: 'is_sender', args: [me.me.address, me.other.address], });
        const [ chatRel ] = res.data || [];
        if (chatRel == '1' || chatRel == '3' || chatRel == '5') {
          me.chatRel = 'sender';
        } else if (chatRel == '2') {
          me.chatRel = 'receiver';
        } else {
          me.chatRel = null;
        }
      },
      clickImg(urls) {
        wx.previewImage({
					urls: urls, //httpurl
					current: '', // http
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
      },
      getUserInfo(userCode) {
        let me = this;
        fetchUserInfo({ userCode }).then(res => {
          me.other = res.data || {};
          me.getMessageList(true);
          me.getChatRel();
        })
      },
      getMessageList(showLoading) {
        let me = this;
        console.log('----------');
        console.log('', WebIM.conn.isOpened() ? '' : '');
        console.log('----------');
        showLoading && uni.showLoading({ mask: true })
        const options = {
          queue: this.other.userCode,
          isGroup: false,
          count: 1000,
          success: function(res){
            console.log('----------');
            console.log('', res);
            console.log('----------');
            const list = res || [];
            me.replyMsgNum = 0;
            me.list = list.map(it => {
              if (it.contentsType === 'TEXT' && it.data.startsWith(autoMsgPrefix)) {
                it.isAutoMsg = true;
                it.data = it.data.slice(autoMsgPrefix.length);
              } else if (it.from === me.other.userCode && me.chatRel === 'receiver') {
                me.replyMsgNum = me.replyMsgNum + 1;
              }
              it.isOther = it.from === me.other.userCode
              if (it.contentsType === 'COMMAND') {
                it.isOther = ((it.ext || {}).data || {}).from === me.other.userCode;
                it.videoCall = ['videoCancel', 'videoReject', 'videoEnd'].includes(it.action);
                if (!it.videoCall) {
                  it.hide = true;
                }
              }
              return it;
            });
            showLoading && uni.hideLoading()
            me.extraMsg = null;
            setTimeout(() => {
              me.toView = 'dade' + list.length;
            }, 300);
          },
          fail: function(error){
            console.log('----------');
            console.log('', error);
            console.log('----------');
          }
        }
        WebIM.conn.mr_cache = [];
        WebIM.conn.fetchHistoryMessages(options)
      },
      sendMessage() {
        let me = this;
        String.prototype.trim = function () {
          return this.replace(/(^\s*)|(\s*$)/g, "");
        };
        const userMessage = me.inputMessage;
        if (!userMessage.trim()) {
          return;
        }
        if (!getUserSendMsg() && me.chatRel == 'sender' &&  me.other.userCode != '21216729') {
          me.openSendModal();
          me.sendType = 'text';
        } else {
          me.beforeSend('text');
        }
      },
      sendMessageConfirm() {
        let me = this;
        let id = WebIM.conn.getUniqueId();
        let msg = new WebIM.message(msgType.TEXT, id);
        const inputMessage = me.inputMessage;
        me.extraMsg = {
          type: 'text',
          content: inputMessage,
          status: 'loading'
        }
        setTimeout(() => {
          me.toView = 'extraMsg';
        }, 300);
        me.inputMessage = '';
        msg.set({
          msg: inputMessage,
          to: me.other.userCode,
          // roomType: false,
          chatType: me.chatType,
          success(id, serverMsgId) {
            me.loadingMsg = null;
            me.getMessageList();
            if (getChatReply() == '0' && me.chatRel == 'receiver') {
              me.open()
            }
          },
          fail(id, serverMsgId) {
            console.log("");
            if (me.extraMsg) {
              me.extraMsg.status = 'fail';
            }
          },
        });
        WebIM.conn.send(msg.body);
      },
      sendImage() {
				var me = this;
        uni.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album"],
          success(res) {
            me.sendImgRes = res;
            setTimeout(() => {
              if (!getUserSendMsg() && me.chatRel == 'sender' && me.other.userCode != '21216729') {
                me.openSendModal();
                me.sendType = 'image';
              } else {
                me.beforeSend('image');
              }
            }, 300);
          }
        });
			},
      beforeSend(type) {
        let me = this;
        const { uid, fid } = me.walletAssetsInfo || {};
        const { userCode, invitationCode } = me.me || {};
        const isActive = fid == invitationCode && uid == userCode;
        if (me.other.userCode == '21216729') {
          me.dealWhitelistUserMsg(type);
          return;
        }
        // chatRel is sender, but fee to low
        if (me.chatRel == 'sender') {
          if (Number(me.walletAssetsInfo.account_apt) < Number(me.feeInfo.chatFee)) {
            me.$refs.popup.open();
          } else {
            me.sendMsg(type);
          }
        } else if (me.chatRel == 'receiver') {
          me.sendMsg(type, isActive);
        } else {
          uni.showToast({
            icon: "none",
            title: this.$t('chat.errorChatRelMsg'),
            duration: 2000,
          });
        }
      },
      dealWhitelistUserMsg(type) {
        let me = this;
        const inputMessage =  me.inputMessage;
        if (type === 'text' && inputMessage === '/mint') {
          botSendMsg({
            code: inputMessage
          }).then(res => {
            const { inWhitelist, start, msg, mint_num } = res.data || {};
            if (
              inWhitelist &&
              start &&
              mint_num !== undefined && mint_num < 1
            ) {
              setTimeout(() => {
                me.openMint()
              }, 300);
            } else {
              uni.showToast({
                icon: "none",
                title: msg,
                duration: 5000,
              });
            }
          });
        }
        me.sendMsg(type, false);
      },
      mintConfirm() {
        let me = this;
        me.event = {
          type: `mint`,
          payload: { module: 'dat3_invitation_nft', func: 'mint', args: ['DAT3 invitation NFT'], code: me.wallet.code, isNft: true },
          showLoading: true,
        };
      },
      async viewMintState() {
        let me = this;
        const res = await viewContractService({ 
          module: 'dat3_invitation_nft', 
          func: 'mint_state', 
          args: [me.me.address, 'DAT3 invitation NFT'], 
          isNft: true
        });
        const data = res.data || [];
        if (data[8] > 0) {
          uni.showToast({
            title: 'mint ok',
            icon: 'none'
          });
        } else {
          uni.showToast({
            title: 'mint error',
            icon: 'none'
          });
        }
      },
      openMint() {
        this.$refs.mintConfirmPopup.open();
      },
      closeMint() {
        this.$refs.mintConfirmPopup.close();
      },
      sendMsg(type, call_1 = true) {
        let me = this;
        if (type === 'text') {
          me.sendMessageConfirm();
        } else if (type === 'image') {
          me.sendImageConfirm();
        }
        if (call_1) {
          let params = {}
          if (me.chatRel == 'sender') {
            params = {
              userCode: me.me.userCode,
              creator: me.other.userCode,
              amount: me.feeInfo.chatFee
            };
          } else {
            params = {
              userCode: me.other.userCode,
              creator: me.me.userCode,
            };
          }
          sendMsgv1(params).then(res => {
            getApp().globalData.getWalletBalanceInfo();
          })
          // me.event = {
          //   type: `call_1.${type}`,
          //   payload: { module: 'routel', func: 'call_1', args: [me.other.address], code: me.wallet.code },
          //   showLoading: false
          // };
        }
      },
      sendImageConfirm() {
        var me = this;
        const res = me.sendImgRes;
        if (!res) return;
				var tempFilePaths = res.tempFilePaths;
				var token = WebIM.conn.context.accessToken;
        console.log('image-res', res);
        me.extraMsg = {
          type: 'image',
          content: res.tempFilePaths[0],
          status: 'loading'
        }
        setTimeout(() => {
          me.toView = 'extraMsg';
        }, 300);
        uni.getImageInfo({
					src: res.tempFilePaths[0],
					success(res) {
            var allowType = {
							jpg: true,
							jpeg: true,
							gif: true,
							png: true,
							bmp: true
						};
						var str = WebIM.config.appkey.split("#");
						var width = res.width;
						var height = res.height;
						var index = res.path.lastIndexOf(".");
						var filetype = ~index && res.path.slice(index + 1) || "";
						if (!res.type) {
							uni.showToast({
								title: "H5uni-app",
                      			icon: "none"
							})
						}
						if (filetype.toLowerCase() in allowType || res.type in allowType) {
              console.log('url::', WebIM.config.apiURL + str[0] + "/" + str[1] + "/chatfiles");
              uni.uploadFile({
								url: WebIM.config.apiURL + "/" + str[0] + "/" + str[1] + "/chatfiles",
								filePath: tempFilePaths[0],
								fileType: 'image',
								name: "file",
								header: {
									// "Content-Type": "multipart/form-data",
									'Content-Type': 'application/x-www-form-urlencoded',
									Authorization: "Bearer " + token
								},
								success: (res)=>{
									if (res.statusCode == 400) {
										// 
										// var errData = JSON.parse(res.data);
										// if (errData.error === 'content improper') {
										uni.showToast({
											title: "",
											duration: 1000
										});
										return false
										// }
									}
									var data = res.data;
									var dataObj = JSON.parse(data);
									var id = WebIM.conn.getUniqueId(); //  id

									var msg = new WebIM.message(msgType.IMAGE, id);
									var file = {
										type: msgType.IMAGE,
										size: {
											width: width,
											height: height
										},
										url: dataObj.uri + "/" + dataObj.entities[0].uuid,
										filetype: filetype,
										filename: tempFilePaths[0]
									};
									msg.set({
										apiUrl: WebIM.config.apiURL,
										body: file,
										to: me.other.userCode,
										roomType: false,
										chatType: me.chatType,
										success: function(argument) {
                      me.getMessageList();
										},
                    fail: function () {
                      if (me.extraMsg) {
                        me.extraMsg.status = 'fail';
                      }
                    }
									});

									if (me.chatType == msgType.chatType.CHAT_ROOM) {
										msg.setGroup("groupchat");
									}

									WebIM.conn.send(msg.body);
                  if (getChatReply() == '0' && me.chatRel == 'receiver') {
                    me.open()
                  }
                  me.sendImgRes = null;
								},
								fail: (err) => {
									console.log('', err)
                  if (me.extraMsg) {
                    me.extraMsg.status = 'fail';
                  }
								},
								complete: (err) => {
									console.log('', err)
								}
							});
            }
          }
        })
      },
      goFriendDetailPage() {
        let me = this;
	      uni.navigateTo({
					url: `/pages/home/friend-details?userCode=${me.other.userCode}`,
				});
      },
      back() {
				uni.navigateBack({
					delta: 1,
				});
			},
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    background: #F1EEFF;
    .user-title-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      image {
        width: 58rpx;
        height: 58rpx;
        margin-right: 16rpx;
        border-radius: 50%;
        background: #000;
      }
      text {
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
      }
    }
    .body {
      margin-top: 20rpx;
      height: calc(100vh - 160rpx);
      background: #FFFFFF;
      box-shadow: 0px -5rpx 27rpx 0rpx rgba(216,80,233,0.18);
      border-radius: 65rpx 65rpx 0 0;
      box-sizing: border-box;
      .message-list {
        padding: 80rpx 54rpx 150rpx;
        .auto-message {
          background: #F9F5FF;
          border-radius: 14rpx;
          padding: 22rpx;
          width: 450rpx;
          margin: 0 auto 65rpx;
          view {
            text-align: center;
            font-weight: 400;
            font-family: PingFangSC-Regular, PingFang SC;
            font-size: 22rpx;
            color: #D841FF;
            line-height: 35rpx;
          }
        }
        .message-item {
          margin-bottom: 63rpx;
          display: flex;
          align-items: start;
          flex-direction: row-reverse;
          .picture {
            width: 96rpx;
            height: 96rpx;
            margin-left: 24rpx;
            image {
              width: 96rpx;
              height: 96rpx;
              border-radius: 50%;
              background: #000;
            }
          }
          .message-box {
            .message-content {
              background: #F1EEFF;
              border-radius: 30rpx;
              font-size: 22rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #000000;
              line-height: 32rpx;
              min-height: 32rpx;
              padding: 22rpx;
              margin-top: 12rpx;
              position: relative;
              word-break: break-all;
              &.message-image-content {
                image {
                  width: 400rpx;
                  height: 400rpx;
                }
              }
              .status-icon {
                position: absolute;
                height: 32rpx;
                left: -48rpx;
                bottom: 50%;
                display: flex;
                align-items: center;
                min-width: 200rpx;
                .loading-icon {
                  margin-bottom: -30rpx;
                  width: 30rpx;
                  height: 36rpx;
                }
                .fail-icon {
                  margin-bottom: -36rpx;
                  width: 18rpx;
                  height: 43rpx;
                }
              }
              .profit-box {
                position: absolute;
                bottom: -44rpx;
                height: 32rpx;
                left: 30rpx;
                display: flex;
                align-items: center;
                min-width: 200rpx;
                image {
                  width: 29rpx;
                  height: 25rpx;
                  margin-right: 6rpx;
                }
                text {
                  font-size: 22rpx;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #000000;
                }
              }
              .trangle {
                position: absolute;
                top: 28rpx;
                right: -20rpx;
                width: 0rpx;
                height: 0rpx;
                border-top: 15rpx solid transparent;
                border-left: 30rpx solid #F1EEFF;
                border-bottom: 15rpx solid transparent;
              }
              .videoCall-view {
                display: flex;
                align-items: center;
                &>image {
                  flex: 0 0 58rpx;
                  width: 58rpx;
                  height: 34rpx;
                  margin-right: 7rpx;
                }
                &>text {
                  font-size: 22rpx;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #000000;
                  line-height: 31rpx;
                }
              }
            }
          }
          &.isOther {
             flex-direction: row;
            .picture {
              margin-right: 24rpx;
              margin-left: 0;
            }
            .message-box {
              .message-content {
                background: #EDEDED;
                .trangle {
                  left: none;
                  left: -20rpx;
                  border-top: 15rpx solid transparent;
                  border-right: 30rpx solid #EDEDED;
                  border-bottom: 15rpx solid transparent;
                  border-left: none;
                }
              
              }
            }
          }
        }
      }
    }
    .control-box {
      display: flex;
      align-items: center;
      flex-direction: row;
      position: fixed;
      bottom: 34rpx;
      left: 31rpx;
      padding-bottom: 80rpx;
      .input-box {
        width: 591rpx;
        height: 96rpx;
        border-radius: 48rpx;
        box-sizing: border-box;
        background: #F8F6FF;
        margin-right: 12rpx;
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 0 30rpx;
        .input {
          height: 96rpx;
          flex: 1;
        }
      }
      .send-icon {
        width: 92rpx;
        height: 92rpx;
      }
      .action-btns {
        position: absolute;
        bottom: 0;
        left: 40rpx;
        display: flex;
        align-items: center;
        .image-type-icon {
          width: 40rpx;
          height: 38rpx;
          margin-right: 34rpx;
        }
        .video-type-icon {
          width: 74rpx;
          height: 38rpx;
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
  // 
  .popup-content {
    position: relative;

    .dialog-bg {
      width: 634rpx;
      height: 776rpx;
      position: relative;
    }

    .dialog-content {
      width: 634rpx;
      height: 776rpx;
      z-index: 2;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      .dialog-close{
        position: absolute;
        padding: 8rpx;
        right: 42rpx;
        top: 42rpx;
        width: 27rpx;
        height: 25rpx;
        z-index: 2;
      }
      &>.title {
        margin-top: 72rpx;
        font-size: 45rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 65rpx;
        word-break: break-all;
        white-space: pre-wrap;
        text-align: center;
      }
      &>.des {
        margin-top: 14rpx;
        font-size: 25rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 36rpx;
      }
      .content-list {
        margin-top: 54rpx;
        .content-item {
          width: 518rpx;
          height: 130rpx;
          margin-bottom: 29rpx;
          display: flex;
          align-items: center;
          padding-left: 54rpx;
          .content-item-icon {
            width: 100rpx;
            height: 100rpx;
            margin-right: 36rpx;
          }
          .content-item-content {
            .title {
              font-size: 29rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #999999;
              line-height: 40rpx;
              margin-bottom: 14rpx;
            }
            .content {
              text {
                font-size: 36rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #333333;
                line-height: 36rpx;
              }
            }
          }
        }
      }
      .info-btn {
        margin-top: 72rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        image {
          width: 582rpx;
          height: 101rpx;
          position: relative;
        }
        text {
          width: 582rpx;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
          text-align: center;

          font-size: 36rpx;
          color: #ffffff;
          font-weight: bold;
          font-family: PingFangSC-Semibold, PingFang SC;
        }
      }
    }
  }

  .send-popup-content {
    position: relative;

    .dialog-bg {
      width: 634rpx;
      height: 776rpx;
      position: relative;
    }

    .dialog-content {
      width: 634rpx;
      height: 776rpx;
      z-index: 2;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      .dialog-close{
        position: absolute;
        padding: 8rpx;
        right: 42rpx;
        top: 42rpx;
        width: 27rpx;
        height: 25rpx;
        z-index: 2;
      }
      &>.msg-icon {
        margin-top: 100rpx;
       
        image {
          width: 226rpx;
          height: 160rpx;
        }
      }
      &>.des {
        margin-top: 36rpx;
        font-size: 28rpx;
        font-family: PingFang SC;
        color: #2D2D2D;
      }
      .content-list {
        margin-top: 32rpx;
        .content-item {
          display: flex;
          align-items: center;
          justify-content: center;
          .content-item-icon {
            width: 46rpx;
            height: 46rpx;
            margin-right: 20rpx;
          }
          .content-item-content {
            .content {
              text {
                font-size: 36rpx;
                font-family: PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 36rpx;
              }
            }
          }
        }
      }
      .gasfee-price {
        margin: 18rpx 0 32rpx;
        color: #808080;
        font-size: 30rpx;
        .label {
          margin-right: 24rpx;
        }
      }
      .info-btn {
        margin-top: 32rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .title {
          position: absolute;
          bottom: -56rpx;
          height: 56rpx;
          line-height: 56rpx;
          color: #989898;
          font-family: PingFang SC;
          font-size: 20rpx;
          font-weight: 600;
        }
        image {
          width: 582rpx;
          height: 101rpx;
          position: relative;
        }
        text {
          width: 582rpx;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
          text-align: center;

          font-size: 36rpx;
          color: #ffffff;
          font-weight: bold;
          font-family: PingFangSC-Semibold, PingFang SC;
        }
      }
    }
  }
}

.video-dialog-wrapper {
	position: relative;
	width: 634rpx;
	height: 880rpx;
	.dialog-wrapper-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 634rpx;
    height: 880rpx;
	}
	.dialog-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 634rpx;
		height: 880rpx;
		padding: 100rpx 62rpx 0rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		.portrait {
			width: 277rpx;
			height: 277rpx;
			flex: 0  0 277rpx;
			border-radius: 50%;
			position: relative;
			image {
				width: 277rpx;
				height: 277rpx;
				border-radius: 50%;
				background: #F1EEFF;
			}
			.online-dot {
				position: absolute;
				width: 41rpx;
				height: 41rpx;
				border-radius: 50%;
				background: #3DD42D;
				box-sizing: border-box;
				border: 4rpx solid #fff;
				right: 29rpx;
				bottom: 11rpx;
			}
		}
		.requires-des {
			font-size: 33rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			line-height: 45rpx;
			margin: 26rpx 0 26rpx;
		}
		.requires-price {
			display: flex;
			align-items: center;
			.price-icon {
				width: 57rpx;
				height: 53rpx;
				flex: 0 0 57rpx;
				margin-right: 13rpx;
			}
			.price-text {
				font-size: 36rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #000000;
				line-height: 51rpx;
			}
		}
    .gasfee-price {
      margin: 18rpx 0 32rpx;
      color: #808080;
      font-size: 30rpx;
      .label {
        margin-right: 24rpx;
      }
    }
	  .confirm-title {
			margin: 34rpx 0 16rpx;
			font-size: 25rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			line-height: 36rpx;
		}
		.video-dialog-content-btn {
			width: 545rpx;
			height: 101rpx;
			flex: 0 0 101rpx;
			position: relative;
			.video-dialog-content-btn-bg {
				width: 545rpx;
				height: 101rpx;
			}
			.video-dialog-content-btn-content {
				position: absolute;
				width: 545rpx;
				height: 101rpx;
				top: 0;
				left: 0;
				text-align: center;
				line-height: 101rpx;
				font-size: 36rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
			}
		}
  
	}
}
</style>
