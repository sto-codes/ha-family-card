import { html, nothing } from "lit";
import { plannerBuckets, readableTextColor } from "../../events";
import type { BoardEvent } from "../../events";
import { formatDayRange, formatMinutes } from "../../localize";
import { WEATHER_ICON, personColor, startOfDay, toLocalDate } from "../utils";
import { renderPersonFilter } from "./header";
import type { FamilyBoardCard } from "../../ha-family-board-card";

export function renderPlanner(card: FamilyBoardCard) {
  const days = card._plannerDays;
  const { start, end } = card._plannerWindow();
  const locale = card.hass.locale?.language || "en";
  const wdShort = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const monthShort = new Intl.DateTimeFormat(locale, { month: "short" });
  const todayMs = startOfDay(new Date()).getTime();
  const raws = card._raw.filter(
    (r) =>
      !card._isOff(r.personIdx) &&
      // to-dos without a due date are repeated on every day elsewhere; here only today
      (r.kind !== "todo" || !!r.todo_due || startOfDay(r.start).getTime() === todayMs),
  );
  const buckets = plannerBuckets(raws, start, days);
  const cols = buckets
    .map((items, d) => ({
      date: new Date(start.getFullYear(), start.getMonth(), start.getDate() + d),
      items: mergeSameEvents(card, items),
    }))
    .filter(
      ({ date }) =>
        card._config.show_weekends !== false || (date.getDay() !== 0 && date.getDay() !== 6),
    );
  const canCreate = card._creators().length > 0;
  const range = formatDayRange(card.hass, start, end);
  return html`
    <div class="weekhead plnav">
      <div class="weeknav">
        <button class="nav" aria-label=${card._t("prev_days")} @click=${() => card._planOffset--}>
          ‹
        </button>
        <button class="nav-now" @click=${() => (card._planOffset = 0)}>
          ${card._planOffset === 0 ? html`${card._t("today")} · ${range}` : range}
        </button>
        <button class="nav" aria-label=${card._t("next_days")} @click=${() => card._planOffset++}>
          ›
        </button>
      </div>
      ${card._loading ? html`<span class="spinner"></span>` : nothing} ${renderPersonFilter(card)}
    </div>
    ${card._loadError ? html`<div class="banner">${card._t("load_error")}</div>` : nothing}
    <div
      class="board planner"
      lang=${locale}
      style="--pl-cols:${cols.length}"
      @pointerdown=${card._onPlannerDown}
      @pointerup=${card._onPlannerUp}
      @touchstart=${card._onPlannerTouchStart}
      @touchend=${card._onPlannerTouchEnd}
    >
      ${cols.map(({ date, items }) => {
        const today = date.getTime() === startOfDay(new Date()).getTime();
        const rel = card._relativeDay(date);
        return html`
          <section
            class="plcol ${today ? "today" : ""}"
            aria-label=${date.toLocaleDateString(locale)}
          >
            <div
              class="plhead"
              role="button"
              tabindex="0"
              aria-label=${card._t("day")}
              @click=${() => card._goToDate(date)}
              @keydown=${(k: KeyboardEvent) => {
                if (k.key === "Enter" || k.key === " ") {
                  k.preventDefault();
                  card._goToDate(date);
                }
              }}
            >
              <span class="plwd">${rel ?? wdShort.format(date)}</span>
              <span class="pldate">${date.getDate()}</span>
              <span class="plsub"
                >${rel ? wdShort.format(date) : monthShort.format(date)}${plannerWeather(
                  card,
                  date,
                )}</span
              >
            </div>
            <div
              class="plbody ${canCreate ? "creatable" : ""}"
              @click=${(ev: MouseEvent) => {
                // a tap on free space (not on a tile) adds an event on that day
                const t = ev.target as HTMLElement;
                if (!canCreate || card._suppressClick) return;
                if (t === ev.currentTarget || t.classList.contains("plfree")) {
                  card._openCreateFor(date);
                }
              }}
            >
              ${items.length === 0
                ? html`<div class="plfree">${card._t("nothing_planned")}</div>`
                : items.map(({ e, owners }) => plannerTile(card, e, owners))}
            </div>
          </section>
        `;
      })}
    </div>
  `;
}

export function plannerWeather(card: FamilyBoardCard, date: Date) {
  const f = card._forecast[toLocalDate(date)];
  if (!f) return nothing;
  return html`<span class="plwx" title=${f.condition}
    ><ha-icon icon="mdi:${WEATHER_ICON[f.condition] || "weather-cloudy"}"></ha-icon>${f.temp}°</span
  >`;
}

/** Title without the duplicate auto-emoji when the calendar already brings its own mdi icon. */
export function plannerTitle(card: FamilyBoardCard, e: BoardEvent) {
  const base = e.parts && e.parts > 1 ? `${e.title} (${e.part}/${e.parts})` : e.title;
  const calIcon = e.ref.kind !== "todo" ? card._calIcon(e.ref.calendar) : undefined;
  const emoji = calIcon ? "" : card._autoIcon(e.title);
  return html`${e.continuesBefore ? "« " : ""}${emoji ? `${emoji} ` : ""}${base}${e.continuesAfter
    ? " »"
    : ""}`;
}

