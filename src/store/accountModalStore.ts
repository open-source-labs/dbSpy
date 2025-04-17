import { create } from 'zustand';

interface AccountModalState {
  saveDbModalOpened: boolean;
  loadDbModalOpened: boolean;
  deleteDbModalOpened: boolean;

  nameArr: string[];
  setNameArr: (arr: string[]) => void;
  
  setSaveDbModalOpen: () => void;
  setSaveDbModalClose: () => void;
  setLoadDbModalOpen: () => void;
  setLoadDbModalClose: () => void;
  setDeleteDbModalOpen: () => void;
  setDeleteDbModalClose: () => void;
}

export const accountModalStore = create<AccountModalState>((set) => ({
  saveDbModalOpened: false,
  loadDbModalOpened: false,
  deleteDbModalOpened: false,
  nameArr: [],

  setSaveDbModalOpen: () => set({ saveDbModalOpened: true }),
  setSaveDbModalClose: () => set({ saveDbModalOpened: false }),

  setLoadDbModalOpen: () => set({ loadDbModalOpened: true }),
  setLoadDbModalClose: () => set({ loadDbModalOpened: false }),

  setDeleteDbModalOpen: () => set({ deleteDbModalOpened: true }),
  setDeleteDbModalClose: () => set({ deleteDbModalOpened: false }),

  setNameArr: (arr) => set({ nameArr: arr }),
}));