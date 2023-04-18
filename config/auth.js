export function removeUserInfo(){
	const app = getApp()
	app.globalData.userInfo =null
	app.globalData.walletBalanceInfo =[]
	uni.removeStorageSync('token')
	uni.removeStorageSync('emToken')
	uni.removeStorageSync('userInfo')
}
export function setUserInfo(userInfo={}){
	const app = getApp()
	app.globalData.userInfo = userInfo;
	uni.setStorageSync("userInfo", JSON.stringify(userInfo));
}
export function setToken(token){
	uni.setStorageSync("token", token);
}
export function setEmToken(emToken){
	uni.setStorageSync("emToken", emToken);
}
export function getUserInfo(){
	let userInfoStr = uni.getStorageSync('userInfo')
	return userInfoStr && JSON.parse(userInfoStr) || {}
}
export function getToken(){
	return uni.getStorageSync('token')
}
export function getEmToken(){
	return uni.getStorageSync('emToken')
}
export function setUserInitStatus(bool){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		uni.setStorageSync(`user_init.${userInfo.userCode}`, bool ? 'Y' : 'N');
	}
}
export function getUserInitStatus(){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		return uni.getStorageSync(`user_init.${userInfo.userCode}`) == 'Y';
	}
}
export function setUserSendMsg(bool){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		uni.setStorageSync(`sendMsg.${userInfo.userCode}`, bool ? 'Y' : 'N');
	}
}
export function getUserSendMsg(){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		return uni.getStorageSync(`sendMsg.${userInfo.userCode}`) == 'Y';
	}
}