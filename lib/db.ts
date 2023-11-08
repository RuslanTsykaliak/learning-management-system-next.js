import { PrismaClient } from "@prisma/client";

// Declaring a global variable to hold the PrismaClient instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Using the global prisma variable or creating a new PrismaClient instance as 'db'
export const db = globalThis.prisma || new PrismaClient();

// Storing the PrismaClient instance in the global variable during development to prevent unnecessary new instances
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
