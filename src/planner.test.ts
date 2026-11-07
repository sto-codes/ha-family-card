import { describe, it, expect } from "vitest";
import {
  parseRawEvent,
  splitAcrossDays,
  dayStarts,
  calendarDaysBetween,
  plannerRange,
  plannerBuckets,
  readableTextColor,
} from "./events";

const timed = (start: string, end: string, summary = "x") =>
  parseRawEvent(
    { summary, start: { dateTime: start }, end: { dateTime: end } },
    0,
    "calendar.a",
    "#8fd3ff",
  )!;
const allDay = (start: string, end: string, summary = "x") =>
  parseRawEvent(
    { summary, start: { date: start }, end: { date: end } },
    0,
    "calendar.a",
    "#8fd3ff",
  )!;

describe("dayStarts / calendarDaysBetween", () => {
  it("steps by calendar day across the DST switch", () => {
    // 2026-03-29: clocks go forward in Europe/Berlin (a 23-hour day)
    const s = dayStarts(new Date(2026, 2, 28, 15), 3);
    expect(s.map((d) => [d.getDate(), d.getHours()])).toEqual([
      [28, 0],
      [29, 0],
      [30, 0],
    ]);
    expect(calendarDaysBetween(new Date(2026, 2, 28), new Date(2026, 2, 30))).toBe(2);
  });
});

describe("splitAcrossDays on DST days", () => {
  it("keeps a 09:00 event at 09:00 on the day after the switch", () => {
    const r = timed("2026-03-30T09:00:00+02:00", "2026-03-30T10:00:00+02:00");
    const segs = splitAcrossDays(r, new Date(2026, 2, 28), 4);
    expect(segs).toHaveLength(1);
    expect(segs[0].day).toBe(2);
    expect(segs[0].startMin).toBe(9 * 60);
  });
  it("counts parts of a multi-day all-day event by calendar days", () => {
    const r = allDay("2026-10-24", "2026-10-27"); // spans the October switch (25-hour day)
    const segs = splitAcrossDays(r, new Date(2026, 9, 24), 7);
    expect(segs.map((s) => [s.day, s.part, s.parts])).toEqual([
      [0, 1, 3],
      [1, 2, 3],
      [2, 3, 3],
    ]);
  });
});

describe("plannerRange", () => {
  it("starts today at midnight and pages by the number of days", () => {
    const now = new Date(2026, 10, 7, 13, 45);
    const r0 = plannerRange(now, 7, 0);
    expect([r0.start.getDate(), r0.start.getHours(), r0.end.getDate()]).toEqual([7, 0, 14]);
    const r1 = plannerRange(now, 7, 1);
    expect([r1.start.getDate(), r1.end.getDate()]).toEqual([14, 21]);
    const rm = plannerRange(now, 5, -1);
    expect([rm.start.getDate(), rm.end.getDate()]).toEqual([2, 7]);
  });
});

describe("plannerBuckets", () => {
  it("puts all-day items first, then timed items by start", () => {
    const start = new Date(2026, 10, 7);
    const b = plannerBuckets(
      [
        timed("2026-11-07T14:00:00+01:00", "2026-11-07T15:00:00+01:00", "Turnen"),
        allDay("2026-11-07", "2026-11-08", "Geburtstag"),
        timed("2026-11-07T08:00:00+01:00", "2026-11-07T09:00:00+01:00", "Arzt"),
        timed("2026-11-09T08:00:00+01:00", "2026-11-09T09:00:00+01:00", "Schule"),
      ],
      start,
      3,
    );
    expect(b.map((d) => d.map((e) => e.title))).toEqual([
      ["Geburtstag", "Arzt", "Turnen"],
      [],
      ["Schule"],
    ]);
  });
  it("splits an overnight event into both days", () => {
    const b = plannerBuckets(
      [timed("2026-11-07T22:00:00+01:00", "2026-11-08T02:00:00+01:00", "Party")],
      new Date(2026, 10, 7),
      2,
    );
    expect(b[0][0]).toMatchObject({ startMin: 22 * 60, endMin: 1440, continuesAfter: true });
    expect(b[1][0]).toMatchObject({ startMin: 0, endMin: 120, continuesBefore: true });
  });
});

describe("readableTextColor", () => {
  it("uses dark text on pastel colors and white on dark colors", () => {
    expect(readableTextColor("#ffd77a")).toBe("#1b1726");
    expect(readableTextColor("#8fd3ff")).toBe("#1b1726");
    expect(readableTextColor("#3f51b5")).toBe("#ffffff");
    expect(readableTextColor("#000")).toBe("#ffffff");
  });
  it("returns null for colors it cannot judge", () => {
    expect(readableTextColor("var(--primary-color)")).toBeNull();
    expect(readableTextColor("red")).toBeNull();
  });
});
