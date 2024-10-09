"use client";
import React, { useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const categories = [
    { id: 1, name: 'Education' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Community' },
    { id: 4, name: 'Health' },
    { id: 5, name: 'Environment' },
    { id: 6, name: 'Technology' },
];

const CreatePage: React.FC = () => {
    const [query, setQuery] = useState('');
    console.log("🚀 ~ query:", query)
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredCategories =
        !query.length
            ? categories
            : categories.filter((category) => {
                return category.name.toLowerCase().includes(query.toLowerCase());
            });
    console.log("🚀 ~ filteredCategories:", filteredCategories)

    return (
        <main className="flex h-[100dvh] flex-col items-center justify-center bg-slate-100 p-4">
            <h1 className="font-accent text-2xl text-blue-600 leading-normal font-bold tracking-wider my-12 mt-24 text-center">
                CREATE YOUR<br />FUNDRAISE
            </h1>

            <div className='border border-dashed border-blue-700 text-center rounded-lg flex-1 mb-4 w-full flex justify-center items-center'>
                <h2 className="text-xl text-gray-600">Upload a 2 minute video pitch</h2>
                <input
                    type="file"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hidden"
                />
            </div>

            <div className="w-full max-w-md space-y-4">
                <Combobox value={selectedCategory} onChange={setSelectedCategory}>
                    <div className="relative mt-1">
                        <ComboboxInput
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(category: { name: string } | null) => category?.name || ''}
                            placeholder="Select a category"
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </ComboboxButton>
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredCategories.map((category) => (
                                <ComboboxOption
                                    key={category.id}
                                    value={category}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                        }`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {category.name}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-blue-600'
                                                        }`}
                                                >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))}
                        </ComboboxOptions>
                    </div>
                </Combobox>

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
                    <input
                        type="text"
                        placeholder="Amount in INR"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sticky bottom-2"
                >
                    Create Fundraise
                </button>
            </div>
        </main>
    );
}

export default CreatePage;