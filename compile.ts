import algosdk from 'algosdk'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

async function compileContract(algodClient: algosdk.Algodv2, filename: string) {
	const source = await fs.promises.readFile(filename, 'utf8')
	const compiled = await algodClient.compile(source).do()
	return compiled
}

export { compileContract }
