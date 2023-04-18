import axios from 'axios'

import config from '@/config/config';
import { removeUserInfo } from '@/config/auth.js';



let domainPath = config.domainPath;

// import {
// 	showModal
// } from "@/components/G_show_modal/modal"
/*
 * Request(): callback
 * url: 
 * params: { datamethodscallback }
 */
export const request = async (options) => {
	const app = getApp()
	// if(!app.globalData.hasCheckLogin){
	// 	await checkLogin()
	// 	app.globalData.hasCheckLogin = true
	// }
	let {
		data,
		method,
		url,
		header = {},
		showLoading,
	} = options
	showLoading && uni.showLoading();
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token') || ''
		const lang = uni.getStorageSync('lang') || 'en_US'
		header['token'] = token
		header['lang'] = lang

		uni.request({
			url: domainPath + url,
			data,
			header: {
				...header,
			},
			method,
			sslVerify: false,
			success: function (res) {
				handleSuccess(res, resolve, reject)
			},
			fail: function (res) {
				handleFail(res, reject)
			}
		})


	});
};
export const requestFormData = (options={}) => {
	console.log("🚀 ~ file: request.js:61 ~ requestFormData ~ options:", options)
	
	return new Promise((resolve, reject) => {
		const {
			data,
			url,
			header = {},
			filePath,// 
			files,
			name, //  
			showLoading
		} = options
		showLoading && uni.showLoading();
		let domainPath = config.domainPath;
		const token = uni.getStorageSync('token') || ''
		const lang = uni.getStorageSync('lang') || 'en_US'
		header['token'] = token
		header['lang'] = lang
		let formData
		if(data) {
			formData = data
		}
		uni.uploadFile({
			filePath,
			files,
			url: domainPath + url,
			name,
			formData,
			header: {
				...header
			},
			success: function (res) {
				console.log(res)
				res.data = JSON.parse(res.data);
				handleSuccess(res, resolve, reject)
			},
			fail: function (res) {
				console.log(res)
				handleFail(res, reject)
			}
		});
	})
}
export const requestAxios = (optios={})=>{
let domainPath = config.domainPath;
let {
		method,
		data,
		params,
		url,
		headers,
	} = optios
	return new Promise(function (resolve, reject) {
		axios({
			url:domainPath + url,
			method,
			data,
			params,
			headers
		}).then((res)=>{
			handleSuccess(res, resolve, reject,true)
		}).catch(res=>{
			handleFail(res, reject,true)
		})
	})
}
function handleFail(res, reject,isAxios) {
	!isAxios && uni.hideLoading();
	let {
		errMsg = null
	} = res
	if (errMsg) {
		console.log("errMsg:", errMsg)
	}
	reject(res)
}
function handleSuccess(res, resolve, reject,isAxios) {
	!isAxios&&uni.hideLoading();
	const message = res.data.msg || ''

	if (res.statusCode === 200 || res.status === 200) {
		let response = res.data
		if (response.code === 200) {
			resolve(response);
		} else {

			// 401 
			// if (response.code == 401) {
			// 	removeUserInfo()
			// 	uni.reLaunch({
			// 		url: '/pages/login/index?from=home'
			// 	})
			// }
			message && uni.showToast({
				icon: "none",
				title: message
			})
			reject(response)
		}
	} else {
		// 401 
		if (res.statusCode == 401) {
			removeUserInfo()
			uni.reLaunch({
				url: '/pages/login/index?from=home'
			})
		}
		message && uni.showToast({
			icon: "none",
			title: message
		})
		reject(res)
	}
}
/**
 * ws web socket
 */
