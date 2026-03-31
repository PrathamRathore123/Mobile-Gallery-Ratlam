"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, Mail, Phone } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const customers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 890",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    orders: 5,
    totalSpent: "₹4,567",
    lastOrder: "2 days ago",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1 234 567 891",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    orders: 3,
    totalSpent: "₹2,897",
    lastOrder: "1 week ago",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 234 567 892",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    orders: 7,
    totalSpent: "₹6,234",
    lastOrder: "3 days ago",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 234 567 893",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    orders: 2,
    totalSpent: "₹1,498",
    lastOrder: "2 weeks ago",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa@example.com",
    phone: "+1 234 567 894",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    orders: 8,
    totalSpent: "₹7,892",
    lastOrder: "1 day ago",
  },
]

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your customer base
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-2xl"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative size-12 rounded-full overflow-hidden">
                  <Image
                    src={customer.avatar}
                    alt={customer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {customer.orders} orders
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    View Orders
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                {customer.phone}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between text-sm">
              <div>
                <p className="text-muted-foreground">Total Spent</p>
                <p className="font-semibold">{customer.totalSpent}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Last Order</p>
                <p className="font-medium">{customer.lastOrder}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
