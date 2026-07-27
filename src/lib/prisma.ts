import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // 1. Initialisation du Pool PostgreSQL avec l'URL de Supabase
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  
  // 2. Création de l'adaptateur
  const adapter = new PrismaPg(pool);
  
  // 3. On passe l'adaptateur au PrismaClient (ce qui résout l'erreur de l'argument manquant)
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function createSeedClient() {
  return createPrismaClient();
}