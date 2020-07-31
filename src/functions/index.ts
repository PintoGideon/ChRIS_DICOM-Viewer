import { isMobile, isTablet } from "react-device-detect";
import { SETTINGS_FSVIEW } from "../constants/settings";

export function getSettingsFsView() {
  let view = localStorage.getItem(SETTINGS_FSVIEW);
  if (view === null) {
    view = isMobile && !isTablet ? "bottom" : "right";
    localStorage.setItem(SETTINGS_FSVIEW, view);
  }
  return view;
}

export function setSettingsFsView(value: string) {
  localStorage.setItem(SETTINGS_FSVIEW, value);
}
