import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// Instancia o PrismaClient e guarda na variável global no ambiente de desenvolvimento
// Isso impede o erro de 'too many connections' quando o Next.js recarrega (Fast Refresh)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Logs úteis para vermos o que o Prisma está fazendo por baixo dos panos
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
