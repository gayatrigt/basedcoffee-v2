'use client';
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

import { useSidebarStore } from "~/store/sidebarStore";
import { Avatar } from "@coinbase/onchainkit/identity";
import { PiSpinnerGap } from "react-icons/pi";
import { RxAvatar } from "react-icons/rx";
import { useAccount } from "wagmi";
import { useOnClickOutside } from 'usehooks-ts'

const SideBarList: React.FC = ({ }) => (
    <div className="bg-white rounded-lg h-full p-4">This is content</div>
);

export const SideMenu: React.FC<{
    overlayColor?: string;
    width?: number;
}> = ({ overlayColor = "transparent", width = 300 }) => {
    const { isOpen, setOpen, toggle, close } = useSidebarStore()
    const controls = useAnimation();
    const { address } = useAccount()
    console.log("🚀 ~ address:", address)

    const ref = useRef(null)

    useOnClickOutside(ref, close)

    useEffect(() => {
        controls.start(isOpen ? "active" : "inactive");
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
                            controls.start(isOpen ? "active" : "inactive");
                        }
                    }}
                    animate={controls}
                    variants={sidekickBodyStyles}
                    transition={{ type: "spring", damping: 60, stiffness: 180 }}
                >
                    <motion.button
                        className="border-none bg-transparent absolute top-4 right-0 outline-none bg-blue-700 p-1 rounded-full border-2 border-blue-700"
                        onClick={toggle}
                        variants={menuHandlerStyles}
                        transition={{ type: "spring", damping: 60, stiffness: 180 }}
                    >
                        {/* {isOpen ? "Close" : "Open"} */}
                        {address && <Avatar
                            address={address}
                            defaultComponent={<RxAvatar className='h-8 w-8' />}
                            loadingComponent={<PiSpinnerGap className='h-8 w-8 animate-spin' />}
                            className="h-8 w-8 text-white"
                        />}
                    </motion.button>
                    <SideBarList />
                </motion.div>
            </div>
        </>
    );
};

export default SideMenu;