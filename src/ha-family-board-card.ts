import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "custom-card-helpers";
import {
  RawEvent,
  BoardEvent,
  LaidOutEvent,
  DAY_MS,
  parseRawEvent,
  splitIntoSegments,
  splitAcrossDays,
  layoutDayColumns,
  dragTimes,
} from "./events";
import {
  localize,
  formatTime,
  formatMinutes,
  formatCountdown,
  weekdayNames,
  formatWeekRange,
} from "./localize";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ViewName = "day" | "week" | "month" | "agenda" | "timeline";
const ALL_VIEWS: ViewName[] = ["day", "timeline", "week", "month", "agenda"];

interface PersonConfig {
  name?: string;
  person?: string; // person.* entity -> avatar (entity_picture) + live status
  calendar?: string | string[]; // calendar.* entity/entities -> events
  todo?: string | string[]; // todo.* list/lists shown in the calendar
  color?: string; // optional override; default falls back to a palette
  badges?: string[]; // extra entities shown as chips under the person header
  hidden?: boolean; // start collapsed (person toggle can bring them back)
}

export interface SharedCalendarGroupConfig {
  calendars: string | string[];
  persons?: string[];
  label?: string;
}

export interface SharedTodoGroupConfig {
  todos: string | string[];
  persons?: string[];
  label?: string;
}

export interface FamilyBoardConfig extends LovelaceCardConfig {
  persons: PersonConfig[];
  shared_calendar?: string | string[]; // optional calendar(s) shown once across all person columns
  shared_todo?: string | string[]; // optional todo list(s) shown once across all person columns
  shared_calendar_groups?: SharedCalendarGroupConfig[];
  shared_todo_groups?: SharedTodoGroupConfig[];
  title?: string;
  view?: ViewName;
  views?: ViewName[]; // which views appear in the toggle. default: all
  time_grid?: 15 | 30 | 60;
  start_hour?: number;
  end_hour?: number;
  show_weekends?: boolean;
  show_now_line?: boolean;
  color_by?: "person" | "location" | "calendar";
  dim_past?: boolean; // fade events that already ended. default true
  hide_patterns?: string[]; // hide events whose title matches any pattern
  show_patterns?: string[]; // allow-list: only show events whose title matches
  replace_patterns?: string[]; // clean up titles: "search => replacement" (or "search" to strip)
  filter_duplicates?: boolean; // drop identical events (title/start/end) per person + in agenda
  calendars?: Record<
    string,
    { color?: string; label?: string; icon?: string; title_field?: string }
  >; // per-calendar color/label/icon and which field supplies the title
  tentative_patterns?: string[]; // mark events tentative when title matches
  auto_icons?: boolean; // prefix events with a matching emoji by keyword. default false
  icon_patterns?: string[]; // custom icon rules: "keyword => 🎂"
  show_focus?: boolean; // show a "now / next" focus bar per person above the views
  drag_drop?: boolean; // drag to move / resize events in the day view. default true
  compact?: boolean; // denser spacing + smaller fonts in one switch
  map_url?: string; // location link template, {location} is replaced (URL-encoded)
  show_progress?: boolean; // progress bar on running events. default true
  weather_entity?: string; // weather.* entity for the daily forecast
  show_weather?: boolean; // show weather in headers. default true when entity set
  refresh_interval?: number; // seconds; 0 disables. default 300
  hour_height?: number; // px per hour in the day view. default 64
  hour_width?: number; // px per hour in the timeline view. default 96
  fit_height?: boolean; // shrink the day view so start..end fits without scroll
  full_height?: boolean; // stretch the board to the bottom of the screen (wall tablet)
  col_min_width?: number; // min px per person column before horizontal scroll. default 120
  event_size?: number; // event title font size in px (editor slider -> --fb-event-size)
  radius?: number; // corner radius of event blocks in px (-> --fb-radius)
  past_opacity?: number; // opacity of past events in percent (-> --fb-past-opacity)
  hide_empty_persons?: boolean; // week view: skip persons without events that week
  auto_return?: number; // kiosk: minutes of inactivity before returning to the default view. 0=off
  trim_hours?: boolean; // day view: cut empty edge hours so events get the full height. default true
  background_hours?: number; // timed events >= this many hours become a faint band. default 3, 0=off
  max_columns?: number; // max side-by-side columns per person/day. default 3
  first_day?: "monday" | "sunday"; // week start. default monday
  scroll_to_now?: boolean; // auto-scroll day view to current time. default true
}

/** A collapsed "+N more" marker for dense overlap clusters in the day view. */
interface Overflow {
  col: number;
  cols: number;
  startMin: number;
  endMin: number;
  count: number;
}

type TodoStatus = "needs_action" | "completed";

interface TodoItem {
  uid?: string;
  summary: string;
  status: TodoStatus;
  due?: string;
  description?: string;
}

interface PersonTodoItem extends TodoItem {
  entityId: string;
  listLabel: string;
}

interface NormalizedSharedGroup {
  ids: string[];
  personIdxs: number[];
  label?: string;
}

interface TodoDialogState {
  entityId: string;
  uid?: string;
  itemRef: string;
  summary: string;
  description: string;
  due: string;
  dueHasTime: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  supportsDescription: boolean;
  supportsDueDate: boolean;
  supportsDueDatetime: boolean;
  busy?: boolean;
  error?: string;
}

interface TodoBadgeDialogState {
  personIdx: number;
}

/** State of the create/edit dialog. */
interface DialogState {
  mode: "create" | "edit";
  personIdx: number;
  calendar: string;
  uid?: string;
  recurrence_id?: string;
  canUpdate: boolean;
  canDelete: boolean;
  summary: string;
  location: string;
  description: string;
  allDay: boolean;
  start: string; // datetime-local ("YYYY-MM-DDTHH:mm") or date ("YYYY-MM-DD")
  end: string;
  recurring?: boolean; // event is part of a recurring series
  recurrenceRange: "" | "THISANDFUTURE"; // scope for edit/delete of a series
  calendarOptions?: string[]; // when a person has several writable calendars
  busy?: boolean;
  error?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const FALLBACK_COLORS = [
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
const DEFAULT_HOUR_HEIGHT = 64; // px per hour in the day view
const HOUR_HEIGHT_MIN = 40;
const HOUR_HEIGHT_MAX = 96;

// HA weather condition -> mdi icon
const WEATHER_ICON: Record<string, string> = {
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
const FEAT_CREATE = 1;
const FEAT_DELETE = 2;
const FEAT_UPDATE = 4;
const SHARED_PERSON_IDX = -1;
const TODO_FEAT_DUE_DATE = 16;
const TODO_FEAT_DUE_DATETIME = 32;
const TODO_FEAT_DESCRIPTION = 64;

/** Built-in keyword -> emoji map for auto_icons (DE + EN). First match wins. */
const ICON_MAP: Array<[RegExp, string]> = [
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
const HAS_EMOJI = /\p{Extended_Pictographic}/u;

const pad = (n: number) => String(n).padStart(2, "0");

/** local Date -> "YYYY-MM-DDTHH:mm" for <input type=datetime-local> */
const toLocalInput = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
/** local Date -> "YYYY-MM-DD" for <input type=date> */
const toLocalDate = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
/** midnight (local) of the given date */
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const personColor = (p: PersonConfig, idx: number) =>
  p.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

/** Deterministic palette color from a string (for location/calendar coloring). */
const hashColor = (s: string): string => {
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

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
export class FamilyBoardCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: FamilyBoardConfig;
  @state() private _events: BoardEvent[] = [];
  @state() private _view: ViewName = "day";
  @state() private _day: number = (new Date().getDay() + 6) % 7;
  @state() private _weekOffset = 0;
  @state() private _monthOffset = 0;
  @state() private _dialog?: DialogState;
  @state() private _todoDialog?: TodoDialogState;
  @state() private _todoBadgeDialog?: TodoBadgeDialogState;
  @state() private _loadError = false;
  @state() private _loading = false;
  @state() private _todoBusy: string[] = [];
  @state() private _todoItemsByOwner: Record<string, PersonTodoItem[]> = {};
  @state() private _fitPx = 0;
  @state() private _hiddenP: number[] = []; // temporarily hidden persons (header click) // measured px/min when fit_height is on (0 = not measured)
  @state() private _drag?: {
    raw: RawEvent;
    mode: "move" | "resize";
    deltaMin: number;
    moved: boolean;
    busy: boolean;
  };

  private _dragStartY = 0;
  private _dragPx = 1;
  private _dragGrid = 30;
  private _suppressClick = false;
  private _raw: RawEvent[] = [];
  private _fetchedKey = "";
  private _timer?: number;
  private _tick?: number;
  @state() private _forecast: Record<string, { temp: number; condition: string }> = {};
  private _weatherKey = "";
  private _scrolledKey = "";
  private _restoreFocus?: HTMLElement;
  private _ro?: ResizeObserver;
  private _lastInteract = Date.now();

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor");
    return document.createElement("ha-family-board-card-editor") as LovelaceCardEditor;
  }

  /** Zero-config start: detect person.* entities and match their calendars. */
  public static getStubConfig(hass?: HomeAssistant): FamilyBoardConfig {
    const persons = hass ? autoDetectPersons(hass) : [];
    return {
      type: "custom:family-board-card",
      view: "day",
      time_grid: 30,
      start_hour: 6,
      end_hour: 22,
      show_weekends: true,
      show_now_line: true,
      color_by: "person",
      persons: persons.length
        ? persons
        : [
            { name: "Person 1", person: "", calendar: "" },
            { name: "Person 2", person: "", calendar: "" },
          ],
    };
  }

  public setConfig(config: FamilyBoardConfig): void {
    if (!config.persons || !Array.isArray(config.persons)) {
      throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");
    }
    this._config = config;
    const enabled = this._enabledViews;
    const wanted = config.view ?? "day";
    this._view = enabled.includes(wanted) ? wanted : enabled[0];
    this._day = this._todayIndex();
    // persons flagged `hidden` start collapsed (the header toggle brings them back)
    this._hiddenP = config.persons.map((p, i) => (p.hidden ? i : -1)).filter((i) => i >= 0);
    // simple size knobs -> CSS tokens (also overridable via theme/card-mod)
    const colMin = Number(config.col_min_width);
    if (Number.isFinite(colMin) && colMin >= 60) {
      this.style.setProperty("--fb-col-min", `${Math.min(colMin, 400)}px`);
    } else {
      this.style.removeProperty("--fb-col-min");
    }
    this.toggleAttribute("compact", config.compact === true);
    const evSize = Number(config.event_size);
    if (Number.isFinite(evSize) && evSize >= 8 && evSize <= 20) {
      this.style.setProperty("--fb-event-size", `${evSize}px`);
      this.style.setProperty("--fb-chip-size", `${Math.max(evSize - 1, 8)}px`);
    } else {
      this.style.removeProperty("--fb-event-size");
      this.style.removeProperty("--fb-chip-size");
    }
    const radius = Number(config.radius);
    if (Number.isFinite(radius) && radius >= 0 && radius <= 20) {
      this.style.setProperty("--fb-radius", `${radius}px`);
      this.style.setProperty("--fb-radius-sm", `${Math.max(radius - 2, 2)}px`);
    } else {
      this.style.removeProperty("--fb-radius");
      this.style.removeProperty("--fb-radius-sm");
    }
    const pastOp = Number(config.past_opacity);
    if (Number.isFinite(pastOp) && pastOp >= 10 && pastOp <= 100) {
      this.style.setProperty("--fb-past-opacity", `${pastOp / 100}`);
    } else {
      this.style.removeProperty("--fb-past-opacity");
    }
    if (this.isConnected) this._startTimer();
  }

  /** Views shown in the toggle (config order-independent, default all). */
  private get _enabledViews(): ViewName[] {
    const v = this._config?.views;
    const chosen = Array.isArray(v) ? ALL_VIEWS.filter((x) => v.includes(x)) : [];
    return chosen.length ? chosen : [...ALL_VIEWS];
  }

  /** JS weekday (0=Sun..6=Sat) of the configured week start. */
  private get _firstDayJs(): number {
    return this._config?.first_day === "sunday" ? 0 : 1;
  }
  /** Column index (0..6 from week start) of the real today. */
  private _todayIndex(): number {
    return (new Date().getDay() - this._firstDayJs + 7) % 7;
  }

  public getCardSize(): number {
    return 12;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("visibilitychange", this._onVisible);
    window.addEventListener("focus", this._onVisible);
    this._startTimer();
    this.addEventListener("pointerdown", this._onInteract);
    // minute tick so countdowns and progress bars stay live when idle
    this._tick = window.setInterval(() => {
      this._kioskReturn();
      this.requestUpdate();
    }, 60000);
    // recompute the fit-to-height scaling whenever the card is resized
    if (typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => requestAnimationFrame(() => this._measureFit()));
      this._ro.observe(this);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("visibilitychange", this._onVisible);
    window.removeEventListener("focus", this._onVisible);
    this.removeEventListener("pointerdown", this._onInteract);
    this._stopTimer();
    if (this._tick) {
      clearInterval(this._tick);
      this._tick = undefined;
    }
    this._ro?.disconnect();
    this._ro = undefined;
    window.removeEventListener("pointermove", this._onDragMove);
    window.removeEventListener("pointerup", this._onDragUp);
  }

  private get _progressOn(): boolean {
    return this._config?.show_progress !== false;
  }
  /** Whether an event is happening right now. */
  private _isCurrent(e: BoardEvent): boolean {
    const n = Date.now();
    return e.ref.start.getTime() <= n && n < e.ref.end.getTime();
  }
  /** Elapsed percentage (0–100) of a currently running event. */
  private _progressPct(e: BoardEvent): number {
    const s = e.ref.start.getTime();
    const en = e.ref.end.getTime();
    if (en <= s) return 0;
    return Math.min(100, Math.max(0, ((Date.now() - s) / (en - s)) * 100));
  }

  private _onInteract = (): void => {
    this._lastInteract = Date.now();
  };

  /** Kiosk mode: after `auto_return` minutes without touch, go back to the default view. */
  private _kioskReturn(): void {
    const min = Number(this._config?.auto_return ?? 0);
    if (!Number.isFinite(min) || min <= 0) return;
    if (Date.now() - this._lastInteract < min * 60000) return;
    if (this._dialog || this._todoDialog || this._todoBadgeDialog) return; // never yank an open dialog away
    const wanted = this._config.view ?? "day";
    const view = this._enabledViews.includes(wanted) ? wanted : this._enabledViews[0];
    if (this._view !== view) this._view = view;
    if (this._weekOffset !== 0) this._weekOffset = 0;
    if (this._monthOffset !== 0) this._monthOffset = 0;
    if (this._hiddenP.length) this._hiddenP = [];
    this._day = this._todayIndex();
  }

  /** Refresh when the tab/tablet becomes visible again. */
  private _onVisible = (): void => {
    if (document.visibilityState !== "hidden" && this.hass && this._config) this._refetch();
  };

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && (this._dialog || this._todoDialog || this._todoBadgeDialog)) {
      e.stopPropagation();
      if (this._dialog) this._closeDialog();
      else if (this._todoDialog) this._closeTodoDialog();
      else this._closeTodoBadgeDialog();
    }
  };

  private _startTimer(): void {
    this._stopTimer();
    const s = this._config?.refresh_interval ?? 300;
    if (s > 0) this._timer = window.setInterval(() => this._refetch(), s * 1000);
  }
  private _stopTimer(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  protected updated(changed: PropertyValues): void {
    if ((changed.has("hass") || changed.has("_config")) && this.hass && this._config) {
      this._maybeFetch();
      this._maybeFetchWeather();
    }
    if (changed.has("_todoItemsByOwner") && this._todoBadgeDialog) {
      const items = this._todoItemsForPerson(this._todoBadgeDialog.personIdx);
      if (items.length === 0) this._todoBadgeDialog = undefined;
    }
    if (changed.has("_dialog") || changed.has("_todoDialog") || changed.has("_todoBadgeDialog")) {
      const prevOpen =
        Boolean(changed.get("_dialog")) ||
        Boolean(changed.get("_todoDialog")) ||
        Boolean(changed.get("_todoBadgeDialog"));
      this._manageOverlayFocus(prevOpen);
    }
    this._measureFit();
    this._maybeScrollToNow();
  }

  /** Keep sticky row offsets in sync so top rows stay visible below the header. */
  private _syncStickyRows(): void {
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    if (!board) return;
    const header = board.querySelector(".header-row") as HTMLElement | null;
    const todo = board.querySelector(".todo-row") as HTMLElement | null;
    const headerH = header?.offsetHeight ?? 0;
    const todoH = todo?.offsetHeight ?? 0;
    board.style.setProperty("--fb-sticky-header-h", `${headerH}px`);
    board.style.setProperty("--fb-sticky-todo-h", `${todoH}px`);
  }

  /**
   * When `fit_height` is on, shrink the day grid so the whole start..end range
   * fits inside the board without scrolling. Only ever scales DOWN from the
   * configured hour height (never blows small days up into giant blocks).
   */
  private _measureFit(): void {
    this._applyFullHeight();
    this._syncStickyRows();
    if (!this._config?.fit_height || this._view !== "day") {
      if (this._fitPx !== 0) this._fitPx = 0;
      return;
    }
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    if (!board) return;
    const header = board.querySelector(".header-row") as HTMLElement | null;
    const todo = board.querySelector(".todo-row") as HTMLElement | null;
    const allday = board.querySelector(".allday-row") as HTMLElement | null;
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const win = this._dayWindow(day);
    const span = win.endMin - win.startMin;
    if (span <= 0) return;
    const chrome =
      (header?.offsetHeight ?? 0) + (todo?.offsetHeight ?? 0) + (allday?.offsetHeight ?? 0);
    const avail = board.clientHeight - chrome - 2;
    if (avail <= 0) return;
    const configuredPx =
      Math.min(
        HOUR_HEIGHT_MAX,
        Math.max(HOUR_HEIGHT_MIN, this._config.hour_height ?? DEFAULT_HOUR_HEIGHT),
      ) / 60;
    // shrink to fit, floored at the minimum readable height, capped at configured
    const px = Math.max(HOUR_HEIGHT_MIN / 60, Math.min(configuredPx, avail / span));
    if (Math.abs(px - this._fitPx) > 0.02) this._fitPx = px;
  }

  /**
   * `full_height`: stretch the board down to the bottom of the viewport
   * (wall-tablet / panel view). Applied as inline styles so the default
   * 58vh cap stays for normal dashboards.
   */
  private _applyFullHeight(): void {
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    if (!board) return;
    if (!this._config?.full_height) {
      if (board.style.height) {
        board.style.height = "";
        board.style.maxHeight = "";
      }
      return;
    }
    const top = board.getBoundingClientRect().top + window.scrollY;
    const h = Math.max(200, Math.round(window.innerHeight - top - 16));
    const want = `${h}px`;
    if (board.style.height !== want) {
      board.style.height = want;
      board.style.maxHeight = want;
    }
  }

  /** Scroll the day board so the current time is in view (once per view). */
  private _maybeScrollToNow(): void {
    if (this._view !== "day" || this._config?.scroll_to_now === false) return;
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    if (!this._isRealToday(day)) return;
    const key = `${this._weekOffset}|${this._day}|${this._config?.hour_height}`;
    if (key === this._scrolledKey) return;
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    const now = this.renderRoot?.querySelector(".nowline") as HTMLElement | null;
    if (!board || !now) return;
    this._scrolledKey = key;
    requestAnimationFrame(() => {
      const target = now.offsetTop - board.clientHeight / 3;
      board.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    });
  }

  /** Focus the first overlay field on open; restore focus on close. */
  private _manageOverlayFocus(prevOpen: boolean): void {
    const open = !!this._dialog || !!this._todoDialog || !!this._todoBadgeDialog;
    if (open && !prevOpen) {
      this._restoreFocus = (this.renderRoot as ShadowRoot)?.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        const input = this.renderRoot?.querySelector(".dialog input") as HTMLElement | null;
        input?.focus();
      });
    } else if (!open && prevOpen) {
      this._restoreFocus?.focus?.();
      this._restoreFocus = undefined;
    }
  }

