import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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
import enStrategicCommunicator from "./locales/en/strategicCommunicator.json";
import enAiLab from "./locales/en/aiLab.json";

i18n
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
        strategicCommunicator: enStrategicCommunicator,
        aiLab: enAiLab,
      },
    },
    lng: "en",
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // React handles escaping
    },
  });

export default i18n;
