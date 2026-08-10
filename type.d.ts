import type { ImageSourcePropType } from "react-native";

declare global {
  interface AppTab {
    name: string;
    title: string;
    icon: ImageSourcePropType;
  }

  interface TabIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
  }

  interface Bill {
    id: string;
    icon: ImageSourcePropType;
    name: string;
    plan?: string;
    category?: string;
    paymentMethod?: string;
    status?: string;
    startDate?: string;
    price: number;
    currency?: string;
    billing: string;
    frequency?: string;
    renewalDate?: string;
    color?: string;
  }

  interface BillCardProps extends Omit<Bill, "id"> {
    expanded: boolean;
    onPress: () => void;
    onCancelPress?: () => void;
    isCancelling?: boolean;
  }

  interface UpcomingBill {
    id: string;
    icon: ImageSourcePropType;
    name: string;
    price: number;
    currency?: string;
    daysLeft: number;
  }

  interface UpcomingBillCardProps extends Omit<UpcomingBill, "id"> {}

  interface Chore {
    id: string;
    icon: ImageSourcePropType;
    name: string;
    category?: string;
    color?: string;
    delegationType: "random_weekly" | "fixed_rotation";
    members: string[]; // flatmates eligible for this chore's rotation
  }

  interface ChoreAssignment {
    id: string;
    choreId: string;
    weekStart: string; // ISO date, always a Monday — "2026-08-03"
    assignee: string;
    completed: boolean;
    completedAt?: string;
  }

  interface ChoreCardProps extends Omit<Chore, "id"> {
    expanded: boolean;
    onPress: () => void;
    currentAssignee?: string;
    completed?: boolean;
    onCancelPress?: () => void;
    isCancelling?: boolean;
  }

  interface AssignedChoreCardProps {
    choreName: string;
    icon: ImageSourcePropType;
    daysLeft: number;
    completed: boolean;
    onComplete: () => void;
  }

  interface ChoreRowProps {
    name: string;
    icon: ImageSourcePropType;
    assignee: string;
    completed: boolean;
    onComplete: () => void;
  }

  interface ListHeadingProps {
    title: string;
  }

  type Slide = { key: string; icon: string; title: string; subtitle: string };
}

export { };

