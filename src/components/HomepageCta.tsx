"use client";
import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import SignupButton from './SignupButton'
import LoginButton from './LoginButton'
import { useRouter } from 'next/navigation';

const HomepageCta = () => {
    const { address } = useAccount()
    const router = useRouter()

    useEffect(() => {
        if (address) {
            router.push('/feed')
        }
    }, [address])
    return (
        <div className='flex space-x-2 items-center'>
            <SignupButton />
            {!address && <LoginButton />}
        </div>
    )
}

export default HomepageCta