import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import ImportStepper from "@/components/import/import-stepper"

export default function ImportPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold tracking-tight">Import Data</h1>
              <p className="text-muted-foreground text-sm">
                Upload your CSV/XLS/XLSX with products, suppliers, and transactions in one pass.
              </p>
            </div>
            <ImportStepper />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
