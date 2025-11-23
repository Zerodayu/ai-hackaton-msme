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
import { useId, useState } from "react"
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
  Droplet,
  Apple,
  HeartMinus
} from "lucide-react"


export default function CreateAuditBtn() {
  return (
    <AlertDialog>
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
            <SelectInput />
            <AmountInput />
          </div>

        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SelectInput() {
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
    {
      value: "angular",
      label: "Angular",
    },
    {
      value: "vue",
      label: "Vue.js",
    },
    {
      value: "react",
      label: "React",
    },
    {
      value: "ember",
      label: "Ember.js",
    },
    {
      value: "gatsby",
      label: "Gatsby",
    },
    {
      value: "eleventy",
      label: "Eleventy",
    },
    {
      value: "solid",
      label: "SolidJS",
    },
    {
      value: "preact",
      label: "Preact",
    },
    {
      value: "qwik",
      label: "Qwik",
    },
    {
      value: "alpine",
      label: "Alpine.js",
    },
    {
      value: "lit",
      label: "Lit",
    },
  ]
  const id = useId()
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>("")

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
                ? frameworks.find((framework) => framework.value === value)
                  ?.label
                : "Select framework"}
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
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {framework.label}
                    {value === framework.value && (
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

function AmountInput() {
  const id = useId()
  const [moist, setMoist] = useState([25])
  const [mold, setMold] = useState([25])
  const [insect, setInsect] = useState([25])

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-content *:not-first:mt-2">
          <Label htmlFor={id}>Enter Amount</Label>
          <div className="relative">
            <Input id={id} className="peer ps-9" placeholder="1123" type="number" />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <ChartPie size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="w-content *:not-first:mt-2">
          <Label htmlFor={id}>Enter Price</Label>
          <div className="relative">
            <Input id={id} className="peer ps-9" placeholder="1123" type="number" />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <PhilippinePeso size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="gap-4 py-4">
        <span className="flex">
          <Label>Moisture Content: {moist}</Label>
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
            onValueChange={setMoist}
            aria-label="Slider with output"
          />
        </div>
      </div>

      <div className="gap-4 py-4">
        <span className="flex">
          <Label>Moldy Percentage: {mold}</Label>
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
            onValueChange={setMold}
            aria-label="Slider with output"
          />
        </div>
      </div>

      <div className="gap-4 py-4">
        <span className="flex">
          <Label>Insect Damage Percentage: {insect}</Label>
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
            onValueChange={setInsect}
            aria-label="Slider with output"
          />
        </div>
      </div>

    </div>
  )
}