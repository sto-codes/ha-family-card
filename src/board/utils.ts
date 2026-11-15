import type { HomeAssistant } from "custom-card-helpers";
import type { PersonConfig } from "./types";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
export const FALLBACK_COLORS = [
  "#8B7CF6",
  "#34D399",
  "#FBBF24",
  "#FB7185",
  "#22D3EE",
  "#C084FC",
  "#A3E635",
  "#FB923C",
  "#F472B6",
  "#60A5FA",
];
export const DEFAULT_HOUR_HEIGHT = 64; // px per hour in the day view
export const HOUR_HEIGHT_MIN = 40;
export const HOUR_HEIGHT_MAX = 96;

// HA weather condition -> mdi icon
export const WEATHER_ICON: Record<string, string> = {
  "clear-night": "weather-night",
  cloudy: "weather-cloudy",
  fog: "weather-fog",
  hail: "weather-hail",
  lightning: "weather-lightning",
  "lightning-rainy": "weather-lightning-rainy",
  partlycloudy: "weather-partly-cloudy",
  pouring: "weather-pouring",
  rainy: "weather-rainy",
  snowy: "weather-snowy",
  "snowy-rainy": "weather-snowy-rainy",
  sunny: "weather-sunny",
  windy: "weather-windy",
  "windy-variant": "weather-windy-variant",
  exceptional: "weather-cloudy-alert",
};

// CalendarEntityFeature bitmask (home-assistant/core)
export const FEAT_CREATE = 1;
export const FEAT_DELETE = 2;
export const FEAT_UPDATE = 4;
export const SHARED_PERSON_IDX = -1;
export const TODO_FEAT_DUE_DATE = 16;
export const TODO_FEAT_DUE_DATETIME = 32;
export const TODO_FEAT_DESCRIPTION = 64;

/** Built-in keyword -> emoji map for auto_icons (DE + EN). First match wins. */
export const ICON_MAP: Array<[RegExp, string]> = [
  [/zahnarzt|dentist|kieferortho/i, "🦷"],
  [/arzt|doctor|doktor|klinik|hospital|therapie|physio|impf/i, "🩺"],
  [/geburtstag|geb\.|birthday|jubiläum|jubilaeum|anniversary/i, "🎂"],
  [/schwimm|swim|hallenbad|baden/i, "🏊"],
  [/fußball|fussball|soccer|football|training/i, "⚽"],
  [/sport|gym|fitness|turnen|joggen|laufen|workout/i, "🏃"],
  [/reit|pferd|pony|horse/i, "🐴"],
  [/tanz|ballett|dance/i, "🩰"],
  [/klavier|gitarre|musik|music|chor|singen|band|orchester|instrument/i, "🎵"],
  [
    /schule|unterricht|klasse|klassenverbund|school|nachhilfe|lernen|prüfung|pruefung|klausur/i,
    "🎒",
  ],
  [/kita|kindergarten|krippe|hort/i, "🧸"],
  [/frühstück|fruehstueck|breakfast/i, "🥐"],
  [/mittag|lunch|abendessen|dinner|essen|kochen|restaurant|brunch/i, "🍽️"],
  [/kaffee|coffee|café|cafe/i, "☕"],
  [/urlaub|ferien|vacation|holiday|reise|trip|strand|beach/i, "🏖️"],
  [/flug|flight|airport|flughafen/i, "✈️"],
  [/zug|bahn|train|abfahrt|ankunft/i, "🚆"],
  [/kino|film|movie|cinema/i, "🎬"],
  [/party|feier|fest|celebration/i, "🎉"],
  [/einkauf|shopping|supermarkt|einkaufen|besorgung/i, "🛒"],
  [/putz|reinig|cleaning|wäsche|waesche|müll|muell|garbage|trash/i, "🧹"],
  [/schlaf|nap|ruhezeit|mittagsschlaf/i, "😴"],
  [/spiel|freispiel|play|angebotszeit/i, "🧸"],
  [/meeting|besprechung|termin|call|konferenz|conference|office|büro|buero|arbeit|work/i, "💼"],
  [/friseur|haircut|hairdresser|frisör|frisoer/i, "💇"],
  [/kirche|church|gottesdienst|messe|religion/i, "⛪"],
  [/pause|hofpause|break/i, "⏸️"],
];

// Test for an emoji already present in a title (avoid adding a second one).
export const HAS_EMOJI = /\p{Extended_Pictographic}/u;

export const pad = (n: number) => String(n).padStart(2, "0");

/** local Date -> "YYYY-MM-DDTHH:mm" for <input type=datetime-local> */
export const toLocalInput = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
/** local Date -> "YYYY-MM-DD" for <input type=date> */
export const toLocalDate = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
/** midnight (local) of the given date */
export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/*
 * Idle tracking for the kiosk options, shared by every card on the page: any touch, key
 * or in-app navigation counts (also on other cards, e.g. ticking off a to-do next to the
 * board), and it survives Lovelace re-creating the card after a reconnect.
 */
export let lastActivity = Date.now();
let activityWatched = false;
export const markActivity = (): void => {
  lastActivity = Date.now();
};
export function watchActivity(): void {
  if (activityWatched) return;
  activityWatched = true;
  const opts = { capture: true, passive: true };
  window.addEventListener("pointerdown", markActivity, opts);
  window.addEventListener("keydown", markActivity, opts);
  window.addEventListener("location-changed", markActivity, opts);
  window.addEventListener("popstate", markActivity, opts);
}

export const personColor = (p: PersonConfig, idx: number) =>
  p.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

/** Deterministic palette color from a string (for location/calendar coloring). */
export const hashColor = (s: string): string => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
};

/**
 * Auto-detect family members: every person.* entity becomes a row, and
 * calendar.* entities are matched by entity slug or friendly name.
 * Exported so the editor can offer a one-click "detect" button.
 */
export function autoDetectPersons(hass: HomeAssistant): PersonConfig[] {
  const states = hass?.states ?? {};
  const calendars = Object.keys(states).filter((id) => id.startsWith("calendar."));
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  const persons: PersonConfig[] = [];
  for (const id of Object.keys(states)) {
    if (!id.startsWith("person.")) continue;
    const slug = id.slice("person.".length);
    const friendly = (states[id].attributes?.friendly_name as string | undefined) ?? slug;
    const key = norm(slug);
    const keyF = norm(friendly);
    const matched = calendars.filter((c) => {
      const cSlug = norm(c.slice("calendar.".length));
      const cName = norm((states[c].attributes?.friendly_name as string | undefined) ?? "");
      return (
        cSlug === key ||
        cSlug.includes(key) ||
        (keyF.length > 2 && (cSlug.includes(keyF) || cName.includes(keyF)))
      );
    });
    persons.push({
      name: friendly,
      person: id,
      calendar: matched.length === 1 ? matched[0] : matched.length ? matched : "",
    });
    if (persons.length >= 10) break;
  }
  return persons;
}
