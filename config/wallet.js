
// json
export function setWalletJson(json){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		uni.setStorageSync(`wallet.keystore.${userInfo.userCode}`, json);
	}
}
// json
export function getWalletJson(){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		const walletJson = uni.getStorageSync(`wallet.keystore.${userInfo.userCode}`);
		return walletJson;
	} else {
		return;
	}
}
// APTOS
import CryptoJS from "crypto-js"
const SECRET_KEY = 'dat3' // KEY

export function setWallet(wallet={}) {
	let walletJson =  JSON.stringify(wallet)
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		app.globalData.wallet = wallet
		let ciphertext = CryptoJS.AES.encrypt(walletJson, SECRET_KEY).toString()
		uni.setStorageSync(`wallet.keystore.${userInfo.userCode}`, ciphertext);
	}
} 
export function getWallet() {
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		let ciphertext = uni.getStorageSync(`wallet.keystore.${userInfo.userCode}`);
		let wallet = JSON.parse(CryptoJS.AES.decrypt(ciphertext, SECRET_KEY).toString(CryptoJS.enc.Utf8)) 
		return wallet;
	}
	return ;
} 
