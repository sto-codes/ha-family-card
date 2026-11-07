import { describe, expect, it } from "vitest";
import {
  addressCandidates,
  daysUntil,
  distanceKm,
  fillTemplate,
  isOnlineLocation,
  leaveInfo,
  noticeActive,
  parseLatLon,
  stripMarker,
} from "./extras";

describe("countdowns", () => {
  it("counts calendar days across the DST switch", () => {
    const now = new Date(2026, 9, 24, 23, 30); // Sat before the switch
    expect(daysUntil(now, new Date(2026, 9, 25, 0, 0))).toBe(1);
    expect(daysUntil(now, new Date(2026, 10, 1, 9, 0))).toBe(8);
    expect(daysUntil(now, new Date(2026, 9, 24, 8, 0))).toBe(0);
  });
  it("strips the marker", () => {
    expect(stripMarker("⏳ Urlaub Italien")).toBe("Urlaub Italien");
    expect(stripMarker("Ferien ⏳")).toBe("Ferien");
    expect(stripMarker("⏳")).toBe("⏳");
  });
});

describe("travel", () => {
  it("prefers the street line of Apple-style locations", () => {
    expect(addressCandidates("TonHalle\nAtelierstraße 24, 81671 München, Deutschland")).toEqual([
      "Atelierstraße 24, 81671 München",
      "TonHalle, Atelierstraße 24, 81671 München",
    ]);
    expect(addressCandidates("Saarstraße 7, 80797 München")).toEqual([
      "Saarstraße 7, 80797 München",
    ]);
    expect(addressCandidates("Leopoldstraße 175\n80804 München\nDeutschland")).toEqual([
      "Leopoldstraße 175, 80804 München",
    ]);
    expect(addressCandidates("  ")).toEqual([]);
  });
  it("detects online meetings", () => {
    expect(isOnlineLocation("https://zoom.us/j/1")).toBe(true);
    expect(isOnlineLocation("Microsoft Teams-Besprechung")).toBe(true);
    expect(isOnlineLocation("Bunte Arche")).toBe(false);
  });
  it("parses coordinates and measures distance", () => {
    expect(parseLatLon("48.1, 11.5")).toEqual({ lat: 48.1, lon: 11.5 });
    expect(parseLatLon("Marienplatz")).toBeUndefined();
    const d = distanceKm({ lat: 48.137, lon: 11.575 }, { lat: 48.302, lon: 11.611 });
    expect(d).toBeGreaterThan(17);
    expect(d).toBeLessThan(20);
  });
  it("computes when to leave", () => {
    const start = new Date(2026, 10, 7, 15, 0);
    const a = leaveInfo(new Date(2026, 10, 7, 13, 0), start, 22.4, 5);
    expect(a.leaveAt.getHours() * 60 + a.leaveAt.getMinutes()).toBe(14 * 60 + 33);
    expect(a.level).toBe("info");
    expect(leaveInfo(new Date(2026, 10, 7, 14, 20), start, 22.4, 5).level).toBe("soon");
    const late = leaveInfo(new Date(2026, 10, 7, 14, 40), start, 22.4, 5);
    expect(late.level).toBe("now");
    expect(late.minutes).toBeLessThanOrEqual(0);
  });
});

describe("notices", () => {
  it("is idle for off-like states", () => {
    expect(noticeActive("off")).toBe(false);
    expect(noticeActive("unavailable")).toBe(false);
    expect(noticeActive(undefined)).toBe(false);
    expect(noticeActive("Gelber Sack")).toBe(true);
    expect(noticeActive("on")).toBe(true);
  });
  it("fills templates", () => {
    expect(fillTemplate("{state} rausstellen", { state: "Biotonne" })).toBe("Biotonne rausstellen");
    expect(fillTemplate("{x}", {})).toBe("{x}");
  });
});
