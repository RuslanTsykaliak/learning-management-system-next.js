'use client'

import { Category } from '@prisma/client'
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode
} from 'react-icons/fc'
import { IconType } from 'react-icons'

import { CategoryItem } from './CategoryItem'

interface CategoriesProps {
  // This interface defines the props that are passed to the Categories component.
  items: Category[] // The array of Category objects.
}

const iconMap: Record<Category["name"], IconType> = {
  // This object maps category names to icons.
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
  "Fitness": FcSportsMode,
  "Accounting": FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  "Filming": FcFilmReel,
  "Engineering": FcEngineering,
}

export const Categories = ({
  items,
}: CategoriesProps) => {
  // This function defines the Categories component. It takes in a CategoriesProps object as its prop and returns a JSX element.

  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
      {/* This div element renders the category items. */}
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}