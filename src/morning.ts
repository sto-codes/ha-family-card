/* ------------------------------------------------------------------ */
/*  Morning check: what each person has to take along today (or pack  */
/*  tonight for tomorrow), plus a weather tip. Pure helpers, free of   */
/*  Lit/HA so they can be unit-tested.                                 */
/* ------------------------------------------------------------------ */

export interface PackRule {
  re: RegExp;
  item: string;
}

/** Built-in keyword -> item rules, per language. First match per rule counts. */
const DEFAULT_RULES: Record<"de" | "en", Array<[string, string]>> = {
  de: [
    ["schwimm|swim|hallenbad|freibad|baden", "Badesachen"],
    [
      "turnen|sport|training|fußball|fussball|handball|basketball|volleyball|tennis|leichtathletik|judo|karate|gym",
      "Sportzeug",
    ],
    ["yoga|pilates", "Yogamatte"],
    ["reit|pferd|pony", "Reitsachen"],
    ["tanz|ballett|dance", "Tanzsachen"],
    ["instrument|klavier|gitarre|geige|flöte|floete|cello|trompete|musikschule", "Instrument"],
    ["ausflug|wandertag|exkursion", "Proviant & Trinkflasche"],
    ["bücherei|buecherei|bibliothek", "Büchereibücher"],
  ],
  en: [
    ["swim|pool", "Swimwear"],
    [
      "sport|training|soccer|football|handball|basketball|volleyball|tennis|athletics|judo|karate|gym",
      "Sports kit",
    ],
    ["yoga|pilates", "Yoga mat"],
    ["riding|horse|pony", "Riding gear"],
    ["dance|ballet", "Dance clothes"],
    ["instrument|piano|guitar|violin|flute|cello|trumpet|music school", "Instrument"],
    ["field trip|excursion|outing", "Packed lunch & bottle"],
    ["library", "Library books"],
  ],
};

/**
 * Rules from config lines ("Bücherei => Büchereibücher", pattern is a case-insensitive
 * regex or plain text) followed by the built-in rules for the language.
 * Lines without "=>" or with an invalid pattern are skipped.
 */
export function packRules(lang: string, custom: string[] = [], defaults = true): PackRule[] {
  const rules: PackRule[] = [];
  for (const line of custom) {
    const i = line.indexOf("=>");
    if (i < 0) continue;
    const pat = line.slice(0, i).trim();
    const item = line.slice(i + 2).trim();
    if (!pat || !item) continue;
    try {
      rules.push({ re: new RegExp(pat, "i"), item });
    } catch {
      rules.push({ re: new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), item });
    }
  }
  if (defaults) {
    const list = DEFAULT_RULES[lang.toLowerCase().startsWith("de") ? "de" : "en"];
    for (const [pat, item] of list) rules.push({ re: new RegExp(pat, "i"), item });
  }
  return rules;
}

/** Unique items to take along for the given event titles, in rule order. */
export function packList(titles: string[], rules: PackRule[]): string[] {
  const out: string[] = [];
  for (const r of rules) {
    if (out.includes(r.item)) continue;
    if (titles.some((t) => r.re.test(t))) out.push(r.item);
  }
  return out;
}

export interface DayWeather {
  temp: number; // daily high, °C
  low?: number; // daily low, °C
  condition: string; // HA weather condition
  rain?: number; // precipitation probability in %
}

export type WeatherTip = "rain" | "snow" | "cold" | "sun";

const RAINY = ["rainy", "pouring", "lightning-rainy", "hail", "snowy-rainy"];

/** Clothing tips for a day's forecast: rain/snow gear, warm clothes, sun protection. */
export function weatherTips(w?: DayWeather): WeatherTip[] {
  if (!w) return [];
  const tips: WeatherTip[] = [];
  if (w.condition === "snowy" || w.condition === "snowy-rainy") tips.push("snow");
  if (RAINY.includes(w.condition) || (w.rain ?? 0) >= 50) {
    if (!tips.includes("snow") || w.condition === "snowy-rainy") tips.push("rain");
  }
  const low = w.low ?? w.temp;
  if (low <= 3) tips.push("cold");
  if (w.temp >= 25 || (w.condition === "sunny" && w.temp >= 22)) tips.push("sun");
  return tips;
}

export interface MorningWindow {
  from: number; // hour the "today" hint appears
  until: number; // hour it disappears
  evening: number; // hour the "pack for tomorrow" hint appears (0 = off)
}

/** Which day the check is about right now: 0 = today, 1 = tomorrow, null = hidden. */
export function morningMode(now: Date, w: MorningWindow): 0 | 1 | null {
  const h = now.getHours() + now.getMinutes() / 60;
  if (h >= w.from && h < w.until) return 0;
  if (w.evening > 0 && h >= w.evening) return 1;
  return null;
}
