import algosdk from 'algosdk'
import dotenv from 'dotenv'
dotenv.config()

const algodClient = new algosdk.Algodv2('', process.env.ALGOD_API_URL!, '')

async function getAppDetails(appIdx: string) {
	const appId = parseInt(appIdx)
	try {
		const appInfo = await algodClient.getApplicationByID(appId).do()

		// Format the output nicely
		console.log('=== APPLICATION DETAILS ===')
		console.log(`App ID: ${appInfo.id}`)
		console.log(`Creator: ${appInfo.params.creator}`)
		console.log(`Global State Schema: ${JSON.stringify(appInfo.params.globalStateSchema)}`)
		console.log(`Local State Schema: ${JSON.stringify(appInfo.params.localStateSchema)}`)

		// Decode global state
		console.log('\n=== GLOBAL STATE ===')
		appInfo.params.globalState &&
			appInfo.params.globalState.forEach((state: any) => {
				const key = Buffer.from(state.key, 'base64').toString()
				let value
				if (state.value.type === 1) {
					// byte slice
					value = Buffer.from(state.value.bytes, 'base64').toString()
				} else {
					// integer
					value = state.value.uint
				}
				console.log(`${key}: ${value}`)
			})

		// Decode programs
		console.log('\n=== PROGRAM INFO ===')
		console.log(`Approval Program Length: ${appInfo.params.approvalProgram.length} bytes`)
		console.log(`Clear Program Length: ${appInfo.params.clearStateProgram.length} bytes`)

		const appBoxes = await algodClient.getApplicationBoxes(appId).do()
		console.log('\n=== APPLICATION BOXES ===')
		console.log(`Total Boxes: ${appBoxes.boxes?.length || 0}`)
	} catch (error) {
		console.error('Error fetching app details:', error)
	}
}
getAppDetails(process.env.APP_ID!)
