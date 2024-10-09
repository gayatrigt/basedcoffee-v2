"use client";
import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import CurrencyInput from 'react-currency-input-field';
import { upload } from '@vercel/blob/client';
import { useAccount } from 'wagmi';

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

const CreatePage: React.FC = () => {
    const { address } = useAccount();
    const [selectedCategory, setSelectedCategory] = useState<number>(1);
    const [goalAmount, setGoalAmount] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [video, setVideo] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGoalAmountChange = (value: string | undefined) => {
        setGoalAmount(value || '');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
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
                    amount: parseFloat(goalAmount),
                    videoUrl: url,
                    // You would typically get the wallet address from your authentication system
                    walletAddress: address
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create fundraise');
            }

            const data = await response.json();
            setSubmitMessage(`Fundraise proposal submitted successfully! Fundraise ID: ${data.fundraise.id}`);
        } catch (error) {
            console.error('Error submitting fundraise:', error);
            setSubmitMessage(`Error submitting fundraise: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatIndianCurrency = (value: string): string => {
        const number = parseFloat(value);
        if (isNaN(number)) return '';
        return formatter.format(number);
    };

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
                        // transformRawValue={formatIndianCurrency}
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