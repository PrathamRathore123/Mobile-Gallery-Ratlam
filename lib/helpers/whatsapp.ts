export interface WhatsAppLineItem {
  title: string
  quantity: number
  unitPrice: number
}

export interface WhatsAppCustomerInfo {
  name?: string
  phone?: string
  note?: string
}

interface BuildMessageInput {
  items: WhatsAppLineItem[]
  total: number
  customer?: WhatsAppCustomerInfo
  currencySymbol?: string
}

export function buildWhatsAppOrderMessage({
  items,
  total,
  customer,
  currencySymbol = "₹",
}: BuildMessageInput): string {
  const lines = items
    .map((item, index) => {
      const lineTotal = item.unitPrice * item.quantity
      return `${index + 1}. ${item.title} x${item.quantity} - ${currencySymbol}${lineTotal.toLocaleString("en-IN")}`
    })
    .join("\n")

  const customerLines = [
    customer?.name ? `Name: ${customer.name}` : null,
    customer?.phone ? `Phone: ${customer.phone}` : null,
    customer?.note ? `Note: ${customer.note}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  return [
    "Hi, I want to place an order:",
    "",
    lines,
    "",
    `Total: ${currencySymbol}${total.toLocaleString("en-IN")}`,
    customerLines ? `\n${customerLines}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const safePhone = phone.replace(/[^\d]/g, "")
  return `https://wa.me/${safePhone}?text=${encodeURIComponent(message)}`
}
