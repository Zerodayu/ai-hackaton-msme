import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Check,
  CircleAlert,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"

import { getAllTransactions } from "@/data-access/get-transactions"

export default async function TableCard() {
  const transactions = await getAllTransactions()

  const averageAmount = transactions.length > 0
    ? Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Logs</CardTitle>
        <CardDescription>
          Average amount: {averageAmount}
        </CardDescription>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Supplier Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.transaction_id}>
              <TableCell className="flex items-center gap-2 font-medium">
                <Avatar>
                  <AvatarImage src="" alt={transaction.supplier.name} />
                  <AvatarFallback>
                    {transaction.supplier.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {transaction.supplier.name}
              </TableCell>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <Badge variant={transaction.status === "rejected" ? "outline" : "default"}>
                  {transaction.status === "completed" ? <Check /> : <CircleAlert />}
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{transaction.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Transaction history
      </p>
    </Card>
  )
}


type PaginationProps = {
  currentPage: number
  totalPages: number
}

 function PaginationSection({
  currentPage,
  totalPages,
}: PaginationProps) {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationLink
            className={cn(
              "aria-disabled:pointer-events-none aria-disabled:opacity-50",
              buttonVariants({
                variant: "outline",
              })
            )}
            href={currentPage === 1 ? undefined : `#/page/${currentPage - 1}`}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? "link" : undefined}
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Page <span className="text-foreground">{currentPage}</span> of{" "}
            <span className="text-foreground">{totalPages}</span>
          </p>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className={cn(
              "aria-disabled:pointer-events-none aria-disabled:opacity-50",
              buttonVariants({
                variant: "outline",
              })
            )}
            href={
              currentPage === totalPages
                ? undefined
                : `#/page/${currentPage + 1}`
            }
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages ? true : undefined}
            role={currentPage === totalPages ? "link" : undefined}
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}