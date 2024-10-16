import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import {
    Transaction,
    TransactionButton,
    TransactionSponsor,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import { useCallback } from 'react';
import { base, baseSepolia } from 'viem/chains';
import CROWDFUNDING_PROJECT_ABI from "../abi/CrowdFundingProject.json";
import { encodeFunctionData, Hex, parseEther } from 'viem';
import { useAccount } from 'wagmi';

interface SupportButtonProps {
    fundingContractAddress?: string;
    amount?: number
}

const SupportButton: React.FC<SupportButtonProps> = ({ fundingContractAddress, amount }) => {
    const { address } = useAccount()
    const fixedAmount = '0.0001'; // 0.001 ETH

    const contributeFunctionData = encodeFunctionData({
        abi: CROWDFUNDING_PROJECT_ABI,
        functionName: 'contribute',
    });

    const calls = [
        {
            to: fundingContractAddress as Hex,
            data: contributeFunctionData,
            value: parseEther(fixedAmount),
        },
    ];
    console.log("🚀 ~ calls:", calls)

    const handleOnStatus = useCallback(async (status: LifecycleStatus) => {
        console.log('LifecycleStatus', status);

        if (status.statusName === 'success' && status.statusData.transactionReceipts[0]) {
            const txnHash = status.statusData.transactionReceipts[0].transactionHash

            try {
                const response = await fetch('/api/support', { // Adjust the endpoint as needed
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userAddress: address, // Replace with actual user address
                        contract: fundingContractAddress, // Replace with actual contract address
                        amount: fixedAmount, // Replace with actual amount
                        txnHash: txnHash, // Replace with actual transaction hash
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create support record');
                }

                const result = await response.json();
                console.log('Support record created:', result);
            } catch (error) {
                console.error('Error creating support record:', error);
                // Handle error (e.g., show error message to user)
            }

        }
    }, []);

    return (
        <Transaction
            chainId={baseSepolia.id}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            calls={calls}
            onStatus={handleOnStatus}
        >
            <TransactionButton
                className='bg-blue-600 text-white py-2 w-full mt-2 rounded-md font-semibold'
                text='Send a Cofffee'
            />
            <TransactionSponsor />
            <TransactionStatus>
                <TransactionStatusLabel />
                <TransactionStatusAction />
            </TransactionStatus>
        </Transaction>
    )
}

export default SupportButton