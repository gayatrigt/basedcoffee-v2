import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface MutedState {
    isMuted: boolean;
    toggleMute: () => void;
    setMuted: (isMuted: boolean) => void;
}

export const useMutedStore = create<MutedState>()(
    persist(
        (set) => ({
            isMuted: true, // Start muted by default
            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
            setMuted: (isMuted: boolean) => set({ isMuted })
        }),
        {
            name: 'muted-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage)
        }
    )
);