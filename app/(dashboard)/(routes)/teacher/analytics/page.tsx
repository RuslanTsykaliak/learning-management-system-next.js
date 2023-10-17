import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/getAnalytics";

import { DataCard } from "./_components/DataCard";
import { Chart } from "./_components/Chart";

// Define an AnalyticsPage component for displaying user-specific analytics data.
const AnalyticsPage = async () => {
  // Get the user's ID from the authentication system
  const { userId } = auth();

  // If the user is not authenticated, redirect them to the homepage
  if (!userId) {
    return redirect('/');
  }

  // Fetch analytics data, including total revenue and total sales
  const {
    data,
    totalRevenue,
    totalSales,
  } = await getAnalytics(userId);

  return (
    <div className="p-6">
      {/* Display total revenue and total sales as DataCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label='Total Revenue'
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          label='Total Sales'
          value={totalSales}
        />
      </div>

      {/* Display analytics data as a chart */}
      <Chart
        data={data}
      />
    </div>
  )
}

export default AnalyticsPage;
