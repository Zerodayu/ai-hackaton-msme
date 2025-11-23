"use server"

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

export async function getPaginatedTransactions(page: number = 1, pageSize: number = 10) {
  try {
    const skip = (page - 1) * pageSize;

    const [transactions, totalCount] = await Promise.all([
      prisma.transactions.findMany({
        include: {
          supplier: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: pageSize,
      }),
      prisma.transactions.count(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      transactions,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching paginated transactions:', error);
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