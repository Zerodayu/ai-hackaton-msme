import { prisma } from '@/lib/prismadb'

export async function getAllTransactions() {
  try {
    const transactions = await prisma.transactions.findMany({
      include: {
        supplier: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function getTransactionById(transactionId: string) {
  try {
    const transaction = await prisma.transactions.findUnique({
      where: {
        transaction_id: transactionId,
      },
      include: {
        supplier: true,
      },
    });

    return transaction;
  } catch (error) {
    console.error('Error fetching transaction:', error);
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
        date: 'desc',
      },
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions by supplier:', error);
    throw error;
  }
}