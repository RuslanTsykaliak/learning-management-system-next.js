"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";

// Define the 'ChartProps' interface to specify the expected props for the 'Chart' component.
interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

// Define the 'Chart' React component.
export const Chart = ({
  data
}: ChartProps) => {
  return (
    // Render a card containing a responsive bar chart.
    <Card>
      {/* Create a responsive container for the bar chart */}
      <ResponsiveContainer width="100%" height={350}>
        {/* Create a bar chart with data */}
        <BarChart data={data}>
          {/* X-axis configuration */}
          <XAxis
            dataKey="name"             // X-axis data key
            stroke="#888888"           // X-axis stroke color
            fontSize={12}              // X-axis label font size
            tickLine={false}           // Hide X-axis tick lines
            axisLine={false}           // Hide X-axis axis line
          />
          {/* Y-axis configuration */}
          <YAxis
            stroke="#888888"           // Y-axis stroke color
            fontSize={12}              // Y-axis label font size
            tickLine={false}           // Hide Y-axis tick lines
            axisLine={false}           // Hide Y-axis axis line
            tickFormatter={(value) => `$${value}`} // Format Y-axis tick labels as currency
          />
          {/* Bar configuration */}
          <Bar
            dataKey="total"            // Bar data key
            fill="#0369a1"             // Bar fill color
            radius={[4, 4, 0, 0]}      // Rounded corners for the top of the bar
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
