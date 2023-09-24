import { db } from "@/lib/db";
import { Course, Purchase } from "@/prisma/client"


// Defining a custom type that combines Purchase and Course
type PurchaseWithCourse = Purchase & {
  course: Course;
}

// The groupByCourse() function takes an array for PurchaseWithCourse objects as input and returns an object mapping course titles to thier total revenue. The function works by iterating over the purchases and adding the price of each purchase to the total revenue for the course
const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {}

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0
    }
    grouped[courseTitle] += purchase.course.price!
  })

  return grouped;
}

// Takes a user ID as input and returns an objecct containig the user's analytics data
export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId: userId
        }
      },
      include: {
        course: true,
      }
    })

    const groupedEarnings = groupByCourse(purchases)
    const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total,
    }))

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0)
    // Calculate the total number of sales for the user
    const totalSales = purchases.length

    return {
      data,
      totalRevenue,
      totalSales
    }
  } catch (error) {
    console.log("[GET_ANALYTICS]", error)
    // Returns an empty analytics if object if an error occurred
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    }
  }
}