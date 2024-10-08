import { create } from 'zustand'

type SidebarState = {
    isOpen: boolean
    setOpen: (isOpen: boolean) => void
    toggle: () => void
    open: () => void
    close: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isOpen: false,
    setOpen: (isOpen: boolean) => set({ isOpen }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}))