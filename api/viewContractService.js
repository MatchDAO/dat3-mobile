// online
export const NODE_URL = "https://fullnode.mainnet.aptoslabs.com";
export const address = '0x25ef1bacaafb6a69b099c00091d9f4c52cc0b963236dead831bc2000fb23246e';
export const nft_address = '0xb80f067d36ed79712a2771a37f61e3f2b6e66466fdf24910a832b72b680d2f0c';
// test
// export const NODE_URL = "https://fullnode.testnet.aptoslabs.com";
// export const address = '0xeaca9a4b2c3e5a305099b8f68d90587e7f965e2e1f4b7505368872644ef95746'; 
// export const nft_address = '0xeaca9a4b2c3e5a305099b8f68d90587e7f965e2e1f4b7505368872644ef95746'; 

export const viewContractService = ({
  module,
  func,
  args,
  showLoading = false,
  isNft = false
}) => {
  showLoading && uni.showLoading();
  return new Promise(async (resolve, reject) => {
    try {
      uni.request({
        url: `${NODE_URL}/v1/view`,
        method: 'POST',
        sslVerify: false,
        data: {
          function: `${isNft ? nft_address : address}::${module}::${func}`,
          type_arguments: [],
          arguments: args,
        },
        success: function (res) {
          console.log('--------success------------', res);
          if (res.statusCode === 200) {
            resolve(res)
          } else {
            uni.showToast({
              title: (res.data || {}).message,
              icon: 'none'
            });
            reject(res)
          }
        },
        fail: function (fail) {
          console.log('--------fail------------', fail);
          uni.showToast({
            title: fail.message,
            icon: 'none'
          });
          reject(fail)
        },
        complete: function (err) {
          showLoading && uni.hideLoading();
        },
      })
    } catch (err) {
      console.log('--------err------------', err);
      uni.showToast({
        title: err.message,
        icon: 'none'
      });
      reject(err);
    }
  })
}


export const getGasFee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      uni.request({
        url: `${NODE_URL}/v1/estimate_gas_price`,
        method: 'GET',
        sslVerify: false,
        success: function (res) {
          if (res.statusCode === 200) {
            resolve(res)
          } else {
            uni.showToast({
              title: (res.data || {}).message,
              icon: 'none'
            });
            reject(res)
          }
        },
        fail: function (fail) {
          uni.showToast({
            title: fail.message,
            icon: 'none'
          });
          reject(fail)
        },
      })
    } catch (err) {
      uni.showToast({
        title: err.message,
        icon: 'none'
      });
      reject(err);
    }
  })
}