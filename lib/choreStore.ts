import { HOME_CHORES } from "@/constants/data";
import { ensureWeeklyAssignments } from "@/lib/choreAssignments";
import { create } from "zustand";

interface ChoreStore {
  chores: Chore[];
  assignments: ChoreAssignment[];
  addChore: (chore: Chore) => void;
  setChores: (chores: Chore[]) => void;
  addAssignment: (assignment: ChoreAssignment) => void;
  completeAssignment: (assignmentId: string) => void;
  generateThisWeek: () => void;
}

export const useChoreStore = create<ChoreStore>((set, get) => ({
  chores: HOME_CHORES,
  assignments: [],

  addChore: (chore) => {
    set((state) => ({ chores: [chore, ...state.chores] }));
    // A brand-new chore has no assignment yet — generate one right away
    // rather than waiting for the next app launch.
    get().generateThisWeek();
  },

  setChores: (chores) => set({ chores }),

  addAssignment: (assignment) =>
    set((state) => ({ assignments: [...state.assignments, assignment] })),

  completeAssignment: (assignmentId) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, completed: true, completedAt: new Date().toISOString() }
          : a,
      ),
    })),

  generateThisWeek: () => {
    const { chores, assignments, addAssignment } = get();
    ensureWeeklyAssignments(chores, assignments, addAssignment);
  },
}));
