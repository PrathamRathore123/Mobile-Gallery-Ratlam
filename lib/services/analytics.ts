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
import { stringOrDefault, toDate } from "@/lib/firebase/parsers"
import type { AnalyticsEvent, AnalyticsEventType } from "@/lib/types/entities"

interface TrackPageViewInput {
  pagePath: string
  sessionId: string
  referrer?: string | null
}

const analyticsRef = collection(db, COLLECTIONS.analyticsEvents)

function mapAnalyticsEvent(id: string, data: Record<string, unknown>): AnalyticsEvent {
  const referrer = data.referrer
  return {
    id,
    eventType: (data.eventType as AnalyticsEventType) === "page_view" ? "page_view" : "page_view",
    pagePath: stringOrDefault(data.pagePath),
    sessionId: stringOrDefault(data.sessionId),
    referrer: typeof referrer === "string" ? referrer : null,
    createdAt: toDate(data.createdAt),
  }
}

function sortByCreatedAtDesc(a: AnalyticsEvent, b: AnalyticsEvent): number {
  const aTime = a.createdAt?.getTime() ?? 0
  const bTime = b.createdAt?.getTime() ?? 0
  return bTime - aTime
}

export async function trackPageView({
  pagePath,
  sessionId,
  referrer = null,
}: TrackPageViewInput): Promise<void> {
  await addDoc(analyticsRef, {
    eventType: "page_view",
    pagePath,
    sessionId,
    referrer,
    createdAt: serverTimestamp(),
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
