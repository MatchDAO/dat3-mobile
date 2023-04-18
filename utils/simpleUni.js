const keys = [
  'showToast', 
  'showLoading',
  'hideLoading', 
  'navigateTo',
  'switchTab',
  'redirectTo',
  // ---  --- 
  // 'request',
  // 'getStorageSync',
  // 'setStorageSync',
];

export const registerSimpleUni = (_Vue) => {
  keys.forEach((key) => {
    _Vue.prototype[`uni.${key}`] = uni[key];
  })
}

export const getSimpleUni = (_this) => {
  let simpleUni = {}
  keys.forEach((key) => {
    simpleUni[key] = (...args) => _this.$ownerInstance.callMethod(`uni.${key}`, ...args);
  })
  return simpleUni;
};