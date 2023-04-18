import { request } from '@/config/request'
import { BASE_PATH } from '@/config/config'

/**
 * 
 */
export function getWalletBalanceInfo(data = {}) {
  return request({
    method: 'POST',
    data,
    url: `${BASE_PATH}/wallet/balance`,
    showLoading: false,
  })
}

/**
 * 
 */
export function getDepositAddress(data = {}) {
  return request({
    method: 'POST',
    data,
    url: `${BASE_PATH}/wallet/getDepositAddress`,
    showLoading: false,
  })
}

/**
 * 
 */
export function getChatFee() {
  return request({
    method: 'GET',
    url: `${BASE_PATH}/metadata/chatFee`,
    showLoading: true,
  })
}

/**
 * ()
 */
export function exchangePrice(data) {
  return request({
    method: 'POST',
    data,
    url: `${BASE_PATH}/wallet/exchangePrice`,
    showLoading: true,
  })
}

/**
 *  
 */
export function getChains() {
  return request({
    method: 'GET',
    url: `${BASE_PATH}/metadata/chains`,
    showLoading: true,
  })
}

/**
 * 
 */
export function withdraw(data) {
  return request({
    method: 'POST',
    data,
    url: `${BASE_PATH}/wallet/withdraw`,
    showLoading: true,
  })
}