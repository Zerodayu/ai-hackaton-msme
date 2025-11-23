"use server"

import { createTransaction } from "@/data-access/post-transaction"
import { revalidatePath } from "next/cache"

export async function createTransactionAction(data: {
  supplier_id: string
  amount: number
  price: number
  quality: {
    moisture_content: number
    cut_test_results: {
      moldy_percent: number
      insect_damaged_percent: number
    }
  }
}) {
  try {
    const result = await createTransaction(data)
    
    // Revalidate the dashboard page to fetch fresh data
    revalidatePath("/dashboard")
    
    return { success: true, data: result }
  } catch (error) {
    console.error("Error creating transaction:", error)
    return { success: false, error: "Failed to create transaction" }
  }
}