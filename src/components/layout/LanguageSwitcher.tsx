"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith("zh");

  const toggle = () => i18n.changeLanguage(isZh ? "en" : "zh");

  return (
    <button
      onClick={toggle}
      aria-label={isZh ? "Switch to English" : "切换到中文"}
      className="text-[13px] font-medium select-none min-h-[44px] flex items-center cursor-pointer"
    >
      <span className={isZh ? "text-muted" : "text-foreground"}>EN</span>
      <span className="text-muted/40 mx-1">/</span>
      <span className={isZh ? "text-foreground" : "text-muted"}>中</span>
    </button>
  );
}