  /* ---- data ---------------------------------------------------- */
  private _weekBounds(): { monday: Date; nextMonday: Date } {
    const now = new Date();
    const monday = new Date(now); // "monday" = configured week start
    monday.setHours(0, 0, 0, 0);
    monday.setDate(
      now.getDate() - ((now.getDay() - this._firstDayJs + 7) % 7) + this._weekOffset * 7,
    );
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    return { monday, nextMonday };
  }

  /** Grid geometry for the currently shown month (week-start aware). */
  private _monthGrid(): { gridStart: Date; weeks: number; month: number; year: number } {
    const base = new Date();
    const target = new Date(base.getFullYear(), base.getMonth() + this._monthOffset, 1);
    const offset = (target.getDay() - this._firstDayJs + 7) % 7;
    const gridStart = startOfDay(new Date(target.getFullYear(), target.getMonth(), 1 - offset));
    const daysInMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    const weeks = Math.ceil((offset + daysInMonth) / 7);
    return { gridStart, weeks, month: target.getMonth(), year: target.getFullYear() };
  }

  /** Fetch window for the current view. */
  private _fetchRange(): { start: Date; end: Date } {
    if (this._view === "month") {
      const { gridStart, weeks } = this._monthGrid();
      return { start: gridStart, end: new Date(gridStart.getTime() + weeks * 7 * DAY_MS) };
    }
    const { monday, nextMonday } = this._weekBounds();
    return { start: monday, end: nextMonday };
  }

  private async _maybeFetch(): Promise<void> {
    const cals = this._config.persons.map((p) => this._calsOf(p).join("+")).join(",");
    const shared = this._sharedCalendarGroups()
      .map((g) => `${g.ids.join("+")}@${g.personIdxs.join(".")}:${g.label ?? ""}`)
      .join(",");
    const sharedTodos = this._sharedTodoGroups()
      .map((g) => `${g.ids.join("+")}@${g.personIdxs.join(".")}:${g.label ?? ""}`)
      .join(",");
    const todos = [
      ...this._config.persons.map((p) => this._todosOf(p).join("+")),
      ...this._sharedTodoGroups().map((g) => g.ids.join("+")),
    ].join(",");
    const todoState = Array.from(
      new Set([...this._config.persons.flatMap((p) => this._todosOf(p)), ...this._sharedTodoIds()]),
    )
      .map((id) => {
        const st = this.hass.states[id];
        return `${id}:${st?.state ?? ""}:${st?.last_updated ?? ""}`;
      })
      .join(",");
    const scope = this._view === "month" ? `m${this._monthOffset}` : `w${this._weekOffset}`;
    const key = `${scope}|${cals}|${shared}|${sharedTodos}|${todos}|${todoState}`;
    if (key === this._fetchedKey) return;
    this._fetchedKey = key;
    await this._fetchEvents();
  }

  /** Force a refresh on next update (e.g. after a mutation or timer). */
  private async _refetch(): Promise<void> {
    this._fetchedKey = "";
    await this._maybeFetch();
  }

  /** Fetch the daily forecast for the configured weather entity (once/day). */
  private async _maybeFetchWeather(): Promise<void> {
    const ent = this._config.weather_entity;
    if (!ent || this._config.show_weather === false || !this.hass.states[ent]) {
      if (Object.keys(this._forecast).length) this._forecast = {};
      this._weatherKey = "";
      return;
    }
    const key = `${ent}|${new Date().toISOString().slice(0, 10)}`;
    if (key === this._weatherKey) return;
    this._weatherKey = key;
    try {
      const res: any = await this.hass.callWS({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        service_data: { type: "daily" },
        target: { entity_id: ent },
        return_response: true,
      });
      const list: any[] = res?.response?.[ent]?.forecast ?? [];
      const map: Record<string, { temp: number; condition: string }> = {};
      for (const f of list) {
        if (!f?.datetime) continue;
        map[toLocalDate(new Date(f.datetime))] = {
          temp: Math.round(f.temperature),
          condition: f.condition,
        };
      }
      this._forecast = map;
    } catch (e) {
      this._forecast = {};
    }
  }

  /** Small weather chip (icon + temperature) for a given date, or nothing. */
  private _weatherChip(date: Date) {
    const f = this._forecast[toLocalDate(date)];
    if (!f) return nothing;
    const icon = WEATHER_ICON[f.condition] || "weather-cloudy";
    const unit = (this.hass.config as any)?.unit_system?.temperature ?? "°";
    return html`<span class="wx" title=${f.condition}>
      <ha-icon icon="mdi:${icon}"></ha-icon>${f.temp}${unit}
    </span>`;
  }

