"use client"

import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { suggestOrder } from "@/api/suggest-order"
import { getAllTransactions } from "@/data-access/get-transactions"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sparkles
} from "lucide-react"
import { useDataRefresh } from "@/hooks/DataRefreshWrap"
import { cn } from "@/lib/utils"

interface SuggestionData {
  status: string
  message: string
  analysis: {
    current_storage: number
    predicted_usage_spike: number
    required_purchase_kg: number
  }
  ai_suggestion: {
    supplier: string
    rank_score: number
    suggested_order_kg: number
    reason: string
  }[]
}

export function SectionCards() {
  const { refreshKey } = useDataRefresh()
  const [suggestion, setSuggestion] = useState<SuggestionData | null>(null)
  const [averageTransactionAmount, setAverageTransactionAmount] = useState<
    number | null
  >(null)
  const [totalTransactionAmount, setTotalTransactionAmount] = useState<
    number | null
  >(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suggestionData, transactionsData] = await Promise.all([
          suggestOrder(),
          getAllTransactions(),
        ])

        setSuggestion(suggestionData)

        if (transactionsData && transactionsData.length > 0) {
          const totalAmount = transactionsData.reduce(
            (sum, t) => sum + t.amount,
            0
          )
          setAverageTransactionAmount(totalAmount / transactionsData.length)
          setTotalTransactionAmount(totalAmount)
        } else {
          setAverageTransactionAmount(0)
          setTotalTransactionAmount(0)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchData()
  }, [refreshKey])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Supplies</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalTransactionAmount !== null
              ? `${totalTransactionAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} kg`
              : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Requests</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {averageTransactionAmount !== null
              ? `${averageTransactionAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })} kg`
              : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary"/>
            Suggested Estimated Supply
          </CardDescription>
          <CardTitle
            className={cn(
              "text-2xl font-semibold tabular-nums @[250px]/card:text-3xl",
              suggestion?.status === "CRITICAL_ORDERING_REQUIRED" &&
                "text-destructive"
            )}
          >
            {suggestion
              ? `${suggestion.analysis.required_purchase_kg} kg`
              : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div
            className={cn(
              "line-clamp-1 flex gap-2 font-medium",
              suggestion?.status === "CRITICAL_ORDERING_REQUIRED" &&
                "text-destructive"
            )}
          >
            {suggestion ? (
              <>
                {suggestion.status} <IconTrendingUp className="size-4" />
              </>
            ) : (
              "Loading..."
            )}
          </div>
          <div className="text-muted-foreground">
            {suggestion ? suggestion.message : "..."}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Supply Available</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {suggestion
              ? `${suggestion.analysis.current_storage.toLocaleString()} kg`
              : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
