'use client'

import qs from 'query-string'
import { IconType } from 'react-icons'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

import { cn } from '@/lib/utils'

// This interface defines the props that are passed to the CategoryItem component.
interface CategoryItmeProps {
  // The label of the category item.
  label: string;
  // The value of the category item. This is used to identify the category when the user clicks on it.
  value?: string;
  // The icon of the category item.
  icon?: IconType;
}

// This function defines the CategoryItem component. It takes in a CategoryItmeProps object as its prop and returns a JSX element.
export const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: CategoryItmeProps) => {
  // Get the current pathname from the router.
  const pathname = usePathname();
  // Get the router object.
  const router = useRouter();
  // Get the search params from the router.
  const searchParams = useSearchParams();

  // Get the current category ID from the search params.
  const currentCategoryId = searchParams.get("categoryId");
  // Get the current title from the search params.
  const currentTitle = searchParams.get("title");

  // Check if the category item is selected.
  const isSelected = currentCategoryId === value;

  // Define an onClick function that will update the search params and navigate to the new URL.
  const onClick = () => {
    // Use the qs library to stringify the URL with the updated search params.
    const url = qs.stringifyUrl({
      // The pathname of the current page.
      url: pathname,
      // The new search params.
      query: {
        // The current title, if any.
        title: currentTitle,
        // The new category ID, or null if the category item is being deselected.
        categoryId: isSelected ? null : value,
      },
    }, {
      // Skip null and empty string values in the search params.
      skipNull: true,
      skipEmptyString: true,
    });

    // Push the new URL to the router.
    router.push(url);
  };

  // Render the CategoryItem component.
  return (
    <button
      onClick={onClick}
      className={cn(
        // The base CSS class for the button.
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
        // The CSS class for a selected button.
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800",
      )}
      type="button"
    >
      {/* Render the icon, if provided. */}
      {Icon && <Icon size={20} />}
      {/* Render the label of the category item. */}
      <div className="truncate">
        {label}
      </div>
    </button>
  );
};
