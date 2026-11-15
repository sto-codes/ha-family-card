import { html, nothing } from "lit";
import type { BoardEvent } from "../../events";
import { formatCountdown, formatMinutes, weekdayNames } from "../../localize";
import { weekNav } from "./header";
import type { FamilyBoardCard } from "../../ha-family-board-card";

export function renderAgenda(card: FamilyBoardCard) {
  const full = weekdayNames(card.hass, "long", card._firstDayJs);
  const dateFmt = new Intl.DateTimeFormat(card.hass.locale?.language || "en", {
    day: "numeric",
    month: "short",
  });
  const dedupe = (items: BoardEvent[]): BoardEvent[] => {
    if (!card._config.filter_duplicates) return items;
    const seen = new Set<string>();
    return items.filter((e) => {
      const k = `${card._evTitle(e)}|${e.ref.start.getTime()}|${e.ref.end.getTime()}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };
  const groups = card._visibleDays
    .map((d) => ({
      d,
      items: dedupe(
        card._events
          .filter((e) => e.day === d && !card._isOff(e.personIdx))
          .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin),
      ),
    }))
    .filter((g) => g.items.length > 0);

  return html`
    <div class="weekhead">${weekNav(card)}</div>
    ${card._loadError ? html`<div class="banner">${card._t("load_error")}</div>` : nothing}
    <div class="agenda">
      ${groups.length === 0
        ? html`<div class="agenda-empty">
            ${card._loading ? html`<span class="spinner"></span>` : card._t("no_events")}
          </div>`
        : groups.map(
            (g) => html`
              <div class="agenda-day">
                <div class="agenda-date ${card._isRealToday(g.d) ? "today" : ""}">
                  ${card._relativeDay(card._dateForDay(g.d)) ?? full[g.d]} ·
                  ${dateFmt.format(card._dateForDay(g.d))}
                  ${card._weatherChip(card._dateForDay(g.d))}
                </div>
                ${g.items.map((e) => agendaRow(card, e))}
              </div>
            `,
          )}
    </div>
  `;
}

export function agendaRow(card: FamilyBoardCard, e: BoardEvent) {
  const c = card._eventColor(e);
  const name = card._eventOwnerLabel(e);
  const time = e.allDay
    ? card._t("all_day")
    : `${formatMinutes(card.hass, e.startMin)}–${formatMinutes(card.hass, e.endMin)}`;
  const current = card._isCurrent(e);
  const tent = card._isTentative(e);
  const countdown =
    !e.allDay && !current && !e.continuesBefore ? formatCountdown(card.hass, e.ref.start) : "";
  return html`
    <div
      class="agenda-row ${card._isPast(e) ? "past" : ""} ${current ? "current" : ""} ${tent
        ? "tentative"
        : ""} ${card._isShared(e) ? "shared" : ""} ${card._isTodo(e) ? "todo" : ""}"
      tabindex="0"
      role="button"
      @click=${() => card._openEvent(e)}
      @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
    >
      <span class="agenda-time">${time}</span>
      <span class="agenda-bar" style="background:${c}"></span>
      <span class="agenda-main">
        <span class="agenda-title ${card._isTodo(e) ? "todo-line" : ""}"
          >${card._isTodo(e) ? card._renderTodoCheckbox(e) : nothing}${card._isTodo(e)
            ? html`<span class="todo-label"
                >${card._calIconEl(e)}${e.continuesBefore ? "« " : ""}${card._evTitle(
                  e,
                )}${e.continuesAfter ? " »" : ""}</span
              >`
            : html`${card._calIconEl(e)}${e.continuesBefore ? "« " : ""}${card._evTitle(
                e,
              )}${e.continuesAfter ? " »" : ""}`}</span
        >
        <span class="agenda-meta">${name}${e.location ? ` · ${e.location}` : ""}</span>
        ${current && card._progressOn
          ? html`<span class="agenda-prog"
              ><span style="width:${card._progressPct(e)}%;background:${c}"></span
            ></span>`
          : nothing}
      </span>
      ${countdown ? html`<span class="agenda-cd">${countdown}</span>` : nothing}
    </div>
  `;
}
