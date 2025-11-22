"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple bar chart"

const chartConfig = {
  reliability_score: {
    label: "Reliability Score",
    color: "var(--chart-1)",
  },
  avg_transaction: {
    label: "Avg Transaction",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface ChartBarMultipleProps {
  suppliers: Array<{
    name: string
    reliability_score: number
    transactions: Array<{ amount: number }>
  }>
}

export function ChartBarMultiple({ suppliers }: ChartBarMultipleProps) {
  const chartData = suppliers.map(supplier => ({
    name: supplier.name,
    reliability_score: supplier.reliability_score,
    avg_transaction: supplier.transactions.length > 0
      ? Math.round(supplier.transactions.reduce((sum, t) => sum + t.amount, 0) / supplier.transactions.length)
      : 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Performance</CardTitle>
        <CardDescription>Reliability Score & Average Transaction Amount</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="reliability_score" fill="var(--color-reliability_score)" radius={4} />
            <Bar dataKey="avg_transaction" fill="var(--color-avg_transaction)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Supplier performance metrics <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing reliability scores and average transaction amounts
        </div>
      </CardFooter>
    </Card>
  )
}
