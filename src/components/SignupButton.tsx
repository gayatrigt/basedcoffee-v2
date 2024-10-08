'use client';
import WalletWrapper from './WalletWrapper';

export default function SignupButton() {
    return (
        <WalletWrapper
            // className="ockConnectWallet_Container min-w-[90px] shrink border-2 border-slate-200 bg-transparent backdrop-blur-sm text-[#030712] hover:border-slate-300"
            className='bg-blue-600 text-white/80 py-2 w-full rounded-md border-2 border-blue-600 hover:bg-blue-700'
            text="Sign up"
        />
    );
}
