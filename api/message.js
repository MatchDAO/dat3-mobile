import { request, requestFormData,requestAxios } from '@/config/request'
import { BASE_PATH } from '@/config/config'

/**
 * ()
 */
export function sendMsgBefore(data = {}) {
  return request({
      method: 'POST',
      data: {
        timestamp: new Date().getTime(),
        ...data
      },
      url:`${BASE_PATH}/interactive/sendMsg`,
      showLoading: false,
  })
}

/**
 * ()
 */
export function replyMsgAfter(data = {}) {
  return request({
      method: 'POST',
      data: {
        timestamp: new Date().getTime(),
        ...data
      },
      url:`${BASE_PATH}/interactive/replyv1`,
      showLoading: false,
  })
}

/**
 *  
 */
export function getChatRel(userCode) {
  return request({
      method: 'GET',
      url:`${BASE_PATH}/interactive/before/${userCode}`,
      showLoading: false,
  })
}

/**
 * sayHi  
 */
 export function afterSayHi(data = {}) {
  return request({
      method: 'POST',
      data: {
        timestamp: new Date().getTime(),
        ...data
      },
      url:`${BASE_PATH}/customMsg/sayHi`,
      showLoading: false,
  })
}

/**
 * sendMsgv1  
 */
 export function sendMsgv1(data = {}) {
  return request({
      method: 'POST',
      data: {
        timestamp: new Date().getTime(),
        ...data
      },
      url:`${BASE_PATH}/interactive/sendMsgv1`,
      showLoading: false,
  })
}

/**
 * botSendMsg
 */
 export function botSendMsg(data = {}) {
  return request({
      method: 'POST',
      data: {
        timestamp: new Date().getTime(),
        ...data
      },
      url:`${BASE_PATH}/bot/sendMsg`,
      showLoading: false,
  })
}