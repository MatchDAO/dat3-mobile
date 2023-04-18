import { request, requestFormData,requestAxios } from '@/config/request'
import { BASE_PATH } from '@/config/config'

export function callRequest(data = {}) {
  return request({
    method: 'POST',
    data,
    url:`${BASE_PATH}/rtc/channel/callRequestV1`
  })
}

export function callAccept(data = {}) {
  return request({
    method: 'POST',
    data,
    url:`${BASE_PATH}/rtc/channel/callAcceptV1`
  })
}

export function callEnd(data = {}) {
  return request({
    method: 'POST',
    data,
    url:`${BASE_PATH}/rtc/channel/callEndV1`
  })
}

export function callBegin(data = {}) {
  return request({
    method: 'POST',
    data,
    url:`${BASE_PATH}/rtc/channel/callBegin`
  })
}

export function getVideoState(data = {}) {
  return request({
    method: 'POST',
    data,
    url:`${BASE_PATH}/rtc/channel/state`
  })
}