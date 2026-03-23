import { NextResponse } from "next/server"

import { prisma } from "@/lib/prismadb"

type ImportRow = {
  name?: string
  location?: any
  eligibility?: any
  description?: any
  reliability_score?: any
  amount?: any
  price?: any
  date?: any
  quality?: any
  status?: any
  product_type?: any
  quantity?: any
}

const parseJson = (value: any) => {
  if (value === undefined || value === null || value === "") return undefined
  if (typeof value === "object") return value
  try {
    return JSON.parse(String(value))
  } catch {
    return undefined
  }
}

const toNumber = (value: any, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const toDate = (value: any) => {
  const d = new Date(value ?? Date.now())
  return Number.isNaN(d.getTime()) ? new Date() : d
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rows: ImportRow[] = Array.isArray(body?.rows) ? body.rows : []

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "No rows provided" }, { status: 400 })
    }

    let supplierCount = 0
    let transactionCount = 0
    let productionCount = 0

    for (const row of rows) {
      if (!row.name) continue

      const existingSupplier = await prisma.suppliers.findFirst({
        where: { name: row.name },
      })

      const supplier = existingSupplier
        ? existingSupplier
        : await prisma.suppliers.create({
            data: {
              name: row.name,
              location: parseJson(row.location) ?? {},
              eligibility: parseJson(row.eligibility) ?? {},
              description: parseJson(row.description) ?? {},
              reliability_score: toNumber(row.reliability_score, 0),
            },
          })

      if (!existingSupplier) supplierCount += 1

      const transaction = await prisma.transactions.create({
        data: {
          supplier_id: supplier.supplier_id,
          amount: toNumber(row.amount, 0),
          price: Number.isFinite(Number(row.price)) ? Number(row.price) : 0,
          date: toDate(row.date),
          quality: parseJson(row.quality) ?? {},
          status: String(row.status ?? "pending"),
        },
      })

      transactionCount += 1

      if (row.product_type) {
        await prisma.production_logs.create({
          data: {
            product_type: String(row.product_type),
            quantity: toNumber(row.quantity, 0),
            date: toDate(row.date),
            supplier_id: supplier.supplier_id,
          },
        })
        productionCount += 1
      }
    }

    return NextResponse.json({
      success: true,
      suppliers: supplierCount,
      transactions: transactionCount,
      productionLogs: productionCount,
    })
  } catch (error) {
    console.error("Import failed", error)
    return NextResponse.json({ success: false, error: "Import failed" }, { status: 500 })
  }
}
