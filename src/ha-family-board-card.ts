import "./paperless-pay-card";
import { html, nothing } from "lit";
import type { HomeAssistant, LovelaceCard, LovelaceCardEditor } from "custom-card-helpers";
import {
  DAY_MS,
  dragTimes,
  layoutDayColumns,
  parseRawEvent,
  plannerRange,
  splitIntoSegments,
} from "./events";
import type { BoardEvent, LaidOutEvent, RawEvent } from "./events";
import { formatMinutes, formatTime, localize } from "./localize";
import {
  COUNTDOWN_MARKER,
  addressCandidates,
  distanceKm,
  isOnlineLocation,
  leaveInfo,
  parseLatLon,
  stripMarker,
} from "./extras";
import type { LatLon, LeaveInfo } from "./extras";
import { ALL_VIEWS, PLANNER_DAYS_DEFAULT } from "./board/types";
import type {
  CountdownConfig,
  CountdownItem,
  DialogState,
  FamilyBoardConfig,
  NormalizedSharedGroup,
  NoticeConfig,
  Overflow,
  PersonConfig,
  PersonTodoItem,
  TodoBadgeDialogState,
  TodoDialogState,
  TodoItem,
  TravelEntry,
  ViewName,
} from "./board/types";
import {
  DEFAULT_HOUR_HEIGHT,
  FEAT_CREATE,
  FEAT_DELETE,
  FEAT_UPDATE,
  HAS_EMOJI,
  HOUR_HEIGHT_MAX,
  HOUR_HEIGHT_MIN,
  ICON_MAP,
  SHARED_PERSON_IDX,
  TODO_FEAT_DESCRIPTION,
  TODO_FEAT_DUE_DATE,
  TODO_FEAT_DUE_DATETIME,
  WEATHER_ICON,
  autoDetectPersons,
  hashColor,
  lastActivity,
  markActivity,
  personColor,
  startOfDay,
  toLocalDate,
  toLocalInput,
  watchActivity,
} from "./board/utils";
import {
  backButton,
  renderClockHeader,
  renderExtras,
  renderFab,
  renderFocus,
  viewSwitch,
} from "./board/views/header";
import { renderDay } from "./board/views/day";
import { renderTimeline } from "./board/views/timeline";
import { renderWeek } from "./board/views/week";
import { renderMonth } from "./board/views/month";
import { renderAgenda } from "./board/views/agenda";
import { renderPlanner } from "./board/views/planner";
import { renderDialog, renderTodoBadgeDialog, renderTodoDialog } from "./board/views/dialogs";
import { property, state } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { LitElement } from "lit";
import { boardStyles } from "./board/styles";
import type { DayWeather, MorningWindow } from "./morning";
import type { MorningCheckConfig } from "./board/types";

