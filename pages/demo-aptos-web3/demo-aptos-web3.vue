<template>
	<view>
		demo aptos web3
	</view>
</template>

<script module="walletWeb" lang="renderjs">
	import { contractService } from "@/api/contract";
	const aptosWeb3 = require('@martiandao/aptos-web3-bip44.js');
	const NODE_URL = "https://fullnode.testnet.aptoslabs.com";
	const FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
	const apis = new aptosWeb3.WalletClient(NODE_URL, FAUCET_URL);

	async function testSignAndSubmitTransaction() {
		const wallet = await apis.importWallet('audit spread flavor jewel volume awful mammal napkin forget poem siren pride');
    const account = await aptosWeb3.WalletClient.getAccountFromMetaData(
      wallet.code,
      wallet.accounts[0]
    );
	
		const res = await contractService({ module: 'routel', func: 'change_my_fee', args: [1] });
		console.log('res', res);
		
	}
	testSignAndSubmitTransaction()

	async function testCreateAnImport() {
		const wallet1 = await apis.createWallet();
		console.log('', wallet1);
		const wallet2 = await apis.importWallet('lunar neck camera dumb fragile rigid top sell busy solar sausage end');
		console.log('', wallet2);
	}
	// testCreateAnImport()

	async function testTransferCoin()  {
	    const alice = await apis.createWallet();
	    const aliceAccount = await aptosWeb3.WalletClient.getAccountFromMetaData(alice.code, alice.accounts[0]);
	    await apis.airdrop(aliceAccount.address().toString(), 10000000);
			console.log('aliceAccount', aliceAccount)

	    const bob = await apis.createWallet();
	    const bobAccount = await aptosWeb3.WalletClient.getAccountFromMetaData(bob.code, bob.accounts[0]);
	    await apis.airdrop(bobAccount.address().toString(), 10000000);
			console.log('bobAccount', bobAccount)

	    // the address will change with time
	    const coin_type_path = `0x1::aptos_coin::AptosCoin`;

			
	    // const initializeCoinRes = await apis.initializeCoin(aliceAccount, coin_type_path, "Martian Coin", "MAR", 6);
			const registerCoinAliceRes = await apis.registerCoin(aliceAccount, coin_type_path);
	    const registerCoinBobRes = await apis.registerCoin(bobAccount, coin_type_path);
	    const mintCoinRes = await apis.mintCoin(aliceAccount, coin_type_path, aliceAccount.address().toString(), 3000);

			const aliceBeforeCoinBalance = await apis.getCoinBalance(aliceAccount.address().toString(), coin_type_path);
	    const bobBeforeCoinBalance = await apis.getCoinBalance(bobAccount.address().toString(), coin_type_path);
			console.log('aliceBeforeCoinBalance', aliceBeforeCoinBalance)
			console.log('bobBeforeCoinBalance', bobBeforeCoinBalance)

	    const transferCoinRes = await apis.transferCoin(aliceAccount, coin_type_path, bobAccount.address().toString(), 1000);
			
	    const aliceAfterCoinBalance = await apis.getCoinBalance(aliceAccount.address().toString(), coin_type_path);
			const bobAfterCoinBalance = await apis.getCoinBalance(bobAccount.address().toString(), coin_type_path);
	    console.log('aliceAfterCoinBalance', aliceAfterCoinBalance)
			console.log('bobAfterCoinBalance', bobAfterCoinBalance)
	}
	// testTransferCoin()
</script>

<script>

	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">

</style>
