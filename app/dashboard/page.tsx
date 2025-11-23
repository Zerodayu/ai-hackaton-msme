import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { revalidatePath } from "next/cache"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import TableCard from "@/components/table-component"
import { ChartBarMultiple } from "@/components/bar-chart"

import { getAllTransactions } from "@/data-access/get-transactions"
import { getAllSuppliers } from "@/data-access/get-suppliers"

export default async function Page() {
  const transactions = await getAllTransactions()
  const suppliers = await getAllSuppliers()
  
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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive transactions={transactions} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-6">
                <TableCard />
                <ChartBarMultiple suppliers={suppliers} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
