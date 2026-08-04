import { HOME_CHORES } from "@/constants/data";
import { create } from "zustand";

interface choreStore {
  chores: Chore[];
  addChore: (chores: Chore) => void;
  setChores: (chores: Chore[]) => void;
}

export const useChoreStore = create<choreStore>((set) => ({
  chores: HOME_CHORES,
  addChore: (chore) => set((state) => ({ chores: [chore, ...state.chores] })),
  setChores: (chores) => set({ chores }),
}));
