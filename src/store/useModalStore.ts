import { create } from 'zustand';

interface ModalState {
  queryModalOpened: boolean;
  openQueryModal: () => void;
  closeQueryModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  queryModalOpened: false,
  openQueryModal: () => set({ queryModalOpened: true }),
  closeQueryModal: () => set({ queryModalOpened: false }),
}));