  /** Whether an event title matches a configured hide pattern (case-insensitive). */
  private _hidden(summary: string): boolean {
    const pats = this._config.hide_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return false;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  /** Allow-list: when set, only events whose title matches a pattern are shown. */
  private _allowed(summary: string): boolean {
    const pats = this._config.show_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return true;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  /** Clean up titles via replace_patterns entries: "search => replacement". */
  private _cleanTitle(summary: string): string {
    const pats = this._config.replace_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return summary;
    let out = summary;
    for (const p of pats) {
      const raw = String(p);
      const idx = raw.indexOf("=>");
      const from = (idx >= 0 ? raw.slice(0, idx) : raw).trim();
      const to = idx >= 0 ? raw.slice(idx + 2).trim() : "";
      if (from.length === 0) continue;
      out = out.split(from).join(to);
    }
    return out.replace(/\s{2,}/g, " ").trim() || summary;
  }

  /** Whether an event title marks it as tentative/provisional (case-insensitive). */
  private _matchesTentative(summary: string): boolean {
    const pats = this._config.tentative_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return false;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  private async _fetchEvents(): Promise<void> {
    const { start, end } = this._fetchRange();
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    const raws: RawEvent[] = [];
    const todoItemsByOwner: Record<string, PersonTodoItem[]> = {};
    let anyError = false;
    this._loading = true;

    const fetchCalendar = async (
      cal: string,
      idx: number,
      color: string,
      shared: boolean = false,
      group?: NormalizedSharedGroup,
    ): Promise<void> => {
      try {
        const events = await this.hass.callApi<any[]>(
          "GET",
          `calendars/${cal}?start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`,
        );
        for (const ev of events) {
          const raw = parseRawEvent(ev, idx, cal, color, shared);
          if (raw) {
            // optional per-calendar override: take the title from another
            // field (school feeds often hide the subject in `description`)
            const tf = this._calMeta(cal).title_field;
            if (tf) {
              const alt = (ev as Record<string, unknown>)[tf];
              if (typeof alt === "string" && alt.trim()) raw.summary = alt.trim();
            }
            if (shared && group) {
              raw.shared_person_idxs = group.personIdxs;
              raw.shared_label =
                group.label || (group.ids.length === 1 ? this._calLabel(group.ids[0]) : undefined);
            }
          }
          if (raw && !this._hidden(raw.summary) && this._allowed(raw.summary)) {
            if (this._matchesTentative(raw.summary)) raw.tentative = true;
            raw.summary = this._cleanTitle(raw.summary);
            raws.push(raw);
          }
        }
      } catch (_err) {
        anyError = true;
      }
    };

    const sharedCalendarGroups = this._sharedCalendarGroups();
    const sharedIds = Array.from(new Set(sharedCalendarGroups.flatMap((g) => g.ids)));
    await Promise.all([
      ...this._config.persons.flatMap((p, idx) => {
        const color = personColor(p, idx);
        return this._calsOf(p)
          .filter((cal) => this.hass.states[cal] && !sharedIds.includes(cal))
          .map((cal) => fetchCalendar(cal, idx, color));
      }),
      ...sharedCalendarGroups.flatMap((group) =>
        group.ids
          .filter((cal) => this.hass.states[cal])
          .map((cal) =>
            fetchCalendar(
              cal,
              SHARED_PERSON_IDX,
              this._calMeta(cal).color ?? hashColor(cal),
              true,
              group,
            ),
          ),
      ),
    ]);
    const sharedTodoGroups = this._sharedTodoGroups();
    const sharedTodoIds = Array.from(new Set(sharedTodoGroups.flatMap((g) => g.ids)));
    const todoIds = Array.from(
      new Set([...this._config.persons.flatMap((p) => this._todosOf(p)), ...sharedTodoIds]),
    );
    if (todoIds.length > 0) {
      try {
        const res: any = await this.hass.callWS({
          type: "execute_script",
          sequence: [
            {
              action: "todo.get_items",
              target: { entity_id: todoIds },
              data: { status: ["needs_action"] },
              response_variable: "fb_todos",
            },
            { stop: "", response_variable: "fb_todos" },
          ],
        });
        const payload = ((res as { response?: unknown }).response ?? res) as Record<
          string,
          { items?: TodoItem[] } | undefined
        >;
        const anchors = this._todoAnchorDates(start, end);
        const pushTodoItems = (key: string, items: TodoItem[], entityId: string) => {
          const list = todoItemsByOwner[key] ?? [];
          items.forEach((item) =>
            list.push({
              ...item,
              entityId,
              listLabel: this._todoLabel(entityId),
            }),
          );
          todoItemsByOwner[key] = list;
        };
        const pushTodoEvents = (
          items: TodoItem[],
          idx: number,
          color: string,
          id: string,
          shared = false,
          group?: NormalizedSharedGroup,
        ) => {
          items.forEach((item) => {
            const due = typeof item.due === "string" ? item.due.trim() : "";
            const itemAnchors = due ? [anchors[0]] : anchors;
            itemAnchors.forEach((anchor) => {
              const raw = this._todoToRawEvent(item, idx, color, id, anchor, start, end, shared);
              if (!raw) return;
              if (shared && group) {
                raw.shared_person_idxs = group.personIdxs;
                raw.shared_label =
                  group.label || (group.ids.length === 1 ? this._todoLabel(group.ids[0]) : undefined);
              }
              raws.push(raw);
            });
          });
        };
        this._config.persons.forEach((p, idx) => {
          const color = personColor(p, idx);
          this._todosOf(p)
            .filter((id) => !sharedTodoIds.includes(id))
            .forEach((id) => {
              const items = payload?.[id]?.items;
              if (!Array.isArray(items)) return;
              pushTodoItems(this._todoOwnerKey(idx), items, id);
              pushTodoEvents(items, idx, color, id);
            });
        });
        sharedTodoGroups.forEach((group) => {
          group.ids.forEach((id) => {
            const items = payload?.[id]?.items;
            if (!Array.isArray(items)) return;
            group.personIdxs.forEach((idx) => pushTodoItems(this._todoOwnerKey(idx), items, id));
            pushTodoEvents(items, SHARED_PERSON_IDX, hashColor(id), id, true, group);
          });
        });
      } catch (_err) {
        // Keep calendar events visible even if the todo service is unavailable.
      }
    }
    let cleaned = raws;
    if (this._config.filter_duplicates) {
      // same title/start/end/kind within ONE person (e.g. mirrored in two calendars)
      const seen = new Set<string>();
      cleaned = raws.filter((r) => {
        const key = `${r.kind ?? "calendar"}|${r.personIdx}|${r.calendar}|${r.uid ?? r.todo_item ?? r.summary}|${r.start.getTime()}|${r.end.getTime()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    this._raw = cleaned;
    // Week views index events by weekday; month builds its own grid from _raw.
    const { monday } = this._weekBounds();
    this._events =
      this._view === "month" ? [] : cleaned.flatMap((r) => splitIntoSegments(r, monday));
    this._todoItemsByOwner = Object.fromEntries(
      Object.entries(todoItemsByOwner).map(([key, items]) => [
        key,
        [...items].sort((a, b) => this._todoSortKey(a).localeCompare(this._todoSortKey(b))),
      ]),
    );
    this._loadError = anyError && raws.length === 0;
    this._loading = false;
  }

  /* ---- capabilities -------------------------------------------- */
  /** A person's calendars, normalized to a (possibly empty) array. */
  private _calsOf(p: PersonConfig): string[] {
    if (Array.isArray(p.calendar)) return p.calendar.filter(Boolean);
    return p.calendar ? [p.calendar] : [];
  }
  /** A person's todo lists, normalized to a (possibly empty) array. */
  private _todosOf(p: PersonConfig): string[] {
    if (Array.isArray(p.todo)) return p.todo.filter(Boolean);
    return p.todo ? [p.todo] : [];
  }
  /** Calendars of a person that allow creating events. */
  private _writableCals(p: PersonConfig): string[] {
    return this._calsOf(p).filter((c) => this._canCreate(c));
  }
  /** Whether the person's add (+) affordance should be shown. */
  private _personCanCreate(p: PersonConfig): boolean {
    return this._writableCals(p).length > 0;
  }
  private _calFeatures(entity?: string): number {
    if (!entity) return 0;
    const st = this.hass.states[entity];
    return Number(st?.attributes?.supported_features ?? 0);
  }
  private _canCreate(entity?: string) {
    return (this._calFeatures(entity) & FEAT_CREATE) !== 0;
  }
  private _canUpdate(entity?: string) {
    return (this._calFeatures(entity) & FEAT_UPDATE) !== 0;
  }
  private _canDelete(entity?: string) {
    return (this._calFeatures(entity) & FEAT_DELETE) !== 0;
  }
  private _todoFeatures(entity?: string): number {
    if (!entity) return 0;
    const st = this.hass.states[entity];
    return Number(st?.attributes?.supported_features ?? 0);
  }
  private _canUpdateTodo(entity?: string) {
    return (this._todoFeatures(entity) & FEAT_UPDATE) !== 0;
  }
  private _canDeleteTodo(entity?: string) {
    return (this._todoFeatures(entity) & FEAT_DELETE) !== 0;
  }
  private _allPersonIdxs(): number[] {
    return this._persons.map((_, idx) => idx);
  }
  private _personRef(p: PersonConfig, idx: number): string {
    if (p.person) return p.person;
    if (p.name) return `name:${p.name}`;
    return `slot:${idx}`;
  }
  private _resolvePersonRefs(refs?: string[]): number[] {
    if (!Array.isArray(refs) || refs.length === 0) return this._allPersonIdxs();
    const resolved: number[] = [];
    this._persons.forEach((p, idx) => {
      const candidates = [this._personRef(p, idx), p.person, p.name ? `name:${p.name}` : "", String(idx)]
        .filter((x): x is string => !!x);
      if (refs.some((ref) => candidates.includes(ref)) && !resolved.includes(idx)) resolved.push(idx);
    });
    return resolved;
  }
  private _normalizeSharedGroups(
    direct: string[],
    grouped: Array<{ ids: string[]; persons?: string[]; label?: string }>,
    duplicateSource: Array<{ id: string; owners: number[] }>,
  ): NormalizedSharedGroup[] {
    const groups: NormalizedSharedGroup[] = [];
    const pushGroup = (ids: string[], personIdxs: number[], label?: string) => {
      const cleanIds = Array.from(new Set(ids.filter(Boolean)));
      const cleanPersons = Array.from(new Set(personIdxs)).sort((a, b) => a - b);
      if (cleanIds.length === 0 || cleanPersons.length === 0) return;
      groups.push({ ids: cleanIds, personIdxs: cleanPersons, label: label?.trim() || undefined });
    };
    if (direct.length) pushGroup(direct, this._allPersonIdxs());
    grouped.forEach((g) => pushGroup(g.ids, this._resolvePersonRefs(g.persons), g.label));
    duplicateSource.forEach(({ id, owners }) => {
      if (owners.length < 2) return;
      const alreadyCovered = groups.some(
        (g) => g.ids.includes(id) && owners.every((idx) => g.personIdxs.includes(idx)),
      );
      if (!alreadyCovered) pushGroup([id], owners);
    });
    return groups;
  }
  private _sharedCals(): string[] {
    const val = this._config.shared_calendar;
    if (Array.isArray(val)) return val.filter(Boolean);
    return val ? [val] : [];
  }
  private _sharedCalendarGroups(): NormalizedSharedGroup[] {
    const cfgGroups = Array.isArray(this._config.shared_calendar_groups)
      ? this._config.shared_calendar_groups
      : [];
    const duplicateSource = new Map<string, number[]>();
    this._config.persons.forEach((p, idx) => {
      new Set(this._calsOf(p)).forEach((id) => {
        const owners = duplicateSource.get(id) ?? [];
        if (!owners.includes(idx)) owners.push(idx);
        duplicateSource.set(id, owners);
      });
    });
    return this._normalizeSharedGroups(
      this._sharedCals(),
      cfgGroups.map((g) => ({
        ids: Array.isArray(g.calendars) ? g.calendars.filter(Boolean) : g.calendars ? [g.calendars] : [],
        persons: g.persons,
        label: g.label,
      })),
      Array.from(duplicateSource, ([id, owners]) => ({ id, owners })),
    );
  }
  private _sharedTodos(): string[] {
    const val = this._config.shared_todo;
    if (Array.isArray(val)) return val.filter(Boolean);
    return val ? [val] : [];
  }
  private _sharedTodoGroups(): NormalizedSharedGroup[] {
    const cfgGroups = Array.isArray(this._config.shared_todo_groups) ? this._config.shared_todo_groups : [];
    const duplicateSource = new Map<string, number[]>();
    this._config.persons.forEach((p, idx) => {
      new Set(this._todosOf(p)).forEach((id) => {
        const owners = duplicateSource.get(id) ?? [];
        if (!owners.includes(idx)) owners.push(idx);
        duplicateSource.set(id, owners);
      });
    });
    return this._normalizeSharedGroups(
      this._sharedTodos(),
      cfgGroups.map((g) => ({
        ids: Array.isArray(g.todos) ? g.todos.filter(Boolean) : g.todos ? [g.todos] : [],
        persons: g.persons,
        label: g.label,
      })),
      Array.from(duplicateSource, ([id, owners]) => ({ id, owners })),
    );
  }
  /** Calendars that should be rendered once across one or more people. */
  private _sharedCalendarIds(): string[] {
    return Array.from(new Set(this._sharedCalendarGroups().flatMap((g) => g.ids)));
  }
  private _sharedTodoIds(): string[] {
    return Array.from(new Set(this._sharedTodoGroups().flatMap((g) => g.ids)));
  }
  private _sharedGroupFor(groups: NormalizedSharedGroup[], id: string): NormalizedSharedGroup | undefined {
    return groups.find((g) => g.ids.includes(id));
  }
  private _isShared(entry: { personIdx: number; shared?: boolean }): boolean {
    return entry.shared === true || entry.personIdx === SHARED_PERSON_IDX;
  }
  private _sharedPersons(entry: { ref: RawEvent }): number[] {
    return entry.ref.shared_person_idxs?.length ? entry.ref.shared_person_idxs : this._allPersonIdxs();
  }
  private _sharedLabel(entry?: { ref: RawEvent }): string {
    const label = entry?.ref.shared_label?.trim();
    if (label) return label;
    const shared = this._sharedCalendarIds();
    return shared.length === 1 ? this._calLabel(shared[0]) : this._t("shared_events");
  }
  private _sharedRange(
    entry: { ref: RawEvent },
    visibleIdxs: number[] = this._allPersonIdxs(),
  ): { start: number; span: number } | null {
    const members = this._sharedPersons(entry).filter((idx) => visibleIdxs.includes(idx));
    if (members.length === 0) return null;
    const positions = members
      .map((idx) => visibleIdxs.indexOf(idx))
      .filter((pos) => pos >= 0)
      .sort((a, b) => a - b);
    if (!positions.length) return null;
    const start = positions[0];
    const end = positions[positions.length - 1];
    return { start, span: end - start + 1 };
  }
  private _sharedGridStyle(
    entry: { ref: RawEvent },
    visibleIdxs: number[] = this._allPersonIdxs(),
  ): string {
    const range = this._sharedRange(entry, visibleIdxs);
    if (!range) return "display:none";
    return `grid-column:${range.start + 1} / span ${range.span}`;
  }
  private _sharedBandStyle(e: LaidOutEvent, px: number, startMin: number): string | null {
    const range = this._sharedRange(e);
    if (!range) return null;
    const { top, height: bandHeight } = this._sharedBandBox(e, px, startMin);
    const leftPct = (range.start / this._persons.length) * 100;
    const widthPct = (range.span / this._persons.length) * 100;
    return `top:${top + 1.5}px;height:${bandHeight}px;left:calc(var(--fb-axis-width, 56px) + ${leftPct}% + 2px);width:calc(${widthPct}% - 4px)`;
  }

  /* ---- helpers ------------------------------------------------- */
  private get _persons(): PersonConfig[] {
    return this._config.persons;
  }
  private get _grid(): number {
    return this._config.time_grid ?? 30;
  }
  /** Pixels per minute, derived from the configurable hour height (or fit mode). */
  private get _pxPerMin(): number {
    if (this._config.fit_height && this._fitPx > 0) return this._fitPx;
    const h = Math.min(
      HOUR_HEIGHT_MAX,
      Math.max(HOUR_HEIGHT_MIN, this._config.hour_height ?? DEFAULT_HOUR_HEIGHT),
    );
    return h / 60;
  }
  private get _startMin(): number {
    return (this._config.start_hour ?? 6) * 60;
  }
  private get _endMin(): number {
    return (this._config.end_hour ?? 22) * 60;
  }
  /**
   * Visible minute window of the day view. With `trim_hours` (default on) the
   * configured start/end window is shrunk to the hours that actually contain
   * events, so the occupied part of the day gets the full height instead of
   * being squeezed by empty morning/evening hours.
   */
  private _dayWindow(day: number): { startMin: number; endMin: number } {
    const cfgStart = this._startMin;
    const cfgEnd = this._endMin;
    if (this._config.trim_hours === false) return { startMin: cfgStart, endMin: cfgEnd };
    const evs = this._events.filter((e) => e.day === day && !e.allDay);
    if (evs.length === 0) return { startMin: cfgStart, endMin: cfgEnd };
    let first = Math.min(...evs.map((e) => e.startMin));
    let last = Math.max(...evs.map((e) => e.endMin));
    // keep the now-line visible on today
    if (this._isRealToday(day)) {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      if (nowMin >= cfgStart && nowMin <= cfgEnd) {
        first = Math.min(first, nowMin);
        last = Math.max(last, nowMin);
      }
    }
    let s = Math.max(cfgStart, Math.floor(first / 60) * 60);
    let e = Math.min(cfgEnd, Math.ceil(last / 60) * 60);
    // never shrink below a sane 6-hour window
    const MIN_WINDOW = 6 * 60;
    if (e - s < MIN_WINDOW) {
      e = Math.min(cfgEnd, s + MIN_WINDOW);
      s = Math.max(cfgStart, e - MIN_WINDOW);
    }
    return { startMin: s, endMin: e };
  }
  /** Column index (0..6 from week start) -> JS weekday (0=Sun..6=Sat). */
  private _jsDay(index: number): number {
    return (this._firstDayJs + index) % 7;
  }
  private get _visibleDays(): number[] {
    const all = [0, 1, 2, 3, 4, 5, 6];
    if (this._config.show_weekends === false) {
      return all.filter((i) => {
        const js = this._jsDay(i);
        return js !== 0 && js !== 6; // hide Sat/Sun wherever they fall
      });
    }
    return all;
  }
  private _t(key: string): string {
    return localize(this.hass, key);
  }
  /** Optional per-calendar color/label from the `calendars:` mapping. */
  private _calMeta(entity?: string): {
    color?: string;
    label?: string;
    icon?: string;
    title_field?: string;
  } {
    return (entity && this._config.calendars?.[entity]) || {};
  }
  /** Link for a location, honouring the configurable `map_url` template. */
  private _mapUrl(location: string): string {
    const tpl = this._config.map_url;
    const q = encodeURIComponent(location);
    if (typeof tpl === "string" && tpl.includes("{location}")) return tpl.replace("{location}", q);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }
  /** Optional mdi icon configured for a calendar. */
  private _calIcon(entity?: string): string | undefined {
    return this._calMeta(entity).icon;
  }
  /** Small inline icon element for an event's calendar (or nothing). */
  private _calIconEl(e: BoardEvent) {
    if (e.ref.kind === "todo") return nothing;
    const icon = this._calIcon(e.ref.calendar);
    return icon ? html`<ha-icon class="cicon" .icon=${icon}></ha-icon>` : nothing;
  }
  /** Display name of a calendar entity: mapping label > friendly name > id. */
  private _calLabel(entity: string): string {
    return (
      this._calMeta(entity).label ??
      ((this.hass.states[entity]?.attributes?.friendly_name as string | undefined) || entity)
    );
  }
  /** Color for an event respecting the color_by option. */
  private _eventColor(e: BoardEvent): string {
    if (e.ref.kind === "todo") return e.color;
    const by = this._config.color_by;
    if (by === "location" && e.location) return hashColor(e.location);
    if (by === "calendar" && e.ref.calendar)
      return this._calMeta(e.ref.calendar).color ?? hashColor(e.ref.calendar);
    return e.color;
  }
  /** Whether an event has already ended (for dimming). */
  private _isPast(e: BoardEvent): boolean {
    return this._config.dim_past !== false && e.ref.end.getTime() <= Date.now();
  }
  private _sharedFor(day: number): BoardEvent[] {
    return this._events
      .filter((e) => e.day === day && this._isShared(e))
      .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin);
  }
  private _todoAnchorDates(rangeStart: Date, rangeEnd: Date): Date[] {
    const dates: Date[] = [];
    const cursor = startOfDay(rangeStart);
    while (cursor.getTime() < rangeEnd.getTime()) {
      dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates.length > 0 ? dates : [startOfDay(rangeStart)];
  }
  private _todoToRawEvent(
    item: TodoItem,
    personIdx: number,
    color: string,
    entityId: string,
    anchor: Date,
    rangeStart: Date,
    rangeEnd: Date,
    shared: boolean = false,
  ): RawEvent | null {
    if (!item || typeof item.summary !== "string" || item.status === "completed") return null;
    const rawDue = typeof item.due === "string" ? item.due.trim() : "";
    const normalizedDue =
      rawDue.includes(" ") && !rawDue.includes("T") ? rawDue.replace(" ", "T") : rawDue;
    const hasTime = normalizedDue.includes("T");
    let start = startOfDay(anchor);
    let end = new Date(start.getTime() + DAY_MS);
    let allDay = true;
    if (normalizedDue) {
      if (hasTime) {
        const due = new Date(normalizedDue);
        if (isNaN(due.getTime())) return null;
        start = due;
        end = new Date(due.getTime() + Math.max(this._grid, 30) * 60000);
        allDay = false;
      } else {
        const due = new Date(`${normalizedDue}T00:00:00`);
        if (isNaN(due.getTime())) return null;
        start = due;
        end = new Date(due.getTime() + DAY_MS);
      }
    }
    if (end.getTime() <= rangeStart.getTime() || start.getTime() >= rangeEnd.getTime()) return null;
    return {
      kind: "todo",
      personIdx,
      shared,
      calendar: entityId,
      uid: item.uid,
      summary: item.summary.trim() || this._t("todo"),
      description: item.description,
      allDay,
      start,
      end,
      color,
      tentative: false,
      todo_item: item.uid || item.summary,
      todo_due: rawDue || undefined,
      todo_due_has_time: normalizedDue ? hasTime : undefined,
    };
  }
  private _isTodo(e: { ref: RawEvent }): boolean {
    return e.ref.kind === "todo";
  }
  private _sharedAllDay(day: number): BoardEvent[] {
    return this._sharedFor(day).filter((e) => e.allDay);
  }
  private _sharedTimed(day: number): LaidOutEvent[] {
    return layoutDayColumns(this._sharedFor(day).filter((e) => !e.allDay));
  }
  private _sharedBandBox(
    e: LaidOutEvent,
    px: number,
    startMin: number,
  ): { top: number; height: number } {
    const baseTop = (e.startMin - startMin) * px;
    const baseHeight = Math.max((e.endMin - e.startMin) * px - 3, 12);
    if (e.cols <= 1) return { top: baseTop, height: baseHeight };
    const inset = Math.min(8, Math.max(3, Math.floor(baseHeight / Math.max(e.cols * 3, 3))));
    return {
      top: baseTop + e.col * inset,
      height: Math.max(12, baseHeight - (e.cols - 1) * inset),
    };
  }
  /** Localized "Today"/"Tomorrow"/"Yesterday" for a date, else null. */
  private _relativeDay(date: Date): string | null {
    const diff = Math.round(
      (startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / DAY_MS,
    );
    if (diff === 0) return this._t("today");
    if (diff === 1) return this._t("tomorrow");
    if (diff === -1) return this._t("yesterday");
    return null;
  }
  /** Person temporarily hidden via header click (legend-style toggle). */
  private _isOff(idx: number): boolean {
    return this._hiddenP.includes(idx);
  }
  private _togglePerson(idx: number): void {
    this._hiddenP = this._isOff(idx)
      ? this._hiddenP.filter((i) => i !== idx)
      : [...this._hiddenP, idx];
  }
  private _timedFor(day: number, idx: number): LaidOutEvent[] {
    if (this._isOff(idx)) return [];
    const evs = this._events.filter(
      (e) => e.day === day && e.personIdx === idx && !e.allDay && !this._isBackground(e),
    );
    return layoutDayColumns(evs);
  }
  /** Threshold (minutes) at/above which a timed event becomes a background band. */
  private _bgMinMin(): number {
    const h = Number(this._config.background_hours ?? 3);
    if (!Number.isFinite(h) || h <= 0) return 0; // 0 disables background bands
    return h * 60;
  }
  /** Long, day-spanning events (e.g. OGS/Freispiel) shown as a faint full-width band. */
  private _isBackground(e: BoardEvent): boolean {
    const min = this._bgMinMin();
    return min > 0 && !this._isTodo(e) && !e.allDay && e.endMin - e.startMin >= min;
  }
  /** Background-band segments for a person/day, longest first (so they stack cleanly). */
  private _bgFor(day: number, idx: number): BoardEvent[] {
    if (this._isOff(idx)) return [];
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx && !e.allDay && this._isBackground(e))
      .sort((a, b) => b.endMin - b.startMin - (a.endMin - a.startMin));
  }
  /** Max side-by-side columns before dense overlaps collapse into a "+N" chip. */
  private _maxCols(): number {
    const n = Number(this._config.max_columns);
    if (!Number.isFinite(n) || n < 1) return 3;
    return Math.min(Math.round(n), 8);
  }
  /**
   * Cap the per-day overlap columns so events stay readable. Clusters with more
   * columns than `max_columns` keep the first columns and collapse the rest into
   * one "+N" overflow chip in the last column.
   */
  private _dayLayout(day: number, idx: number): { events: LaidOutEvent[]; overflows: Overflow[] } {
    const laid = this._timedFor(day, idx);
    const maxCols = this._maxCols();
    const byCluster = new Map<number, LaidOutEvent[]>();
    for (const e of laid) {
      const g = byCluster.get(e.cluster);
      if (g) g.push(e);
      else byCluster.set(e.cluster, [e]);
    }
    const events: LaidOutEvent[] = [];
    const overflows: Overflow[] = [];
    for (const group of byCluster.values()) {
      const trueCols = group[0].cols;
      if (trueCols <= maxCols) {
        events.push(...group);
        continue;
      }
      // Keep columns 0..maxCols-2, reserve the last column for the overflow chip.
      let count = 0;
      let startMin = Infinity;
      let endMin = -Infinity;
      for (const e of group) {
        if (e.col <= maxCols - 2) {
          events.push({
            ...e,
            cols: maxCols,
            span: Math.max(1, Math.min(e.span, maxCols - e.col)),
          });
        } else {
          count++;
          startMin = Math.min(startMin, e.startMin);
          endMin = Math.max(endMin, e.endMin);
        }
      }
      if (count > 0) {
        overflows.push({ col: maxCols - 1, cols: maxCols, startMin, endMin, count });
      }
    }
    return { events, overflows };
  }
  /** Display title, with "(day X/Y)" suffix for multi-day events. */
  private _evTitle(e: BoardEvent): string {
    const base = e.parts && e.parts > 1 ? `${e.title} (${e.part}/${e.parts})` : e.title;
    const icon = this._autoIcon(e.title);
    return icon ? `${icon} ${base}` : base;
  }

  /** Emoji for a title via custom rules then the built-in keyword map. */
  private _autoIcon(title: string): string {
    if (this._config.auto_icons !== true) return "";
    if (!title || HAS_EMOJI.test(title)) return "";
    const custom = this._config.icon_patterns;
    if (Array.isArray(custom)) {
      const low = title.toLowerCase();
      for (const p of custom) {
        const raw = String(p);
        const i = raw.indexOf("=>");
        if (i < 0) continue;
        const key = raw.slice(0, i).trim().toLowerCase();
        const emoji = raw.slice(i + 2).trim();
        if (key && emoji && low.includes(key)) return emoji;
      }
    }
    for (const [re, emoji] of ICON_MAP) if (re.test(title)) return emoji;
    return "";
  }

  /** Whether an event is flagged tentative/provisional. */
  private _isTentative(e: BoardEvent): boolean {
    return e.ref.tentative === true;
  }
  /** Jump to the agenda list for a given weekday so collapsed events stay reachable. */
  private _showDayAgenda(day: number): void {
    this._day = day;
    if (this._enabledViews.includes("agenda")) this._view = "agenda";
  }
  /** Jump from the week view into the day view of a given weekday. */
  private _openDayView(day: number): void {
    this._day = day;
    if (this._enabledViews.includes("day")) this._view = "day";
  }
  private _allDayFor(day: number, idx: number): BoardEvent[] {
    if (this._isOff(idx)) return [];
    return this._events.filter((e) => e.day === day && e.personIdx === idx && e.allDay);
  }
  private _eventsFor(day: number, idx: number): BoardEvent[] {
    if (this._isOff(idx)) return [];
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx)
      .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin);
  }
  /** Week-start-based column index -> absolute Date in the shown week. */
  private _dateForDay(day: number): Date {
    const { monday } = this._weekBounds();
    return new Date(monday.getTime() + day * DAY_MS);
  }
  private _isRealToday(day: number): boolean {
    return this._weekOffset === 0 && day === this._todayIndex();
  }
  /** Open an item on Enter/Space for keyboard users. */
  private _onItemKey(e: KeyboardEvent, ev: BoardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      this._openEvent(ev);
    }
  }
  private _dayHasEvents(day: number): boolean {
    return (
      this._sharedFor(day).length > 0 ||
      this._persons.some((_, i) => this._eventsFor(day, i).length > 0)
    );
  }
  private _eventOwnerLabel(e: BoardEvent): string {
    return this._isShared(e)
      ? this._sharedLabel(e)
      : this._personName(this._persons[e.personIdx], e.personIdx);
  }
  private _personName(p: PersonConfig, idx: number): string {
    return (
      p.name || this.hass.states[p.person ?? ""]?.attributes?.friendly_name || `Person ${idx + 1}`
    );
  }
  private _todoLabel(entityId: string): string {
    return (
      (this.hass.states[entityId]?.attributes?.friendly_name as string | undefined) ?? entityId
    );
  }
  private _todoOwnerKey(idx: number): string {
    return idx === SHARED_PERSON_IDX ? "shared" : `person:${idx}`;
  }
  private _todoSortKey(item: Pick<TodoItem, "due" | "summary">): string {
    const due = typeof item.due === "string" ? item.due.trim() : "";
    return `${due || "9999-12-31T23:59:59"}::${item.summary.toLowerCase()}`;
  }
  private _todoItemsForPerson(idx: number): PersonTodoItem[] {
    return [...(this._todoItemsByOwner[this._todoOwnerKey(idx)] ?? [])].sort((a, b) =>
      this._todoSortKey(a).localeCompare(this._todoSortKey(b)),
    );
  }
  private _todoCountForPerson(idx: number): number {
    return this._todoItemsForPerson(idx).length;
  }
  private _formatTodoDue(due?: string): string {
    if (!due) return "";
    const raw = due.trim();
    if (!raw) return "";
    const hasTime = raw.includes("T") || raw.includes(" ");
    const dt = new Date(raw.replace(" ", "T"));
    if (Number.isNaN(dt.getTime())) return raw;
    const date = dt.toLocaleDateString(this.hass.locale.language, {
      day: "2-digit",
      month: "2-digit",
    });
    return hasTime
      ? `${date} · ${formatMinutes(this.hass, dt.getHours() * 60 + dt.getMinutes())}`
      : date;
  }
  private _todoKey(item: Pick<PersonTodoItem, "entityId" | "uid" | "summary">): string {
    return `${item.entityId}::${this._todoRef(item)}`;
  }
  private _todoFromEvent(e: BoardEvent): PersonTodoItem | null {
    if (!this._isTodo(e)) return null;
    const raw = e.ref;
    return {
      entityId: raw.calendar,
      uid: raw.uid,
      summary: raw.summary,
      status: "needs_action",
      due: raw.todo_due,
      description: raw.description,
      listLabel: this._todoLabel(raw.calendar),
    };
  }
  private _isTodoBusy(e: BoardEvent): boolean {
    const item = this._todoFromEvent(e);
    return !!item && this._todoBusy.includes(this._todoKey(item));
  }
  private _todoRef(item: Pick<PersonTodoItem, "uid" | "summary">): string {
    return item.uid || item.summary;
  }
  private _openTodo(item: PersonTodoItem): void {
    const features = this._todoFeatures(item.entityId);
    this._todoDialog = {
      entityId: item.entityId,
      uid: item.uid,
      itemRef: this._todoRef(item),
      summary: item.summary,
      description: item.description ?? "",
      due: item.due
        ? item.due.includes("T") || item.due.includes(" ")
          ? toLocalInput(new Date(item.due.replace(" ", "T")))
          : item.due
        : "",
      dueHasTime: !!item.due && (item.due.includes("T") || item.due.includes(" ")),
      canUpdate: (features & FEAT_UPDATE) !== 0,
      canDelete: (features & FEAT_DELETE) !== 0,
      supportsDescription: (features & TODO_FEAT_DESCRIPTION) !== 0 || !!item.description,
      supportsDueDate:
        (features & TODO_FEAT_DUE_DATE) !== 0 ||
        (features & TODO_FEAT_DUE_DATETIME) !== 0 ||
        !!item.due,
      supportsDueDatetime:
        (features & TODO_FEAT_DUE_DATETIME) !== 0 ||
        !!item.due?.includes("T") ||
        !!item.due?.includes(" "),
    };
  }
  private _openTodoBadgeDialog(personIdx: number): void {
    this._todoBadgeDialog = { personIdx };
  }
  private _closeTodoBadgeDialog(): void {
    this._todoBadgeDialog = undefined;
  }
  private _todoDlgField<K extends keyof TodoDialogState>(key: K, value: TodoDialogState[K]): void {
    if (!this._todoDialog) return;
    this._todoDialog = { ...this._todoDialog, [key]: value, error: undefined };
  }
  private async _toggleTodo(item: PersonTodoItem): Promise<void> {
    if (!this._canUpdateTodo(item.entityId)) return;
    const key = this._todoKey(item);
    this._todoBusy = [...this._todoBusy, key];
    try {
      await this.hass.callWS({
        type: "call_service",
        domain: "todo",
        service: "update_item",
        target: { entity_id: item.entityId },
        service_data: { item: this._todoRef(item), status: "completed" },
      });
      await this._refetch();
    } finally {
      this._todoBusy = this._todoBusy.filter((x) => x !== key);
    }
  }
  private _renderTodoItemCheckbox(item: PersonTodoItem) {
    const busy = this._todoBusy.includes(this._todoKey(item));
    const canUpdate = this._canUpdateTodo(item.entityId);
    const stop = (ev: Event) => ev.stopPropagation();
    return html`<input
      class="todo-check"
      type="checkbox"
      aria-label="${this._t("todo_complete")}: ${item.summary}"
      .checked=${busy}
      ?disabled=${!canUpdate || busy}
      @pointerdown=${stop}
      @click=${stop}
      @keydown=${stop}
      @change=${(ev: Event) => {
        ev.stopPropagation();
        const input = ev.target as HTMLInputElement;
        if (!input.checked) {
          input.checked = false;
          return;
        }
        void this._toggleTodo(item);
      }}
    />`;
  }
  private _renderTodoCheckbox(e: BoardEvent) {
    const item = this._todoFromEvent(e);
    return item ? this._renderTodoItemCheckbox(item) : nothing;
  }
  private async _completeTodoDialog(): Promise<void> {
    if (!this._todoDialog || !this._canUpdateTodo(this._todoDialog.entityId)) return;
    const d = this._todoDialog;
    this._todoDialog = { ...d, busy: true, error: undefined };
    try {
      await this.hass.callWS({
        type: "call_service",
        domain: "todo",
        service: "update_item",
        target: { entity_id: d.entityId },
        service_data: { item: d.itemRef, status: "completed" },
      });
      this._todoDialog = undefined;
      await this._refetch();
    } catch (e: any) {
      this._todoDialog = { ...d, busy: false, error: e?.message || this._t("save_failed") };
    }
  }
  private async _saveTodoDialog(): Promise<void> {
    if (!this._todoDialog) return;
    const d = this._todoDialog;
    this._todoDialog = { ...d, busy: true, error: undefined };
    try {
      const data: Record<string, string> = {
        item: d.itemRef,
        rename: d.summary.trim() || d.summary,
      };
      if (d.supportsDescription) data.description = d.description.trim();
      if (d.supportsDueDatetime) {
        data.due_datetime = d.due.trim()
          ? new Date(d.due).toISOString().slice(0, 19).replace("T", " ")
          : "";
      } else if (d.supportsDueDate) {
        data.due_date = d.due.trim();
      }
      await this.hass.callWS({
        type: "call_service",
        domain: "todo",
        service: "update_item",
        target: { entity_id: d.entityId },
        service_data: data,
      });
      this._todoDialog = undefined;
      await this._refetch();
    } catch (e: any) {
      this._todoDialog = { ...d, busy: false, error: e?.message || this._t("save_failed") };
    }
  }
  private async _deleteTodoDialog(): Promise<void> {
    if (!this._todoDialog) return;
    const d = this._todoDialog;
    this._todoDialog = { ...d, busy: true, error: undefined };
    try {
      await this.hass.callWS({
        type: "call_service",
        domain: "todo",
        service: "remove_item",
        target: { entity_id: d.entityId },
        service_data: { item: d.itemRef },
      });
      this._todoDialog = undefined;
      await this._refetch();
    } catch (e: any) {
      this._todoDialog = { ...d, busy: false, error: e?.message || this._t("delete_failed") };
    }
  }
  private _closeTodoDialog(): void {
    this._todoDialog = undefined;
  }
  private _openTodoFromBadge(item: PersonTodoItem): void {
    this._closeTodoBadgeDialog();
    this._openTodo(item);
  }
  private _avatar(p: PersonConfig, idx: number) {
    const color = personColor(p, idx);
    const st = p.person ? this.hass.states[p.person] : undefined;
    const pic = st?.attributes?.entity_picture as string | undefined;
    const name = this._personName(p, idx);
    const initials = name.slice(0, 2).toUpperCase();
    return pic
      ? html`<div
          class="avatar"
          style="background-image:url('${pic}');box-shadow:0 0 0 2px ${color}55"
        ></div>`
      : html`<div class="avatar initials" style="background:${color}">${initials}</div>`;
  }

  private _todoBadge(idx: number) {
    const count = this._todoCountForPerson(idx);
    if (!count) return nothing;
    const name = this._personName(this._persons[idx], idx);
    return html`<span
      class="pbadge todo-badge"
      title="${name} · ${count} ${this._t("todo_items")}"
      role="button"
      tabindex="0"
      @click=${(ev: MouseEvent) => {
        ev.stopPropagation();
        this._openTodoBadgeDialog(idx);
      }}
      @keydown=${(k: KeyboardEvent) => {
        if (k.key === "Enter" || k.key === " ") {
          k.preventDefault();
          k.stopPropagation();
          this._openTodoBadgeDialog(idx);
        }
      }}
    >
      <ha-icon icon="mdi:checkbox-marked-circle-outline"></ha-icon>
      <span>${count}</span>
    </span>`;
  }

  /** Small entity chips (battery, sensors …) under a person header. */
  private _badges(p: PersonConfig, idx: number) {
    const ids = Array.isArray(p.badges) ? p.badges.filter(Boolean) : [];
    const todoCount = this._todoCountForPerson(idx);
    if (ids.length === 0 && todoCount === 0) return nothing;
    const todoBadge = todoCount > 0 ? this._todoBadge(idx) : nothing;
    return html`<div class="pbadges">
      ${todoBadge}
      ${ids.map((id) => {
        const st = this.hass.states[id];
        if (!st) return nothing;
        const icon = st.attributes?.icon as string | undefined;
        const unit = (st.attributes?.unit_of_measurement as string | undefined) ?? "";
        return html`<span
          class="pbadge"
          title=${(st.attributes?.friendly_name as string | undefined) ?? id}
          role="button"
          tabindex="0"
          @click=${(ev: MouseEvent) => {
            ev.stopPropagation();
            this._moreInfo(id);
          }}
          @keydown=${(k: KeyboardEvent) => {
            if (k.key === "Enter" || k.key === " ") {
              k.preventDefault();
              this._moreInfo(id);
            }
          }}
        >
          ${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : nothing}
          <span>${st.state}${unit}</span>
        </span>`;
      })}
    </div>`;
  }

  /** Open the standard HA more-info dialog for an entity. */
  private _moreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
    );
  }

  private _prevWeek = () => {
    this._weekOffset -= 1;
  };
  private _nextWeek = () => {
    this._weekOffset += 1;
  };
  private _thisWeek = () => {
    this._weekOffset = 0;
    this._day = this._todayIndex();
  };
  private _prevMonth = () => {
    this._monthOffset -= 1;
  };
  private _nextMonth = () => {
    this._monthOffset += 1;
  };
  private _thisMonth = () => {
    this._monthOffset = 0;
  };
  /** Jump to the day view for a specific date (from the month grid). */
  private _goToDate(date: Date): void {
    const today = startOfDay(new Date());
    const toWeekStart = (d: Date) => {
      const s = startOfDay(d);
      s.setDate(s.getDate() - ((s.getDay() - this._firstDayJs + 7) % 7));
      return s;
    };
    const weeks = Math.round(
      (toWeekStart(date).getTime() - toWeekStart(today).getTime()) / (7 * DAY_MS),
    );
    this._weekOffset = weeks;
    this._day = (date.getDay() - this._firstDayJs + 7) % 7;
    this._view = this._enabledViews.includes("day") ? "day" : this._view;
  }

  /* ---- render -------------------------------------------------- */
  protected render() {
    if (!this._config || !this.hass) return nothing;
    const title = this._config.title ?? this._t("board_title");
    return html`
      <ha-card>
        <div class="top">
          <div class="title">${title}</div>
          ${this._enabledViews.length > 1
            ? html`<div class="switch" role="tablist">
                ${this._enabledViews.map(
                  (v) =>
                    html`<button
                      role="tab"
                      aria-selected=${this._view === v}
                      class=${this._view === v ? "on" : ""}
                      @click=${() => (this._view = v)}
                    >
                      ${this._t(v)}
                    </button>`,
                )}
              </div>`
            : nothing}
        </div>
        ${this._config.show_focus ? this._renderFocus() : nothing}
        ${this._view === "day"
          ? this._renderDay()
          : this._view === "timeline"
            ? this._renderTimeline()
            : this._view === "week"
              ? this._renderWeek()
              : this._view === "month"
                ? this._renderMonth()
                : this._renderAgenda()}
      </ha-card>
      ${this._dialog
        ? this._renderDialog()
        : this._todoDialog
          ? this._renderTodoDialog()
          : this._todoBadgeDialog
            ? this._renderTodoBadgeDialog()
            : nothing}
    `;
  }

  /** Current + next timed event for a person, view-independent (from _raw). */
  private _focusFor(idx: number): { current?: RawEvent; next?: RawEvent } {
    const now = Date.now();
    const mine = this._raw
      .filter((r) => r.personIdx === idx && !r.allDay && r.kind !== "todo")
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    const current = mine.find((r) => r.start.getTime() <= now && now < r.end.getTime());
    const next = mine.find((r) => r.start.getTime() > now);
    return { current, next };
  }

  /** "Jetzt / als Nächstes" glance bar — one chip per (visible) person. */
  private _renderFocus() {
    return html`
      <div class="focus">
        ${this._persons.map((p, i) => {
          if (this._isOff(i)) return nothing;
          const { current, next } = this._focusFor(i);
          const c = personColor(p, i);
          const icon = (r: RawEvent) => (this._config.auto_icons ? this._autoIcon(r.summary) : "");
          return html`
            <div class="fchip" title=${this._personName(p, i)}>
              ${this._avatar(p, i)}
              <div class="fbody">
                <span class="fname">${this._personName(p, i)}</span>
                ${current
                  ? html`<span class="fnow">
                      <span class="fdot" style="background:${c}"></span>${icon(current)}
                      ${current.summary}
                      <small>bis ${formatTime(this.hass, current.end)}</small>
                    </span>`
                  : next
                    ? html`<span class="fnext">
                        ${this._t("focus_next")}: ${icon(next)} ${next.summary}
                        <small>${formatCountdown(this.hass, next.start)}</small>
                      </span>`
                    : html`<span class="ffree">${this._t("focus_free")}</span>`}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _weekNav() {
    const { monday } = this._weekBounds();
    return html`
      <div class="weeknav">
        <button class="nav" aria-label=${this._t("prev_week")} @click=${this._prevWeek}>‹</button>
        <button class="nav-now" @click=${this._thisWeek}>
          ${formatWeekRange(this.hass, monday)}
        </button>
        <button class="nav" aria-label=${this._t("next_week")} @click=${this._nextWeek}>›</button>
      </div>
    `;
  }

  private _renderDayTabs() {
    const short = weekdayNames(this.hass, "short", this._firstDayJs);
    return html`
      <div class="tabs" role="tablist">
        ${this._visibleDays.map(
          (d) => html`
            <button
              role="tab"
              aria-selected=${d === this._day}
              class="${d === this._day ? "on" : ""} ${this._isRealToday(d) ? "today" : ""}"
              @click=${() => (this._day = d)}
            >
              ${short[d]}
            </button>
          `,
        )}
      </div>
    `;
  }

  private _renderDay() {
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const px = this._pxPerMin;
    const hourPx = 60 * px;
    const { startMin, endMin } = this._dayWindow(day);
    const height = (endMin - startMin) * px;
    const full = weekdayNames(this.hass, "long", this._firstDayJs);
    const sharedAllDay = this._sharedAllDay(day).filter((e) => !this._isTodo(e));
    const sharedTimed = this._sharedTimed(day);

    const hours: number[] = [];
    for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);

    const now = new Date();
    const nowMin = Math.max(startMin, Math.min(endMin, now.getHours() * 60 + now.getMinutes()));
    const showNow = this._config.show_now_line !== false && this._isRealToday(day);
    const hasAllDay =
      sharedAllDay.length > 0 || this._persons.some((_, i) => this._allDayFor(day, i).length > 0);

    return html`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(day)) ?? full[day]}
          ${this._weatherChip(this._dateForDay(day))}${this._loading && this._raw.length === 0
            ? html`<span class="spinner"></span>`
            : nothing}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      ${this._loadError ? html`<div class="banner">${this._t("load_error")}</div>` : nothing}
      <div class="board">
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((p, i) => {
            const stateObj = p.person ? this.hass.states[p.person] : undefined;
            const off = this._isOff(i);
            return html`
              <div
                class="phead ${off ? "off" : ""}"
                role="button"
                tabindex="0"
                title=${this._personName(p, i)}
                @click=${() => this._togglePerson(i)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._togglePerson(i);
                  }
                }}
              >
                ${this._avatar(p, i)}
                ${off
                  ? nothing
                  : html`<div class="pname">${this._personName(p, i)}</div>
                      <div class="pstatus">
                        ${stateObj ? this._statusLabel(stateObj.state) : ""}
                      </div>
                      ${this._badges(p, i)}`}
              </div>
            `;
          })}
        </div>
        ${hasAllDay
          ? html`
              <div class="allday-row">
                <div class="axis-spacer allday-label">${this._t("all_day")}</div>
                <div class="allday-main">
                  ${sharedAllDay.length
                    ? html`<div class="allday-shared">
                        ${sharedAllDay.map((e) => {
                          const c = this._eventColor(e);
                          const tent = this._isTentative(e);
                          return html`
                            <div
                              class="adchip shared ${tent ? "tentative" : ""}"
                              style="${this._sharedGridStyle(e)};border-left:3px ${tent
                                ? "dashed"
                                : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                              title="${this._evTitle(e)}"
                              tabindex="0"
                              role="button"
                              @click=${() => this._openEvent(e)}
                              @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                            >
                              ${this._isTodo(e)
                                ? html`<span class="todo-line">
                                    ${this._renderTodoCheckbox(e)}
                                    <span class="todo-label"
                                      >${e.continuesBefore ? "« " : ""}${this._evTitle(
                                        e,
                                      )}${e.continuesAfter ? " »" : ""}</span
                                    >
                                  </span>`
                                : html`${e.continuesBefore ? "« " : ""}${this._evTitle(
                                    e,
                                  )}${e.continuesAfter ? " »" : ""}`}
                            </div>
                          `;
                        })}
                      </div>`
                    : nothing}
                  <div class="allday-grid">
                    ${this._persons.map((_p, i) => {
                      const calendarItems = this._allDayFor(day, i).filter((e) => !this._isTodo(e));
                      return html`
                        <div class="allday-cell ${this._isOff(i) ? "off" : ""}">
                          ${calendarItems.map((e) => {
                            const c = this._eventColor(e);
                            const tent = this._isTentative(e);
                            return html`
                              <div
                                class="adchip ${tent ? "tentative" : ""}"
                                style="border-left:3px ${tent
                                  ? "dashed"
                                  : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                                title="${this._evTitle(e)}"
                                tabindex="0"
                                role="button"
                                @click=${() => this._openEvent(e)}
                                @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                              >
                                ${e.continuesBefore ? "« " : ""}${this._evTitle(
                                  e,
                                )}${e.continuesAfter ? " »" : ""}
                              </div>
                            `;
                          })}
                        </div>
                      `;
                    })}
                  </div>
                </div>
              </div>
            `
          : nothing}
        <div class="body" style="height:${height}px">
          <div class="axis">
            ${hours.map(
              (h) =>
                html`<div class="hour" style="top:${(h * 60 - startMin) * px}px">
                  ${pad(h)}:00
                </div>`,
            )}
          </div>
          ${this._persons.map((p, i) => {
            const canCreate = this._personCanCreate(p);
            const layout = this._dayLayout(day, i);
            return html`
              <div
                class="col ${canCreate ? "creatable" : ""} ${this._isOff(i) ? "off" : ""}"
                @click=${(ev: MouseEvent) => this._onColClick(ev, i, day, px, startMin)}
                style="background-image:
                  repeating-linear-gradient(var(--fb-row-shade) 0 ${hourPx}px, transparent ${hourPx}px ${2 *
                hourPx}px),
                  repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${hourPx /
                2}px),
                  repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${hourPx}px)"
              >
                ${this._bgFor(day, i)
                  .filter((e) => e.endMin > startMin && e.startMin < endMin)
                  .map((e, bi) => {
                    const top = (e.startMin - startMin) * px;
                    const h = Math.max((e.endMin - e.startMin) * px - 3, 16);
                    const c = this._eventColor(e);
                    const tent = this._isTentative(e);
                    return html`
                      <div
                        class="band ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                        tabindex="0"
                        role="button"
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          this._openEvent(e);
                        }}
                        @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                        style="top:${top + 1.5}px;height:${h}px;
                               border:1.5px dashed ${c}55;
                               background:${c}0d;
                               background:repeating-linear-gradient(45deg,
                                 color-mix(in srgb, ${c} 8%, transparent) 0 8px,
                                 transparent 8px 16px)"
                        title="${this._evTitle(e)} · ${formatMinutes(
                          this.hass,
                          e.startMin,
                        )}–${formatMinutes(this.hass, e.endMin)}"
                      >
                        <span
                          class="etitle"
                          style="margin-top:${bi * 19}px;
                                 background:${c}26;
                                 background:color-mix(in srgb, ${c} 16%, var(--card-background-color, #fff))"
                          >${e.continuesBefore ? "« " : ""}${this._evTitle(e)}${e.continuesAfter
                            ? " »"
                            : ""}</span
                        >
                      </div>
                    `;
                  })}
                ${(() => {
                  // consecutive full-width mini events sit at min block height;
                  // nudge each one below the previous strip so labels never stack
                  let lastSlimBottom = -Infinity;
                  return layout.events
                    .filter((e) => e.endMin > startMin && e.startMin < endMin)
                    .map((e) => {
                      // live preview while dragging this event (in minute space)
                      const dragging = this._drag?.raw === e.ref;
                      let sMin = e.startMin;
                      let eMin = e.endMin;
                      if (dragging && this._drag) {
                        const g = this._dragGrid;
                        if (this._drag.mode === "move") {
                          const ns = Math.round((e.startMin + this._drag.deltaMin) / g) * g;
                          eMin = e.endMin + (ns - e.startMin);
                          sMin = ns;
                        } else {
                          let dur =
                            Math.round((e.endMin - e.startMin + this._drag.deltaMin) / g) * g;
                          if (dur < g) dur = g;
                          eMin = e.startMin + dur;
                        }
                      }
                      let top = (sMin - startMin) * px;
                      const h = Math.max((eMin - sMin) * px - 3, 16);
                      const c = this._eventColor(e);
                      const leftPct = (e.col / e.cols) * 100;
                      const widthPct = ((e.span ?? 1) / e.cols) * 100;
                      const tent = this._isTentative(e);
                      const slim = h < 24; // very short events: single-line strip on top
                      const canDrag = this._draggable(e);
                      if (slim && e.cols === 1 && !dragging) {
                        top = Math.max(top, lastSlimBottom + 1);
                        lastSlimBottom = top + h;
                      }
                      return html`
                        <div
                          class="event ${this._isPast(e) ? "past" : ""} ${tent
                            ? "tentative"
                            : ""} ${this._isTodo(e) ? "todo" : ""} ${slim ? "slim" : ""} ${canDrag
                            ? "draggable"
                            : ""} ${dragging ? "dragging" : ""}"
                          tabindex="0"
                          role="button"
                          @pointerdown=${(ev: PointerEvent) =>
                            this._onEventPointerDown(ev, e, "move")}
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            if (this._suppressClick) {
                              this._suppressClick = false;
                              return;
                            }
                            this._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                          style="top:${top + 1.5}px;height:${h}px;
                               left:calc(${leftPct}% + 2px);width:calc(${widthPct}% - 4px);
                               border-left:3px ${tent
                            ? "dashed"
                            : "solid"} ${c};background:${c}40;background:color-mix(in srgb, ${c} 32%, var(--card-background-color, #fff));"
                          title="${this._evTitle(e)} · ${formatMinutes(
                            this.hass,
                            e.startMin,
                          )}–${formatMinutes(this.hass, e.endMin)}"
                        >
                          <span class="etitle ${this._isTodo(e) ? "todo-line" : ""}"
                            >${this._isTodo(e)
                              ? this._renderTodoCheckbox(e)
                              : nothing}${this._isTodo(e)
                              ? html`<span class="todo-label"
                                  >${this._calIconEl(e)}${e.continuesBefore
                                    ? "« "
                                    : ""}${this._evTitle(e)}</span
                                >`
                              : html`${this._calIconEl(e)}${e.continuesBefore
                                  ? "« "
                                  : ""}${this._evTitle(e)}`}</span
                          >
                          ${h > 32 || dragging
                            ? html`<span class="etime"
                                >${formatMinutes(this.hass, sMin)}–${formatMinutes(
                                  this.hass,
                                  eMin,
                                )}</span
                              >`
                            : nothing}
                          ${this._progressOn && this._isCurrent(e) && !dragging
                            ? html`<div class="eprog">
                                <div style="width:${this._progressPct(e)}%"></div>
                              </div>`
                            : nothing}
                          ${canDrag && !slim
                            ? html`<div
                                class="rz"
                                @pointerdown=${(ev: PointerEvent) =>
                                  this._onEventPointerDown(ev, e, "resize")}
                              ></div>`
                            : nothing}
                        </div>
                      `;
                    });
                })()}
                ${layout.overflows
                  .filter((o) => o.endMin > startMin && o.startMin < endMin)
                  .map((o) => {
                    const top = (o.startMin - startMin) * px;
                    const h = Math.max((o.endMin - o.startMin) * px - 3, 16);
                    const leftPct = (o.col / o.cols) * 100;
                    const widthPct = 100 / o.cols;
                    return html`
                      <div
                        class="event overflow"
                        tabindex="0"
                        role="button"
                        title="${o.count} ${this._t("more_events")}"
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          this._showDayAgenda(day);
                        }}
                        @keydown=${(k: KeyboardEvent) => {
                          if (k.key === "Enter" || k.key === " ") {
                            k.preventDefault();
                            this._showDayAgenda(day);
                          }
                        }}
                        style="top:${top + 1.5}px;height:${h}px;
                               left:calc(${leftPct}% + 2px);width:calc(${widthPct}% - 4px)"
                      >
                        <span class="etitle">+${o.count}</span>
                      </div>
                    `;
                  })}
              </div>
            `;
          })}
          ${sharedTimed
            .filter((e) => e.endMin > startMin && e.startMin < endMin)
            .map((e) => {
              const bandStyle = this._sharedBandStyle(e, px, startMin);
              if (!bandStyle) return nothing;
              const { height: bandHeight } = this._sharedBandBox(e, px, startMin);
              const c = this._eventColor(e);
              const tent = this._isTentative(e);
              return html`
                <div
                  class="shared-band ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                  tabindex="0"
                  role="button"
                  @click=${(ev: MouseEvent) => {
                    ev.stopPropagation();
                    this._openEvent(e);
                  }}
                  @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                  style="${bandStyle};
                         border-left:3px ${tent ? "dashed" : "solid"} ${c};
                         background:${c}1f;
                         background:color-mix(in srgb, ${c} 14%, var(--card-background-color, #fff))"
                  title="${this._evTitle(e)} · ${formatMinutes(
                    this.hass,
                    e.startMin,
                  )}–${formatMinutes(this.hass, e.endMin)}"
                >
                  <span class="shared-tag">${this._sharedLabel(e)}</span>
                  <span class="etitle"
                    >${e.continuesBefore ? "« " : ""}${this._calIconEl(e)}${this._evTitle(
                      e,
                    )}${e.continuesAfter ? " »" : ""}</span
                  >
                  ${bandHeight > 24
                    ? html`<span class="etime"
                        >${formatMinutes(this.hass, e.startMin)}–${formatMinutes(
                          this.hass,
                          e.endMin,
                        )}</span
                      >`
                    : nothing}
                </div>
              `;
            })}
          ${showNow
            ? html`<div class="nowline" style="top:${(nowMin - startMin) * px}px">
                <span>${formatMinutes(this.hass, nowMin)}</span>
              </div>`
            : nothing}
          ${!this._loading && !this._loadError && !this._dayHasEvents(day)
            ? html`<div class="empty">${this._t("no_events")}</div>`
            : nothing}
        </div>
      </div>
    `;
  }

  /** Horizontal timeline: persons as rows on the left, time flowing left → right. */
  private _renderTimeline() {
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const { startMin, endMin } = this._dayWindow(day);
    const hourPx = Math.min(240, Math.max(48, Number(this._config.hour_width) || 96));
    const px = hourPx / 60;
    const width = (endMin - startMin) * px;
    const full = weekdayNames(this.hass, "long", this._firstDayJs);
    const shared = this._sharedTimed(day);
    const visiblePersonIdxs = this._persons.map((_, idx) => idx).filter((idx) => !this._isOff(idx));
    const hours: number[] = [];
    for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const showNow =
      this._config.show_now_line !== false &&
      this._isRealToday(day) &&
      nowMin >= startMin &&
      nowMin <= endMin;
    const LANE = 30;

    return html`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(day)) ?? full[day]}
          ${this._weatherChip(this._dateForDay(day))}${this._loading && this._raw.length === 0
            ? html`<span class="spinner"></span>`
            : nothing}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      ${this._loadError ? html`<div class="banner">${this._t("load_error")}</div>` : nothing}
      <div class="tlwrap">
        <div class="tlgrid" style="min-width:calc(var(--fb-tl-label, 150px) + ${width}px)">
          <div class="tlhead">
            <div class="tlcorner"></div>
            <div class="tlhours" style="width:${width}px">
              ${hours.map(
                (h) =>
                  html`<span class="tlhour" style="left:${(h * 60 - startMin) * px}px"
                    >${pad(h)}:00</span
                  >`,
              )}
            </div>
          </div>
          ${shared.length
            ? html`
                <div class="tlrow shared">
                  <div class="tlperson shared">
                    <div>
                      <div class="pname">${this._t("shared_events")}</div>
                    </div>
                  </div>
                  <div
                    class="tlcanvas shared"
                    style="width:${width}px;height:${Math.max(...shared.map((e) => e.cols)) * LANE +
                    8}px;
                           background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${hourPx}px),
                           repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${hourPx /
                    2}px)"
                  >
                    ${shared
                      .filter((e) => e.endMin > startMin && e.startMin < endMin)
                      .map((e) => {
                        const s = Math.max(e.startMin, startMin);
                        const en = Math.min(e.endMin, endMin);
                        const w = Math.max((en - s) * px - 3, 20);
                        const c = this._eventColor(e);
                        const tent = this._isTentative(e);
                        const before = e.continuesBefore || e.startMin < startMin;
                        const after = e.continuesAfter || e.endMin > endMin;
                        if (!this._sharedRange(e, visiblePersonIdxs)) return nothing;
                        return html`
                          <div
                            class="tlbar shared ${this._isPast(e) ? "past" : ""} ${tent
                              ? "tentative"
                              : ""}"
                            tabindex="0"
                            role="button"
                            @click=${(ev: MouseEvent) => {
                              ev.stopPropagation();
                              this._openEvent(e);
                            }}
                            @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                            style="left:${(s - startMin) * px + 1.5}px;width:${w}px;
                                   top:${e.col * LANE + 4}px;height:${LANE - 6}px;
                                   border-left:3px ${tent ? "dashed" : "solid"} ${c};
                                   background:${c}28;
                                   background:color-mix(in srgb, ${c} 18%, var(--card-background-color, #fff))"
                            title="${this._evTitle(e)}${e.allDay
                              ? ` · ${this._t("all_day")}`
                              : ` · ${formatMinutes(this.hass, e.startMin)}–${formatMinutes(this.hass, e.endMin)}`}"
                          >
                            <span class="shared-tag">${this._sharedLabel(e)}</span>
                            <span class="etitle"
                              >${before ? "« " : ""}${this._calIconEl(e)}${this._evTitle(e)}${after
                                ? " »"
                                : ""}</span
                            >
                          </div>
                        `;
                      })}
                  </div>
                </div>
              `
            : nothing}
          ${this._persons.map((p, i) => {
            const off = this._isOff(i);
            const evs = off ? [] : this._events.filter((e) => e.day === day && e.personIdx === i);
            const laid = layoutDayColumns(evs);
            const lanes = laid.length ? Math.max(...laid.map((e) => e.cols)) : 1;
            const canCreate = this._personCanCreate(p);
            const stateObj = p.person ? this.hass.states[p.person] : undefined;
            return html`
              <div class="tlrow ${off ? "off" : ""}">
                <div
                  class="tlperson"
                  role="button"
                  tabindex="0"
                  @click=${() => this._togglePerson(i)}
                  @keydown=${(k: KeyboardEvent) => {
                    if (k.key === "Enter" || k.key === " ") {
                      k.preventDefault();
                      this._togglePerson(i);
                    }
                  }}
                >
                  ${this._avatar(p, i)}
                  <div class="pmeta">
                    <div class="pname">${this._personName(p, i)}</div>
                    <div class="pstatus">${stateObj ? this._statusLabel(stateObj.state) : ""}</div>
                    ${this._badges(p, i)}
                  </div>
                </div>
                <div
                  class="tlcanvas ${canCreate ? "creatable" : ""}"
                  style="width:${width}px;height:${lanes * LANE + 8}px;
                         background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${hourPx}px),
                         repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${hourPx /
                  2}px)"
                  @click=${(ev: MouseEvent) => this._onTimelineClick(ev, i, day, px, startMin)}
                >
                  ${laid
                    .filter((e) => e.endMin > startMin && e.startMin < endMin)
                    .map((e) => {
                      const s = Math.max(e.startMin, startMin);
                      const en = Math.min(e.endMin, endMin);
                      const w = Math.max((en - s) * px - 3, 20);
                      const c = this._eventColor(e);
                      const tent = this._isTentative(e);
                      const before = e.continuesBefore || e.startMin < startMin;
                      const after = e.continuesAfter || e.endMin > endMin;
                      return html`
                        <div
                          class="tlbar ${this._isPast(e) ? "past" : ""} ${tent
                            ? "tentative"
                            : ""} ${this._isTodo(e) ? "todo" : ""}"
                          tabindex="0"
                          role="button"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            this._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                          style="left:${(s - startMin) * px + 1.5}px;width:${w}px;
                                 top:${e.col * LANE + 4}px;height:${LANE - 6}px;
                                 border-left:3px ${tent
                            ? "dashed"
                            : "solid"} ${c};background:${c}40;background:color-mix(in srgb, ${c} 32%, var(--card-background-color, #fff));"
                          title="${this._evTitle(e)}${e.allDay
                            ? ` · ${this._t("all_day")}`
                            : ` · ${formatMinutes(this.hass, e.startMin)}–${formatMinutes(this.hass, e.endMin)}`}"
                        >
                          <span class="etitle ${this._isTodo(e) ? "todo-line" : ""}"
                            >${this._isTodo(e)
                              ? this._renderTodoCheckbox(e)
                              : nothing}${this._isTodo(e)
                              ? html`<span class="todo-label"
                                  >${before ? "« " : ""}${this._evTitle(e)}${after
                                    ? " »"
                                    : ""}</span
                                >`
                              : html`${before ? "« " : ""}${this._evTitle(e)}${after ? " »" : ""}`}</span
                          >
                          ${!e.allDay && w > 120
                            ? html`<span class="etime"
                                >${formatMinutes(this.hass, e.startMin)}–${formatMinutes(
                                  this.hass,
                                  e.endMin,
                                )}</span
                              >`
                            : nothing}
                        </div>
                      `;
                    })}
                </div>
              </div>
            `;
          })}
          ${showNow
            ? html`<div
                class="tlnow"
                style="left:calc(var(--fb-tl-label, 150px) + ${(nowMin - startMin) * px}px)"
              >
                <span>${formatMinutes(this.hass, nowMin)}</span>
              </div>`
            : nothing}
        </div>
        ${!this._loading && !this._loadError && !this._dayHasEvents(day)
          ? html`<div class="empty">${this._t("no_events")}</div>`
          : nothing}
      </div>
    `;
  }

  private _onTimelineClick(
    ev: MouseEvent,
    idx: number,
    day: number,
    px: number,
    startMin: number,
  ): void {
    const p = this._persons[idx];
    if (!this._personCanCreate(p)) return;
    const target = ev.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetX = ev.clientX - rect.left;
    let min = startMin + offsetX / px;
    const grid = this._grid;
    min = Math.round(min / grid) * grid;
    min = Math.max(0, Math.min(min, 24 * 60 - grid));
    this._openCreate(idx, day, min);
  }

  private _renderWeek() {
    const short = weekdayNames(this.hass, "short", this._firstDayJs);
    // optionally hide persons without any events in the shown week
    const people = this._persons
      .map((p, i) => ({ p, i }))
      .filter(
        ({ i }) =>
          this._config.hide_empty_persons !== true ||
          this._events.some((e) => e.personIdx === i || (this._isShared(e) && this._sharedPersons(e).includes(i))),
      );
    const shown = people.length > 0 ? people : this._persons.map((p, i) => ({ p, i }));
    const cols = `70px repeat(${shown.length}, minmax(110px, 1fr))`;
    return html`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${cols}">
          <div class="corner"></div>
          ${shown.map(
            ({ p, i }) =>
              html`<div
                class="wphead ${this._isOff(i) ? "off" : ""}"
                role="button"
                tabindex="0"
                @click=${() => this._togglePerson(i)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._togglePerson(i);
                  }
                }}
              >
                ${this._avatar(p, i)}
                <div class="pmeta">
                  <div class="pname">${this._personName(p, i)}</div>
                  ${this._badges(p, i)}
                </div>
              </div>`,
          )}
          ${this._visibleDays.map((d) => {
            const shared = this._sharedFor(d);
            const shownIdxs = shown.map(({ i }) => i);
            return html`
              <div
                class="wday ${this._isRealToday(d) ? "today" : ""}"
                role="button"
                tabindex="0"
                title=${this._t("day")}
                @click=${() => this._openDayView(d)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._openDayView(d);
                  }
                }}
              >
                <b>${short[d]}</b>
              </div>
              ${shared.length
                ? html`
                    <div class="wshared ${this._isRealToday(d) ? "today" : ""}">
                      ${shared.map((e) => {
                        const c = this._eventColor(e);
                        const tent = this._isTentative(e);
                        const sharedStyle = this._sharedGridStyle(e, shownIdxs);
                        if (sharedStyle === "display:none") return nothing;
                        return html`
                          <div
                            class="wshared-chip ${this._isPast(e) ? "past" : ""} ${tent
                              ? "tentative"
                              : ""}"
                            style="${sharedStyle};border-left:2.5px ${tent
                              ? "dashed"
                              : "solid"} ${c};background:${c}28;background:color-mix(in srgb, ${c} 18%, var(--card-background-color, #fff))"
                            title="${this._evTitle(e)}"
                            tabindex="0"
                            role="button"
                            @click=${(ev: MouseEvent) => {
                              ev.stopPropagation();
                              this._openEvent(e);
                            }}
                            @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                          >
                            <span class="shared-tag">${this._sharedLabel(e)}</span>
                            <span
                              >${this._calIconEl(e)}${e.continuesBefore ? "« " : ""}${this._evTitle(
                                e,
                              )}${e.continuesAfter ? " »" : ""}</span
                            >
                            ${!e.allDay
                              ? html`<small
                                  >${formatMinutes(this.hass, e.startMin)}–${formatMinutes(
                                    this.hass,
                                    e.endMin,
                                  )}</small
                                >`
                              : html`<small>${this._t("all_day")}</small>`}
                          </div>
                        `;
                      })}
                    </div>
                    <div class="wspacer ${this._isRealToday(d) ? "today" : ""}"></div>
                  `
                : nothing}
              ${shown.map(({ p, i }) => {
                const canCreate = this._personCanCreate(p);
                return html`
                  <div
                    class="wcell ${this._isRealToday(d) ? "today" : ""} ${canCreate
                      ? "creatable"
                      : ""}"
                    @click=${() => canCreate && this._openCreate(i, d)}
                  >
                    ${this._eventsFor(d, i).map((e) => {
                      const c = this._eventColor(e);
                      const tent = this._isTentative(e);
                      return html`
                        <div
                          class="wchip ${this._isPast(e) ? "past" : ""} ${tent
                            ? "tentative"
                            : ""} ${this._isTodo(e) ? "todo" : ""}"
                          style="border-left:2.5px ${tent
                            ? "dashed"
                            : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}"
                          tabindex="0"
                          role="button"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            this._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                        >
                          <span class=${this._isTodo(e) ? "todo-line" : ""}
                            >${this._isTodo(e)
                              ? this._renderTodoCheckbox(e)
                              : nothing}${this._isTodo(e)
                              ? html`<span class="todo-label"
                                  >${this._calIconEl(e)}${e.continuesBefore
                                    ? "« "
                                    : ""}${this._evTitle(e)}</span
                                >`
                              : html`${this._calIconEl(e)}${e.continuesBefore
                                  ? "« "
                                  : ""}${this._evTitle(e)}`}</span
                          >
                          ${!e.allDay
                            ? html`<small>${formatMinutes(this.hass, e.startMin)}</small>`
                            : nothing}
                        </div>
                      `;
                    })}
                  </div>
                `;
              })}
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderAgenda() {
    const full = weekdayNames(this.hass, "long", this._firstDayJs);
    const dateFmt = new Intl.DateTimeFormat(this.hass.locale?.language || "en", {
      day: "numeric",
      month: "short",
    });
    const dedupe = (items: BoardEvent[]): BoardEvent[] => {
      if (!this._config.filter_duplicates) return items;
      const seen = new Set<string>();
      return items.filter((e) => {
        const k = `${this._evTitle(e)}|${e.ref.start.getTime()}|${e.ref.end.getTime()}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    };
    const groups = this._visibleDays
      .map((d) => ({
        d,
        items: dedupe(
          this._events
            .filter((e) => e.day === d && !this._isOff(e.personIdx))
            .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin),
        ),
      }))
      .filter((g) => g.items.length > 0);

