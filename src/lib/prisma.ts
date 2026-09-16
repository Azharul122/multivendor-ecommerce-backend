import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import envConfig from "../configs/envConfig";
import { PrismaClient } from "../genereted/prisma/client";



const connectionString = `${envConfig.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };