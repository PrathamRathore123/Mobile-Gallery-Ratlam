const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function formatINR(value: number): string {
  if (!Number.isFinite(value)) return inrFormatter.format(0)
  return inrFormatter.format(value)
}
