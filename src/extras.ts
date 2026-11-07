/* ------------------------------------------------------------------ */
/*  Pure helpers for the wall-display extras: countdowns, travel time  */
/*  ("time to leave") and notices. Kept free of Lit/HA so they can be  */
/*  unit-tested.                                                        */
/* ------------------------------------------------------------------ */

import { calendarDaysBetween } from "./events";

/** Default marker that turns an event into a countdown ("⏳ Urlaub"). */
export const COUNTDOWN_MARKER = "⏳";

/** Whole calendar days from `now` to `start` (0 = today), DST-safe. */
export function daysUntil(now: Date, start: Date): number {
  return calendarDaysBetween(now, start);
}

/** Title without the countdown marker, e.g. "⏳ Urlaub" -> "Urlaub". */
export function stripMarker(title: string, marker: string = COUNTDOWN_MARKER): string {
  if (!marker) return title.trim();
  return (
    title
      .split(marker)
      .join(" ")
      .replace(/\s{2,}/g, " ")
      .trim() || title.trim()
  );
}

/** Locations that are not a place to drive to (video calls, links). */
export function isOnlineLocation(loc: string): boolean {
  return /https?:\/\/|\b(zoom|teams|meet|webex|online|skype|facetime|telefon|phone)\b/i.test(loc);
}

/**
 * Search strings for a calendar location, best first. Apple Calendar writes
 * "Venue\nStreet 1, 12345 City, Country" — the street line geocodes far more
 * reliably than the venue name, so it goes first; the whole text is the fallback.
 */
export function addressCandidates(loc: string): string[] {
  const lines = loc
    .split(/\n+/)
    .map((l) => l.replace(/,?\s*(Deutschland|Germany|DE)\s*$/i, "").trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const out: string[] = [];
  if (lines.length > 1 && !/\d/.test(lines[0])) out.push(lines.slice(1).join(", "));
  out.push(lines.join(", "));
  return Array.from(new Set(out));
}

export interface LatLon {
  lat: number;
  lon: number;
}

/** Parse "48.1,11.5" into coordinates, or undefined. */
export function parseLatLon(s: string): LatLon | undefined {
  const m = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/.exec(s);
  if (!m) return undefined;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  return Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? { lat, lon } : undefined;
}

/** Great-circle distance in km. */
export function distanceKm(a: LatLon, b: LatLon): number {
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(b.lat - a.lat);
  const dLon = r(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

export type LeaveLevel = "info" | "soon" | "now";

export interface LeaveInfo {
  leaveAt: Date;
  minutes: number; // minutes until leaving (negative = late)
  level: LeaveLevel;
}

/**
 * When to leave for an event: start - travel - buffer.
 * `soon` within `soonMin` minutes, `now` once the leave time has passed.
 */
export function leaveInfo(
  now: Date,
  start: Date,
  travelMin: number,
  bufferMin: number = 5,
  soonMin: number = 15,
): LeaveInfo {
  const leaveAt = new Date(start.getTime() - Math.round(travelMin + bufferMin) * 60000);
  const minutes = Math.ceil((leaveAt.getTime() - now.getTime()) / 60000);
  const level: LeaveLevel = minutes <= 0 ? "now" : minutes <= soonMin ? "soon" : "info";
  return { leaveAt, minutes, level };
}

/** States that mean "nothing to show" for a notice entity. */
export const NOTICE_IDLE = ["off", "unknown", "unavailable", "", "none", "false", "0", "keine"];

export function noticeActive(state: string | undefined, idle: string[] = NOTICE_IDLE): boolean {
  if (state === undefined) return false;
  const s = state.trim().toLowerCase();
  return !idle.map((x) => String(x).toLowerCase()).includes(s);
}

/** Fill "{state}" and "{name}" in a notice title. */
export function fillTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}
