import { HOME_BILLS } from '@/constants/data';
import { create } from 'zustand';

interface billStore {
  bills: Bill[];
  addBill: (bills: Bill) => void;
  setBills: (bills: Bill[]) => void;
}

export const useBillStore = create<billStore>((set) => ({
  bills: HOME_BILLS,
  addBill: (bill) =>
    set((state) => ({ bills: [bill, ...state.bills] })),
  setBills: (bills) => set({ bills }),
}));