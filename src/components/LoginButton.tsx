'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LoginButton = () => {
    return (
        <Link href={"/feed"}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                // onClick={handleSupportButton}
                className='bg-blue-600 text-white/80 py-2 w-full mt-2 rounded-md font-medium'
            >
                Connect your wallet
            </motion.button>
        </Link>
    )
}

export default LoginButton