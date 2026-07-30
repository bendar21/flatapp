import { icons } from "./icons";

export const tabs: AppTab[] = [
  { name: "index", title: "Home", icon: icons.home },
  { name: "explore", title: "Explore", icon: icons.wallet },
  { name: "activity", title: "Activity", icon: icons.activity },
  { name: "settings", title: "Settings", icon: icons.setting },
];

export const SLIDES: Slide[] = [
  {
    key: "bills",
    icon: "💸",
    title: "Never chase a bill again",
    subtitle: "See what's owing and who owes it, all in one place.",
  },
  {
    key: "chores",
    icon: "🧹",
    title: "Chores that rotate fairly",
    subtitle:
      "Automatic rotation means no more arguing about whose turn it is.",
  },
  {
    key: "flat",
    icon: "🏠",
    title: "Keep your flat in the loop",
    subtitle: "One shared home for bills, chores, and what's coming up.",
  },
];