export { autoDetectPersons } from "./board/utils";
export type {
  FamilyBoardConfig,
  SharedCalendarGroupConfig,
  SharedTodoGroupConfig,
  CountdownConfig,
  TravelConfig,
  NoticeConfig,
} from "./board/types";

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
export class FamilyBoardCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() _config!: FamilyBoardConfig;
  @state() _events: BoardEvent[] = [];
  @state() _view: ViewName = "day";
  @state() _day: number = (new Date().getDay() + 6) % 7;
  @state() _weekOffset = 0;
  @state() _monthOffset = 0;
  @state() _planOffset = 0; // planner view: pages of `planner_days` from today
  @state() _dialog?: DialogState;
  @state() _todoDialog?: TodoDialogState;
  @state() _todoBadgeDialog?: TodoBadgeDialogState;
  @state() _loadError = false;
  @state() _loading = false;
  @state() _todoBusy: string[] = [];
  @state() _todoItemsByOwner: Record<string, PersonTodoItem[]> = {};
  @state() _fitPx = 0;
  @state() _hiddenP: number[] = []; // temporarily hidden persons (header click) // measured px/min when fit_height is on (0 = not measured)
  @state() _drag?: {
    raw: RawEvent;
    mode: "move" | "resize";
    deltaMin: number;
    moved: boolean;
    busy: boolean;
  };

  _dragStartY = 0;
  _dragPx = 1;
  _dragGrid = 30;
  _suppressClick = false;
  _raw: RawEvent[] = [];
  _fetchedKey = "";
  _timer?: number;
  _tick?: number;
  @state() _forecast: Record<string, DayWeather> = {};
  _weatherKey = "";
  @state() _countdowns: CountdownItem[] = [];
  _countdownKey = "";
  _travel = new Map<string, TravelEntry>();
  @state() _travelRev = 0;
  _travelBusy = false;
  @state() _noticeDone: Record<string, { state: string; at: number }> = {};
  _scrolledKey = "";
  _restoreFocus?: HTMLElement;
  _ro?: ResizeObserver;

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
  get _enabledViews(): ViewName[] {
    const v = this._config?.views;
    // configured order wins (e.g. planner first on a wall tablet); unknown names are dropped
    const chosen = Array.isArray(v)
      ? v.filter((x, i): x is ViewName => ALL_VIEWS.includes(x) && v.indexOf(x) === i)
      : [];
    return chosen.length ? chosen : [...ALL_VIEWS];
  }

  /** JS weekday (0=Sun..6=Sat) of the configured week start. */
  get _firstDayJs(): number {
    return this._config?.first_day === "sunday" ? 0 : 1;
  }
  /** Column index (0..6 from week start) of the real today. */
  _todayIndex(): number {
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
    watchActivity();
    // minute tick so countdowns, progress bars and the header clock stay live when idle
    this._scheduleTick();
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
    this._stopTimer();
    if (this._tick) {
      clearTimeout(this._tick);
      this._tick = undefined;
    }
    this._ro?.disconnect();
    this._ro = undefined;
    window.removeEventListener("pointermove", this._onDragMove);
    window.removeEventListener("pointerup", this._onDragUp);
  }

  /** Re-render right after every full minute (a plain 60 s interval drifts off the clock). */
  _scheduleTick(): void {
    if (this._tick) clearTimeout(this._tick);
    const now = new Date();
    const wait = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50;
    this._tick = window.setTimeout(() => {
      this._kioskReturn();
      this.requestUpdate();
      this._updateTravel();
      this._scheduleTick();
    }, wait);
  }

  get _progressOn(): boolean {
    return this._config?.show_progress !== false;
  }
  /** Whether an event is happening right now. */
  _isCurrent(e: BoardEvent): boolean {
    const n = Date.now();
    return e.ref.start.getTime() <= n && n < e.ref.end.getTime();
  }
  /** Elapsed percentage (0–100) of a currently running event. */
  _progressPct(e: BoardEvent): number {
    const s = e.ref.start.getTime();
    const en = e.ref.end.getTime();
    if (en <= s) return 0;
    return Math.min(100, Math.max(0, ((Date.now() - s) / (en - s)) * 100));
  }

  /** Kiosk mode: after `auto_return` minutes without touch, go back to the default view. */
  _kioskReturn(): void {
    this._kioskBack();
    const min = Number(this._config?.auto_return ?? 0);
    if (!Number.isFinite(min) || min <= 0) return;
    if (Date.now() - lastActivity < min * 60000) return;
    if (this._dialog || this._todoDialog || this._todoBadgeDialog) return; // never yank an open dialog away
    const wanted = this._config.view ?? "day";
    const view = this._enabledViews.includes(wanted) ? wanted : this._enabledViews[0];
    if (this._view !== view) this._view = view;
    if (this._weekOffset !== 0) this._weekOffset = 0;
    if (this._monthOffset !== 0) this._monthOffset = 0;
    if (this._planOffset !== 0) this._planOffset = 0;
    if (this._hiddenP.length) this._hiddenP = [];
    this._day = this._todayIndex();
  }

  /** Kiosk: after `auto_back` idle minutes leave for `back_path` (e.g. the tablet home screen). */
  _kioskBack(): void {
    const min = Number(this._config?.auto_back ?? 0);
    const path = this._config?.back_path;
    if (!path || !Number.isFinite(min) || min <= 0) return;
    if (Date.now() - lastActivity < min * 60000) return;
    if (this._dialog || this._todoDialog || this._todoBadgeDialog) return;
    if (document.visibilityState === "hidden" || !this.isConnected) return;
    // never leave the dashboard editor (card preview / edit mode)
    const host = this as unknown as { preview?: boolean; editMode?: boolean };
    if (host.preview || host.editMode || location.search.includes("edit=1")) return;
    if (location.pathname === path.split("?")[0]) return;
    markActivity();
    this._navigateBack();
  }

  /** Refresh when the tab/tablet becomes visible again. */
  _onVisible = (): void => {
    if (document.visibilityState !== "hidden" && this.hass && this._config) this._refetch();
  };

  _onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && (this._dialog || this._todoDialog || this._todoBadgeDialog)) {
      e.stopPropagation();
      if (this._dialog) this._closeDialog();
      else if (this._todoDialog) this._closeTodoDialog();
      else this._closeTodoBadgeDialog();
    }
  };

  _startTimer(): void {
    this._stopTimer();
    const s = this._config?.refresh_interval ?? 300;
    if (s > 0) this._timer = window.setInterval(() => this._refetch(), s * 1000);
  }
  _stopTimer(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  protected updated(changed: PropertyValues): void {
    const navChanged = ["_view", "_weekOffset", "_monthOffset", "_planOffset"].some((k) =>
      changed.has(k as keyof FamilyBoardCard),
    );
    if (
      (changed.has("hass") || changed.has("_config") || navChanged) &&
      this.hass &&
      this._config
    ) {
      this._maybeFetch();
      this._maybeFetchWeather();
      this._maybeFetchCountdowns();
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
  _syncStickyRows(): void {
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
  _measureFit(): void {
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
  _applyFullHeight(): void {
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
  _maybeScrollToNow(): void {
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
  _manageOverlayFocus(prevOpen: boolean): void {
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
  _weekBounds(): { monday: Date; nextMonday: Date } {
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
  _monthGrid(): { gridStart: Date; weeks: number; month: number; year: number } {
    const base = new Date();
    const target = new Date(base.getFullYear(), base.getMonth() + this._monthOffset, 1);
    const offset = (target.getDay() - this._firstDayJs + 7) % 7;
    const gridStart = startOfDay(new Date(target.getFullYear(), target.getMonth(), 1 - offset));
    const daysInMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    const weeks = Math.ceil((offset + daysInMonth) / 7);
    return { gridStart, weeks, month: target.getMonth(), year: target.getFullYear() };
  }

  /** Fetch window for the current view. */
  _fetchRange(): { start: Date; end: Date } {
    if (this._view === "planner") return this._plannerWindow();
    if (this._view === "month") {
      const { gridStart, weeks } = this._monthGrid();
      return { start: gridStart, end: new Date(gridStart.getTime() + weeks * 7 * DAY_MS) };
    }
    const { monday, nextMonday } = this._weekBounds();
    return { start: monday, end: nextMonday };
  }

  async _maybeFetch(): Promise<void> {
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
    const scope =
      this._view === "month"
        ? `m${this._monthOffset}`
        : this._view === "planner"
          ? `p${this._planOffset}:${this._plannerDays}:${toLocalDate(new Date())}`
          : `w${this._weekOffset}`;
    const key = `${scope}|${cals}|${shared}|${sharedTodos}|${todos}|${todoState}`;
    if (key === this._fetchedKey) return;
    this._fetchedKey = key;
    await this._fetchEvents();
  }

  /** Force a refresh on next update (e.g. after a mutation or timer). */
  async _refetch(): Promise<void> {
    this._fetchedKey = "";
    await this._maybeFetch();
  }

  /** Fetch the daily forecast for the configured weather entity (once/day). */
  async _maybeFetchWeather(): Promise<void> {
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
      const map: Record<string, DayWeather> = {};
      for (const f of list) {
        if (!f?.datetime) continue;
        map[toLocalDate(new Date(f.datetime))] = {
          temp: Math.round(f.temperature),
          low: Number.isFinite(Number(f.templow)) ? Math.round(Number(f.templow)) : undefined,
          condition: f.condition,
          rain: Number.isFinite(Number(f.precipitation_probability))
            ? Number(f.precipitation_probability)
            : undefined,
        };
      }
      this._forecast = map;
    } catch (e) {
      this._forecast = {};
    }
  }

  /** Small weather chip (icon + temperature) for a given date, or nothing. */
  _weatherChip(date: Date) {
    const f = this._forecast[toLocalDate(date)];
    if (!f) return nothing;
    const icon = WEATHER_ICON[f.condition] || "weather-cloudy";
    const unit = (this.hass.config as any)?.unit_system?.temperature ?? "°";
    return html`<span class="wx" title=${f.condition}>
      <ha-icon icon="mdi:${icon}"></ha-icon>${f.temp}${unit}
    </span>`;
  }

  /** Whether an event title matches a configured hide pattern (case-insensitive). */
  _hidden(summary: string): boolean {
    const pats = this._config.hide_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return false;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  /** Allow-list: when set, only events whose title matches a pattern are shown. */
  _allowed(summary: string): boolean {
    const pats = this._config.show_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return true;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  /** Clean up titles via replace_patterns entries: "search => replacement". */
  _cleanTitle(summary: string): string {
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
  _matchesTentative(summary: string): boolean {
    const pats = this._config.tentative_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return false;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  async _fetchEvents(): Promise<void> {
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
                  group.label ||
                  (group.ids.length === 1 ? this._todoLabel(group.ids[0]) : undefined);
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
    this._updateTravel();
    // Week views index events by weekday; month and planner build their own grid from _raw.
    const { monday } = this._weekBounds();
    this._events =
      this._view === "month" || this._view === "planner"
        ? []
        : cleaned.flatMap((r) => splitIntoSegments(r, monday));
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
  _calsOf(p: PersonConfig): string[] {
    if (Array.isArray(p.calendar)) return p.calendar.filter(Boolean);
    return p.calendar ? [p.calendar] : [];
  }
  /** A person's todo lists, normalized to a (possibly empty) array. */
  _todosOf(p: PersonConfig): string[] {
    if (Array.isArray(p.todo)) return p.todo.filter(Boolean);
    return p.todo ? [p.todo] : [];
  }
  /** Calendars of a person that allow creating events. */
  _writableCals(p: PersonConfig): string[] {
    return this._calsOf(p).filter((c) => this._canCreate(c));
  }
  /** Whether the person's add (+) affordance should be shown. */
  _personCanCreate(p: PersonConfig): boolean {
    return this._writableCals(p).length > 0;
  }
  _calFeatures(entity?: string): number {
    if (!entity) return 0;
    const st = this.hass.states[entity];
    return Number(st?.attributes?.supported_features ?? 0);
  }
  _canCreate(entity?: string) {
    return (this._calFeatures(entity) & FEAT_CREATE) !== 0;
  }
  _canUpdate(entity?: string) {
    return (this._calFeatures(entity) & FEAT_UPDATE) !== 0;
  }
  _canDelete(entity?: string) {
    return (this._calFeatures(entity) & FEAT_DELETE) !== 0;
  }
  _todoFeatures(entity?: string): number {
    if (!entity) return 0;
    const st = this.hass.states[entity];
    return Number(st?.attributes?.supported_features ?? 0);
  }
  _canUpdateTodo(entity?: string) {
    return (this._todoFeatures(entity) & FEAT_UPDATE) !== 0;
  }
  _canDeleteTodo(entity?: string) {
    return (this._todoFeatures(entity) & FEAT_DELETE) !== 0;
  }
  _allPersonIdxs(): number[] {
    return this._persons.map((_, idx) => idx);
  }
  _personRef(p: PersonConfig, idx: number): string {
    if (p.person) return p.person;
    if (p.name) return `name:${p.name}`;
    return `slot:${idx}`;
  }
  _resolvePersonRefs(refs?: string[]): number[] {
    if (!Array.isArray(refs) || refs.length === 0) return this._allPersonIdxs();
    const resolved: number[] = [];
    this._persons.forEach((p, idx) => {
      const candidates = [
        this._personRef(p, idx),
        p.person,
        p.name ? `name:${p.name}` : "",
        String(idx),
      ].filter((x): x is string => !!x);
      if (refs.some((ref) => candidates.includes(ref)) && !resolved.includes(idx))
        resolved.push(idx);
    });
    return resolved;
  }
  _normalizeSharedGroups(
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
  _sharedCals(): string[] {
    const val = this._config.shared_calendar;
    if (Array.isArray(val)) return val.filter(Boolean);
    return val ? [val] : [];
  }
  _sharedCalendarGroups(): NormalizedSharedGroup[] {
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
        ids: Array.isArray(g.calendars)
          ? g.calendars.filter(Boolean)
          : g.calendars
            ? [g.calendars]
            : [],
        persons: g.persons,
        label: g.label,
      })),
      Array.from(duplicateSource, ([id, owners]) => ({ id, owners })),
    );
  }
  _sharedTodos(): string[] {
    const val = this._config.shared_todo;
    if (Array.isArray(val)) return val.filter(Boolean);
    return val ? [val] : [];
  }
  _sharedTodoGroups(): NormalizedSharedGroup[] {
    const cfgGroups = Array.isArray(this._config.shared_todo_groups)
      ? this._config.shared_todo_groups
      : [];
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
  _sharedCalendarIds(): string[] {
    return Array.from(new Set(this._sharedCalendarGroups().flatMap((g) => g.ids)));
  }
  _sharedTodoIds(): string[] {
    return Array.from(new Set(this._sharedTodoGroups().flatMap((g) => g.ids)));
  }
  _sharedGroupFor(groups: NormalizedSharedGroup[], id: string): NormalizedSharedGroup | undefined {
    return groups.find((g) => g.ids.includes(id));
  }
  _isShared(entry: { personIdx: number; shared?: boolean }): boolean {
    return entry.shared === true || entry.personIdx === SHARED_PERSON_IDX;
  }
  _sharedPersons(entry: { ref: RawEvent }): number[] {
    return entry.ref.shared_person_idxs?.length
      ? entry.ref.shared_person_idxs
      : this._allPersonIdxs();
  }
  _sharedLabel(entry?: { ref: RawEvent }): string {
    const label = entry?.ref.shared_label?.trim();
    if (label) return label;
    const shared = this._sharedCalendarIds();
    return shared.length === 1 ? this._calLabel(shared[0]) : this._t("shared_events");
  }
  _sharedRange(
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
  _sharedGridStyle(
    entry: { ref: RawEvent },
    visibleIdxs: number[] = this._allPersonIdxs(),
  ): string {
    const range = this._sharedRange(entry, visibleIdxs);
    if (!range) return "display:none";
    return `grid-column:${range.start + 1} / span ${range.span}`;
  }
  _sharedBandStyle(e: LaidOutEvent, px: number, startMin: number): string | null {
    const range = this._sharedRange(e);
    if (!range) return null;
    const { top, height: bandHeight } = this._sharedBandBox(e, px, startMin);
    const leftPct = (range.start / this._persons.length) * 100;
    const widthPct = (range.span / this._persons.length) * 100;
    return `top:${top + 1.5}px;height:${bandHeight}px;left:calc(var(--fb-axis-width, 56px) + ${leftPct}% + 2px);width:calc(${widthPct}% - 4px)`;
  }

  /* ---- helpers ------------------------------------------------- */
  get _persons(): PersonConfig[] {
    return this._config.persons;
  }
  get _grid(): number {
    return this._config.time_grid ?? 30;
  }
  /** Pixels per minute, derived from the configurable hour height (or fit mode). */
  get _pxPerMin(): number {
    if (this._config.fit_height && this._fitPx > 0) return this._fitPx;
    const h = Math.min(
      HOUR_HEIGHT_MAX,
      Math.max(HOUR_HEIGHT_MIN, this._config.hour_height ?? DEFAULT_HOUR_HEIGHT),
    );
    return h / 60;
  }
  get _startMin(): number {
    return (this._config.start_hour ?? 6) * 60;
  }
  get _endMin(): number {
    return (this._config.end_hour ?? 22) * 60;
  }
  /**
   * Visible minute window of the day view. With `trim_hours` (default on) the
   * configured start/end window is shrunk to the hours that actually contain
   * events, so the occupied part of the day gets the full height instead of
   * being squeezed by empty morning/evening hours.
   */
  _dayWindow(day: number): { startMin: number; endMin: number } {
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
  _jsDay(index: number): number {
    return (this._firstDayJs + index) % 7;
  }
  get _visibleDays(): number[] {
    const all = [0, 1, 2, 3, 4, 5, 6];
    if (this._config.show_weekends === false) {
      return all.filter((i) => {
        const js = this._jsDay(i);
        return js !== 0 && js !== 6; // hide Sat/Sun wherever they fall
      });
    }
    return all;
  }
  _t(key: string): string {
    return localize(this.hass, key);
  }
  /** Optional per-calendar color/label from the `calendars:` mapping. */
  _calMeta(entity?: string): {
    color?: string;
    label?: string;
    icon?: string;
    title_field?: string;
  } {
    return (entity && this._config.calendars?.[entity]) || {};
  }
  /** Link for a location, honouring the configurable `map_url` template. */
  _mapUrl(location: string): string {
    const tpl = this._config.map_url;
    const q = encodeURIComponent(location);
    if (typeof tpl === "string" && tpl.includes("{location}")) return tpl.replace("{location}", q);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }
  /** Optional mdi icon configured for a calendar. */
  _calIcon(entity?: string): string | undefined {
    return this._calMeta(entity).icon;
  }
  /** Small inline icon element for an event's calendar (or nothing). */
  _calIconEl(e: BoardEvent) {
    if (e.ref.kind === "todo") return nothing;
    const icon = this._calIcon(e.ref.calendar);
    return icon ? html`<ha-icon class="cicon" .icon=${icon}></ha-icon>` : nothing;
  }
  /** Display name of a calendar entity: mapping label > friendly name > id. */
  _calLabel(entity: string): string {
    return (
      this._calMeta(entity).label ??
      ((this.hass.states[entity]?.attributes?.friendly_name as string | undefined) || entity)
    );
  }
  /** Color for an event respecting the color_by option. */
  _eventColor(e: BoardEvent): string {
    if (e.ref.kind === "todo") return e.color;
    const by = this._config.color_by;
    if (by === "location" && e.location) return hashColor(e.location);
    if (by === "calendar" && e.ref.calendar)
      return this._calMeta(e.ref.calendar).color ?? hashColor(e.ref.calendar);
    return e.color;
  }
  /** Whether an event has already ended (for dimming). */
  _isPast(e: BoardEvent): boolean {
    return this._config.dim_past !== false && e.ref.end.getTime() <= Date.now();
  }
  _sharedFor(day: number): BoardEvent[] {
    return this._events
      .filter((e) => e.day === day && this._isShared(e))
      .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin);
  }
  _todoAnchorDates(rangeStart: Date, rangeEnd: Date): Date[] {
    const dates: Date[] = [];
    const cursor = startOfDay(rangeStart);
    while (cursor.getTime() < rangeEnd.getTime()) {
      dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates.length > 0 ? dates : [startOfDay(rangeStart)];
  }
  _todoToRawEvent(
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
  _isTodo(e: { ref: RawEvent }): boolean {
    return e.ref.kind === "todo";
  }
  _sharedAllDay(day: number): BoardEvent[] {
    return this._sharedFor(day).filter((e) => e.allDay);
  }
  _sharedTimed(day: number): LaidOutEvent[] {
    return layoutDayColumns(this._sharedFor(day).filter((e) => !e.allDay));
  }
  _sharedBandBox(e: LaidOutEvent, px: number, startMin: number): { top: number; height: number } {
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
  _relativeDay(date: Date): string | null {
    const diff = Math.round(
      (startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / DAY_MS,
    );
    if (diff === 0) return this._t("today");
    if (diff === 1) return this._t("tomorrow");
    if (diff === -1) return this._t("yesterday");
    return null;
  }
  /** Person temporarily hidden via header click (legend-style toggle). */
  _isOff(idx: number): boolean {
    return this._hiddenP.includes(idx);
  }
  _togglePerson(idx: number): void {
    this._hiddenP = this._isOff(idx)
      ? this._hiddenP.filter((i) => i !== idx)
      : [...this._hiddenP, idx];
  }
  _timedFor(day: number, idx: number): LaidOutEvent[] {
    if (this._isOff(idx)) return [];
    const evs = this._events.filter(
      (e) => e.day === day && e.personIdx === idx && !e.allDay && !this._isBackground(e),
    );
    return layoutDayColumns(evs);
  }
  /** Threshold (minutes) at/above which a timed event becomes a background band. */
  _bgMinMin(): number {
    const h = Number(this._config.background_hours ?? 3);
    if (!Number.isFinite(h) || h <= 0) return 0; // 0 disables background bands
    return h * 60;
  }
  /** Long, day-spanning events (e.g. OGS/Freispiel) shown as a faint full-width band. */
  _isBackground(e: BoardEvent): boolean {
    const min = this._bgMinMin();
    return min > 0 && !this._isTodo(e) && !e.allDay && e.endMin - e.startMin >= min;
  }
  /** Background-band segments for a person/day, longest first (so they stack cleanly). */
  _bgFor(day: number, idx: number): BoardEvent[] {
    if (this._isOff(idx)) return [];
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx && !e.allDay && this._isBackground(e))
      .sort((a, b) => b.endMin - b.startMin - (a.endMin - a.startMin));
  }
  /** Max side-by-side columns before dense overlaps collapse into a "+N" chip. */
  _maxCols(): number {
    const n = Number(this._config.max_columns);
    if (!Number.isFinite(n) || n < 1) return 3;
    return Math.min(Math.round(n), 8);
  }
  /**
   * Cap the per-day overlap columns so events stay readable. Clusters with more
   * columns than `max_columns` keep the first columns and collapse the rest into
   * one "+N" overflow chip in the last column.
   */
  _dayLayout(day: number, idx: number): { events: LaidOutEvent[]; overflows: Overflow[] } {
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
  _evTitle(e: BoardEvent): string {
    const base = e.parts && e.parts > 1 ? `${e.title} (${e.part}/${e.parts})` : e.title;
    const icon = this._autoIcon(e.title);
    return icon ? `${icon} ${base}` : base;
  }

  /** Emoji for a title via custom rules then the built-in keyword map. */
  _autoIcon(title: string): string {
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
  _isTentative(e: BoardEvent): boolean {
    return e.ref.tentative === true;
  }
  /** Jump to the agenda list for a given weekday so collapsed events stay reachable. */
  _showDayAgenda(day: number): void {
    this._day = day;
    if (this._enabledViews.includes("agenda")) this._view = "agenda";
  }
  /** Jump from the week view into the day view of a given weekday. */
  _openDayView(day: number): void {
    this._day = day;
    if (this._enabledViews.includes("day")) this._view = "day";
  }
  _allDayFor(day: number, idx: number): BoardEvent[] {
    if (this._isOff(idx)) return [];
    return this._events.filter((e) => e.day === day && e.personIdx === idx && e.allDay);
  }
  _eventsFor(day: number, idx: number): BoardEvent[] {
    if (this._isOff(idx)) return [];
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx)
      .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin);
  }
  /** Week-start-based column index -> absolute Date in the shown week. */
  _dateForDay(day: number): Date {
    const { monday } = this._weekBounds();
    return new Date(monday.getTime() + day * DAY_MS);
  }
  _isRealToday(day: number): boolean {
    return this._weekOffset === 0 && day === this._todayIndex();
  }
  /** Open an item on Enter/Space for keyboard users. */
  _onItemKey(e: KeyboardEvent, ev: BoardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      this._openEvent(ev);
    }
  }
  _dayHasEvents(day: number): boolean {
    return (
      this._sharedFor(day).length > 0 ||
      this._persons.some((_, i) => this._eventsFor(day, i).length > 0)
    );
  }
  _eventOwnerLabel(e: BoardEvent): string {
    return this._isShared(e)
      ? this._sharedLabel(e)
      : this._personName(this._persons[e.personIdx], e.personIdx);
  }
  _personName(p: PersonConfig, idx: number): string {
    return (
      p.name || this.hass.states[p.person ?? ""]?.attributes?.friendly_name || `Person ${idx + 1}`
    );
  }
  _todoLabel(entityId: string): string {
    return (
      (this.hass.states[entityId]?.attributes?.friendly_name as string | undefined) ?? entityId
    );
  }
  _todoOwnerKey(idx: number): string {
    return idx === SHARED_PERSON_IDX ? "shared" : `person:${idx}`;
  }
  _todoSortKey(item: Pick<TodoItem, "due" | "summary">): string {
    const due = typeof item.due === "string" ? item.due.trim() : "";
    return `${due || "9999-12-31T23:59:59"}::${item.summary.toLowerCase()}`;
  }
  _todoItemsForPerson(idx: number): PersonTodoItem[] {
    return [...(this._todoItemsByOwner[this._todoOwnerKey(idx)] ?? [])].sort((a, b) =>
      this._todoSortKey(a).localeCompare(this._todoSortKey(b)),
    );
  }
  _todoCountForPerson(idx: number): number {
    return this._todoItemsForPerson(idx).length;
  }
  _formatTodoDue(due?: string): string {
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
  _todoKey(item: Pick<PersonTodoItem, "entityId" | "uid" | "summary">): string {
    return `${item.entityId}::${this._todoRef(item)}`;
  }
  _todoFromEvent(e: BoardEvent): PersonTodoItem | null {
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
  _isTodoBusy(e: BoardEvent): boolean {
    const item = this._todoFromEvent(e);
    return !!item && this._todoBusy.includes(this._todoKey(item));
  }
  _todoRef(item: Pick<PersonTodoItem, "uid" | "summary">): string {
    return item.uid || item.summary;
  }
  _openTodo(item: PersonTodoItem): void {
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
  _openTodoBadgeDialog(personIdx: number): void {
    this._todoBadgeDialog = { personIdx };
  }
  _closeTodoBadgeDialog(): void {
    this._todoBadgeDialog = undefined;
  }
  _todoDlgField<K extends keyof TodoDialogState>(key: K, value: TodoDialogState[K]): void {
    if (!this._todoDialog) return;
    this._todoDialog = { ...this._todoDialog, [key]: value, error: undefined };
  }
  async _toggleTodo(item: PersonTodoItem): Promise<void> {
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
  _renderTodoItemCheckbox(item: PersonTodoItem) {
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
  _renderTodoCheckbox(e: BoardEvent) {
    const item = this._todoFromEvent(e);
    return item ? this._renderTodoItemCheckbox(item) : nothing;
  }
  async _completeTodoDialog(): Promise<void> {
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
  async _saveTodoDialog(): Promise<void> {
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
  async _deleteTodoDialog(): Promise<void> {
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
  _closeTodoDialog(): void {
    this._todoDialog = undefined;
  }
  _openTodoFromBadge(item: PersonTodoItem): void {
    this._closeTodoBadgeDialog();
    this._openTodo(item);
  }
  _avatar(p: PersonConfig, idx: number) {
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

  _todoBadge(idx: number) {
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
  _badges(p: PersonConfig, idx: number) {
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
  _moreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
    );
  }

  _prevWeek = () => {
    this._weekOffset -= 1;
  };
  _nextWeek = () => {
    this._weekOffset += 1;
  };
  _thisWeek = () => {
    this._weekOffset = 0;
    this._day = this._todayIndex();
  };
  _prevMonth = () => {
    this._monthOffset -= 1;
  };
  _nextMonth = () => {
    this._monthOffset += 1;
  };
  _thisMonth = () => {
    this._monthOffset = 0;
  };
  /** Jump to the day view for a specific date (from the month grid). */
  _goToDate(date: Date): void {
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
        ${this._config.clock_header
          ? renderClockHeader(this)
          : html`<div class="top">
              <div class="titlewrap">${backButton(this)}<span class="title">${title}</span></div>
              ${viewSwitch(this)}
            </div>`}
        ${renderExtras(this)} ${this._config.show_focus ? renderFocus(this) : nothing}
        ${this._view === "day"
          ? renderDay(this)
          : this._view === "planner"
            ? renderPlanner(this)
            : this._view === "timeline"
              ? renderTimeline(this)
              : this._view === "week"
                ? renderWeek(this)
                : this._view === "month"
                  ? renderMonth(this)
                  : renderAgenda(this)}
        ${renderFab(this)}
      </ha-card>
      ${this._dialog
        ? renderDialog(this)
        : this._todoDialog
          ? renderTodoDialog(this)
          : this._todoBadgeDialog
            ? renderTodoBadgeDialog(this)
            : nothing}
    `;
  }

  _navigateBack = (): void => {
    const path = this._config.back_path;
    if (!path) return;
    history.pushState(null, "", path);
    window.dispatchEvent(
      new CustomEvent("location-changed", { detail: { replace: false }, composed: true }),
    );
  };

  /* ---- presence ("who is where") ------------------------------- */
  /** Friendly name of the home zone; HA reports it as the person state when it is not zone.home. */
  get _homeZone(): string {
    return this._config.home_zone || "zone.home";
  }

  _presence(p: PersonConfig): { kind: "home" | "away" | "zone"; label: string } | undefined {
    if (this._config.show_presence === false || !p.person) return undefined;
    const st = this.hass.states[p.person]?.state;
    if (!st || st === "unknown" || st === "unavailable") return undefined;
    const homeName = this.hass.states[this._homeZone]?.attributes?.friendly_name;
    if (st === "home" || (homeName && st === homeName)) {
      return { kind: "home", label: this._t("status_home") };
    }
    if (st === "not_home") return { kind: "away", label: this._t("status_away") };
    return { kind: "zone", label: st };
  }

  _presenceLabel(p: PersonConfig, i: number) {
    const where = this._presence(p);
    const name = this._personName(p, i);
    if (!where) return html`<span>${name}</span>`;
    return html`<span class="pcname"><span>${name}</span><small>${where.label}</small></span>`;
  }

  /* ---- countdowns ("⏳ Urlaub · noch 12× schlafen") -------------- */
  /** Normalized morning_check config, or undefined when off. */
  get _morningCfg(): (Required<MorningCheckConfig> & MorningWindow) | undefined {
    const c = this._config.morning_check;
    if (!c) return undefined;
    const o: MorningCheckConfig = typeof c === "object" ? c : {};
    const hour = (v: unknown, d: number) => {
      const n = Number(v ?? d);
      return Number.isFinite(n) ? Math.min(24, Math.max(0, n)) : d;
    };
    return {
      from: hour(o.from, 5),
      until: hour(o.until, 10),
      evening: hour(o.evening, 18),
      persons: o.persons ?? [],
      items: o.items ?? [],
      default_items: o.default_items !== false,
      weather: o.weather !== false,
    };
  }

  get _countdownCfg(): Required<CountdownConfig> | undefined {
    const c = this._config.countdowns;
    if (!c) return undefined;
    const o = typeof c === "object" ? c : {};
    return {
      marker: o.marker || COUNTDOWN_MARKER,
      days: Math.min(730, Math.max(1, Number(o.days ?? 365) || 365)),
      max: Math.min(6, Math.max(1, Number(o.max ?? 3) || 3)),
    };
  }

  /** All configured calendars once, each with the color it is shown in. */
  _allCalendars(): { cal: string; color: string }[] {
    const out = new Map<string, string>();
    this._config.persons.forEach((p, idx) => {
      for (const cal of this._calsOf(p)) if (!out.has(cal)) out.set(cal, personColor(p, idx));
    });
    for (const cal of this._sharedCalendarIds()) {
      out.set(cal, this._calMeta(cal).color ?? out.get(cal) ?? hashColor(cal));
    }
    return Array.from(out, ([cal, color]) => ({ cal, color })).filter(
      ({ cal }) => this.hass.states[cal],
    );
  }

  /** Look ahead for marked events; refreshed every 30 minutes and on day change. */
  async _maybeFetchCountdowns(): Promise<void> {
    const cfg = this._countdownCfg;
    if (!cfg) {
      if (this._countdowns.length) this._countdowns = [];
      this._countdownKey = "";
      return;
    }
    const cals = this._allCalendars();
    const key = `${cfg.marker}|${cfg.days}|${cals.map((c) => c.cal).join(",")}|${Math.floor(
      Date.now() / 1800000,
    )}`;
    if (key === this._countdownKey) return;
    this._countdownKey = key;
    const start = startOfDay(new Date());
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + cfg.days);
    const found = new Map<string, CountdownItem>();
    await Promise.all(
      cals.map(async ({ cal, color }) => {
        try {
          const events = await this.hass.callApi<any[]>(
            "GET",
            `calendars/${cal}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(
              end.toISOString(),
            )}`,
          );
          for (const ev of events) {
            const summary = String(ev?.summary ?? "");
            if (!summary.includes(cfg.marker)) continue;
            const raw = parseRawEvent(ev, 0, cal, color, false);
            if (!raw || raw.start.getTime() < start.getTime()) continue; // already running
            const title = stripMarker(this._cleanTitle(summary), cfg.marker);
            const k = `${title.toLowerCase()}|${toLocalDate(raw.start)}`;
            if (!found.has(k))
              found.set(k, { title, start: raw.start, color: this._calMeta(cal).color ?? color });
          }
        } catch (_e) {
          /* a broken calendar must not hide the others */
        }
      }),
    );
    this._countdowns = Array.from(found.values())
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, cfg.max);
  }

  _countdownText(n: number): string {
    if (n <= 0) return this._t("cd_today");
    if (n === 1) return this._t("cd_tomorrow");
    return this._t("cd_days").replace("{n}", String(n));
  }

  /* ---- travel ("time to leave") --------------------------------- */
  _coordsOf(ref: string): LatLon | undefined {
    const ll = parseLatLon(ref);
    if (ll) return ll;
    const a = this.hass.states[ref]?.attributes;
    const lat = Number(a?.latitude);
    const lon = Number(a?.longitude);
    return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : undefined;
  }

  /** Coordinates for an event location: own places first, then OpenStreetMap (cached). */
  async _locate(loc: string, near: LatLon): Promise<LatLon | undefined> {
    const places = this._config.travel?.places ?? {};
    const low = loc.toLowerCase();
    for (const [name, ref] of Object.entries(places)) {
      if (name && low.includes(name.toLowerCase())) return this._coordsOf(ref);
    }
    const direct = parseLatLon(loc);
    if (direct) return direct;
    if (this._config.travel?.geocode === false) return undefined;
    for (const q of addressCandidates(loc)) {
      const ck = `fbc-geo:${q.toLowerCase()}`;
      let hit: LatLon | null | undefined;
      try {
        const c = localStorage.getItem(ck);
        if (c) hit = JSON.parse(c);
      } catch (_e) {
        /* storage blocked */
      }
      if (hit === undefined) {
        const box = [near.lon - 0.6, near.lat + 0.6, near.lon + 0.6, near.lat - 0.6].join(",");
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&viewbox=${box}&q=${encodeURIComponent(q)}`,
            { headers: { "Accept-Language": this.hass.locale?.language || "en" } },
          );
          if (!r.ok) return undefined; // rate limited / offline: try again later
          const list: any[] = await r.json();
          hit = list[0] ? { lat: Number(list[0].lat), lon: Number(list[0].lon) } : null;
        } catch (_e) {
          return undefined;
        }
        try {
          localStorage.setItem(ck, JSON.stringify(hit));
        } catch (_e) {
          /* storage full or blocked */
        }
        await new Promise((res) => setTimeout(res, 1100)); // Nominatim: max 1 request/second
      }
      // a match on the other side of the country is a wrong guess, not a destination
      if (hit && distanceKm(near, hit) < 300) return hit;
    }
    return undefined;
  }

  /** Look up driving times for today's upcoming events (one lookup per place every 10 min). */
  async _updateTravel(): Promise<void> {
    const cfg = this._config?.travel;
    if (!cfg || this._travelBusy || !this.hass) return;
    const origin = this._coordsOf(cfg.origin || this._homeZone);
    if (!origin) return;
    const now = Date.now();
    const lead = Math.max(15, Number(cfg.lead ?? 120) || 120) * 60000;
    const locs = new Set<string>();
    for (const r of this._raw) {
      const loc = r.location?.trim();
      if (!loc || r.allDay || r.kind === "todo" || isOnlineLocation(loc)) continue;
      const t = r.start.getTime();
      if (t > now && t - now <= lead) locs.add(loc);
    }
    this._travelBusy = true;
    try {
      for (const loc of locs) {
        const c = this._travel.get(loc);
        const maxAge = c && c.min === undefined ? 3 * 3600000 : 600000;
        if (c && now - c.at < maxAge) continue;
        const dest = await this._locate(loc, origin);
        let min: number | undefined;
        if (dest && distanceKm(origin, dest) >= 0.4) {
          try {
            const res: any = await this.hass.callWS({
              type: "call_service",
              domain: "waze_travel_time",
              service: "get_travel_times",
              service_data: {
                origin: `${origin.lat},${origin.lon}`,
                destination: `${dest.lat},${dest.lon}`,
                region: cfg.region || "eu",
                vehicle_type: cfg.vehicle_type || "car",
              },
              return_response: true,
            });
            const routes: any[] = res?.response?.routes ?? [];
            const best = Math.min(...routes.map((x) => Number(x.duration)).filter(Number.isFinite));
            if (Number.isFinite(best)) min = Math.round(best);
          } catch (_e) {
            /* Waze not set up or no route */
          }
        }
        this._travel.set(loc, { at: Date.now(), min });
        this._travelRev++;
      }
    } finally {
      this._travelBusy = false;
    }
  }

  /** Leave time for an event, or undefined when there is nothing to say. */
  _leaveFor(r: RawEvent): LeaveInfo | undefined {
    const cfg = this._config.travel;
    const loc = r.location?.trim();
    if (!cfg || !loc || r.allDay || r.kind === "todo") return undefined;
    const now = new Date();
    const lead = Math.max(15, Number(cfg.lead ?? 120) || 120) * 60000;
    if (r.start.getTime() <= now.getTime() || r.start.getTime() - now.getTime() > lead)
      return undefined;
    const min = this._travel.get(loc)?.min;
    if (min === undefined) return undefined;
    return leaveInfo(now, r.start, min, Number(cfg.buffer ?? 5));
  }

  _leaveText(l: LeaveInfo): string {
    if (l.level === "now") return this._t("leave_now");
    if (l.level === "soon") return this._t("leave_in").replace("{n}", String(l.minutes));
    return this._t("leave_at").replace("{t}", formatTime(this.hass, l.leaveAt));
  }

  /** Short form for narrow planner tiles: "los 14:33" · "los in 7 Min" · "jetzt los!". */
  _renderLeave(e: BoardEvent) {
    if (e.continuesBefore) return nothing;
    const l = this._leaveFor(e.ref);
    if (!l) return nothing;
    const min = this._travel.get(e.ref.location!.trim())?.min;
    const text =
      l.level === "now"
        ? this._t("tile_leave_now")
        : l.level === "soon"
          ? this._t("tile_leave_in").replace("{n}", String(l.minutes))
          : this._t("tile_leave_at").replace("{t}", formatTime(this.hass, l.leaveAt));
    return html`<div class="plleave ${l.level}" title="${min} ${this._t("minutes_short")}">
      <ha-icon icon="mdi:car"></ha-icon><span>${text}</span>
    </div>`;
  }

  /* ---- notices strip -------------------------------------------- */
  _runNotice(n: NoticeConfig): void {
    const a = n.action;
    if (!a?.action || !a.action.includes(".")) return;
    const [domain, service] = a.action.split(".", 2);
    // hide right away; it comes back only if the entity still shows the same state in 2 minutes
    const st = this.hass.states[n.entity]?.state ?? "";
    this._noticeDone = { ...this._noticeDone, [n.entity]: { state: st, at: Date.now() } };
    this.hass.callService(domain, service, a.data ?? {}, a.target as any);
  }

  /* ---- planner (Skylight-style day columns) --------------------- */
  get _plannerDays(): number {
    const n = Number(this._config?.planner_days ?? PLANNER_DAYS_DEFAULT);
    return Number.isFinite(n) ? Math.min(14, Math.max(1, Math.round(n))) : PLANNER_DAYS_DEFAULT;
  }

  _plannerWindow(): { start: Date; end: Date } {
    return plannerRange(new Date(), this._plannerDays, this._planOffset);
  }

  _swipeX = 0;
  _swipeY = 0;
  // Touch uses touch events: once the browser takes a gesture for scrolling it sends
  // pointercancel instead of pointerup, but touchend still arrives. Mouse/pen use pointer events.
  _onPlannerTouchStart = {
    handleEvent: (e: TouchEvent) => {
      this._swipeX = e.touches[0]?.clientX ?? 0;
      this._swipeY = e.touches[0]?.clientY ?? 0;
    },
    passive: true,
  };
  _onPlannerTouchEnd = (e: TouchEvent): void => {
    const t = e.changedTouches[0];
    if (t) this._plannerSwipe(t.clientX, t.clientY, e.currentTarget as HTMLElement);
  };
  _onPlannerDown = (e: PointerEvent): void => {
    if (e.pointerType === "touch") return;
    this._swipeX = e.clientX;
    this._swipeY = e.clientY;
  };
  _onPlannerUp = (e: PointerEvent): void => {
    if (e.pointerType === "touch") return;
    this._plannerSwipe(e.clientX, e.clientY, e.currentTarget as HTMLElement);
  };
  /** Swipe left/right pages the planner — but only when the columns don't scroll sideways. */
  _plannerSwipe(x: number, y: number, grid: HTMLElement): void {
    const dx = x - this._swipeX;
    const dy = y - this._swipeY;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
    if (grid.scrollWidth > grid.clientWidth + 2) return;
    this._suppressClick = true;
    setTimeout(() => (this._suppressClick = false), 0);
    this._planOffset += dx < 0 ? 1 : -1;
  }

  /** Writable calendars for a person, or for the shared calendars (SHARED_PERSON_IDX). */
  _writableFor(idx: number): string[] {
    if (idx === SHARED_PERSON_IDX) {
      return this._sharedCalendarIds().filter((c) => this.hass.states[c] && this._canCreate(c));
    }
    const p = this._persons[idx];
    return p ? this._writableCals(p) : [];
  }

  /** Who can get a new event: visible persons with a writable calendar, then "shared". */
  _creators(): number[] {
    const who = this._persons
      .map((_, i) => i)
      .filter((i) => !this._isOff(i) && this._writableFor(i).length > 0);
    if (this._writableFor(SHARED_PERSON_IDX).length > 0) who.push(SHARED_PERSON_IDX);
    return who;
  }

  /** Date a new event starts on from the "+" button: the day the current view shows. */
  _createDate(): Date {
    const today = new Date();
    switch (this._view) {
      case "planner":
        return this._planOffset === 0 ? today : this._plannerWindow().start;
      case "day":
      case "timeline": {
        const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
        return this._dateForDay(day);
      }
      case "month": {
        if (this._monthOffset === 0) return today;
        const { month, year } = this._monthGrid();
        return new Date(year, month, 1);
      }
      default:
        return this._weekOffset === 0 ? today : this._weekBounds().monday;
    }
  }

  /** New event on that date; asks "for whom?" when several people (or "shared") can write. */
  _openCreateFor(date: Date): void {
    const who = this._creators();
    if (who.length === 0) return;
    let startMin: number | undefined;
    if (startOfDay(date).getTime() === startOfDay(new Date()).getTime()) {
      const now = new Date();
      startMin = Math.min(23 * 60, (now.getHours() + 1) * 60); // next full hour
    }
    this._openCreateAt(who[0], date, startMin, who.length > 1 ? who : undefined);
  }

  /** Switch the "for whom?" choice in a create dialog to another person. */
  _pickDialogPerson(idx: number): void {
    const d = this._dialog;
    if (!d) return;
    const writable = this._writableFor(idx);
    if (writable.length === 0) return;
    this._dialog = {
      ...d,
      personIdx: idx,
      calendar: writable[0],
      calendarOptions: writable.length > 1 ? writable : undefined,
    };
  }

  /** Current + next timed event for a person, view-independent (from _raw). */
  _focusFor(idx: number): { current?: RawEvent; next?: RawEvent } {
    const now = Date.now();
    const mine = this._raw
      .filter((r) => r.personIdx === idx && !r.allDay && r.kind !== "todo")
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    const current = mine.find((r) => r.start.getTime() <= now && now < r.end.getTime());
    const next = mine.find((r) => r.start.getTime() > now);
    return { current, next };
  }

  _onTimelineClick(ev: MouseEvent, idx: number, day: number, px: number, startMin: number): void {
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

  _statusLabel(state: string): string {
    if (state === "home") return this._t("status_home");
    if (state === "not_home") return this._t("status_away");
    if (state === "unknown" || state === "unavailable") return "–";
    return state;
  }

  /* ---- create / edit / delete ---------------------------------- */
  _onColClick(ev: MouseEvent, idx: number, day: number, px: number, startMin: number): void {
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

  _openCreate(idx: number, day: number, startMin?: number): void {
    this._openCreateAt(idx, this._dateForDay(day), startMin);
  }

  _openCreateAt(idx: number, date: Date, startMin?: number, pickPersons?: number[]): void {
    const writable = this._writableFor(idx);
    if (writable.length === 0) return;
    const sMin = startMin ?? Math.max(this._startMin, 9 * 60);
    // local wall-clock time on that date (stays right on DST days)
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, sMin);
    const end = new Date(start.getTime() + 60 * 60000);
    this._dialog = {
      mode: "create",
      personIdx: idx,
      calendar: writable[0],
      calendarOptions: writable.length > 1 ? writable : undefined,
      pickPersons,
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

  _openEvent(e: BoardEvent): void {
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

  _dlgField<K extends keyof DialogState>(key: K, value: DialogState[K]): void {
    if (!this._dialog) return;
    this._dialog = { ...this._dialog, [key]: value, error: undefined };
  }

  _toggleAllDay(allDay: boolean): void {
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
  _buildPayload(d: DialogState): Record<string, string> {
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

  _validate(d: DialogState): string | null {
    const s = d.allDay ? new Date(`${d.start}T00:00:00`) : new Date(d.start);
    const e = d.allDay ? new Date(`${d.end}T00:00:00`) : new Date(d.end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return this._t("err_invalid");
    if (e.getTime() < s.getTime()) return this._t("err_end_before");
    if (!d.allDay && e.getTime() === s.getTime()) return this._t("err_end_equal");
    return null;
  }

  /* ---- drag & drop -------------------------------------------- */
  /** Whether an event may be dragged: feature on, timed, writable, non-recurring. */
  _draggable(e: BoardEvent): boolean {
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

  _onEventPointerDown(ev: PointerEvent, e: BoardEvent, mode: "move" | "resize"): void {
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

  _onDragMove = (ev: PointerEvent): void => {
    if (!this._drag) return;
    ev.preventDefault();
    const dy = ev.clientY - this._dragStartY;
    const moved = this._drag.moved || Math.abs(dy) > 4;
    this._drag = { ...this._drag, deltaMin: dy / this._dragPx, moved };
  };

  _onDragUp = (): void => {
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

  async _commitDrag(drag: NonNullable<FamilyBoardCard["_drag"]>): Promise<void> {
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

  async _saveDialog(): Promise<void> {
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

  async _deleteDialog(): Promise<void> {
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

  _closeDialog(): void {
    this._dialog = undefined;
  }

  /* ---- styles (theme-aware) ------------------------------------ */

  static styles = boardStyles;
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
  "%c FAMILY-BOARD-CARD %c v0.32.0 ",
  "background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px",
  "background:#222;color:#fff;border-radius:0 3px 3px 0",
);
