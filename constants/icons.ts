import activity from "@/assets/icons/activity.png";
import add from "@/assets/icons/add.png";
import back from "@/assets/icons/back.png";
import bathroom from "@/assets/icons/bathroom.png";
import home from "@/assets/icons/home.png";
import chores from "@/assets/icons/list.png";
import medium from "@/assets/icons/medium.png";
import menu from "@/assets/icons/menu.png";
import netflix from "@/assets/icons/netflix.png";
import openai from "@/assets/icons/openai.png";
import plus from "@/assets/icons/plus.png";
import power from "@/assets/icons/power.png";
import rent from "@/assets/icons/rent.png";
import setting from "@/assets/icons/setting.png";
import spotify from "@/assets/icons/spotify.png";
import wallet from "@/assets/icons/wallet.png";
import wifi from "@/assets/icons/wifi.png";

export const icons = {
  home,
  wallet,
  setting,
  activity,
  add,
  back,
  menu,
  plus,
  openai,
  medium,
  spotify,
  bathroom,
  rent,
  power,
  wifi,
  netflix,
  chores,
} as const;

export type IconKey = keyof typeof icons;
