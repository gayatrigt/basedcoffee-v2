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
import fundingProject from "../abi/CrowdFundingProject.json";

const SupportButton = () => {

    const handleOnStatus = useCallback((status: LifecycleStatus) => {
        console.log('LifecycleStatus', status);
    }, []);

    return (
        <Transaction
            chainId={base.id}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            contracts={fundingProject as any}
            onStatus={handleOnStatus}
        >
            <TransactionButton />
            <TransactionSponsor />
            <TransactionStatus>
                <TransactionStatusLabel />
                <TransactionStatusAction />
            </TransactionStatus>
        </Transaction>
    )
}

export default SupportButton