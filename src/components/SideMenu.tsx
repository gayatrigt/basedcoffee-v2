'use client';
import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef } from "react";

import { FundButton, getOnrampBuyUrl } from '@coinbase/onchainkit/fund';
import { Avatar, EthBalance, Identity, Name } from "@coinbase/onchainkit/identity";
import { WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { usePathname, useRouter } from "next/navigation";
import { IoLogInSharp } from "react-icons/io5";
import { PiSpinnerGap } from "react-icons/pi";
import { RxAvatar } from "react-icons/rx";
import { useOnClickOutside } from 'usehooks-ts';
import { useAccount, useDisconnect } from "wagmi";
import { env } from "~/env";
import { useSidebarStore } from "~/store/sidebarStore";
import Link from 'next/link';
import { twMerge } from "tailwind-merge";

const SideBarList: React.FC = ({ }) => {
    const { data, disconnectAsync } = useDisconnect();
    console.log("args.data", data)
    const { address, isDisconnected } = useAccount({});
    console.log("🚀 ~ address:", address)
    const router = useRouter()
    const { close } = useSidebarStore()

    const onrampBuyUrl = getOnrampBuyUrl({
        projectId: env.NEXT_PUBLIC_WC_PROJECT_ID,
        addresses: { address: ['base'] },
        assets: ['USDC'],
        presetFiatAmount: 20,
        fiatCurrency: 'USD'
    });

    useEffect(() => {
        console.log("🚀 ~ useEffect ~ isDisconnected:", isDisconnected)
        if (isDisconnected) {
            // TODO: do better
            // router.push('/')
            close()
        }
    }, [isDisconnected, address])

    const handleSupportButton = () => {
        router.push('/create');
        close(); // Close the sidebar after redirecting
    };

    const handleDisconnect = () => {
        disconnectAsync()
        router.push('/')
    }

    return (
        <div className="bg-white rounded-lg h-full p-4 py-6 flex flex-col">
            <div className="flex-1">
                <h1 className=" text-blue-600 font-accent uppercase text-2xl mb-2">Based<br />Coffee</h1>

                {
                    address && <>
                        <Identity
                            address={address}
                            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                            className="border-blue-600 text-blue-600 p-2 rounded-lg mt-4 bg-white"
                        >
                            <Avatar
                                address={address}
                                defaultComponent={<RxAvatar className='h-6 w-6' />}
                                loadingComponent={<PiSpinnerGap className='h-6 w-6 animate-spin' />}
                                className="h-6 w-6 "
                            />
                            <Name className='text-blue-600' />
                        </Identity>

                        <div className="relative mt-2">
                            <span className="mb-1 text-xs text-slate-400">Balance</span>
                            <Identity
                                address={address}
                                schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                                className="text-slate-600 font-bold bg-slate-200 rounded-md py-2"
                            >
                                <EthBalance className="text-2xl" />
                            </Identity>
                            <FundButton hideText className="rounded-lg hover:bg-blue-600 focus:bg-blue-600 bg-slate-400 justify-start absolute right-0 top-0 translate-y-1/2 rounded-l-none" fundingUrl={onrampBuyUrl} />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSupportButton}
                            className='bg-blue-600 text-white py-2 w-full mt-4 rounded-md'
                        >
                            Create a Campaign
                        </motion.button>
                    </>
                }

            </div>

            <div className="grid gap-2">
                <button
                    onClick={handleDisconnect}
                    className='bg-blue-100 text-blue-600 py-2 w-full mt-auto rounded-md'
                >
                    Disconnect Wallet
                </button>
            </div>

            {/* <WalletDropdown>
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
            </WalletDropdown> */}

        </div >
    )
};

const MotionLink = motion(Link);

export const SideMenu: React.FC<{
    overlayColor?: string;
    width?: number;
}> = ({ width = 300 }) => {
    const { isOpen, setOpen, toggle, close } = useSidebarStore()
    const controls = useAnimation();
    const { address } = useAccount()
    console.log("🚀 ~ address:", address)
    const pathname = usePathname()
    const isHomepage = pathname === '/'


    const ref = useRef(null)

    useOnClickOutside(ref, close)

    useEffect(() => {
        void controls.start(isOpen ? "active" : "inactive");
    }, [isOpen, controls]);

    const sidekickBodyStyles = {
        active: {
            x: 0
        },
        inactive: {
            x: -width
        }
    };

    const menuHandlerStyles = {
        active: {
            x: 0,
            color: "#000"
        },
        inactive: {
            x: 60,
            color: "#fff"
        }
    };

    return (
        <>
            <div className="fixed inset-0 pointer-events-none z-[9999]">
                {/* <div
                    className="absolute inset-0 pointer-events-auto z-0 bg-slate-700/30"
                /> */}

                <motion.div
                    ref={ref}
                    className={`relative z-10 pointer-events-auto  p-4 h-full box-border`}
                    style={{ maxWidth: `${width}px` }}
                    drag="x"
                    dragElastic={0.1}
                    dragConstraints={{
                        left: -width,
                        right: 0
                    }}
                    dragMomentum={false}
                    onDragEnd={(_event, info) => {
                        const isDraggingLeft = info.offset.x < 0;
                        const multiplier = isDraggingLeft ? 1 / 4 : 2 / 3;
                        const threshold = width * multiplier;

                        if (Math.abs(info.point.x) > threshold && isOpen) {
                            setOpen(false);
                        } else if (Math.abs(info.point.x) < threshold && !isOpen) {
                            setOpen(true);
                        } else {
                            void controls.start(isOpen ? "active" : "inactive");
                        }
                    }}
                    initial={{ x: -width }}
                    animate={controls}
                    variants={sidekickBodyStyles}
                    transition={{ type: "spring", damping: 60, stiffness: 180 }}
                >
                    {!address && !isHomepage && <MotionLink
                        variants={menuHandlerStyles}
                        transition={{ type: "spring", damping: 60, stiffness: 180 }}
                        href="/"
                        className="border-none bg-transparent absolute top-4 right-0 outline-none"
                    >
                        <div
                            className="border-2 py-2 px-4 rounded-md bg-black/40 border-slate-600 backdrop-blur-sm text-white hover:border-slate-500 w-full transform translate-x-32 flex items-center space-x-2"
                        >
                            <IoLogInSharp /> <span className="text-sm">Login with Wallet</span>
                        </div>
                    </MotionLink>}

                    <motion.button
                        className={twMerge(
                            "border-none bg-transparent absolute top-4 right-0 outline-none",
                            address ? "opacity-100" : "opacity-0"
                        )}
                        onClick={toggle}
                        variants={menuHandlerStyles}
                        transition={{ type: "spring", damping: 60, stiffness: 180 }}
                    >
                        {address && <div className="bg-blue-600 p-1 rounded-full border-2 border-blue-600">
                            <Avatar
                                address={address}
                                defaultComponent={<RxAvatar className='h-8 w-8' />}
                                loadingComponent={<PiSpinnerGap className='h-8 w-8 animate-spin' />}
                                className="h-8 w-8 text-white"
                            />
                        </div>}
                    </motion.button>
                    <SideBarList />
                </motion.div>
            </div >
        </>
    );
};

export default SideMenu;