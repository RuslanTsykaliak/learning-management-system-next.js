import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/SearchInput";
import { getCourses } from "@/actions/getCourses";
import { CoursesList } from "@/components/CoursesList";

import { Categories } from "./_components/Categories";

// This interface defines the props that are passed to the SearchPage component. interface Props is a type guard that ensures that the component only receives the props that is expects.
interface SearchPageProps {
  // The search params from the URL.
  searchParams: {
    // The search title.
    title: string;
    // The category ID.
    categoryId: string;
  };
}

// This function defines the SearchPage component. It takes in a SearchPageProps object as its prop and returns a JSX element.
const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  // Get the current user ID.
  const { userId } = auth();

  // If the user is not logged in, redirect them to the home page.
  if (!userId) {
    return redirect('/');
  }

  // Fetch the list of categories from the database. await is used to wait for a promise to resolve before continuing. The findMany() method is used to fetch multiple records from the database.
  const categories = await db.category.findMany({
    // Order the categories by name in ascending order.
    orderBy: {
      name: 'asc',
    },
  });

  // Fetch the list of courses from the database based on the user ID and the search params.
  const courses = await getCourses({
    userId,
    // Spread the search params object into the getCourses function call.
    ...searchParams,
  });

  // Render the SearchPage component.
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories
          items={categories}
        />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage