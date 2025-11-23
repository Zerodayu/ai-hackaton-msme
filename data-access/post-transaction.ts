"use server"

import { prisma } from '@/lib/prismadb'
import { updateScore } from '@/api/update-score'

// /update-scores - post
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
  const transaction = await prisma.transactions.create({
    data: {
      supplier_id: data.supplier_id,
      amount: data.amount,
      price: data.price,
      date: data.date ? new Date(data.date) : new Date(),
      quality: data.quality,
      status: data.status || 'completed',
    },
  })

  // Update score after successful transaction creation
  try {
    console.log('Calling updateScore API...')
    const result = await updateScore()
    
    if (result?.status === 'success') {
      console.log('Update Score msg:', result.message)
    }
  } catch (error) {
    console.error('Failed to update score:', error)
  }

  return transaction
}