"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n/i18n"; // side-effect: initializes i18next

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const syncLang = (lng: string) => {
      document.documentElement.lang = lng;
    };

    // Set initial lang
    syncLang(i18n.language);

    // Listen for changes
    i18n.on("languageChanged", syncLang);
    return () => {
      i18n.off("languageChanged", syncLang);
    };
  }, [i18n]);

  return <>{children}</>;
}
