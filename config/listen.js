import { getUserInfo } from "@/config/auth";
import { getVideoState } from "@/api/video";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);

const CommonWebIMConnListen = {
  onCmdMessage(message) {
    console.log('onCmdMessage', message)
    const userInfo = getUserInfo();
    const { data } = message.ext;
    const currentPages = getCurrentPages();
    const { route } = currentPages[currentPages.length - 1] || {};
    if (message.action === 'videoCall' && !route.startsWith('pages/agora-video')) {
      const { from, to, channelId } = data;
      getVideoState({ from, to, userCode: userInfo.userCode }).then(res => {
        const { begin, end } = res.data || {};
        const now = new Date().getTime();
        if (!end && now - begin <  60 * 1000) {
          uni.navigateTo({
            url: `/pages/agora-video/index?type=2&from=${from}&to=${to}&channelId=${channelId}`,
          });
        }
      })
    }
  },
};


// WebIM listen
export const WebIMListen = () => {
  // listen
  WebIM.conn.listen({
    onOpened(message) {
      uni.$emit("WebIM.onOpened", [message]);
    },
    onCmdMessage(message) {
      uni.$emit("WebIM.onCmdMessage", [message]);
      CommonWebIMConnListen.onCmdMessage(message);
    },
    onTextMessage(message) {
      uni.$emit("WebIM.onTextMessage", [message]);
    },
    onPictureMessage(message) {
      uni.$emit("WebIM.onPictureMessage", [message]);
    },
  });
  // off
  uni.$off('WebIM.sendMsg');
  // on
  uni.$on('WebIM.sendMsg', function([msgType, msgOptions]) {
    console.log('WebIM.sendMsg', msgType, msgOptions);
    let id = WebIM.conn.getUniqueId();
    let cmdMsg = new WebIM.message(msgType, id);
    cmdMsg.set(msgOptions);
    WebIM.conn.send(cmdMsg.body);
  });
}
