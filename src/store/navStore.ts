import { create } from 'zustand';

interface NavState {
  toggleClicked: boolean;
  toggleNav: () => void;
}

export const useNavStore = create<NavState>((set) => ({
  toggleClicked: false,
  toggleNav: () => set((state) => ({ toggleClicked: !state.toggleClicked })),
}));
