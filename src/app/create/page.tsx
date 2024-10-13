'use client'

import { LifecycleStatus, Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import React, { useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { twMerge } from 'tailwind-merge';
import { ContractFunctionParameters, decodeAbiParameters, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import { abi } from '~/abi/abi';

interface Category {
    id: number;
    name: string;
}

const categories: Category[] = [
    { id: 1, name: 'Education' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Community' },
    { id: 4, name: 'Health' },
    { id: 5, name: 'Environment' },
    { id: 6, name: 'Technology' },
];

const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const CreatePage = () => {
    const { address } = useAccount();
    const [selectedCategory, setSelectedCategory] = useState<number>(1);
    const [goalAmount, setGoalAmount] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [video, setVideo] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [savedDetails, setSavedDetails] = useState<any>(null);

    const handleGoalAmountChange = (value: string | undefined) => {
        setGoalAmount(value || '');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    };

    const convertInrToEth = async (inrAmount: number): Promise<string> => {
        try {
            const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=INR');
            const data = await response.json();
            const ethToInrRate = data.INR;
            const ethAmount = inrAmount / ethToInrRate;
            return ethAmount.toFixed(18); // ETH has 18 decimal places
        } catch (error) {
            console.error('Error fetching ETH to INR rate:', error);
            throw new Error('Failed to convert INR to ETH');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            if (!video) {
                throw new Error('Please upload a video pitch');
            }

            // Upload video
            const formData = new FormData();
            formData.append('file', video);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload video');
            }

            const { url } = await uploadResponse.json();

            // Convert INR to ETH
            const ethAmount = await convertInrToEth(parseFloat(goalAmount));

            console.log(goalAmount)

            // Save fundraise data to database
            const response = await fetch('/api/create-fundraise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    category: categories.find(cat => cat.id === selectedCategory)?.name,
                    description,
                    amount: parseFloat(ethAmount),
                    amountINR: parseFloat(goalAmount),
                    videoUrl: url,
                    walletAddress: address
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create fundraise');
            }

            const data = await response.json();
            setSavedDetails(data.fundraise);
            console.log(savedDetails)
            setSubmitMessage(`Fundraise proposal submitted successfully! Fundraise ID: ${data.fundraise.id}`);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting fundraise:', error);
            setSubmitMessage(`Error submitting fundraise: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirm = () => {
        // Implement confirmation logic here
        console.log("Fundraise confirmed");
        // You might want to redirect the user or perform additional actions
    };

    const getContractArgs = () => {

        const startDate = Math.floor((Date.now() + 3 * 60 * 1000) / 1000);
        const deadline = startDate + (14 * 24 * 60 * 60); // 2 weeks from start date

        const functionName = "createProject"
        const args = [
            savedDetails.title,
            parseEther(savedDetails.amount.toString()),
            BigInt(startDate),
            BigInt(deadline)
        ]

        const contracts: ContractFunctionParameters[] = [
            {
                address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as any,
                abi: abi as any,
                functionName,
                args,
            },
        ]
        return contracts
    };


    const handleOnStatus = async (statusData: LifecycleStatus) => {
        if (statusData.statusName === "success") {
            const txn = statusData.statusData.transactionReceipts[0]?.transactionHash as any
            const id = savedDetails.id

            console.log(statusData)

            //get project address
            const logs = statusData.statusData.transactionReceipts[0]?.logs[0]

            const projectCreationLog = logs;

            if (!projectCreationLog) {
                throw new Error("Didn't get the project creation log")
            }

            const projectAddressWithZeros = projectCreationLog?.data;

            const decodedAddress = decodeAbiParameters(
                [{ type: 'address' }],
                projectAddressWithZeros as `0x${string}`,
            );
            const projectAddress = decodedAddress[0];
            console.log("🚀 ~ handleOnStatus ~ projectAddress:", projectAddress)


            try {
                const response = await fetch('/api/update-fundraise', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id,
                        txnHash: txn,
                        contract: projectAddress
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update transaction hash');
                }

                const updatedFundraise = await response.json();
                setSavedDetails(null);
                console.log('Transaction hash updated successfully');
            } catch (error) {
                console.error('Error updating transaction hash:', error);
            }
        }
    }

    if (isSuccess && savedDetails) {
        return (
            <div className="flex h-[100dvh] flex-col items-center justify-center bg-slate-100 p-4">
                <h1 className="font-accent text-2xl text-blue-600 leading-normal font-bold tracking-wider my-12 text-center">
                    FUNDRAISE DETAILS
                </h1>
                <div className="w-full max-w-md space-y-4">
                    <div>
                        <h2 className="text-lg text-gray-600">Title</h2>
                        <p className="text-xl font-semibold">{savedDetails.title}</p>
                    </div>
                    <div>
                        <h2 className="text-lg text-gray-600">Category</h2>
                        <p className="text-xl font-semibold">{savedDetails.category}</p>
                    </div>
                    <div>
                        <h2 className="text-lg text-gray-600">Description</h2>
                        <p className="text-xl">{savedDetails.description}</p>
                    </div>
                    <div>
                        <h2 className="text-lg text-gray-600">Goal Amount</h2>
                        <p className="text-xl font-semibold">{formatter.format(savedDetails.amountINR)}</p>
                    </div>

                    <div>
                        <Transaction
                            chainId={baseSepolia.id}
                            contracts={getContractArgs()}
                            onStatus={handleOnStatus}
                            className="sticky bottom-2 z-10 col-span-4 col-start-1 row-start-3 w-full h-full"
                        >
                            <TransactionButton
                                className="flex w-full items-center space-x-2 py-2 [&_span]:!text-sm md:relative md:bottom-0 md:row-start-3 border-2 border-blue-600 rounded-none uppercase bg-blue-600  text-white justify-center hover:bg-blue-600/90 transition-all duration-300"
                                text="Confirm & Create"
                            />
                            <TransactionSponsor />
                            <TransactionStatus>
                                <TransactionStatusLabel />
                                <TransactionStatusAction />
                            </TransactionStatus>
                        </Transaction>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex h-[100dvh] flex-col items-center justify-center bg-slate-100 p-4">
            <h1 className="font-accent text-2xl text-blue-600 leading-normal font-bold tracking-wider my-12 mt-24 text-center">
                CREATE YOUR<br />FUNDRAISE
            </h1>

            <div className='border border-dashed border-blue-700 text-center rounded-lg flex-1 mb-4 w-full flex justify-center items-center'
                onClick={() => fileInputRef.current?.click()}>
                <h2 className="text-xl text-gray-600"> {video ? video.name : 'Upload a 2 minute video pitch'}</h2>
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="video/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hidden"
                />
            </div>

            <div className="w-full max-w-md space-y-4">
                <div>
                    <h2 className="text-lg text-gray-600 mb-1">Category</h2>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <span
                                className={twMerge(
                                    'py-1 px-2 border-2 rounded-lg text-sm cursor-pointer',
                                    selectedCategory === category.id ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-600'
                                )}
                                onClick={() => setSelectedCategory(category.id)}
                                key={category.id}
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg text-gray-600">What do you want to raise funds for?</h2>
                    <input
                        type="text"
                        placeholder="Fundraise Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <h2 className="text-lg text-gray-600">Briefly explain how you will utilise the funds, and why is it required?</h2>
                    <textarea
                        placeholder="Describe your fundraise"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                    />
                </div>

                <div>
                    <h2 className="text-lg text-gray-600">What is the goal amount?</h2>
                    <CurrencyInput
                        id="goal-amount"
                        name="goal-amount"
                        placeholder="Amount in INR"
                        defaultValue={goalAmount}
                        decimalsLimit={2}
                        onValueChange={handleGoalAmountChange}
                        allowNegativeValue={false}
                        prefix="₹"
                        intlConfig={{
                            locale: 'en-IN',
                            currency: 'INR',
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className='bg-blue-600 text-white/80 py-2 w-full mt-2 rounded-md font-semibold'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating Fundraise...' : 'Create Fundraise'}
                </button>
                {submitMessage && (
                    <p className={`text-center ${submitMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                        {submitMessage}
                    </p>
                )}
            </div>
        </form>
    );
}

export default CreatePage;