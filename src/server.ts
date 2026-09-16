import dotenv from "dotenv"
import app from "./app";

import envConfig from "./configs/envConfig";
import { prisma } from "./lib/prisma";
// import { seedSuperAdmin } from "./utils/seed";
dotenv.config();
async function main() {
  try {
    await prisma.$connect();
    // await seedSuperAdmin();
    console.log("Connected to the database");

    app.listen(envConfig.PORT, () => {
      console.log(
        `Server is running on port http://localhost:${envConfig.PORT}`,
      );
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
