import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Connected to MySQL database successfully");
  } catch (error) {
    console.error("MYSQL CONNECTION FAILED", error);
    process.exit(1); // Exit the process with failure code
  }
}

export { prisma, connectDB };
