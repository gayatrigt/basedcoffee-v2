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
import { base } from 'viem/chains';
import CROWDFUNDING_PROJECT_ABI from "../abi/CrowdFundingProject.json";
import { encodeFunctionData, Hex, parseEther } from 'viem';

interface SupportButtonProps {
    fundingContractAddress?: `0x${string}`;
}
const SupportButton: React.FC<SupportButtonProps> = ({ fundingContractAddress = '0xff5428308a5e9d9a84e2722beb7a248208f84b1b' }) => {
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
    const handleOnStatus = useCallback((status: LifecycleStatus) => {
        console.log('LifecycleStatus', status);
    }, []);

    return (
        <Transaction
            chainId={base.id}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            calls={calls}
            onStatus={handleOnStatus}
        >
            <TransactionButton
                className='bg-blue-600 text-white/80 py-2 w-full mt-2 rounded-md font-semibold'
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