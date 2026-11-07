/* ------------------------------------------------------------------ */
/*  Pure calendar-event logic (no DOM / no hass) — unit-testable.      */
/* ------------------------------------------------------------------ */

export const DAY_MS = 86400000;

/**
 * Compute new start/end for a drag (move) or resize gesture.
 * `deltaMin` is the raw dragged offset in minutes; the result snaps to the
 * `gridMin` raster (absolute, from midnight of the event's day) and keeps a
 * minimum duration of one grid step.
 */
export function dragTimes(
  origStart: Date,
  origEnd: Date,
  deltaMin: number,
  mode: "move" | "resize",
  gridMin: number,
): { start: Date; end: Date } {
  const grid = Math.max(1, gridMin);
  const midnight = new Date(origStart);
  midnight.setHours(0, 0, 0, 0);
  const base = midnight.getTime();
  const startMin = (origStart.getTime() - base) / 60000;
  const durMin = (origEnd.getTime() - origStart.getTime()) / 60000;
  if (mode === "move") {
    const snapped = Math.round((startMin + deltaMin) / grid) * grid;
    const start = new Date(base + snapped * 60000);
    return { start, end: new Date(start.getTime() + durMin * 60000) };
  }
  // resize: keep start, move the end; floor the duration at one grid step
  let newDur = Math.round((durMin + deltaMin) / grid) * grid;
  if (newDur < grid) newDur = grid;
  return { start: origStart, end: new Date(origStart.getTime() + newDur * 60000) };
}

/** A raw event as returned by HA, kept so we can edit/delete it. */
export interface RawEvent {
  kind?: "calendar" | "todo";
  personIdx: number;
  shared?: boolean;
  shared_person_idxs?: number[];
  shared_label?: string;
  calendar: string;
  uid?: string;
  recurrence_id?: string;
  rrule?: string;
  summary: string;
  description?: string;
  location?: string;
  allDay: boolean;
  start: Date; // absolute start
  end: Date; // absolute end (exclusive)
  color: string;
  tentative?: boolean; // provisional event (dashed styling)
  todo_item?: string;
  todo_due?: string;
  todo_due_has_time?: boolean;
}

/** A per-day display segment derived from a RawEvent. */
export interface BoardEvent {
  ref: RawEvent;
  personIdx: number;
  shared?: boolean;
  day: number; // 0 = Monday, within the current week
  startMin: number; // minutes from midnight of `day`
  endMin: number; // minutes from midnight of `day` (1440 = end of day)
  title: string;
  location?: string;
  allDay: boolean;
  color: string;
  continuesBefore: boolean;
  continuesAfter: boolean;
  part?: number; // 1-based day index for multi-day events ("day 2 of 5")
  parts?: number; // total days of a multi-day event; unset when single-day
}

/** A timed segment with its side-by-side overlap placement. */
export interface LaidOutEvent extends BoardEvent {
  col: number; // 0-based column within an overlap cluster
  cols: number; // total columns in that cluster
  span: number; // how many columns this event may stretch across (>= 1)
  cluster: number; // id of the overlap cluster this event belongs to
}

/** Normalize a HA calendar API item into an absolute-time RawEvent. */
export function parseRawEvent(
  ev: any,
  personIdx: number,
  calendar: string,
  color: string,
  shared: boolean = false,
): RawEvent | null {
  const allDay = !ev?.start?.dateTime;
  let start: Date;
  let end: Date;
  if (allDay) {
    // All-day: dates are timezone-naive; end is EXCLUSIVE.
    if (!ev?.start?.date) return null;
    start = new Date(`${ev.start.date}T00:00:00`);
    end = ev.end?.date ? new Date(`${ev.end.date}T00:00:00`) : new Date(start.getTime() + DAY_MS);
  } else {
    start = new Date(ev.start.dateTime);
    end = new Date(ev.end?.dateTime ?? ev.start.dateTime);
  }
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (end.getTime() <= start.getTime()) {
    end = new Date(start.getTime() + (allDay ? DAY_MS : 60000));
  }
  return {
    personIdx,
    shared,
    calendar,
    uid: ev.uid,
    recurrence_id: ev.recurrence_id,
    rrule: ev.rrule,
    summary: ev.summary || "Termin",
    description: ev.description,
    location: ev.location,
    allDay,
    start,
    end,
    color,
    // Tentative is opt-in via `tentative_patterns` only. We deliberately do NOT
    // derive it from the calendar status: some feeds (e.g. school timetables)
    // mark every event TENTATIVE, which would make whole columns look faded.
    tentative: false,
  };
}

/** Split a RawEvent into per-day display segments within the visible week. */
export function splitIntoSegments(raw: RawEvent, monday: Date): BoardEvent[] {
  return splitAcrossDays(raw, monday, 7);
}

/**
 * Split a RawEvent into per-day segments across `numDays` days starting at
 * `gridStart`. `day` is the 0-based offset from `gridStart`. Used by the week
 * views (numDays = 7) and the month grid (numDays = weeks * 7).
 */
