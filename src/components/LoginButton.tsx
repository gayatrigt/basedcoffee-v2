'use client';
import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
    return (
        <WalletWrapper
            // className="min-w-[90px]"
            text="Login"
            className='border-2 py-2 rounded-md bg-white/20 border-slate-600 backdrop-blur-sm text-[#030712] hover:border-slate-500 w-full '
            withWalletAggregator={true}
        />
    );
}
