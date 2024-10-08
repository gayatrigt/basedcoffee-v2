'use client';
import {
    Address,
    Avatar,
    EthBalance,
    Identity,
    Name,
} from '@coinbase/onchainkit/identity';
import {
    ConnectWallet,
    ConnectWalletText,
    Wallet,
    WalletDropdown,
    WalletDropdownBasename,
    WalletDropdownDisconnect,
    WalletDropdownFundLink,
    WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import { twMerge } from 'tailwind-merge';
import { RxAvatar } from "react-icons/rx";
import { PiSpinnerGap } from "react-icons/pi";

type WalletWrapperParams = {
    text?: string;
    className?: string;
    withWalletAggregator?: boolean;
};
export default function WalletWrapper({
    className,
    text,
    withWalletAggregator = false,
}: WalletWrapperParams) {
    return (
        <>
            <Wallet className='flex-1'>
                <ConnectWallet
                    withWalletAggregator={withWalletAggregator}
                    className={twMerge(className, 'w-full text-white')}
                // text='Connect Wallet'
                >
                    <Avatar
                        defaultComponent={<RxAvatar className='h-6 w-6' />}
                        loadingComponent={<PiSpinnerGap className='h-6 w-6 animate-spin' />}
                        className="h-6 w-6 text-white"
                    />
                    <Name className='text-white' />

                    <ConnectWalletText>
                        {text}
                    </ConnectWalletText>
                </ConnectWallet>

                <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
                        <Avatar />
                        <Name />
                        <Address />
                        <EthBalance />
                    </Identity>
                    <WalletDropdownBasename />
                    <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
                        Go to Wallet Dashboard
                    </WalletDropdownLink>
                    <WalletDropdownFundLink />
                    <WalletDropdownDisconnect />
                </WalletDropdown>
            </Wallet>
        </>
    );
}
