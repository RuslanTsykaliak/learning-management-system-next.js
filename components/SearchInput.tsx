"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export const SearchInput = () => {
  // State to manage the input field's value.
  const [value, setValue] = useState("");

  // Debounce the input value to reduce frequent updates.
  const debouncedValue = useDebounce(value);

  // Get the search parameters from the URL.
  const searchParams = useSearchParams();

  // Access the router and pathname for navigation.
  const router = useRouter();
  const pathname = usePathname();

  // Get the current category ID from the search parameters.
  const currentCategoryId = searchParams.get("categoryId");

  // Effect to update the URL when the input value or category changes.
  useEffect(() => {
    // Create a URL with updated query parameters.
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    // Update the router's URL with the new query parameters.
    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative">
      {/* Render a search icon */}
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />

      {/* Render an input field for searching */}
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};
