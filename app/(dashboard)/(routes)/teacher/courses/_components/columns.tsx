"use client"

import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"


// Define columns configuration for the DataTable component, specifying the headers and cell rendering for each column. ColumnDef is a generic type that defines the structure of a column in a DataTable component. <Course> is a generic type that represents a Course object. 
export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      // Parse the price from the row and format it as a currency
      const price = parseFloat(row.getValue('price') || '0');
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);

      return <div>{formatted}</div>;
    }
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      // Get the 'isPublished' value from the row and display it as a badge
      const isPublished = row.getValue('isPublished') || false;

      // coalescing ? operator returns the first truthy operand, or the second operand if the first operand is null or undefined.
      return (
        <Badge className={cn(
          'bg-slate-500',
          isPublished && 'bg-sky-700'
        )}>
          {isPublished ? 'Published' : "Draft"}
        </Badge>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // Extract the course ID from the row data
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className="h-4 w-8 p-0" >
              <span className="sr-only" >
                Open menu
              </span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" >
            {/* Create a link to the edit page for the course */}
            <Link href={`/teacher/courses/${id}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]