/**
 * One tile per event and day. The same appointment in several people's
 * calendars (same title, start and end) becomes ONE tile with all their
 * avatars instead of repeating it.
 */
export function mergeSameEvents(
  card: FamilyBoardCard,
  items: BoardEvent[],
): { e: BoardEvent; owners: number[] }[] {
  const out: { e: BoardEvent; owners: number[] }[] = [];
  const byKey = new Map<string, { e: BoardEvent; owners: number[] }>();
  for (const e of items) {
    const owners = card._isShared(e)
      ? (e.ref.shared_person_idxs ?? [])
      : e.personIdx >= 0
        ? [e.personIdx]
        : [];
    if (card._isTodo(e)) {
      out.push({ e, owners });
      continue;
    }
    const key = `${e.title.trim().toLowerCase()}|${e.ref.start.getTime()}|${e.ref.end.getTime()}`;
    const hit = byKey.get(key);
    if (hit) {
      for (const o of owners) if (!hit.owners.includes(o)) hit.owners.push(o);
      continue;
    }
    const entry = { e, owners: [...owners] };
    byKey.set(key, entry);
    out.push(entry);
  }
  return out;
}

/** Tiny round avatar (photo or initials) for event tiles. */
export function miniAvatar(card: FamilyBoardCard, idx: number) {
  const p = card._persons[idx];
  if (!p) return nothing;
  const color = personColor(p, idx);
  const pic = p.person
    ? (card.hass.states[p.person]?.attributes?.entity_picture as string | undefined)
    : undefined;
  const name = card._personName(p, idx);
  return pic
    ? html`<span
        class="mini"
        title=${name}
        style="background-image:url('${pic}');--c:${color}"
      ></span>`
    : html`<span class="mini initials" title=${name} style="--c:${color};background:${color}"
        >${name.slice(0, 1).toUpperCase()}</span
      >`;
}

export function ownerAvatars(card: FamilyBoardCard, e: BoardEvent, owners: number[]) {
  const all = card._persons.length;
  if (card._isShared(e) && (owners.length === 0 || owners.length >= all)) {
    return html`<span class="plowners" title=${card._eventOwnerLabel(e)}
      ><ha-icon class="plgroup" icon="mdi:account-group"></ha-icon
    ></span>`;
  }
  if (owners.length === 0) return nothing;
  return html`<span class="plowners">${owners.map((i) => miniAvatar(card, i))}</span>`;
}

export function plannerTile(card: FamilyBoardCard, e: BoardEvent, owners: number[]) {
  const c = card._eventColor(e);
  const todo = card._isTodo(e);
  const title = plannerTitle(card, e);
  const cls = `${card._isPast(e) ? "past" : ""} ${card._isTentative(e) ? "tentative" : ""} ${
    todo ? "todo" : ""
  }`;
  const open = (ev: Event) => {
    if (card._suppressClick) return;
    ev.stopPropagation();
    card._openEvent(e);
  };
  if (e.allDay && !todo) {
    const fg = readableTextColor(c);
    return html`<div
      class="plall ${cls}"
      style="--c:${c};${fg ? `color:${fg}` : ""}"
      role="button"
      tabindex="0"
      @click=${open}
      @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
    >
      ${card._calIconEl(e)}<span class="pltitle">${title}</span>${card._isShared(e) &&
      (owners.length === 0 || owners.length >= card._persons.length)
        ? nothing
        : ownerAvatars(card, e, owners)}
    </div>`;
  }
  const current = !e.allDay && card._isCurrent(e);
  // the end part is dropped by a container query when the tile is too narrow for both
  const end = (sep: string) =>
    html`<span class="tend">${sep}${formatMinutes(card.hass, e.endMin)}</span>`;
  const time = e.allDay
    ? card._t("all_day")
    : current
      ? html`${card._t("now")}${end("–")}`
      : e.continuesBefore && !e.continuesAfter
        ? `${card._t("until")} ${formatMinutes(card.hass, e.endMin)}`
        : e.endMin > e.startMin && !e.continuesAfter
          ? html`${formatMinutes(card.hass, e.startMin)}${end("–")}`
          : formatMinutes(card.hass, e.startMin);
  return html`<div
    class="plev ${cls} ${current ? "current" : ""}"
    style="--c:${c}"
    role="button"
    tabindex="0"
    @click=${open}
    @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
  >
    <div class="plmeta"><span class="pltime">${time}</span></div>
    <div class="pltitle ${todo ? "todo-line" : ""}">
      ${todo ? card._renderTodoCheckbox(e) : nothing}${card._calIconEl(e)}<span>${title}</span>
    </div>
    ${card._renderLeave(e)}
    ${e.location && !todo
      ? html`<div class="plloc">
          <ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${e.location}</span>
        </div>`
      : nothing}
    ${card._isShared(e) || owners.length > 1
      ? html`<div class="plwho">${ownerAvatars(card, e, owners)}</div>`
      : nothing}
    ${current && card._progressOn
      ? html`<div class="plprog"><span style="width:${card._progressPct(e)}%"></span></div>`
      : nothing}
  </div>`;
}
