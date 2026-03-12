"use client";

import { useTranslation } from "react-i18next";
import { projects, type Project } from "./projects";

/**
 * Returns the projects array with translatable fields overlaid
 * from the current i18n locale. Non-translatable fields (slug,
 * year, icon, featured, size, caseStudy, image) pass through.
 */
export function useProjects(): Project[] {
  const { t } = useTranslation("projects");

  return projects.map((p) => ({
    ...p,
    title: t(`${p.slug}.title`, p.title),
    displayTitle: t(`${p.slug}.displayTitle`, p.displayTitle ?? ""),
    stat: t(`${p.slug}.stat`, p.stat ?? ""),
    category: t(`${p.slug}.category`, p.category),
    description: t(`${p.slug}.description`, p.description),
    tags: t(`${p.slug}.tags`, { returnObjects: true, defaultValue: p.tags }) as string[],
  }));
}
