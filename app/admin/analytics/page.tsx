import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Eye } from "lucide-react"

const stats = [
  {
    title: "Revenue This Month",
    value: "₹48,352",
    change: "+12.5%",
    trend: "up",
    icon: IndianRupee,
  },
  {
    title: "Orders This Month",
    value: "423",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "New Customers",
    value: "156",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Page Views",
    value: "24.5K",
    change: "-2.1%",
    trend: "down",
    icon: Eye,
  },
]

const salesData = [
  { month: "Jan", sales: 12400 },
  { month: "Feb", sales: 15600 },
  { month: "Mar", sales: 18900 },
  { month: "Apr", sales: 16800 },
  { month: "May", sales: 21200 },
  { month: "Jun", sales: 24500 },
]

const topCategories = [
  { name: "Smartphones", percentage: 65, revenue: "₹82,450" },
  { name: "Accessories", percentage: 18, revenue: "₹22,890" },
  { name: "Wearables", percentage: 12, revenue: "₹15,230" },
  { name: "Audio", percentage: 5, revenue: "₹6,350" },
]

export default function AdminAnalyticsPage() {
  const maxSales = Math.max(...salesData.map((d) => d.sales))

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your store performance and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <div
              key={stat.title}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon className="size-5 text-accent" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <TrendIcon className="size-3" />
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-6">Sales Overview</h2>
          <div className="h-64 flex items-end gap-4">
            {salesData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-accent rounded-t-lg transition-all hover:bg-accent/80"
                  style={{
                    height: `${(data.sales / maxSales) * 200}px`,
                  }}
                />
                <span className="text-xs text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-6">Top Categories</h2>
          <div className="space-y-5">
            {topCategories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">{category.revenue}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{category.percentage}% of sales</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="mt-6 bg-card border border-border rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-6">Traffic Sources</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { source: "Direct", visits: "8,234", percentage: 35 },
            { source: "WhatsApp", visits: "5,892", percentage: 25 },
            { source: "Google", visits: "4,721", percentage: 20 },
            { source: "Social Media", visits: "4,720", percentage: 20 },
          ].map((item) => (
            <div key={item.source} className="bg-secondary rounded-xl p-4">
              <p className="font-medium">{item.source}</p>
              <p className="text-2xl font-bold mt-1">{item.visits}</p>
              <div className="mt-2 h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{item.percentage}% of traffic</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
