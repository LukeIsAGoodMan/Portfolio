import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

/* ── EN locale imports ── */
import enCommon from "./locales/en/common.json";
import enHero from "./locales/en/hero.json";
import enHome from "./locales/en/home.json";
import enWork from "./locales/en/work.json";
import enProjects from "./locales/en/projects.json";
import enResume from "./locales/en/resume.json";
import enCaseStudy from "./locales/en/caseStudy.json";
import enRadar from "./locales/en/radar.json";
import enImpact from "./locales/en/impact.json";

/* ── ZH locale imports ── */
import zhCommon from "./locales/zh/common.json";
import zhHero from "./locales/zh/hero.json";
import zhHome from "./locales/zh/home.json";
import zhWork from "./locales/zh/work.json";
import zhProjects from "./locales/zh/projects.json";
import zhResume from "./locales/zh/resume.json";
import zhCaseStudy from "./locales/zh/caseStudy.json";
import zhRadar from "./locales/zh/radar.json";
import zhImpact from "./locales/zh/impact.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        hero: enHero,
        home: enHome,
        work: enWork,
        projects: enProjects,
        resume: enResume,
        caseStudy: enCaseStudy,
        radar: enRadar,
        impact: enImpact,
      },
      zh: {
        common: zhCommon,
        hero: zhHero,
        home: zhHome,
        work: zhWork,
        projects: zhProjects,
        resume: zhResume,
        caseStudy: zhCaseStudy,
        radar: zhRadar,
        impact: zhImpact,
      },
    },
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // React handles escaping
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
