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
    status?: string;
    doDate?: string;
    assignee: string;
    color?: string;
  }

  interface ChoreCardProps extends Omit<Bill, "id"> {
    expanded: boolean;
    onPress: () => void;
    onCancelPress?: () => void;
    isCancelling?: boolean;
  }

  interface AssignedChore {
    id: string;
    icon: ImageSourcePropType;
    name: string;
    daysLeft: number;
    status: string;
  }

  interface AssignedChoreCardProps extends Omit<AssignedChore, "id"> {}

  interface ListHeadingProps {
    title: string;
  }

  type Slide = { key: string; icon: string; title: string; subtitle: string };
}

export { };

