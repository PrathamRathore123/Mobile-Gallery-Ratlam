"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Eye, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const orders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    products: ["iPhone 15 Pro Max"],
    total: "₹1,199",
    status: "Completed",
    date: "Mar 24, 2024",
    paymentMethod: "WhatsApp Order",
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    email: "michael@example.com",
    products: ["Samsung Galaxy S24 Ultra", "Galaxy Buds 2 Pro"],
    total: "₹1,299",
    status: "Processing",
    date: "Mar 24, 2024",
    paymentMethod: "WhatsApp Order",
  },
  {
    id: "ORD-003",
    customer: "Emily Davis",
    email: "emily@example.com",
    products: ["Google Pixel 8 Pro"],
    total: "₹899",
    status: "Shipped",
    date: "Mar 23, 2024",
    paymentMethod: "WhatsApp Order",
  },
  {
    id: "ORD-004",
    customer: "David Wilson",
    email: "david@example.com",
    products: ["AirPods Pro (2nd Gen)"],
    total: "₹249",
    status: "Completed",
    date: "Mar 23, 2024",
    paymentMethod: "WhatsApp Order",
  },
  {
    id: "ORD-005",
    customer: "Lisa Thompson",
    email: "lisa@example.com",
    products: ["Apple Watch Ultra 2"],
    total: "₹799",
    status: "Pending",
    date: "Mar 22, 2024",
    paymentMethod: "WhatsApp Order",
  },
  {
    id: "ORD-006",
    customer: "James Rodriguez",
    email: "james@example.com",
    products: ["OnePlus 12", "OnePlus Buds Pro 2"],
    total: "₹999",
    status: "Cancelled",
    date: "Mar 21, 2024",
    paymentMethod: "WhatsApp Order",
  },
]

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "All" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-2xl"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 rounded-2xl gap-2">
              <Filter className="size-4" />
              {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            {["All", "Completed", "Processing", "Shipped", "Pending", "Cancelled"].map(
              (status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className="cursor-pointer"
                >
                  {status}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-sm">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-sm text-muted-foreground">
                      {order.products.join(", ")}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{order.total}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                    {order.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye className="size-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
