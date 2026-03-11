import CoursesPageContent from "@/components/courses/CoursesPageContent";
import { getPublishedCourses } from "@/lib/schedule/server";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getPublishedCourses();
  return <CoursesPageContent courses={courses} />;
}
