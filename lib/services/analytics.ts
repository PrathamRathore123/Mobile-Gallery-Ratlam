import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore"
import { COLLECTIONS } from "@/lib/constants/collections"
import { db } from "@/lib/firebase/client"
import { numberOrDefault, stringOrDefault, toDate } from "@/lib/firebase/parsers"
import type { AnalyticsEvent, AnalyticsEventType } from "@/lib/types/entities"

interface TrackAnalyticsEventInput {
  eventType: AnalyticsEventType
  pagePath: string
  sessionId: string
  referrer?: string | null
  productId?: string | null
  value?: number | null
  extra?: string | null
}

const analyticsRef = collection(db, COLLECTIONS.analyticsEvents)

const validEventTypes: AnalyticsEventType[] = [
  "page_view",
  "product_view",
  "add_to_cart",
  "remove_from_cart",
  "whatsapp_click",
  "review_submit",
  "shop_filter",
  "shop_sort",
]

function mapAnalyticsEvent(id: string, data: Record<string, unknown>): AnalyticsEvent {
  const referrer = data.referrer
  const productId = data.productId
  const extra = data.extra
  const eventType = data.eventType as AnalyticsEventType

  return {
    id,
    eventType: validEventTypes.includes(eventType) ? eventType : "page_view",
    pagePath: stringOrDefault(data.pagePath),
    sessionId: stringOrDefault(data.sessionId),
    referrer: typeof referrer === "string" ? referrer : null,
    productId: typeof productId === "string" ? productId : null,
    value: data.value == null ? null : numberOrDefault(data.value, 0),
    extra: typeof extra === "string" ? extra : null,
    createdAt: toDate(data.createdAt),
  }
}

function sortByCreatedAtDesc(a: AnalyticsEvent, b: AnalyticsEvent): number {
  const aTime = a.createdAt?.getTime() ?? 0
  const bTime = b.createdAt?.getTime() ?? 0
  return bTime - aTime
}

export async function trackAnalyticsEvent({
  eventType,
  pagePath,
  sessionId,
  referrer = null,
  productId = null,
  value = null,
  extra = null,
}: TrackAnalyticsEventInput): Promise<void> {
  await addDoc(analyticsRef, {
    eventType,
    pagePath,
    sessionId,
    referrer,
    productId,
    value,
    extra,
    createdAt: serverTimestamp(),
  })
}

export async function trackPageView(input: Omit<TrackAnalyticsEventInput, "eventType">): Promise<void> {
  await trackAnalyticsEvent({
    ...input,
    eventType: "page_view",
  })
}

export async function listAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  const snapshot = await getDocs(analyticsRef)
  return snapshot.docs
    .map((docItem) => mapAnalyticsEvent(docItem.id, docItem.data() as Record<string, unknown>))
    .sort(sortByCreatedAtDesc)
}

export function subscribeAnalyticsEvents(
  onData: (events: AnalyticsEvent[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    analyticsRef,
    (snapshot) => {
      const events = snapshot.docs
        .map((docItem) => mapAnalyticsEvent(docItem.id, docItem.data() as Record<string, unknown>))
        .sort(sortByCreatedAtDesc)
      onData(events)
    },
    (error) => {
      onError?.(error)
    }
  )
}

