import React, { useState, useCallback } from 'react';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import {
    Transaction,
    TransactionButton,
    TransactionSponsor,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import { base, baseSepolia } from 'viem/chains';
import CROWDFUNDING_PROJECT_ABI from "../abi/CrowdFundingProject.json";
import { encodeFunctionData, Hex, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { ChevronLeft } from 'lucide-react';

interface SupportCardViewProps {
    onClose: () => void;
    fundingContractAddress?: string;
}

const SupportCardView: React.FC<SupportCardViewProps> = ({ onClose, fundingContractAddress }) => {
    const { address } = useAccount();
    const [amount, setAmount] = useState('0.0001');

    const contributeFunctionData = encodeFunctionData({
        abi: CROWDFUNDING_PROJECT_ABI,
        functionName: 'contribute',
    });

    const calls = [
        {
            to: fundingContractAddress as Hex,
            data: contributeFunctionData,
            value: parseEther(amount),
        },
    ];

    const handleOnStatus = useCallback(async (status: LifecycleStatus) => {
        console.log('LifecycleStatus', status);

        if (status.statusName === 'success' && status.statusData.transactionReceipts[0]) {
            const txnHash = status.statusData.transactionReceipts[0].transactionHash;

            try {
                const response = await fetch('/api/support-fund', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userAddress: address,
                        contract: fundingContractAddress,
                        amount: amount,
                        txnHash: txnHash,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create support record');
                }

                const result = await response.json();
                console.log('Support record created:', result);
            } catch (error) {
                console.error('Error creating support record:', error);
            }
        }
    }, [address, fundingContractAddress, amount]);

    return (
        <>
            <button
                onClick={onClose}
                className="text-gray-200 hover:text-gray-200 py-1 mb-6 flex items-center space-x-2 px-2 pr-4 rounded-md bg-white/20"
            >
                <ChevronLeft className='h-6 w-6' />
                <span className='mt-1'>Back</span>
            </button>
            <h2 className="text-lg font-semibold mb-4 font-accent text-white uppercase">How many coffees?</h2>
            <div className="mb-4">
                <label htmlFor="amount" className="block mb-2 text-gray-200">
                    Amount (ETH):
                </label>
                <input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-800"
                />
            </div>
            <Transaction
                chainId={base.id}
                calls={calls}
                onStatus={handleOnStatus}
            >
                <TransactionButton
                    className="bg-blue-600 text-white py-2 w-full rounded-md font-semibold"
                    text="Buy Coffee"
                />
                <TransactionSponsor />
                <TransactionStatus className="text-black mt-2">
                    <TransactionStatusLabel className="text-black/80 [&_p]:!text-black" />
                    <TransactionStatusAction className="text-black/80" />
                </TransactionStatus>
            </Transaction>
        </>
    );
};

export default SupportCardView;