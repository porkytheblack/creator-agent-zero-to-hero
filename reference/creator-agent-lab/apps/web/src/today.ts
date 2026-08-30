import type { ContentPacket, TrendSignal } from "@creator-lab/domain";

export type TodayView = {
  nextRun: { label: string; localTime: string };
  strongestSignal: Pick<TrendSignal, "hook" | "score" | "sourceUrl"> | null;
  readyForReview: Array<Pick<ContentPacket, "id" | "version" | "angle" | "status">>;
};

// A real web route asks an application service for this projection.
// The page never receives provider tokens, raw payloads, leases, or model messages.
export const emptyTodayView: TodayView = {
  nextRun: { label: "Weekday morning studio", localTime: "07:00" },
  strongestSignal: null,
  readyForReview: []
};
