import { prisma } from '@/lib/prismadb'

export async function createTransaction(data: {
  supplier_id: string
  amount: number
  price: number
  date?: Date | string
  quality: {
    cut_test_results?: {  
      moldy_percent?: number
      insect_damaged_percent?: number
    }
    moisture_content?: number
  }
  status?: string
}) {
  return await prisma.transactions.create({
    data: {
      supplier_id: data.supplier_id,
      amount: data.amount,
      price: data.price,
      date: data.date ? new Date(data.date) : new Date(),
      quality: data.quality,
      status: data.status || 'completed',
    },
  })
}