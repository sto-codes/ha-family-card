import { html, nothing } from "lit";
import { formatMinutes, weekdayNames } from "../../localize";
import { weekNav } from "./header";
import type { FamilyBoardCard } from "../../ha-family-board-card";

export function renderWeek(card: FamilyBoardCard) {
  const short = weekdayNames(card.hass, "short", card._firstDayJs);
  // optionally hide persons without any events in the shown week
  const people = card._persons
    .map((p, i) => ({ p, i }))
    .filter(
      ({ i }) =>
        card._config.hide_empty_persons !== true ||
        card._events.some(
          (e) => e.personIdx === i || (card._isShared(e) && card._sharedPersons(e).includes(i)),
        ),
    );
  const shown = people.length > 0 ? people : card._persons.map((p, i) => ({ p, i }));
  const cols = `70px repeat(${shown.length}, minmax(110px, 1fr))`;
  return html`
    <div class="weekhead">${weekNav(card)}</div>
    <div class="weekwrap">
      <div class="weekgrid" style="grid-template-columns:${cols}">
        <div class="corner"></div>
        ${shown.map(
          ({ p, i }) =>
            html`<div
              class="wphead ${card._isOff(i) ? "off" : ""}"
              role="button"
              tabindex="0"
              @click=${() => card._togglePerson(i)}
              @keydown=${(k: KeyboardEvent) => {
                if (k.key === "Enter" || k.key === " ") {
                  k.preventDefault();
                  card._togglePerson(i);
                }
              }}
            >
              ${card._avatar(p, i)}
              <div class="pmeta">
                <div class="pname">${card._personName(p, i)}</div>
                ${card._badges(p, i)}
              </div>
            </div>`,
        )}
        ${card._visibleDays.map((d) => {
          const shared = card._sharedFor(d);
          const shownIdxs = shown.map(({ i }) => i);
          return html`
            <div
              class="wday ${card._isRealToday(d) ? "today" : ""}"
              role="button"
              tabindex="0"
              title=${card._t("day")}
              @click=${() => card._openDayView(d)}
              @keydown=${(k: KeyboardEvent) => {
                if (k.key === "Enter" || k.key === " ") {
                  k.preventDefault();
                  card._openDayView(d);
                }
              }}
            >
              <b>${short[d]}</b>
            </div>
            ${shared.length
              ? html`
                  <div class="wshared ${card._isRealToday(d) ? "today" : ""}">
                    ${shared.map((e) => {
                      const c = card._eventColor(e);
                      const tent = card._isTentative(e);
                      const sharedStyle = card._sharedGridStyle(e, shownIdxs);
                      if (sharedStyle === "display:none") return nothing;
                      return html`
                        <div
                          class="wshared-chip ${card._isPast(e) ? "past" : ""} ${tent
                            ? "tentative"
                            : ""}"
                          style="${sharedStyle};border-left:2.5px ${tent
                            ? "dashed"
                            : "solid"} ${c};background:${c}28;background:color-mix(in srgb, ${c} 18%, var(--card-background-color, #fff))"
                          title="${card._evTitle(e)}"
                          tabindex="0"
                          role="button"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            card._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
                        >
                          <span class="shared-tag">${card._sharedLabel(e)}</span>
                          <span
                            >${card._calIconEl(e)}${e.continuesBefore ? "« " : ""}${card._evTitle(
                              e,
                            )}${e.continuesAfter ? " »" : ""}</span
                          >
                          ${!e.allDay
                            ? html`<small
                                >${formatMinutes(card.hass, e.startMin)}–${formatMinutes(
                                  card.hass,
                                  e.endMin,
                                )}</small
                              >`
                            : html`<small>${card._t("all_day")}</small>`}
                        </div>
                      `;
                    })}
                  </div>
                  <div class="wspacer ${card._isRealToday(d) ? "today" : ""}"></div>
                `
              : nothing}
            ${shown.map(({ p, i }) => {
              const canCreate = card._personCanCreate(p);
              return html`
                <div
                  class="wcell ${card._isRealToday(d) ? "today" : ""} ${canCreate
                    ? "creatable"
                    : ""}"
                  @click=${() => canCreate && card._openCreate(i, d)}
                >
                  ${card._eventsFor(d, i).map((e) => {
                    const c = card._eventColor(e);
                    const tent = card._isTentative(e);
                    return html`
                      <div
                        class="wchip ${card._isPast(e) ? "past" : ""} ${tent
                          ? "tentative"
                          : ""} ${card._isTodo(e) ? "todo" : ""}"
                        style="border-left:2.5px ${tent
                          ? "dashed"
                          : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                        title="${card._evTitle(e)}"
                        tabindex="0"
                        role="button"
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          card._openEvent(e);
                        }}
                        @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
                      >
                        <span class=${card._isTodo(e) ? "todo-line" : ""}
                          >${card._isTodo(e) ? card._renderTodoCheckbox(e) : nothing}${card._isTodo(
                            e,
                          )
                            ? html`<span class="todo-label"
                                >${card._calIconEl(e)}${e.continuesBefore
                                  ? "« "
                                  : ""}${card._evTitle(e)}</span
                              >`
                            : html`${card._calIconEl(e)}${e.continuesBefore
                                ? "« "
                                : ""}${card._evTitle(e)}`}</span
                        >
                        ${!e.allDay
                          ? html`<small>${formatMinutes(card.hass, e.startMin)}</small>`
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
