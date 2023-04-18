import { request } from '@/config/request'
import { BASE_PATH } from '@/config/config'

/**
 *    
 */
 export function fetchCodeList() {
  return request({
      method: 'GET',
      url:`${BASE_PATH}/invitation/codeList`,
      showLoading: false,
  })
}

/**
 *  
 * userCode
 * index
 * invitationCode
 */
 export function invitationRewards(data = {}) {
  return request({
      method: 'GET',
      data,
      url:`${BASE_PATH}/invitation/rewards`,
  })
}
