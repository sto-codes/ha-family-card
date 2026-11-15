import { html, nothing } from "lit";
import { DAY_MS, splitAcrossDays } from "../../events";
import type { BoardEvent } from "../../events";
import { weekdayNames } from "../../localize";
import { startOfDay } from "../utils";
import type { FamilyBoardCard } from "../../ha-family-board-card";

export function renderMonth(card: FamilyBoardCard) {
  const { gridStart, weeks, month, year } = card._monthGrid();
  const numDays = weeks * 7;
  const short = weekdayNames(card.hass, "short", card._firstDayJs);
  const locale = card.hass.locale?.language || "en";
  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(year, month, 1),
  );
  const byDay = new Map<number, BoardEvent[]>();
  for (const r of card._raw) {
    if (card._isOff(r.personIdx)) continue;
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
        <button class="nav" aria-label=${card._t("prev_month")} @click=${card._prevMonth}>‹</button>
        <button class="nav-now" @click=${card._thisMonth}>${monthName}</button>
        <button class="nav" aria-label=${card._t("next_month")} @click=${card._nextMonth}>›</button>
      </div>
    </div>
    ${card._loadError ? html`<div class="banner">${card._t("load_error")}</div>` : nothing}
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
              @click=${() => card._goToDate(date)}
              @keydown=${(k: KeyboardEvent) => {
                if (k.key === "Enter" || k.key === " ") {
                  k.preventDefault();
                  card._goToDate(date);
                }
              }}
            >
              <div class="mdate ${isToday ? "today" : ""}">${date.getDate()}</div>
              <div class="mchips">
                ${items.slice(0, maxChips).map((e) => {
                  const col = card._eventColor(e);
                  const tent = card._isTentative(e);
                  return html`<div
                    class="mchip ${card._isPast(e) ? "past" : ""} ${tent
                      ? "tentative"
                      : ""} ${card._isShared(e) ? "shared" : ""} ${card._isTodo(e) ? "todo" : ""}"
                    style="background:${col}30;background:color-mix(in srgb, ${col} 22%, var(--card-background-color, #fff));border-left:2px ${tent
                      ? "dashed"
                      : "solid"} ${col}"
                    title="${card._eventOwnerLabel(e)} · ${card._evTitle(e)}"
                    @click=${(ev: MouseEvent) => {
                      ev.stopPropagation();
                      card._openEvent(e);
                    }}
                  >
                    ${card._isTodo(e)
                      ? html`<span class="todo-line">
                          ${card._renderTodoCheckbox(e)}
                          <span class="todo-label"
                            >${e.continuesBefore ? "« " : ""}${card._evTitle(e)}</span
                          >
                        </span>`
                      : html`${e.continuesBefore ? "« " : ""}${card._evTitle(e)}`}
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
