const aptosWeb3 = require('@martiandao/aptos-web3-bip44.js');

// online
export const NODE_URL = "https://fullnode.mainnet.aptoslabs.com";
export const FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
export const address = '0x25ef1bacaafb6a69b099c00091d9f4c52cc0b963236dead831bc2000fb23246e';
export const nft_address = '0xb80f067d36ed79712a2771a37f61e3f2b6e66466fdf24910a832b72b680d2f0c';
// test
// export const NODE_URL = "https://fullnode.testnet.aptoslabs.com";
// export const FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
// export const address = '0xeaca9a4b2c3e5a305099b8f68d90587e7f965e2e1f4b7505368872644ef95746'; 
// export const nft_address = '0xeaca9a4b2c3e5a305099b8f68d90587e7f965e2e1f4b7505368872644ef95746'; 

export const apis = new aptosWeb3.WalletClient(NODE_URL, FAUCET_URL);

export const getAccount = (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const wallet = await apis.importWallet(code);
      console.log('wallet', wallet);
      const account = await aptosWeb3.WalletClient.getAccountFromMetaData(
        wallet.code,
        wallet.accounts[0]
      );
      // const PrivateKey = Buffer.from('0x020778747662f7237af06c46e204757354fd93a6e38173cc119a7c851d460e51');
      // const account = await aptosWeb3.WalletClient.getAccountFromPrivateKey(PrivateKey);
      resolve(account);
    } catch (error) {
      reject(error);
    }
  })
}

// Example
// import { contractService } from "@/api/contract";
// const hash = await contractService({ module: 'routel', func: 'change_my_fee', args: [1] });
export const contractService = async ({
  module,
  func,
  args,
  code,
  isNft = false
  // simpleUni = uni
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const account = await getAccount(code);
      const txn = await apis.aptosClient.generateTransaction(
        account.address().toString(),
        {
          function: `${isNft ? nft_address : address}::${module}::${func}`,
          type_arguments: [],
          arguments: args,
        }
      );
      const hash = await apis.signAndSubmitTransaction(account, txn);
      resolve(hash);
    } catch (error) {
      try {
        const jsonErr = JSON.parse(error.message);
        if (jsonErr && jsonErr.message && jsonErr.message.includes && jsonErr.message.includes('INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE')) {
          error = {
            ...jsonErr,
            message: 'Insufficient balance transaction fee'
          }
        }
      } catch (error) {
        
      }
      reject(error);
    }
  })
};
