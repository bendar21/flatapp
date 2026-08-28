import dayjs from "dayjs";

// Monday of the current week as an ISO date — the anchor every
// assignment for "this week" is generated against.
export function currentWeekStart(): string {
  const today = dayjs();
  const monday =
    today.day() === 0
      ? today.subtract(6, "day")
      : today.startOf("week").add(1, "day");
  return monday.format("YYYY-MM-DD");
}

function pickAssignee(chore: Chore, existing: ChoreAssignment[]): string {
  if (chore.delegationType === "fixed_rotation") {
    // Cycle through members in order, based on how many assignments
    // this chore has had so far — same person never goes twice in a
    // row unless the flat only has one member.
    const priorCount = existing.filter((a) => a.choreId === chore.id).length;
    return chore.members[priorCount % chore.members.length];
  }
  // random_weekly
  return chore.members[Math.floor(Math.random() * chore.members.length)];
}

// Call this once when the app loads (signed-in Home screen is a good
// spot). For every chore, if this week doesn't already have an
// assignment, create one. Safe to call repeatedly — already-assigned
// weeks are skipped, so it won't reshuffle someone's turn mid-week.
export function ensureWeeklyAssignments(
  chores: Chore[],
  assignments: ChoreAssignment[],
  addAssignment: (a: ChoreAssignment) => void,
) {
  const weekStart = currentWeekStart();

  for (const chore of chores) {
    const alreadyAssigned = assignments.some(
      (a) => a.choreId === chore.id && a.weekStart === weekStart,
    );
    if (alreadyAssigned) continue;

    addAssignment({
      id: `${chore.id}-${weekStart}`,
      choreId: chore.id,
      weekStart,
      assignee: pickAssignee(chore, assignments),
      completed: false,
    });
  }
}
