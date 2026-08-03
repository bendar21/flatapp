import { icons } from "./icons";

export const tabs: AppTab[] = [
  { name: "index", title: "Home", icon: icons.home },
  { name: "explore", title: "Explore", icon: icons.wallet },
  { name: "activity", title: "Activity", icon: icons.activity },
  { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
    name: "Adrian | JS Mastery",
};

export const HOME_BALANCE = {
    amount: 2489.48,
    nextRenewalDate: "2026-03-18T09:00:00.000Z",
};

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

export const UPCOMING_BILLS: UpcomingBill[] = [
    {
        id: "spotify",
        icon: icons.spotify,
        name: "Spotify",
        price: 5.99,
        currency: "USD",
        daysLeft: 2,
    },
    {
        id: "notion",
        icon: icons.notion,
        name: "Notion",
        price: 12.0,
        currency: "USD",
        daysLeft: 4,
    },
    {
        id: "figma",
        icon: icons.figma,
        name: "Figma",
        price: 15.0,
        currency: "USD",
        daysLeft: 6,
    },
];

export const HOME_BILLS: Bill[] = [
    {
        id: "adobe-creative-cloud",
        icon: icons.adobe,
        name: "Adobe Creative Cloud",
        plan: "Teams Plan",
        category: "Design",
        paymentMethod: "Visa ending in 8530",
        status: "active",
        startDate: "2025-03-20T10:00:00.000Z",
        price: 77.49,
        currency: "USD",
        billing: "Monthly",
        renewalDate: "2026-03-20T10:00:00.000Z",
        color: "#f5c542",
    },
    {
        id: "github-pro",
        icon: icons.github,
        name: "GitHub Pro",
        plan: "Developer",
        category: "Developer Tools",
        paymentMethod: "Mastercard ending in 2408",
        status: "active",
        startDate: "2024-11-24T10:00:00.000Z",
        price: 9.99,
        currency: "USD",
        billing: "Monthly",
        renewalDate: "2026-03-24T10:00:00.000Z",
        color: "#e8def8",
    },
    {
        id: "claude-pro",
        icon: icons.claude,
        name: "Claude Pro",
        plan: "Pro Plan",
        category: "AI Tools",
        paymentMethod: "Amex ending in 1010",
        status: "paused",
        startDate: "2025-06-27T10:00:00.000Z",
        price: 20.0,
        currency: "USD",
        billing: "Monthly",
        renewalDate: "2026-03-27T10:00:00.000Z",
        color: "#b8d4e3",
    },
    {
        id: "canva-pro",
        icon: icons.canva,
        name: "Canva Pro",
        plan: "Yearly Access",
        category: "Design",
        paymentMethod: "Visa ending in 7784",
        status: "cancelled",
        startDate: "2024-04-02T10:00:00.000Z",
        price: 119.99,
        currency: "USD",
        billing: "Yearly",
        renewalDate: "2026-04-02T10:00:00.000Z",
        color: "#b8e8d0",
    },
];
