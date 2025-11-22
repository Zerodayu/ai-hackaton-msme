import { prisma } from '@/lib/prismadb'

export async function getAllSuppliers() {
  try {
    const suppliers = await prisma.suppliers.findMany({
      include: {
        transactions: true,
        productionLogs: true,
      },
      orderBy: {
        reliability_score: 'desc',
      },
    });

    return suppliers;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
}

export async function getTransactionsBySupplier(supplierId: string) {
  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        supplier_id: supplierId,
      },
      include: {
        supplier: true,
      },
      orderBy: {
        amount: 'asc',
      },
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions by supplier:', error);
    throw error;
  }
}