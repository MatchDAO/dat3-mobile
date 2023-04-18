/**
 * @description string
 * @param {string, number} value
 */
export const scientificNotationToString = (value) => {
  let strParam = String(value)
  let flag = /e/.test(strParam)
  if (!flag) return value
  //  true: false: 
  let sysbol = true
  if (/e-/.test(strParam)) {
    sysbol = false
  }
  // 
  let index = Number(strParam.match(/\d+$/)[0])
  // 
  let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')

  if (sysbol) {
    return basis.padEnd(index + 1, 0)
  } else {
    return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
  }
}