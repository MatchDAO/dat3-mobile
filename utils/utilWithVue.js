import { VERSION_NAME } from '@/config/config'

export const getStakingEnd = (start, duration) => {
  if (!start || start == '0') {
    return '-';
  }
  let endTime;
  if (!duration || duration == '0') {
    endTime = start;
  }
  const startTime = new Date(start * 1000).getTime();
  const diffTime = duration * 7 * 24 * 60 * 60 * 1000;
  endTime = startTime + diffTime;
  return new Date(endTime).toUTCString().slice(0, -7);
}

export const getStakingEndTime = (start, duration) => {
  if (!start || start == '0') {
    return new Date().getTime();
  }
  let endTime;
  if (!duration || duration == '0') {
    endTime = start;
  }
  const startTime = new Date(start * 1000).getTime();
  const diffTime = duration * 7 * 24 * 60 * 60 * 1000;
  endTime = startTime + diffTime;
  return endTime;
}

export const formatAptos = (aptos, options) => {
  const { fixed = 3 } = typeof options === 'object' ? options : {};
  const num = aptos ? Number(aptos) : 0;
  return (num / 100000000).toFixed(fixed);
};

export const formatDat3 = (dat3, fixed = 2) => {
  const num = dat3 ? Number(dat3) : 0;
  return (num / 1000000).toFixed(3);
};

export const aptosToValue = (aptos, toString = true) => {
  const num = aptos ? Number(aptos) : 0;
  const val = num * 100000000;
  return toString ? val.toString() : val;
};

export const dat3ToValue = (dat3, toString = true) => {
  const num = dat3 ? Number(dat3) : 0;
  const val = num * 1000000;
  return toString ? val.toString() : val;
};

export const formatVedat3 = (vedat3, fixed = 2) => {
  const num = vedat3 ? Number(vedat3) : 0;
  return (num / 1000000).toFixed(3);
};

export const formatApr = (apr, fixed = 2) => {
  const num = apr ? Number(apr) : 0;
  return (num / 1000000000 * 100).toFixed(3);
};

export const formatRoi = (roi, fixed = 2) => {
  const num = roi ? Number(roi) : 0;
  return (num / 1000000000).toFixed(3);
};

export const formatBoost = (boost, fixed = 2) => {
  const num = boost ? Number(boost) : 0;
  return (num / 10000).toFixed(3);
};

export const formatAddress = (address) => {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
};

const defineWithVue = (_Vue) => {
  _Vue.prototype.$defineWithVue = {};
  _Vue.prototype.$defineWithVue.VERSION_NAME = VERSION_NAME;
};

const utilWithVue = (_Vue) => {
  _Vue.prototype.$utilWithVue = {};
  _Vue.prototype.$utilWithVue.getStakingEnd = getStakingEnd;
  _Vue.prototype.$utilWithVue.getStakingEndTime = getStakingEndTime;
  _Vue.prototype.$utilWithVue.formatAptos = formatAptos;
  _Vue.prototype.$utilWithVue.formatDat3 = formatDat3;
  _Vue.prototype.$utilWithVue.aptosToValue = aptosToValue;
  _Vue.prototype.$utilWithVue.dat3ToValue = dat3ToValue;
  _Vue.prototype.$utilWithVue.formatVedat3 = formatVedat3;
  _Vue.prototype.$utilWithVue.formatApr = formatApr;
  _Vue.prototype.$utilWithVue.formatRoi = formatRoi;
  _Vue.prototype.$utilWithVue.formatBoost = formatBoost;
  _Vue.prototype.$utilWithVue.formatAddress = formatAddress;
  defineWithVue(_Vue);
};

export default utilWithVue;