export const msgType = {
  IMAGE: "img",
  TEXT: "txt",
  LOCATION: "location",
  VIDEO: "video",
  AUDIO: "audio",
  EMOJI: "emoji",
  FILE: "chat",
  //
  chatType: {
    SINGLE_CHAT: "singleChat",
    CHAT_ROOM: "chatRoom"
  }
};


export const autoMsgPrefix = '@@sayhi_';

//  
export function setChatReply(val = '0'){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		uni.setStorageSync(`chatReply.${userInfo.userCode}`, val);
	}
}
//  
export function getChatReply(){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		const val = uni.getStorageSync(`chatReply.${userInfo.userCode}`);
		return val || '0';
	} else {
		return '0';
	}
}
