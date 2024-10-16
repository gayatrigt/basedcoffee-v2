import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FundFormState {
    selectedCategory: number;
    goalAmount: string;
    title: string;
    description: string;
    videoUrl: string;
    fundContract?: string;
    savedDetails: any | null;
    setSelectedCategory: (category: number) => void;
    setGoalAmount: (amount: string) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setVideoUrl: (url: string) => void;
    setFundContract: (contractAddress: string) => void;
    setSavedDetails: (details: any | null) => void;
    reset: () => void;
}

const initialState = {
    selectedCategory: 1,
    goalAmount: '',
    title: '',
    videoUrl: 'https://isrjp0cckdzhlbu3.public.blob.vercel-storage.com/Sequence%2001_2-44E2qc0dlL0JCIbXZ9z7MXA7o6gRv9.mp4',
    description: '',
    savedDetails: null,
    fundContract: undefined,
};

export const useFundFormStore = create<FundFormState>()(
    persist(
        (set) => ({
            ...initialState,
            setSelectedCategory: (category) => set({ selectedCategory: category }),
            setGoalAmount: (amount) => set({ goalAmount: amount }),
            setTitle: (title) => set({ title }),
            setDescription: (description) => set({ description }),
            setVideoUrl: (url) => set({ videoUrl: url }),
            setSavedDetails: (details) => set({ savedDetails: details }),
            reset: () => set(initialState),
            setFundContract: (contractAddress) => set({ fundContract: contractAddress }),
        }),
        {
            name: 'fund-form-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);