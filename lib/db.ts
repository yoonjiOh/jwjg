import { PrismaClient } from '@prisma/client';

// declare global {
//   var prisma: PrismaClient;
// }

let prisma: PrismaClient;

// check to use this workaround only in development and not in production
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma;
