import type { Metadata } from "next";
import CoursesPageContent from "@/components/courses/CoursesPageContent";
import { getPublishedCourses } from "@/lib/schedule/server";
import { getPublishedTrainingSeriesGroups } from "@/lib/training-series/server";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Courses & Curriculum",
  description:
    "Browse upcoming financial courses, workshops, and evergreen curriculum from Holistic Health & Financial Services.",
  path: "/courses",
  keywords: [
    "financial courses",
    "financial workshops",
    "financial curriculum",
    "money education classes",
  ],
});

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const [courses, trainingSeriesGroups] = await Promise.all([
    getPublishedCourses(),
    getPublishedTrainingSeriesGroups(),
  ]);

  return (
    <CoursesPageContent courses={courses} trainingSeriesGroups={trainingSeriesGroups} />
  );
}
