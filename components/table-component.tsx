
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Check,
  CircleAlert
} from "lucide-react"

const items = [
  {
    id: "1",
    name: "Alex Thompson",
    month: "January",
    status: "Incoming",
    amount: "312",
  },
  {
    id: "2",
    name: "Sarah Chen",
    month: "February",
    status: "Delivered",
    amount: "600",
  },
  {
    id: "3",
    name: "James Wilson",
    month: "March",
    status: "Delivered",
    amount: "650",
  },
  {
    id: "4",
    name: "Maria Garcia",
    month: "April",
    status: "Delivered",
    amount: "500",
  },
  {
    id: "5",
    name: "David Kim",
    month: "May",
    status: "Delivered",
    amount: "450",
  },
]

export default function TableCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Supply</CardTitle>
        <CardDescription>
          Average supply: 450
        </CardDescription>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="flex items-center gap-2 font-medium">
                <Avatar>
                  <AvatarImage src="" alt={item.name} />
                  <AvatarFallback>{item.id}</AvatarFallback>
                </Avatar>
                {item.name}
              </TableCell>
              <TableCell>{item.month}</TableCell>
              <TableCell>
                <Badge variant={item.status === "Delivered" ? "outline" : "default"}>
                  {item.status === "Delivered" ? <Check /> : <CircleAlert />}
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{item.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Basic table
      </p>
    </Card>
  )
}