export function splitAcrossDays(raw: RawEvent, gridStart: Date, numDays: number): BoardEvent[] {
  const segs: BoardEvent[] = [];
  // "day X of Y" for events that span multiple calendar days
  const firstDay = new Date(raw.start);
  firstDay.setHours(0, 0, 0, 0);
  // count calendar days (not 24-h blocks) so DST days don't add or lose a part
  const lastDay = new Date(raw.end);
  lastDay.setHours(0, 0, 0, 0);
  const totalParts = Math.max(
    1,
    calendarDaysBetween(firstDay, lastDay) + (raw.end.getTime() > lastDay.getTime() ? 1 : 0),
  );
  const starts = dayStarts(gridStart, numDays + 1);
  for (let d = 0; d < numDays; d++) {
    const dayStart = starts[d];
    const dayEnd = starts[d + 1];
    const segStartMs = Math.max(raw.start.getTime(), dayStart.getTime());
    const segEndMs = Math.min(raw.end.getTime(), dayEnd.getTime());
    if (segEndMs <= segStartMs) continue;
    const startMin = raw.allDay ? 0 : Math.round((segStartMs - dayStart.getTime()) / 60000);
    const endMin = raw.allDay ? 1440 : Math.round((segEndMs - dayStart.getTime()) / 60000);
    const part = totalParts > 1 ? calendarDaysBetween(firstDay, dayStart) + 1 : undefined;
    segs.push({
      part,
      parts: totalParts > 1 ? totalParts : undefined,
      ref: raw,
      personIdx: raw.personIdx,
      shared: raw.shared === true,
      day: d,
      startMin,
      endMin: Math.min(endMin, 1440),
      title: raw.summary,
      location: raw.location,
      allDay: raw.allDay,
      color: raw.color,
      continuesBefore: raw.start.getTime() < dayStart.getTime(),
      continuesAfter: raw.end.getTime() > dayEnd.getTime(),
    });
  }
  return segs;
}

/** Local midnight of `start`'s day and the following days (DST-safe: calendar days, not 24 h). */
export function dayStarts(start: Date, count: number): Date[] {
  const out: Date[] = [];
  for (let i = 0; i < count; i++) {
    out.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return out;
}

/** Whole calendar days from `a` to `b` (both local), ignoring DST hour shifts. */
export function calendarDaysBetween(a: Date, b: Date): number {
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / DAY_MS);
}

/**
 * Window of the planner view: `days` calendar days starting today, paged by
 * `offset` (offset 1 = the next `days` days).
 */
export function plannerRange(now: Date, days: number, offset: number): { start: Date; end: Date } {
  const n = Math.max(1, Math.round(days));
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset * n);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + n);
  return { start, end };
}

/**
 * Bucket events into the planner's day columns: per day all-day items first,
 * then timed items by start time (ties: longer first, then title).
 */
export function plannerBuckets(raws: RawEvent[], start: Date, days: number): BoardEvent[][] {
  const buckets: BoardEvent[][] = Array.from({ length: days }, () => []);
  for (const r of raws) {
    for (const s of splitAcrossDays(r, start, days)) buckets[s.day].push(s);
  }
  for (const b of buckets) {
    b.sort(
      (x, y) =>
        Number(y.allDay) - Number(x.allDay) ||
        x.startMin - y.startMin ||
        y.endMin - x.endMin ||
        x.title.localeCompare(y.title),
    );
  }
  return buckets;
}

/**
 * Text color that stays readable on a solid background: near-black on light
 * colors, white on dark ones. Only hex colors are judged; anything else
 * (CSS variables, names) returns null so the caller keeps its default.
 */
export function readableTextColor(bg: string): string | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(bg).trim());
  if (!m) return null;
  const hex =
    m[1].length === 3
      ? m[1]
          .split("")
          .map((c) => c + c)
          .join("")
      : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  // contrast vs white (1.05/(L+.05)) against contrast vs black ((L+.05)/.05)
  return lum > 0.179 ? "#1b1726" : "#ffffff";
}

/**
 * Assign side-by-side columns to overlapping timed events so they don't
 * stack on top of each other. Events in the same "overlap cluster" share
 * the same `cols` count; each gets its own `col` index.
 */
export function layoutDayColumns(events: BoardEvent[]): LaidOutEvent[] {
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const result: LaidOutEvent[] = [];
  let cluster: LaidOutEvent[] = [];
  let clusterEnd = -1;
  let clusterId = 0;
  const colEnds: number[] = [];

  const flush = () => {
    if (cluster.length) {
      const cols = Math.max(...cluster.map((e) => e.col)) + 1;
      cluster.forEach((e) => {
        e.cols = cols;
        e.cluster = clusterId;
        // Stretch into free columns to the right until we hit a column used by
        // an event that overlaps in time (Google-Calendar-style expansion).
        let limit = cols;
        for (const o of cluster) {
          if (o !== e && o.col > e.col && o.startMin < e.endMin && o.endMin > e.startMin) {
            limit = Math.min(limit, o.col);
          }
        }
        e.span = Math.max(1, limit - e.col);
      });
      clusterId++;
    }
    cluster = [];
  };

  for (const ev of sorted) {
    if (cluster.length && ev.startMin >= clusterEnd) {
      flush();
      colEnds.length = 0;
    }
    let col = colEnds.findIndex((end) => end <= ev.startMin);
    if (col === -1) {
      col = colEnds.length;
      colEnds.push(ev.endMin);
    } else {
      colEnds[col] = ev.endMin;
    }
    const laid: LaidOutEvent = { ...ev, col, cols: 1, span: 1, cluster: clusterId };
    cluster.push(laid);
    result.push(laid);
    clusterEnd = cluster.length === 1 ? ev.endMin : Math.max(clusterEnd, ev.endMin);
  }
  flush();
  return result;
}
