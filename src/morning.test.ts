import { describe, expect, it } from "vitest";
import { morningMode, packList, packRules, weatherTips } from "./morning";

describe("packList", () => {
  const de = packRules("de-DE");

  it("finds items from German titles", () => {
    expect(packList(["Schwimmkurs", "Mädchenturnen"], de)).toEqual(["Badesachen", "Sportzeug"]);
    expect(packList(["Instrumentenkarussell"], de)).toEqual(["Instrument"]);
  });

  it("returns each item once and nothing for plain events", () => {
    expect(packList(["Kinderturnen", "Fußball Training"], de)).toEqual(["Sportzeug"]);
    expect(packList(["Schule", "Mittagsbetreuung"], de)).toEqual([]);
  });

  it("puts custom rules first and can drop the defaults", () => {
    const rules = packRules("de", ["Bücherei => Leseausweis", "kaputt[ => X", "ohne Pfeil"]);
    expect(packList(["Bücherei"], rules)).toEqual(["Leseausweis", "Büchereibücher"]);
    expect(packList(["kaputt["], rules)).toEqual(["X"]);
    expect(packList(["Schwimmen"], packRules("de", [], false))).toEqual([]);
  });

  it("uses English rules for other languages", () => {
    expect(packList(["Swim class", "Piano"], packRules("en"))).toEqual(["Swimwear", "Instrument"]);
    expect(packList(["Swim class"], packRules("fr"))).toEqual(["Swimwear"]);
  });
});

describe("weatherTips", () => {
  it("handles rain, cold, snow and sun", () => {
    expect(weatherTips({ temp: 10, low: 5, condition: "rainy" })).toEqual(["rain"]);
    expect(weatherTips({ temp: 10, low: 5, condition: "cloudy", rain: 60 })).toEqual(["rain"]);
    expect(weatherTips({ temp: 4, low: -1, condition: "cloudy", rain: 10 })).toEqual(["cold"]);
    expect(weatherTips({ temp: 1, low: -3, condition: "snowy" })).toEqual(["snow", "cold"]);
    expect(weatherTips({ temp: 27, low: 15, condition: "sunny" })).toEqual(["sun"]);
    expect(weatherTips({ temp: 15, low: 8, condition: "partlycloudy" })).toEqual([]);
    expect(weatherTips(undefined)).toEqual([]);
  });
});

describe("morningMode", () => {
  const w = { from: 5, until: 10, evening: 18 };
  const at = (h: number, m = 0) => new Date(2026, 10, 16, h, m);
  it("shows today in the morning and tomorrow in the evening", () => {
    expect(morningMode(at(4, 59), w)).toBeNull();
    expect(morningMode(at(5), w)).toBe(0);
    expect(morningMode(at(9, 59), w)).toBe(0);
    expect(morningMode(at(10), w)).toBeNull();
    expect(morningMode(at(18), w)).toBe(1);
    expect(morningMode(at(23, 30), w)).toBe(1);
    expect(morningMode(at(20), { ...w, evening: 0 })).toBeNull();
  });
});
