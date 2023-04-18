import { request,requestFormData } from '@/config/request'
import { BASE_PATH } from '@/config/config'

/**
 * 
 * { 
 * "account":"test@dvsd.com", 
 * "password": "efergerthertjhertjhs", 
 * "captcha":1234, }
 */
 export function loginEmail(data={}){
	return request({
		method:'POST',
		data,
		url:`${BASE_PATH}/login`,
        showLoading:true
	})
}

/**
 * 
 * { "account":"erhgfnbioe@dvsd.com", 
 * "captcha":"1234", 
 * "invitation":"20" }
 */
 export function loginRegister(data={}){
	return request({
		method:'POST',
		data,
		url:`${BASE_PATH}/register/login`,
        showLoading:true
	})
}
// file userName bio userCode
export function registerEnd(data = {},fileParams={}) {
    const { filePath = undefined, name = 'file' } = fileParams
    return requestFormData({
        method: 'POST',
        data,
		url:`${BASE_PATH}/register/end`,
        showLoading: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        filePath,
        name
    })
}
// =================  =================
/**
account 
ipV4  ip ip()
:)
 */
export function loginRegisterV1(data={}){
	return request({
		method:'POST',
		data,
		url:`${BASE_PATH}/registerv1`,
    showLoading:true
	})
}
// file userName bio userCode
export function registerV1End(data = {},fileParams={}) {
	const { filePath = undefined, name = 'file' } = fileParams
	return requestFormData({
			method: 'POST',
			data,
			url:`${BASE_PATH}/registerv1/end`,
			showLoading: true,
			headers: {
					'Content-Type': 'multipart/form-data'
			},
			filePath,
			name
	})
}
export function verifyCode(data={}){
	return request({
		method:'POST',
		data,
		url:`${BASE_PATH}/verifyCode`,
    showLoading:true
	})
}

// ================= -end =================


/**
 * 
{ "account":"test@dvsd.com", 
"type":"3" //: "1": login ,"2":modify,"3":login_register,"4":register 
}

 */
 export function sendEmailCode(data={}){
	return request({
		method:'POST',
		data,
		url:`${BASE_PATH}/sendMessage`,
        showLoading:true
	})
}

/**
 * 
 */
 export function logout(data={}){
	return request({
		method:'GET',
		data,
		url:`${BASE_PATH}/user/logout`,
        showLoading:true
	})
}
/**
 * 
 */
 export function delAccount(data={}){
	return request({
		method:'GET',
		data,
		url:`${BASE_PATH}/user/delAccount`,
        showLoading:true
	})
}
