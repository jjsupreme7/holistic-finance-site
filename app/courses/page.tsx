import CoursesPageContent from "@/components/courses/CoursesPageContent";
import { getPublishedCourses } from "@/lib/schedule/server";
import { getPublishedTrainingSeriesGroups } from "@/lib/training-series/server";

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
