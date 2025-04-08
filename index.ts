import { compileContract } from './compile'
import algosdk from 'algosdk'

require('dotenv').config()

const algodClient = new algosdk.Algodv2('', process.env.ALGOD_API_URL!, '')
const mnemonic = process.env.MNEMONIC!
const account = algosdk.mnemonicToSecretKey(mnemonic)

async function createApp(compiledApproval: algosdk.modelsv2.CompileResponse, compiledClear: algosdk.modelsv2.CompileResponse) {
	const params = await algodClient.getTransactionParams().do()
	const onComplete = algosdk.OnApplicationComplete.NoOpOC

	const txn = algosdk.makeApplicationCreateTxnFromObject({
		sender: account.addr,
		onComplete,
		suggestedParams: params,
		approvalProgram: new Uint8Array(Buffer.from(compiledApproval.result, 'base64')),
		clearProgram: new Uint8Array(Buffer.from(compiledClear.result, 'base64')),
		numGlobalInts: 4,
	})

	const signedTxn = txn.signTxn(account.sk)
	const txId = txn.txID().toString()

	console.log(signedTxn)
	await algodClient.sendRawTransaction(signedTxn).do()
	console.log('Transaction ID: ', txId)

	const result = await algosdk.waitForConfirmation(algodClient, txId, 4)
	console.log('Application created successfully')

	const appId = result['applicationIndex']
	console.log('Created Application ID:', appId)
	return appId
}

async function main() {
	const compiledApproval = await compileContract(algodClient, 'vote.teal')
	const compiledClear = await compileContract(algodClient, 'clear.teal')

	await createApp(compiledApproval, compiledClear)
}

main().catch(console.error)
