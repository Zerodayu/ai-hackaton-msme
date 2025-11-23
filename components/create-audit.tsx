"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IconCirclePlusFilled } from "@tabler/icons-react"
import { useId, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  ChartPie,
  CheckIcon,
  ChevronDownIcon,
  PhilippinePeso,
} from "lucide-react"
import { createTransactionAction } from "@/actions/create-transaction"
import { getAllSuppliers } from "@/data-access/get-suppliers"
import { useDataRefresh } from "@/hooks/DataRefreshWrap"


export default function CreateAuditBtn() {
  const { triggerRefresh } = useDataRefresh()
  const [selectedSupplier, setSelectedSupplier] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [moist, setMoist] = useState([25])
  const [mold, setMold] = useState([25])
  const [insect, setInsect] = useState([25])
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [suppliers, setSuppliers] = useState<Array<{ supplier_id: string; name: string }>>([])

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getAllSuppliers()
        setSuppliers(data.map(s => ({ supplier_id: s.supplier_id, name: s.name })))
      } catch (error) {
        console.error("Error fetching suppliers:", error)
      }
    }
    fetchSuppliers()
  }, [])

  const handleSubmit = async () => {
    if (!selectedSupplier || !amount || !price) {
      console.log("Error: Missing required fields - Please fill in supplier, amount, and price")
      return
    }

    setIsLoading(true)
    try {
      const result = await createTransactionAction({
        supplier_id: selectedSupplier,
        amount: parseInt(amount),
        price: parseFloat(price),
        quality: {
          moisture_content: moist[0],
          cut_test_results: {
            moldy_percent: mold[0],
            insect_damaged_percent: insect[0],
          },
        },
      })

      if (result.success) {
        console.log("Success: Transaction created successfully", result.data)
        console.log(`Added ${amount} units at ₱${price}`)

        // Reset form
        setSelectedSupplier("")
        setAmount("")
        setPrice("")
        setMoist([25])
        setMold([25])
        setInsect([25])
        setOpen(false)
        triggerRefresh()
      } else {
        console.error("Error: Failed to create transaction", result.error)
      }
    } catch (error) {
      console.error("Error: Failed to create transaction", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="flex-1">
          <IconCirclePlusFilled />
          <span>Quick Audit</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Audit Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Enter Transaction Details Below
          </AlertDialogDescription>
          <div className="flex flex-col gap-2 py-4">
            <SupplierInput 
              value={selectedSupplier} 
              onChange={setSelectedSupplier}
              suppliers={suppliers}
            />
            <TransactionInput 
              amount={amount}
              price={price}
              moist={moist}
              mold={mold}
              insect={insect}
              onAmountChange={setAmount}
              onPriceChange={setPrice}
              onMoistChange={setMoist}
              onMoldChange={setMold}
              onInsectChange={setInsect}
            />
          </div>

        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SupplierInput({ 
  value, 
  onChange, 
  suppliers 
}: { 
  value: string
  onChange: (value: string) => void
  suppliers: Array<{ supplier_id: string; name: string }>
}) {
  const id = useId()
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="flex-1 *:not-first:mt-2 py-4">
      <Label htmlFor={id}>Select Supplier</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? suppliers.find((supplier) => supplier.supplier_id === value)?.name
                : "Select supplier"}
            </span>
            <ChevronDownIcon
              size={16}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search supplier..." />
            <CommandList>
              <CommandEmpty>No supplier found.</CommandEmpty>
              <CommandGroup>
                {suppliers.map((supplier) => (
                  <CommandItem
                    key={supplier.supplier_id}
                    value={supplier.name}
                    onSelect={() => {
                      onChange(supplier.supplier_id)
                      setOpen(false)
                    }}
                  >
                    {supplier.name}
                    {value === supplier.supplier_id && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function TransactionInput({
  amount,
  price,
  moist,
  mold,
  insect,
  onAmountChange,
  onPriceChange,
  onMoistChange,
  onMoldChange,
  onInsectChange,
}: {
  amount: string
  price: string
  moist: number[]
  mold: number[]
  insect: number[]
  onAmountChange: (value: string) => void
  onPriceChange: (value: string) => void
  onMoistChange: (value: number[]) => void
  onMoldChange: (value: number[]) => void
  onInsectChange: (value: number[]) => void
}) {
  const id = useId()

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-content *:not-first:mt-2">
          <Label htmlFor={id}>Enter Amount</Label>
          <div className="relative">
            <Input 
              id={id} 
              className="peer ps-9" 
              placeholder="1123" 
              type="number" 
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <ChartPie size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="w-content *:not-first:mt-2">
          <Label htmlFor={id}>Enter Price</Label>
          <div className="relative">
            <Input 
              id={id} 
              className="peer ps-9" 
              placeholder="1123" 
              type="number"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <PhilippinePeso size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="gap-4 py-4">
        <span className="flex">
          <Label>Moisture Content: {moist[0]}%</Label>
        </span>
        <div>
          <span
            className="flex w-full items-center justify-between gap-2 text-xs font-medium text-muted-foreground"
            aria-hidden="true"
          >
            <span>Low</span>
            <span>High</span>
          </span>
          <Slider
            value={moist}
            onValueChange={onMoistChange}
            aria-label="Slider with output"
          />
        </div>
      </div>

      <div className="gap-4 py-4">
        <span className="flex">
          <Label>Moldy Percentage: {mold[0]}%</Label>
        </span>
        <div>
          <span
            className="flex w-full items-center justify-between gap-2 text-xs font-medium text-muted-foreground"
            aria-hidden="true"
          >
            <span>Low</span>
            <span>High</span>
          </span>
          <Slider
            value={mold}
            onValueChange={onMoldChange}
            aria-label="Slider with output"
          />
        </div>
      </div>

      <div className="gap-4 py-4">
        <span className="flex">
          <Label>Insect Damage Percentage: {insect[0]}%</Label>
        </span>
        <div>
          <span
            className="flex w-full items-center justify-between gap-2 text-xs font-medium text-muted-foreground"
            aria-hidden="true"
          >
            <span>Low</span>
            <span>High</span>
          </span>
          <Slider
            value={insect}
            onValueChange={onInsectChange}
            aria-label="Slider with output"
          />
        </div>
      </div>

    </div>
  )
}