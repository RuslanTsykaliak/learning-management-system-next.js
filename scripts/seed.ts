// Import the PrismaClient, which provides access to the Prisma ORM.
const { PrismaClient } = require("@prisma/client");

// Create a new PrismaClient instance, establishing a connection to the database.
const database = new PrismaClient();

// Define an asynchronous function called main() to seed the database with categories.
async function main() {
  try {
    // Use the PrismaClient to create multiple category records in the database.
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Filming" },
      ]
    });

    console.log("Success"); // Log a success message if category creation is successful.
  } catch (error) {
    console.log("Error seeding the database categories", error); // Log an error message if an error occurs during seeding.
  } finally {
    await database.$disconnect(); // Close the database connection when seeding is complete or if an error occurs.
  }
}

// Call the main function to start the seeding process.
main();
