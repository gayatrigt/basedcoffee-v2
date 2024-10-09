"use client";
import React, { useState, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import CurrencyInput from 'react-currency-input-field';

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

const CreatePage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number>(1);
    const [goalAmount, setGoalAmount] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGoalAmountChange = (value: string | undefined) => {
        setGoalAmount(value || '');
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'video/mp4') {
                setSelectedFile(file);
                console.log('MP4 file selected:', file.name);
            } else {
                alert('Please select an MP4 file only.');
                event.target.value = ''; // Reset the file input
            }
        }
    };

    return (
        <main className="flex h-[100dvh] flex-col items-center justify-center bg-slate-100 p-4">
            <h1 className="font-accent text-2xl text-blue-600 leading-normal font-bold tracking-wider my-12 mt-24 text-center">
                CREATE YOUR<br />FUNDRAISE
            </h1>

            <div
                onClick={handleUploadClick}
                className='border border-dashed border-blue-700 text-center rounded-lg flex-1 mb-4 w-full flex flex-col justify-center items-center cursor-pointer hover:bg-blue-50 transition-colors duration-200'
            >
                <h2 className="text-xl text-gray-600 mb-2">Upload a 2 minute MP4 video pitch</h2>
                {selectedFile ? (
                    <p className="text-sm text-green-600">Selected: {selectedFile.name}</p>
                ) : (
                    <p className="text-sm text-gray-500">No file selected. Click to upload.</p>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp4,video/mp4"
                    onChange={handleFileChange}
                    className="hidden"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <h2 className="text-lg text-gray-600">Briefly explain how you will utilise the funds, and why is it required?</h2>
                    <textarea
                        placeholder="Describe your fundraise"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
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
                >
                    Create Fundraise
                </button>
            </div>
        </main>
    );
}

export default CreatePage;