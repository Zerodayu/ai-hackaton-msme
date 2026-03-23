"use client"

import { useMemo, useState } from "react"
import Papa from "papaparse"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Pattern as TableUpload } from "@/components/table-upload"
import { Pattern as BaseStepper } from "@/components/stepper-component"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const schemaGroups = [
  {
    key: "suppliers",
    label: "Supplier",
    fields: [
      { name: "name", required: true },
      { name: "location" },
      { name: "eligibility" },
      { name: "description" },
      { name: "reliability_score" },
    ],
  },
  {
    key: "transactions",
    label: "Transaction",
    fields: [
      { name: "amount", required: true },
      { name: "price", required: true },
      { name: "date" },
      { name: "quality" },
      { name: "status" },
    ],
  },
  {
    key: "production_logs",
    label: "Product / Production",
    fields: [
      { name: "date" },
      { name: "product_type", required: true },
      { name: "quantity", required: true },
    ],
  },
]

type ParsedFile = {
  name: string
  size: number
  rows: Record<string, any>[]
  columns: string[]
}

export default function ImportStepper() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<ParsedFile | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [columnMap, setColumnMap] = useState<Record<string, string>>({})
  const [isImporting, setIsImporting] = useState(false)

  const requiredTargets = useMemo(
    () =>
      schemaGroups
        .flatMap((g) => g.fields)
        .filter((f) => f.required)
        .map((f) => f.name),
    []
  )

  const mappedTargets = useMemo(() => Object.values(columnMap).filter(Boolean), [columnMap])
  const missingRequired = requiredTargets.filter((req) => !mappedTargets.includes(req))

  const canNextFromUpload = !!file
  const canNextFromSelect = selectedColumns.length > 0
  const canNextFromMap = missingRequired.length === 0 && selectedColumns.length > 0

  const previewRows = useMemo(() => file?.rows.slice(0, 5) ?? [], [file])

  const handleFilesChange = (files: any[]) => {
    if (!files.length) return
    const f = files[0]
    let cols: string[] = []
    let rows: Record<string, any>[] = []

    // Try to parse CSV via PapaParse if a File is available
    if (f.file instanceof File) {
      f.file
        .text()
        .then((text: string) => {
          const parsed = Papa.parse<Record<string, any>>(text, {
            header: true,
            skipEmptyLines: true,
          })

          const parsedCols = parsed.meta.fields ?? []
          const parsedRows = Array.isArray(parsed.data)
            ? parsed.data.filter((row) => Object.keys(row).length > 0)
            : []

          setFile({
            name: f.file?.name ?? f.name ?? "uploaded-file",
            size: f.file?.size ?? f.size ?? 0,
            rows: parsedRows,
            columns: parsedCols,
          })
          setSelectedColumns([])
          setColumnMap({})
        })
        .catch(() => {
          setFile({
            name: f.file?.name ?? f.name ?? "uploaded-file",
            size: f.file?.size ?? f.size ?? 0,
            rows: [],
            columns: [],
          })
          setSelectedColumns([])
          setColumnMap({})
        })
      return
    }

    cols = Array.isArray(f.columns)
      ? f.columns
      : Array.isArray(f.file?.columns)
        ? f.file.columns
        : []
    rows = Array.isArray(f.rows)
      ? f.rows
      : Array.isArray(f.file?.rows)
        ? f.file.rows
        : []
    setFile({
      name: f.file?.name ?? f.name ?? "uploaded-file",
      size: f.file?.size ?? f.size ?? 0,
      rows,
      columns: cols,
    })
    setSelectedColumns([])
    setColumnMap({})
  }

  const handleToggleColumn = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    )
  }

  const handleSelectAll = () => {
    if (file?.columns?.length) {
      setSelectedColumns(file.columns)
    }
  }

  const handleClearAll = () => {
    setSelectedColumns([])
  }

  const handleMapChange = (source: string, target: string) => {
    setColumnMap((prev) => {
      // Ensure one-to-one mapping: remove this target from others
      const updated = Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [k, v === target && k !== source ? "" : v])
      ) as Record<string, string>
      return { ...updated, [source]: target }
    })
  }

  const stepItems = [
    {
      title: "Import file",
      content: (
        <div className="space-y-4">
          <TableUpload
            maxFiles={1}
            multiple={false}
            accept={".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"}
            onFilesChange={handleFilesChange}
            simulateUpload={false}
            showDefaults={false}
          />
          {file && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary">{file.name}</Badge>
              <span>{Math.round((file.size ?? 0) / 1024)} KB</span>
            </div>
          )}
          <div className="flex justify-end">
            <Button disabled={!canNextFromUpload} onClick={() => setStep(2)}>
              Next: Select columns
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Select columns",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose which columns from the uploaded file to include.
          </p>
          {file?.columns?.length ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select all
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                Clear
              </Button>
            </div>
          ) : null}
          {file?.columns?.length ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column</TableHead>
                    <TableHead className="w-[120px]">Selected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {file.columns.map((col) => (
                    <TableRow key={col}>
                      <TableCell className="font-medium">{col}</TableCell>
                      <TableCell>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedColumns.includes(col)}
                            onChange={() => handleToggleColumn(col)}
                          />
                          <span>{selectedColumns.includes(col) ? "Selected" : ""}</span>
                        </label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              Upload a file to detect columns.
            </div>
          )}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button disabled={!canNextFromSelect} onClick={() => setStep(3)}>
              Next: Map columns
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Map columns",
      content: (
        <div className="space-y-5">
          {selectedColumns.length === 0 && (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              Select at least one column in step 2.
            </div>
          )}

          {selectedColumns.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-3">
              {schemaGroups.map((group) => (
                <div key={group.key} className="space-y-3 rounded-md border p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{group.label}</div>
                      <p className="text-muted-foreground text-xs">Map CSV columns to {group.label.toLowerCase()} fields.</p>
                    </div>
                    <Badge variant="secondary">{group.fields.filter((f) => f.required).length} required</Badge>
                  </div>

                  <div className="space-y-3">
                    {group.fields.map((field) => {
                      const mappedSource = Object.entries(columnMap).find(([, target]) => target === field.name)?.[0] ?? ""
                      const isRequired = !!field.required
                      const isMissing = isRequired && !mappedSource
                      return (
                        <div key={field.name} className="space-y-1 rounded-md border p-3">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span>
                              {field.name}
                              {isRequired ? " *" : ""}
                            </span>
                            {mappedSource ? (
                              <Badge variant="outline">{mappedSource}</Badge>
                            ) : (
                              <Badge variant={isMissing ? "destructive" : "secondary"}>
                                {isMissing ? "Required" : "Unmapped"}
                              </Badge>
                            )}
                          </div>
                          <Select
                            value={mappedSource}
                            onValueChange={(v) => handleMapChange(v, field.name)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select source column" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedColumns.map((col) => (
                                <SelectItem key={col} value={col}>
                                  {col}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button disabled={!canNextFromMap} onClick={() => setStep(4)}>
              Next: Confirm
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Confirm",
      content: (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-md border p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">File</span>
              <span className="font-medium">{file?.name ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Selected columns</span>
              <span className="font-medium">{selectedColumns.length}</span>
            </div>
          </div>

          {selectedColumns.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source column</TableHead>
                    <TableHead>Target field</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedColumns.map((col) => (
                    <TableRow key={col}>
                      <TableCell className="font-medium">{col}</TableCell>
                      <TableCell>{columnMap[col] || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {previewRows.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Preview (first 5 rows)</div>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {selectedColumns.map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row, idx) => (
                      <TableRow key={idx}>
                        {selectedColumns.map((col) => (
                          <TableCell key={col} className="text-xs">
                            {String(row[col] ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button disabled={!canNextFromMap || isImporting} onClick={async () => {
              if (!file) return
              setIsImporting(true)
              try {
                // Build rows using mapped columns
                const rows = (file.rows ?? []).map((row) => {
                  const mapped: Record<string, any> = {}
                  Object.entries(columnMap).forEach(([source, target]) => {
                    mapped[target] = row[source]
                  })
                  return mapped
                })

                const res = await fetch("/api/import", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ rows }),
                })

                const json = await res.json()
                if (!res.ok || !json?.success) {
                  toast.error(json?.error ?? "Import failed")
                } else {
                  toast.success(
                    `Imported ${json.suppliers ?? 0} suppliers, ${json.transactions ?? 0} transactions, ${json.productionLogs ?? 0} production logs`
                  )
                  router.refresh()
                  setStep(1)
                  setFile(null)
                  setSelectedColumns([])
                  setColumnMap({})
                }
              } catch (err) {
                console.error(err)
                toast.error("Import failed")
              } finally {
                setIsImporting(false)
              }
            }}>
              {isImporting ? "Importing..." : "Confirm import"}
            </Button>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>File importer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <BaseStepper steps={stepItems} value={step} onValueChange={setStep} />
      </CardContent>
    </Card>
  )
}
