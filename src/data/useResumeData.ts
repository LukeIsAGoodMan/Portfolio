"use client";

import { useTranslation } from "react-i18next";
import {
  profile as _profile,
  stats as _stats,
  education as _education,
  experience as _experience,
  volunteerExperience as _volunteerExperience,
  professionalDevelopment as _professionalDevelopment,
  coreCompetencies as _coreCompetencies,
  tools as _tools,
  awards as _awards,
  type Education,
  type Experience,
} from "./resumeData";

/**
 * Returns resume data with translatable fields overlaid from i18n.
 * Proper names, institutions, emails, links, and years pass through unchanged.
 */
export function useResumeData() {
  const { t } = useTranslation("resume");

  const sectionHeadings = {
    about: t("sectionHeadings.about"),
    coreCompetencies: t("sectionHeadings.coreCompetencies"),
    competenciesSubtitle: t("sectionHeadings.competenciesSubtitle"),
    experience: t("sectionHeadings.experience"),
    education: t("sectionHeadings.education"),
    profDev: t("sectionHeadings.profDev"),
    tools: t("sectionHeadings.tools"),
    awards: t("sectionHeadings.awards"),
  };

  const profile = {
    ..._profile,
    // name, email, phone, linkedin stay English
    title: t("profile.title", _profile.title),
    location: t("profile.location", _profile.location),
    headline: t("profile.headline", _profile.headline),
    summary: t("profile.summary", {
      returnObjects: true,
      defaultValue: _profile.summary,
    }) as string[],
  };

  const stats = _stats.map((s, i) => ({
    ...s,
    // value stays (numeric)
    label: t(`stats.${i}.label`, s.label),
  }));

  const education: Education[] = _education.map((e, i) => ({
    ...e,
    // institution, location, year stay English
    degree: t(`education.${i}.degree`, e.degree),
    focus: t(`education.${i}.focus`, e.focus),
  }));

  const mapExperience = (items: Experience[], key: string): Experience[] =>
    items.map((e, i) => ({
      ...e,
      // org, location stay English
      period: t(`${key}.${i}.period`, e.period),
      role: t(`${key}.${i}.role`, e.role),
      highlights: t(`${key}.${i}.highlights`, {
        returnObjects: true,
        defaultValue: e.highlights,
      }) as string[],
    }));

  const experience = mapExperience(_experience, "experience");
  const volunteerExperience = mapExperience(_volunteerExperience, "volunteerExperience");

  const professionalDevelopment = _professionalDevelopment.map((pd, i) => ({
    ...pd,
    // year stays
    title: t(`professionalDevelopment.${i}.title`, pd.title),
    detail: t(`professionalDevelopment.${i}.detail`, pd.detail),
  }));

  const coreCompetencies = t("coreCompetencies", {
    returnObjects: true,
    defaultValue: _coreCompetencies,
  }) as string[];

  const tools = t("tools", {
    returnObjects: true,
    defaultValue: _tools,
  }) as string[];

  const awards = _awards.map((a, i) => ({
    ...a,
    // org stays English
    title: t(`awards.${i}.title`, a.title),
  }));

  return {
    sectionHeadings,
    profile,
    stats,
    education,
    experience,
    volunteerExperience,
    professionalDevelopment,
    coreCompetencies,
    tools,
    awards,
  };
}