    return html`
      <div class="weekhead">${this._weekNav()}</div>
      ${this._loadError ? html`<div class="banner">${this._t("load_error")}</div>` : nothing}
      <div class="agenda">
        ${groups.length === 0
          ? html`<div class="agenda-empty">
              ${this._loading ? html`<span class="spinner"></span>` : this._t("no_events")}
            </div>`
          : groups.map(
              (g) => html`
                <div class="agenda-day">
                  <div class="agenda-date ${this._isRealToday(g.d) ? "today" : ""}">
                    ${this._relativeDay(this._dateForDay(g.d)) ?? full[g.d]} ·
                    ${dateFmt.format(this._dateForDay(g.d))}
                    ${this._weatherChip(this._dateForDay(g.d))}
                  </div>
                  ${g.items.map((e) => this._agendaRow(e))}
                </div>
              `,
            )}
      </div>
    `;
  }

  private _agendaRow(e: BoardEvent) {
    const c = this._eventColor(e);
    const name = this._eventOwnerLabel(e);
    const time = e.allDay
      ? this._t("all_day")
      : `${formatMinutes(this.hass, e.startMin)}–${formatMinutes(this.hass, e.endMin)}`;
    const current = this._isCurrent(e);
    const tent = this._isTentative(e);
    const countdown =
      !e.allDay && !current && !e.continuesBefore ? formatCountdown(this.hass, e.ref.start) : "";
    return html`
      <div
        class="agenda-row ${this._isPast(e) ? "past" : ""} ${current ? "current" : ""} ${tent
          ? "tentative"
          : ""} ${this._isShared(e) ? "shared" : ""} ${this._isTodo(e) ? "todo" : ""}"
        tabindex="0"
        role="button"
        @click=${() => this._openEvent(e)}
        @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
      >
        <span class="agenda-time">${time}</span>
        <span class="agenda-bar" style="background:${c}"></span>
        <span class="agenda-main">
          <span class="agenda-title ${this._isTodo(e) ? "todo-line" : ""}"
            >${this._isTodo(e) ? this._renderTodoCheckbox(e) : nothing}${this._isTodo(e)
              ? html`<span class="todo-label"
                  >${this._calIconEl(e)}${e.continuesBefore ? "« " : ""}${this._evTitle(
                    e,
                  )}${e.continuesAfter ? " »" : ""}</span
                >`
              : html`${this._calIconEl(e)}${e.continuesBefore ? "« " : ""}${this._evTitle(
                  e,
                )}${e.continuesAfter ? " »" : ""}`}</span
          >
          <span class="agenda-meta">${name}${e.location ? ` · ${e.location}` : ""}</span>
          ${current && this._progressOn
            ? html`<span class="agenda-prog"
                ><span style="width:${this._progressPct(e)}%;background:${c}"></span
              ></span>`
            : nothing}
        </span>
        ${countdown ? html`<span class="agenda-cd">${countdown}</span>` : nothing}
      </div>
    `;
  }

  private _renderMonth() {
    const { gridStart, weeks, month, year } = this._monthGrid();
    const numDays = weeks * 7;
    const short = weekdayNames(this.hass, "short", this._firstDayJs);
    const locale = this.hass.locale?.language || "en";
    const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
      new Date(year, month, 1),
    );
    const byDay = new Map<number, BoardEvent[]>();
    for (const r of this._raw) {
      if (this._isOff(r.personIdx)) continue;
      for (const s of splitAcrossDays(r, gridStart, numDays)) {
        const arr = byDay.get(s.day);
        if (arr) arr.push(s);
        else byDay.set(s.day, [s]);
      }
    }
    const today = startOfDay(new Date()).getTime();
    const maxChips = 3;
    return html`
      <div class="weekhead">
        <div class="weeknav">
          <button class="nav" aria-label=${this._t("prev_month")} @click=${this._prevMonth}>
            ‹
          </button>
          <button class="nav-now" @click=${this._thisMonth}>${monthName}</button>
          <button class="nav" aria-label=${this._t("next_month")} @click=${this._nextMonth}>
            ›
          </button>
        </div>
      </div>
      ${this._loadError ? html`<div class="banner">${this._t("load_error")}</div>` : nothing}
      <div class="monthwrap">
        <div class="monthhead">${short.map((s) => html`<div class="mhcell">${s}</div>`)}</div>
        <div class="monthgrid">
          ${Array.from({ length: numDays }, (_, d) => {
            const date = new Date(gridStart.getTime() + d * DAY_MS);
            const inMonth = date.getMonth() === month;
            const isToday = date.getTime() === today;
            const items = (byDay.get(d) || []).sort(
              (a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin,
            );
            return html`
              <div
                class="mcell ${inMonth ? "" : "out"} ${isToday ? "today" : ""} ${date.getDay() ===
                  0 || date.getDay() === 6
                  ? "wkend"
                  : ""}"
                role="button"
                tabindex="0"
                @click=${() => this._goToDate(date)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._goToDate(date);
                  }
                }}
              >
                <div class="mdate ${isToday ? "today" : ""}">${date.getDate()}</div>
                <div class="mchips">
                  ${items.slice(0, maxChips).map((e) => {
                    const col = this._eventColor(e);
                    const tent = this._isTentative(e);
                    return html`<div
                      class="mchip ${this._isPast(e) ? "past" : ""} ${tent
                        ? "tentative"
                        : ""} ${this._isShared(e) ? "shared" : ""} ${this._isTodo(e) ? "todo" : ""}"
                      style="background:${col}30;background:color-mix(in srgb, ${col} 22%, var(--card-background-color, #fff));border-left:2px ${tent
                        ? "dashed"
                        : "solid"} ${col}"
                      title="${this._eventOwnerLabel(e)} · ${this._evTitle(e)}"
                      @click=${(ev: MouseEvent) => {
                        ev.stopPropagation();
                        this._openEvent(e);
                      }}
                    >
                      ${this._isTodo(e)
                        ? html`<span class="todo-line">
                            ${this._renderTodoCheckbox(e)}
                            <span class="todo-label"
                              >${e.continuesBefore ? "« " : ""}${this._evTitle(e)}</span
                            >
                          </span>`
                        : html`${e.continuesBefore ? "« " : ""}${this._evTitle(e)}`}
                    </div>`;
                  })}
                  ${items.length > maxChips
                    ? html`<div class="mmore">+${items.length - maxChips}</div>`
                    : nothing}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _statusLabel(state: string): string {
    if (state === "home") return this._t("status_home");
    if (state === "not_home") return this._t("status_away");
    if (state === "unknown" || state === "unavailable") return "–";
    return state;
  }

  /* ---- create / edit / delete ---------------------------------- */
  private _onColClick(
    ev: MouseEvent,
    idx: number,
    day: number,
    px: number,
    startMin: number,
  ): void {
    const p = this._persons[idx];
    if (!this._personCanCreate(p)) return;
    const target = ev.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetY = ev.clientY - rect.top;
    let min = startMin + offsetY / px;
    const grid = this._grid;
    min = Math.round(min / grid) * grid;
    min = Math.max(0, Math.min(min, 24 * 60 - grid));
    this._openCreate(idx, day, min);
  }

  private _openCreate(idx: number, day: number, startMin?: number): void {
    const p = this._persons[idx];
    const writable = this._writableCals(p);
    if (writable.length === 0) return;
    const base = startOfDay(this._dateForDay(day));
    const sMin = startMin ?? Math.max(this._startMin, 9 * 60);
    const start = new Date(base.getTime() + sMin * 60000);
    const end = new Date(start.getTime() + 60 * 60000);
    this._dialog = {
      mode: "create",
      personIdx: idx,
      calendar: writable[0],
      calendarOptions: writable.length > 1 ? writable : undefined,
      canUpdate: true,
      canDelete: false,
      summary: "",
      location: "",
      description: "",
      allDay: false,
      start: toLocalInput(start),
      end: toLocalInput(end),
      recurrenceRange: "",
    };
  }

  private _openEvent(e: BoardEvent): void {
    const raw: RawEvent = e.ref;
    if (raw.kind === "todo") {
      this._openTodo({
        entityId: raw.calendar,
        uid: raw.uid,
        summary: raw.summary,
        status: "needs_action",
        due: raw.todo_due,
        description: raw.description,
        listLabel: this._todoLabel(raw.calendar),
      });
      return;
    }
    const cal = raw.calendar;
    const canUpdate = this._canUpdate(cal) && !!raw.uid;
    const canDelete = this._canDelete(cal) && !!raw.uid;
    this._dialog = {
      mode: "edit",
      personIdx: raw.personIdx,
      calendar: cal,
      uid: raw.uid,
      recurrence_id: raw.recurrence_id,
      recurring: !!(raw.recurrence_id || raw.rrule),
      recurrenceRange: "",
      canUpdate,
      canDelete,
      summary: raw.summary,
      location: raw.location ?? "",
      description: raw.description ?? "",
      allDay: raw.allDay,
      start: raw.allDay ? toLocalDate(raw.start) : toLocalInput(raw.start),
      // all-day end is exclusive in HA; show the inclusive last day to the user
      end: raw.allDay ? toLocalDate(new Date(raw.end.getTime() - DAY_MS)) : toLocalInput(raw.end),
    };
  }

  private _dlgField<K extends keyof DialogState>(key: K, value: DialogState[K]): void {
    if (!this._dialog) return;
    this._dialog = { ...this._dialog, [key]: value, error: undefined };
  }

  private _toggleAllDay(allDay: boolean): void {
    if (!this._dialog) return;
    const d = this._dialog;
    if (allDay && !d.allDay) {
      this._dialog = {
        ...d,
        allDay,
        start: d.start.slice(0, 10),
        end: d.end.slice(0, 10),
        error: undefined,
      };
    } else if (!allDay && d.allDay) {
      this._dialog = {
        ...d,
        allDay,
        start: `${d.start}T09:00`,
        end: `${d.end}T10:00`,
        error: undefined,
      };
    }
  }

  /** Build the event payload expected by calendar/event/* WS commands. */
  private _buildPayload(d: DialogState): Record<string, string> {
    const ev: Record<string, string> = { summary: d.summary.trim() || this._t("default_title") };
    if (d.location.trim()) ev.location = d.location.trim();
    if (d.description.trim()) ev.description = d.description.trim();
    if (d.allDay) {
      const endExcl = new Date(`${d.end}T00:00:00`);
      endExcl.setDate(endExcl.getDate() + 1); // end date is exclusive
      ev.dtstart = d.start;
      ev.dtend = toLocalDate(endExcl);
    } else {
      ev.dtstart = new Date(d.start).toISOString();
      ev.dtend = new Date(d.end).toISOString();
    }
    return ev;
  }

  private _validate(d: DialogState): string | null {
    const s = d.allDay ? new Date(`${d.start}T00:00:00`) : new Date(d.start);
    const e = d.allDay ? new Date(`${d.end}T00:00:00`) : new Date(d.end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return this._t("err_invalid");
    if (e.getTime() < s.getTime()) return this._t("err_end_before");
    if (!d.allDay && e.getTime() === s.getTime()) return this._t("err_end_equal");
    return null;
  }

  /* ---- drag & drop -------------------------------------------- */
  /** Whether an event may be dragged: feature on, timed, writable, non-recurring. */
  private _draggable(e: BoardEvent): boolean {
    return (
      this._config.drag_drop !== false &&
      !this._isTodo(e) &&
      !e.allDay &&
      !e.ref.rrule &&
      !!e.ref.uid &&
      this._canUpdate(e.ref.calendar) &&
      !e.continuesBefore &&
      !e.continuesAfter
    );
  }

  private _onEventPointerDown(ev: PointerEvent, e: BoardEvent, mode: "move" | "resize"): void {
    if (ev.button !== 0 || !this._draggable(e)) return;
    ev.stopPropagation();
    this._dragStartY = ev.clientY;
    this._dragPx = this._pxPerMin;
    this._dragGrid = this._grid;
    this._drag = { raw: e.ref, mode, deltaMin: 0, moved: false, busy: false };
    (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);
    window.addEventListener("pointermove", this._onDragMove);
    window.addEventListener("pointerup", this._onDragUp);
  }

  private _onDragMove = (ev: PointerEvent): void => {
    if (!this._drag) return;
    ev.preventDefault();
    const dy = ev.clientY - this._dragStartY;
    const moved = this._drag.moved || Math.abs(dy) > 4;
    this._drag = { ...this._drag, deltaMin: dy / this._dragPx, moved };
  };

  private _onDragUp = (): void => {
    window.removeEventListener("pointermove", this._onDragMove);
    window.removeEventListener("pointerup", this._onDragUp);
    const drag = this._drag;
    if (!drag) return;
    if (!drag.moved) {
      this._drag = undefined; // a plain click -> let @click open the dialog
      return;
    }
    this._suppressClick = true;
    void this._commitDrag(drag);
  };

  private async _commitDrag(drag: NonNullable<FamilyBoardCard["_drag"]>): Promise<void> {
    const raw = drag.raw;
    const { start, end } = dragTimes(raw.start, raw.end, drag.deltaMin, drag.mode, this._dragGrid);
    if (start.getTime() === raw.start.getTime() && end.getTime() === raw.end.getTime()) {
      this._drag = undefined;
      return;
    }
    this._drag = { ...drag, busy: true };
    try {
      const event: Record<string, string> = {
        summary: raw.summary,
        dtstart: start.toISOString(),
        dtend: end.toISOString(),
      };
      if (raw.location) event.location = raw.location;
      if (raw.description) event.description = raw.description;
      await this.hass.callWS({
        type: "calendar/event/update",
        entity_id: raw.calendar,
        uid: raw.uid,
        recurrence_id: raw.recurrence_id,
        recurrence_range: "",
        event,
      });
      this._drag = undefined;
      await this._refetch();
    } catch (_e) {
      this._drag = undefined;
      this._loadError = false;
      await this._refetch(); // reset to server state on failure
    }
  }

  private async _saveDialog(): Promise<void> {
    if (!this._dialog) return;
    const d = this._dialog;
    const err = this._validate(d);
    if (err) {
      this._dialog = { ...d, error: err };
      return;
    }
    this._dialog = { ...d, busy: true, error: undefined };
    try {
      const event = this._buildPayload(d);
      if (d.mode === "create") {
        await this.hass.callWS({ type: "calendar/event/create", entity_id: d.calendar, event });
      } else {
        await this.hass.callWS({
          type: "calendar/event/update",
          entity_id: d.calendar,
          uid: d.uid,
          recurrence_id: d.recurrence_id,
          recurrence_range: d.recurring ? d.recurrenceRange : "",
          event,
        });
      }
      this._dialog = undefined;
      await this._refetch();
    } catch (e: any) {
      this._dialog = { ...d, busy: false, error: e?.message || this._t("save_failed") };
    }
  }

  private async _deleteDialog(): Promise<void> {
    if (!this._dialog || !this._dialog.uid) return;
    const d = this._dialog;
    this._dialog = { ...d, busy: true, error: undefined };
    try {
      await this.hass.callWS({
        type: "calendar/event/delete",
        entity_id: d.calendar,
        uid: d.uid,
        recurrence_id: d.recurrence_id,
        recurrence_range: d.recurring ? d.recurrenceRange : "",
      });
      this._dialog = undefined;
      await this._refetch();
    } catch (e: any) {
      this._dialog = { ...d, busy: false, error: e?.message || this._t("delete_failed") };
    }
  }

  private _closeDialog(): void {
    this._dialog = undefined;
  }

  private _renderDialog() {
    const d = this._dialog!;
    const readOnly = d.mode === "edit" && !d.canUpdate;
    const calName = this._calLabel(d.calendar);
    const heading =
      d.mode === "create"
        ? this._t("new_event")
        : readOnly
          ? this._t("event")
          : this._t("edit_event");
    return html`
      <div
        class="overlay"
        @click=${(e: MouseEvent) => {
          if (e.target === e.currentTarget) this._closeDialog();
        }}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${heading}>
          <div class="dlg-head">
            <span>${heading}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeDialog}>
              ✕
            </button>
          </div>
          ${d.calendarOptions && d.calendarOptions.length > 1
            ? html`<label class="fld">
                <span>${this._t("field_calendar")}</span>
                <select
                  .value=${d.calendar}
                  @change=${(e: Event) =>
                    this._dlgField("calendar", (e.target as HTMLSelectElement).value)}
                >
                  ${d.calendarOptions.map(
                    (c) =>
                      html`<option value=${c} ?selected=${c === d.calendar}>
                        ${this._calLabel(c)}
                      </option>`,
                  )}
                </select>
              </label>`
            : html`<div class="dlg-cal">${calName}</div>`}

          <label class="fld">
            <span>${this._t("field_title")}</span>
            <input
              type="text"
              .value=${d.summary}
              ?disabled=${readOnly}
              autofocus
              @input=${(e: Event) =>
                this._dlgField("summary", (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="chk">
            <input
              type="checkbox"
              .checked=${d.allDay}
              ?disabled=${readOnly}
              @change=${(e: Event) => this._toggleAllDay((e.target as HTMLInputElement).checked)}
            />
            <span>${this._t("field_all_day")}</span>
          </label>

          <div class="row">
            <label class="fld">
              <span>${this._t("field_start")}</span>
              <input
                type=${d.allDay ? "date" : "datetime-local"}
                .value=${d.start}
                ?disabled=${readOnly}
                @input=${(e: Event) =>
                  this._dlgField("start", (e.target as HTMLInputElement).value)}
              />
            </label>
            <label class="fld">
              <span>${this._t("field_end")}</span>
              <input
                type=${d.allDay ? "date" : "datetime-local"}
                .value=${d.end}
                ?disabled=${readOnly}
                @input=${(e: Event) => this._dlgField("end", (e.target as HTMLInputElement).value)}
              />
            </label>
          </div>

          <label class="fld">
            <span>
              ${this._t("field_location")}
              ${d.location.trim()
                ? html`<a
                    class="maplink"
                    href=${this._mapUrl(d.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    @click=${(e: Event) => e.stopPropagation()}
                    >${this._t("open_map")}</a
                  >`
                : nothing}
            </span>
            <input
              type="text"
              .value=${d.location}
              ?disabled=${readOnly}
              @input=${(e: Event) =>
                this._dlgField("location", (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="fld">
            <span>${this._t("field_note")}</span>
            <textarea
              rows="2"
              .value=${d.description}
              ?disabled=${readOnly}
              @input=${(e: Event) =>
                this._dlgField("description", (e.target as HTMLTextAreaElement).value)}
            ></textarea>
          </label>

          ${d.mode === "edit" && d.recurring && !readOnly
            ? html`<div class="recur">
                <span class="recur-label">${this._t("recurring")}</span>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${d.recurrenceRange === ""}
                    @change=${() => this._dlgField("recurrenceRange", "")}
                  />
                  <span>${this._t("recur_this")}</span>
                </label>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${d.recurrenceRange === "THISANDFUTURE"}
                    @change=${() => this._dlgField("recurrenceRange", "THISANDFUTURE")}
                  />
                  <span>${this._t("recur_future")}</span>
                </label>
              </div>`
            : nothing}
          ${readOnly ? html`<div class="ro-note">${this._t("read_only")}</div>` : nothing}
          ${d.error ? html`<div class="dlg-error">${d.error}</div>` : nothing}

          <div class="dlg-actions">
            ${d.mode === "edit" && d.canDelete
              ? html`<button class="danger" ?disabled=${d.busy} @click=${this._deleteDialog}>
                  ${this._t("delete")}
                </button>`
              : nothing}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${d.busy} @click=${this._closeDialog}>
              ${this._t("cancel")}
            </button>
            ${!readOnly
              ? html`<button class="primary" ?disabled=${d.busy} @click=${this._saveDialog}>
                  ${d.busy ? "…" : this._t("save")}
                </button>`
              : nothing}
          </div>
        </div>
      </div>
    `;
  }
  private _renderTodoDialog() {
    const d = this._todoDialog!;
    const readOnly = !d.canUpdate;
    const heading = readOnly ? this._t("todo") : this._t("edit_todo");
    return html`
      <div
        class="overlay"
        @click=${(e: MouseEvent) => {
          if (e.target === e.currentTarget) this._closeTodoDialog();
        }}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${heading}>
          <div class="dlg-head">
            <span>${heading}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeTodoDialog}>
              ✕
            </button>
          </div>
          <div class="dlg-cal">${this._todoLabel(d.entityId)}</div>
          <label class="fld">
            <span>${this._t("field_title")}</span>
            <input
              type="text"
              .value=${d.summary}
              ?disabled=${readOnly}
              autofocus
              @input=${(e: Event) =>
                this._todoDlgField("summary", (e.target as HTMLInputElement).value)}
            />
          </label>
          ${d.supportsDueDate
            ? html`<label class="fld">
                <span>${this._t("field_due")}</span>
                <input
                  type=${d.supportsDueDatetime ? "datetime-local" : "date"}
                  .value=${d.due}
                  ?disabled=${readOnly}
                  @input=${(e: Event) =>
                    this._todoDlgField("due", (e.target as HTMLInputElement).value)}
                />
              </label>`
            : nothing}
          ${d.supportsDescription
            ? html`<label class="fld">
                <span>${this._t("field_note")}</span>
                <textarea
                  rows="2"
                  .value=${d.description}
                  ?disabled=${readOnly}
                  @input=${(e: Event) =>
                    this._todoDlgField("description", (e.target as HTMLTextAreaElement).value)}
                ></textarea>
              </label>`
            : nothing}
          ${d.error ? html`<div class="dlg-error">${d.error}</div>` : nothing}
          <div class="dlg-actions">
            ${d.canUpdate
              ? html`<button class="ghost" ?disabled=${d.busy} @click=${this._completeTodoDialog}>
                  ${this._t("todo_complete")}
                </button>`
              : nothing}
            ${d.canDelete
              ? html`<button class="danger" ?disabled=${d.busy} @click=${this._deleteTodoDialog}>
                  ${this._t("delete")}
                </button>`
              : nothing}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${d.busy} @click=${this._closeTodoDialog}>
              ${this._t("cancel")}
            </button>
            ${!readOnly
              ? html`<button class="primary" ?disabled=${d.busy} @click=${this._saveTodoDialog}>
                  ${d.busy ? "…" : this._t("save")}
                </button>`
              : nothing}
          </div>
        </div>
      </div>
    `;
  }
  private _renderTodoBadgeDialog() {
    const d = this._todoBadgeDialog!;
    const name = this._personName(this._persons[d.personIdx], d.personIdx);
    const items = this._todoItemsForPerson(d.personIdx);
    return html`
      <div
        class="overlay"
        @click=${(e: MouseEvent) => {
          if (e.target === e.currentTarget) this._closeTodoBadgeDialog();
        }}
      >
        <div class="dialog todo-badge-dialog" role="dialog" aria-modal="true" aria-label=${name}>
          <div class="dlg-head">
            <span>${name} · ${items.length} ${this._t("todo_items")}</span>
            <button
              class="icon"
              aria-label=${this._t("close")}
              @click=${this._closeTodoBadgeDialog}
            >
              ✕
            </button>
          </div>
          <div class="todo-badge-list">
            ${items.map((item) => {
              const dueLabel = this._formatTodoDue(item.due);
              return html`
                <div
                  class="todo-badge-item"
                  role="button"
                  tabindex="0"
                  @click=${() => this._openTodoFromBadge(item)}
                  @keydown=${(k: KeyboardEvent) => {
                    if (k.key === "Enter" || k.key === " ") {
                      k.preventDefault();
                      this._openTodoFromBadge(item);
                    }
                  }}
                  title=${item.summary}
                >
                  ${this._renderTodoItemCheckbox(item)}
                  <span class="todo-badge-copy">
                    <span class="todo-badge-title">${item.summary}</span>
                    <span class="todo-badge-meta"
                      >${item.listLabel}${dueLabel ? ` · ${dueLabel}` : ""}</span
                    >
                  </span>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  }

  /* ---- styles (theme-aware) ------------------------------------ */
  static styles = css`
    :host {
      font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
      /* grid tokens — theme-aware, calm by default */
      --fb-hourline: var(--divider-color, #8884);
      --fb-halfhour: color-mix(in srgb, var(--divider-color, #8884) 45%, transparent);
      --fb-row-shade: color-mix(in srgb, var(--secondary-text-color, #888) 5%, transparent);
      /* customization tokens — override via theme or card-mod */
      --fb-accent: var(--primary-color);
      --fb-now-color: var(--error-color, #ff5252);
      --fb-radius: 7px;
      --fb-radius-sm: 5px;
      --fb-avatar-size: 34px;
      --fb-past-opacity: 0.5;
      --fb-title-size: 16px;
      --fb-name-size: 13px;
      --fb-event-size: 11.5px;
      --fb-time-size: 9.5px;
      --fb-chip-size: 10.5px;
    }
    ha-card {
      overflow: hidden;
      color: var(--primary-text-color);
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    /* one-switch compact density */
    :host([compact]) {
      --fb-title-size: 14px;
      --fb-name-size: 11.5px;
      --fb-event-size: 10.5px;
      --fb-time-size: 9px;
      --fb-chip-size: 9.5px;
      --fb-avatar-size: 26px;
      --fb-event-pad: 2px 5px;
      --fb-head-pad: 5px 4px;
      --fb-axis-width: 44px;
    }
    :host([compact]) .top,
    :host([compact]) .dayhead,
    :host([compact]) .weekhead {
      padding: 6px 10px;
    }
    :host([compact]) .tabs {
      margin: 4px 10px 0;
    }
    :host([compact]) .focus {
      padding: 5px 10px;
    }
    :host([compact]) .fchip {
      padding: 4px 8px;
    }
    /* "now / next" glance bar */
    .focus {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color);
      scrollbar-width: thin;
    }
    .fchip {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1 1 0;
      min-width: 160px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      padding: 6px 10px;
    }
    .fchip .avatar {
      flex: 0 0 auto;
    }
    .fbody {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.25;
    }
    .fname {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-weight: 600;
    }
    .fnow,
    .fnext,
    .ffree {
      font-size: 12.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .ffree {
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .fnow small,
    .fnext small {
      color: var(--secondary-text-color);
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .fdot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: 0 0 8px;
      animation: fb-pulse 2s ease-out infinite;
    }
    .title {
      font-weight: 600;
      font-size: var(--fb-title-size);
    }
    .switch,
    .tabs {
      display: inline-flex;
      gap: 2px;
      background: var(--secondary-background-color);
      border-radius: 9px;
      padding: 2px;
    }
    .switch button,
    .tabs button {
      border: none;
      cursor: pointer;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 5px 12px;
      border-radius: 999px;
      font: inherit;
      font-size: 13px;
      transition:
        background 0.12s ease,
        color 0.12s ease;
    }
    .switch button:hover:not(.on),
    .tabs button:hover:not(.on) {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .switch button.on,
    .tabs button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
      box-shadow: 0 1px 4px color-mix(in srgb, var(--primary-color) 45%, transparent);
    }
    .tabs button.today:not(.on) {
      box-shadow: inset 0 -2px 0 var(--fb-accent);
    }
    .tabs {
      margin: 8px 16px 0;
      flex-wrap: wrap;
    }
    .dayhead,
    .weekhead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--divider-color);
      flex-wrap: wrap;
    }
    .dayname {
      font-weight: 700;
      font-size: 15.5px;
      display: inline-flex;
      align-items: center;
    }
    .weeknav {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .nav,
    .nav-now {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 7px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      padding: 5px 10px;
    }
    .nav {
      font-size: 16px;
      line-height: 1;
      padding: 4px 9px;
    }
    .nav-now {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .banner {
      margin: 8px 16px 0;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12.5px;
      color: var(--text-primary-color, #fff);
      background: var(--error-color, #ff5252);
    }
    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-left: 8px;
      vertical-align: middle;
      border: 2px solid var(--divider-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: fb-spin 0.7s linear infinite;
    }
    @keyframes fb-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 2s;
      }
    }
    .empty {
      position: absolute;
      top: 0;
      left: var(--fb-axis-width, 56px);
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      font-size: 13px;
      pointer-events: none;
    }
    .board {
      max-height: var(--fb-board-max-height, 58vh);
      overflow: auto;
      margin-top: 8px;
    }
    /* keep header, all-day and body columns pixel-aligned: borders must not
       change box width, or the vertical dividers break between the rows. */
    .axis-spacer,
    .phead,
    .axis,
    .col,
    .todo-cell,
    .todo-axis,
    .allday-cell,
    .allday-label {
      box-sizing: border-box;
    }
    .header-row {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 7;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .axis-spacer {
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
      position: sticky;
      left: 0;
      background: inherit;
    }
    .phead {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      padding: var(--fb-head-pad, 10px 6px);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-left: 1px solid var(--divider-color);
      position: relative;
    }
    .allday-row {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--ha-card-background));
      position: sticky;
      top: calc(var(--fb-sticky-header-h, 0px) + var(--fb-sticky-todo-h, 0px));
      z-index: 5;
    }
    .todo-row {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--ha-card-background));
      position: sticky;
      top: var(--fb-sticky-header-h, 0px);
      z-index: 6;
    }
    .todo-axis {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
      font-size: 10px;
      font-weight: 700;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .todo-main {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .todo-shared {
      padding: 4px;
      border-left: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
    }
    .todo-grid {
      display: flex;
    }
    .todo-cell {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      border-left: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .shared-chip,
    .shared-band {
      border-radius: var(--fb-radius-sm);
      cursor: pointer;
    }
    .shared-chip {
      padding: 3px 8px;
      font-size: var(--fb-chip-size);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .allday-label {
      font-size: 10px;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
    }
    .allday-cell {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      border-left: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .allday-main {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .allday-shared {
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      border-left: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
    }
    .allday-grid {
      display: flex;
    }
    .allday-group {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .allday-group.separated {
      margin-top: 4px;
      padding-top: 4px;
      border-top: 1px dashed color-mix(in srgb, var(--divider-color) 80%, transparent);
    }
    .allday-group-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      padding-left: 2px;
    }
    .adchip {
      border-radius: var(--fb-radius-sm);
      padding: 2px 6px;
      font-size: var(--fb-chip-size);
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .adchip.shared {
      font-weight: 700;
    }
    .adchip.todo {
      background: color-mix(in srgb, var(--secondary-background-color) 86%, transparent) !important;
    }
    .adchip.todo.hint {
      opacity: 0.92;
    }
    .adchip.todo.hint .todo-label {
      color: var(--secondary-text-color);
    }
    .todo-line {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .todo-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .todo-check {
      flex: 0 0 auto;
      width: 14px;
      height: 14px;
      margin: 0;
      accent-color: var(--primary-color);
      cursor: pointer;
    }
    .todo-check:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .avatar {
      width: var(--fb-avatar-size);
      height: var(--fb-avatar-size);
      border-radius: 50%;
      background-size: cover;
      background-position: center;
    }
    .avatar.initials {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #11181f;
      font-weight: 700;
      font-size: 13px;
    }
    .pname {
      font-weight: 600;
      font-size: var(--fb-name-size);
    }
    .pstatus {
      font-size: 10.5px;
      color: var(--secondary-text-color);
    }
    .pmeta {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .body {
      display: flex;
      position: relative;
    }
    .axis {
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
      position: sticky;
      left: 0;
      background: var(--card-background-color, var(--ha-card-background));
      z-index: 4;
      border-right: 1px solid var(--divider-color);
    }
    .hour {
      position: absolute;
      right: 8px;
      transform: translateY(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    /* first hour label would be clipped by the header above */
    .hour:first-child {
      transform: none;
      margin-top: 1px;
    }
    .col {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      position: relative;
      border-left: 1px solid var(--divider-color);
    }
    .col.creatable {
      cursor: copy;
    }
    .event {
      position: absolute;
      border-radius: var(--fb-radius);
      padding: var(--fb-event-pad, 4px 7px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 3;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .event:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 5;
    }
    .event.todo,
    .tlbar.todo,
    .wchip.todo,
    .mchip.todo,
    .agenda-row.todo {
      box-shadow: none;
    }
    /* long "background" events (OGS, Freispiel …): faint full-width band behind
       the normal event blocks so short lessons keep the full column width. */
    .band {
      position: absolute;
      left: 2px;
      right: 2px;
      border-radius: var(--fb-radius);
      padding: 3px 7px;
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 2;
      display: flex;
      justify-content: flex-end; /* keep label clear of left-aligned event blocks */
      align-items: flex-start;
    }
    .band .etitle {
      max-width: 90%;
      font-weight: 600;
      font-size: 10px;
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 1px 8px;
    }
    .cicon {
      --mdc-icon-size: 13px;
      width: 13px;
      height: 13px;
      vertical-align: -2px;
      margin-right: 3px;
      opacity: 0.85;
    }
    .event.draggable {
      touch-action: none;
      cursor: grab;
    }
    .event.dragging {
      cursor: grabbing;
      z-index: 20;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
      opacity: 0.94;
      transition: none;
    }
    /* resize grabber at the bottom edge */
    .rz {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 9px;
      cursor: ns-resize;
      touch-action: none;
    }
    .rz::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 2px;
      width: 20px;
      height: 3px;
      transform: translateX(-50%);
      border-radius: 2px;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.12s ease;
    }
    .event.draggable:hover .rz::after {
      opacity: 0.4;
    }
    .event.tentative {
      opacity: 0.72;
      border-style: dashed;
      background-image: repeating-linear-gradient(
        135deg,
        transparent 0 6px,
        rgba(255, 255, 255, 0.06) 6px 12px
      );
    }
    .event.overflow {
      background: var(--secondary-background-color);
      border: 1px dashed var(--divider-color);
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      z-index: 7;
    }
    .event.overflow .etitle {
      font-weight: 700;
    }
    .shared-band {
      position: absolute;
      left: calc(var(--fb-axis-width, 56px) + 2px);
      right: 2px;
      z-index: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 8px;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 35%, transparent);
    }
    .shared-tag {
      flex: 0 0 auto;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--card-background-color, #fff) 88%, transparent);
      border-radius: 999px;
      padding: 1px 7px;
    }
    /* very short events (breaks etc.): thin single-line strip drawn on top so
       neighbours' min-height can't cover them */
    .event.slim {
      z-index: 4;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      padding: 0 5px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .event.slim .etitle {
      font-size: calc(var(--fb-event-size) - 1.5px);
      font-weight: 600;
    }
    .event.slim .etime,
    .event.slim .eprog {
      display: none;
    }
    .phead {
      cursor: pointer;
    }
    .phead.off,
    .col.off,
    .todo-cell.off,
    .allday-cell.off {
      flex: 0 0 48px;
      min-width: 48px;
    }
    .phead.off .avatar,
    .wphead.off .avatar,
    .tlrow.off .avatar {
      opacity: 0.35;
      filter: grayscale(0.8);
    }
    .wphead {
      cursor: pointer;
    }
    .wphead.off span {
      opacity: 0.4;
    }
    .tlperson {
      cursor: pointer;
    }
    .tlrow.off .pname,
    .tlrow.off .pstatus,
    .tlrow.off .ptodos {
      opacity: 0.4;
    }
    .pbadges {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 3px;
      margin-top: 2px;
    }
    .wphead .pbadges,
    .tlperson .pbadges {
      justify-content: flex-start;
    }
    .ptodos {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 3px;
      margin-top: 1px;
    }
    .ptodos.compact {
      justify-content: flex-start;
    }
    .ptodo {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      font-size: 10px;
      font-weight: 600;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--secondary-background-color) 82%, transparent);
      border-radius: 999px;
      padding: 1px 7px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ptodo-check,
    .ptodo-label {
      border: none;
      background: transparent;
      color: inherit;
      font: inherit;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }
    .ptodo-check {
      flex: 0 0 auto;
      width: 14px;
      text-align: center;
      color: var(--secondary-text-color);
      margin-right: 5px;
    }
    .ptodo-check:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .ptodo-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
    .ptodo.more {
      color: var(--secondary-text-color);
      cursor: default;
    }
    .pbadge {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 10px;
      font-weight: 600;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 1px 7px;
      cursor: pointer;
      white-space: nowrap;
    }
    .pbadge ha-icon {
      --mdc-icon-size: 12px;
      width: 12px;
      height: 12px;
      display: inline-flex;
      align-items: center;
    }
    .todo-badge {
      color: var(--primary-color);
    }
    @media (pointer: coarse) {
      .switch button,
      .tabs button {
        padding: 8px 14px;
      }
    }
    /* phones: tighter columns, smaller chrome, everything still scrollable */
    @media (max-width: 600px) {
      :host {
        --fb-col-min: 96px;
        --fb-avatar-size: 28px;
        --fb-axis-width: 42px;
        --fb-title-size: 14px;
        --fb-name-size: 11.5px;
        --fb-event-size: 10.5px;
        --fb-chip-size: 10px;
      }
      .top {
        flex-wrap: wrap;
        gap: 6px;
      }
      .phead {
        padding: 6px 4px;
        gap: 2px;
      }
      .hour {
        font-size: 9.5px;
        right: 4px;
      }
      .weeknav {
        gap: 4px;
      }
      .band .etitle {
        font-size: 9px;
        padding: 1px 6px;
      }
      .pbadge {
        font-size: 9px;
        padding: 1px 5px;
      }
    }
    .wchip,
    .adchip,
    .mchip {
      transition: box-shadow 0.12s ease;
    }
    .wchip:hover,
    .adchip:hover,
    .mchip:hover {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }
    .agenda-row {
      transition: background 0.12s ease;
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .wchip.tentative,
    .mchip.tentative,
    .adchip.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .agenda-row.tentative .agenda-bar {
      opacity: 0.55;
    }
    .agenda-row.tentative .agenda-title {
      font-style: italic;
    }
    .etitle {
      font-size: var(--fb-event-size);
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .etime {
      font-size: var(--fb-time-size);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .nowline {
      position: absolute;
      left: var(--fb-axis-width, 56px);
      right: 0;
      border-top: 2px solid var(--fb-now-color);
      z-index: 7;
      pointer-events: none;
    }
    .nowline::after {
      content: "";
      position: absolute;
      left: -3px;
      top: -5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--fb-now-color);
      animation: fb-pulse 2s ease-out infinite;
    }
    @keyframes fb-pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--fb-now-color) 40%, transparent);
      }
      50% {
        box-shadow: 0 0 0 7px transparent;
      }
    }
    @keyframes fb-fade {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    .board,
    .weekwrap,
    .agenda,
    .monthgrid {
      animation: fb-fade 0.18s ease;
    }
    .board::-webkit-scrollbar,
    .weekwrap::-webkit-scrollbar,
    .agenda::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .board::-webkit-scrollbar-thumb,
    .weekwrap::-webkit-scrollbar-thumb,
    .agenda::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 8px;
    }
    @media (prefers-reduced-motion: reduce) {
      .board,
      .weekwrap,
      .agenda,
      .monthgrid,
      .nowline::after,
      .event {
        animation: none !important;
        transition: none !important;
      }
    }
    .nowline span {
      position: absolute;
      left: -50px;
      top: -8px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* timeline (horizontal) */
    .tlwrap {
      overflow: auto;
      max-height: var(--fb-board-max-height, 58vh);
      margin-top: 8px;
      animation: fb-fade 0.18s ease;
    }
    .tlgrid {
      position: relative;
    }
    .tlhead {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      height: 26px;
    }
    .tlcorner {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      background: inherit;
      z-index: 2;
    }
    .tlhours {
      position: relative;
    }
    .tlhour {
      position: absolute;
      top: 5px;
      transform: translateX(-50%);
      font-size: 10.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .tlrow {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
    }
    .tlperson {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      box-sizing: border-box;
      border-right: 1px solid var(--divider-color);
    }
    .tlperson .pname {
      font-size: 12.5px;
    }
    .tlcanvas {
      position: relative;
      flex: 0 0 auto;
    }
    .tlcanvas.creatable {
      cursor: copy;
    }
    .tlbar {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 7px;
      border-radius: var(--fb-radius);
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .tlbar:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 3;
    }
    .tlbar.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .tlbar.shared {
      z-index: 2;
    }
    .tlbar .etime {
      flex: 0 0 auto;
    }
    .tlnow {
      position: absolute;
      top: 0;
      bottom: 0;
      border-left: 2px solid var(--fb-now-color);
      z-index: 6;
      pointer-events: none;
    }
    .tlnow span {
      position: absolute;
      top: 2px;
      left: -1px;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* agenda */
    .agenda {
      max-height: 60vh;
      overflow: auto;
      padding: 4px 0 8px;
    }
    .agenda-empty {
      padding: 28px 16px;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .agenda-day {
      padding: 0 12px;
    }
    .agenda-date {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
      font-weight: 600;
      font-size: 13px;
      padding: 8px 4px 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-date.today {
      color: var(--primary-color);
    }
    .agenda-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      cursor: pointer;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .agenda-row.shared {
      background: color-mix(in srgb, var(--fb-accent) 4%, transparent);
    }
    .agenda-time {
      flex: 0 0 92px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .agenda-bar {
      flex: 0 0 4px;
      align-self: stretch;
      border-radius: 2px;
    }
    .agenda-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .agenda-title {
      font-size: 13.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .agenda-meta {
      font-size: 11px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* month */
    .monthwrap {
      overflow: auto;
      max-height: 62vh;
      padding: 0 8px 8px;
    }
    .monthhead {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
    }
    .mhcell {
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .monthgrid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(64px, 1fr);
    }
    .mcell {
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 3px;
      cursor: pointer;
      overflow: hidden;
      box-sizing: border-box;
    }
    .mcell:nth-child(7n) {
      border-right: none;
    }
    .mcell.out {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 4%, transparent);
    }
    .mcell.out .mdate {
      opacity: 0.45;
    }
    .mcell:hover {
      background: var(--secondary-background-color);
    }
    .mcell.today {
      background: color-mix(in srgb, var(--fb-accent) 7%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--fb-accent);
    }
    .mcell.wkend:not(.today) {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 3.5%, transparent);
    }
    .mdate {
      font-size: 12px;
      font-weight: 600;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-variant-numeric: tabular-nums;
    }
    .mdate.today {
      background: var(--fb-accent);
      color: var(--text-primary-color, #fff);
      border-radius: 50%;
    }
    .mchips {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 2px;
    }
    .mchip {
      font-size: 10px;
      font-weight: 600;
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mchip.shared {
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--fb-accent) 25%, transparent);
    }
    .mmore {
      font-size: 9.5px;
      color: var(--secondary-text-color);
      padding-left: 4px;
    }
    /* weather chip */
    .wx {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      vertical-align: middle;
      font-variant-numeric: tabular-nums;
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 2px 9px 2px 5px;
      margin-left: 6px;
    }
    .wx ha-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-text-color);
    }
    .agenda-date .wx {
      margin-left: 4px;
    }
    /* faded past events + map link */
    .past {
      opacity: var(--fb-past-opacity);
    }
    /* progress bar inside a running day event */
    .eprog {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      background: var(--divider-color);
    }
    .eprog > div {
      height: 100%;
      background: var(--fb-now-color);
    }
    /* agenda: countdown + running progress */
    .agenda-cd {
      flex: 0 0 auto;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .agenda-row.current {
      background: color-mix(in srgb, var(--fb-accent) 6%, transparent);
    }
    .agenda-prog {
      display: block;
      height: 3px;
      margin-top: 4px;
      border-radius: 2px;
      background: var(--divider-color);
      overflow: hidden;
    }
    .agenda-prog > span {
      display: block;
      height: 100%;
    }
    .maplink {
      margin-left: 8px;
      font-size: 11px;
      color: var(--primary-color);
      text-decoration: none;
    }
    .maplink:hover {
      text-decoration: underline;
    }
    /* week */
    .weekwrap {
      overflow: auto;
      max-height: 60vh;
    }
    .weekgrid {
      display: grid;
    }
    .corner {
      position: sticky;
      left: 0;
      top: 0;
      z-index: 6;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .wphead {
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      border-left: 1px solid var(--divider-color);
      padding: 8px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .wphead .pmeta {
      align-items: center;
    }
    .wphead .avatar {
      width: 28px;
      height: 28px;
    }
    .wday {
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 12.5px;
    }
    .wcell {
      min-height: 70px;
      border-left: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .wcell.creatable {
      cursor: copy;
    }
    .wshared,
    .wspacer {
      border-left: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      background: color-mix(in srgb, var(--fb-accent) 4%, transparent);
    }
    .wshared {
      grid-column: 2 / -1;
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .wspacer {
      position: sticky;
      left: 0;
      z-index: 3;
      background: var(--card-background-color, var(--ha-card-background));
      border-right: 1px solid var(--divider-color);
    }
    .wshared.today,
    .wspacer.today {
      background: color-mix(in srgb, var(--fb-accent) 8%, transparent);
    }
    .wday.today,
    .wcell.today {
      background: color-mix(in srgb, var(--fb-accent) 8%, transparent);
    }
    .wchip {
      border-radius: var(--fb-radius-sm);
      padding: 3px 5px;
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      cursor: pointer;
    }
    .wchip span {
      font-size: var(--fb-chip-size);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wchip small {
      margin-left: auto;
      font-size: 8.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .wshared-chip {
      border-radius: var(--fb-radius-sm);
      padding: 3px 5px;
      display: flex;
      align-items: center;
      gap: 5px;
      overflow: hidden;
      cursor: pointer;
    }
    .wshared-chip span {
      font-size: var(--fb-chip-size);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wshared-chip small {
      margin-left: auto;
      font-size: 8.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    /* focus visibility for a11y */
    button:focus-visible,
    .event:focus-visible,
    .wchip:focus-visible,
    .adchip:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    /* dialog */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99;
      padding: 16px;
    }
    .dialog {
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
      border-radius: 14px;
      padding: 16px;
      width: 100%;
      max-width: 420px;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
    }
    .todo-badge-dialog {
      max-width: 360px;
      padding: 14px;
    }
    .dlg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 16px;
    }
    .todo-badge-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
    }
    .todo-badge-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 10px 12px;
      background: var(--secondary-background-color);
      cursor: pointer;
      text-align: left;
    }
    .todo-badge-item:hover {
      border-color: color-mix(in srgb, var(--primary-color) 45%, var(--divider-color));
    }
    .todo-badge-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .todo-badge-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .todo-badge-meta {
      font-size: 11px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dlg-cal {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 2px 0 10px;
    }
    .icon {
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 16px;
    }
    .fld {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-bottom: 10px;
    }
    .fld > span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .row {
      display: flex;
      gap: 10px;
    }
    .row .fld {
      flex: 1;
    }
    input,
    textarea,
    select {
      font: inherit;
      font-size: 14px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
      width: 100%;
    }
    input:disabled,
    textarea:disabled {
      opacity: 0.7;
    }
    .recur {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 12px;
      margin-bottom: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--secondary-background-color);
    }
    .recur-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      width: 100%;
    }
    .recur-opt {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .recur-opt input {
      width: auto;
    }
    .chk {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 13px;
    }
    .chk input {
      width: auto;
    }
    .ro-note {
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 8px 10px;
      margin-bottom: 10px;
    }
    .dlg-error {
      font-size: 12.5px;
      color: var(--error-color, #ff5252);
      margin-bottom: 10px;
    }
    .dlg-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }
    .dlg-actions .spacer {
      flex: 1;
    }
    .dlg-actions button {
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .ghost {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .danger {
      background: var(--error-color, #ff5252);
      color: #fff;
    }
    button:disabled {
      opacity: 0.6;
      cursor: default;
    }
  `;
}

if (!customElements.get("family-board-card")) {
  customElements.define("family-board-card", FamilyBoardCard);
}

// register in the card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "family-board-card",
  name: "Family Board Card",
  description:
    "Family calendar / who-is-where board for multiple people \u2013 day, timeline, week, month and agenda views.",
  preview: true,
  documentationURL: "https://github.com/renespeaker/ha-family-board-card",
});

console.info(
  "%c FAMILY-BOARD-CARD %c v0.26.0 ",
  "background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px",
  "background:#222;color:#fff;border-radius:0 3px 3px 0",
);
