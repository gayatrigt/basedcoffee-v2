import {
    decodeEventLog,
    type TransactionReceipt
} from 'viem'
import { abi } from '~/abi/abi'


export function decodeProjectCreatedEvent(receipt: TransactionReceipt) {
    const events = receipt?.logs.map(log => {
        try {
            const decodedLog = decodeEventLog({
                abi: abi,
                data: log.data,
                topics: log.topics,
            })

            return {
                ...decodedLog,
                address: log.address,
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                transactionIndex: log.transactionIndex,
                blockHash: log.blockHash,
                logIndex: log.logIndex,
                removed: log.removed
            }
        } catch (error) {
            console.warn('Failed to decode log', log, error)
            return null
        }
    }).filter(Boolean)

    return (events?.[0]?.args as any).projectAddress as string
}
// Usage example:
// import { abi as factoryAbi } from './CrowdFundingFactory.json'
// const receipt = await publicClient.waitForTransactionReceipt({ hash })
// const decodedLogs = decodeTransactionLogs(receipt, factoryAbi)
// const projectCreatedEvent = decodedLogs.find(log => log.eventName === 'ProjectCreated')
// if (projectCreatedEvent) {
//   console.log('New project address:', projectCreatedEvent.args.projectAddress)
// }