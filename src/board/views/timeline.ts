import { html, nothing } from "lit";
import { layoutDayColumns } from "../../events";
import { formatMinutes, weekdayNames } from "../../localize";
import { pad } from "../utils";
import { weekNav } from "./header";
import { renderDayTabs } from "./day";
import type { FamilyBoardCard } from "../../ha-family-board-card";

/** Horizontal timeline: persons as rows on the left, time flowing left → right. */
export function renderTimeline(card: FamilyBoardCard) {
  const day = card._visibleDays.includes(card._day) ? card._day : card._visibleDays[0];
  const { startMin, endMin } = card._dayWindow(day);
  const hourPx = Math.min(240, Math.max(48, Number(card._config.hour_width) || 96));
  const px = hourPx / 60;
  const width = (endMin - startMin) * px;
  const full = weekdayNames(card.hass, "long", card._firstDayJs);
  const shared = card._sharedTimed(day);
  const visiblePersonIdxs = card._persons.map((_, idx) => idx).filter((idx) => !card._isOff(idx));
  const hours: number[] = [];
  for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNow =
    card._config.show_now_line !== false &&
    card._isRealToday(day) &&
    nowMin >= startMin &&
    nowMin <= endMin;
  const LANE = 30;

  return html`
    <div class="dayhead">
      <span class="dayname">
        ${card._relativeDay(card._dateForDay(day)) ?? full[day]}
        ${card._weatherChip(card._dateForDay(day))}${card._loading && card._raw.length === 0
          ? html`<span class="spinner"></span>`
          : nothing}
      </span>
      ${weekNav(card)}
    </div>
    ${renderDayTabs(card)}
    ${card._loadError ? html`<div class="banner">${card._t("load_error")}</div>` : nothing}
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
                    <div class="pname">${card._t("shared_events")}</div>
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
                      const c = card._eventColor(e);
                      const tent = card._isTentative(e);
                      const before = e.continuesBefore || e.startMin < startMin;
                      const after = e.continuesAfter || e.endMin > endMin;
                      if (!card._sharedRange(e, visiblePersonIdxs)) return nothing;
                      return html`
                        <div
                          class="tlbar shared ${card._isPast(e) ? "past" : ""} ${tent
                            ? "tentative"
                            : ""}"
                          tabindex="0"
                          role="button"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            card._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
                          style="left:${(s - startMin) * px + 1.5}px;width:${w}px;
                                 top:${e.col * LANE + 4}px;height:${LANE - 6}px;
                                 border-left:3px ${tent ? "dashed" : "solid"} ${c};
                                 background:${c}28;
                                 background:color-mix(in srgb, ${c} 18%, var(--card-background-color, #fff))"
                          title="${card._evTitle(e)}${e.allDay
                            ? ` · ${card._t("all_day")}`
                            : ` · ${formatMinutes(card.hass, e.startMin)}–${formatMinutes(card.hass, e.endMin)}`}"
                        >
                          <span class="shared-tag">${card._sharedLabel(e)}</span>
                          <span class="etitle"
                            >${before ? "« " : ""}${card._calIconEl(e)}${card._evTitle(e)}${after
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
        ${card._persons.map((p, i) => {
          const off = card._isOff(i);
          const evs = off ? [] : card._events.filter((e) => e.day === day && e.personIdx === i);
          const laid = layoutDayColumns(evs);
          const lanes = laid.length ? Math.max(...laid.map((e) => e.cols)) : 1;
          const canCreate = card._personCanCreate(p);
          const stateObj = p.person ? card.hass.states[p.person] : undefined;
          return html`
            <div class="tlrow ${off ? "off" : ""}">
              <div
                class="tlperson"
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
                  <div class="pstatus">${stateObj ? card._statusLabel(stateObj.state) : ""}</div>
                  ${card._badges(p, i)}
                </div>
              </div>
              <div
                class="tlcanvas ${canCreate ? "creatable" : ""}"
                style="width:${width}px;height:${lanes * LANE + 8}px;
                       background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${hourPx}px),
                       repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${hourPx /
                2}px)"
                @click=${(ev: MouseEvent) => card._onTimelineClick(ev, i, day, px, startMin)}
              >
                ${laid
                  .filter((e) => e.endMin > startMin && e.startMin < endMin)
                  .map((e) => {
                    const s = Math.max(e.startMin, startMin);
                    const en = Math.min(e.endMin, endMin);
                    const w = Math.max((en - s) * px - 3, 20);
                    const c = card._eventColor(e);
                    const tent = card._isTentative(e);
                    const before = e.continuesBefore || e.startMin < startMin;
                    const after = e.continuesAfter || e.endMin > endMin;
                    return html`
                      <div
                        class="tlbar ${card._isPast(e) ? "past" : ""} ${tent
                          ? "tentative"
                          : ""} ${card._isTodo(e) ? "todo" : ""}"
                        tabindex="0"
                        role="button"
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          card._openEvent(e);
                        }}
                        @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
                        style="left:${(s - startMin) * px + 1.5}px;width:${w}px;
                               top:${e.col * LANE + 4}px;height:${LANE - 6}px;
                               border-left:3px ${tent
                          ? "dashed"
                          : "solid"} ${c};background:${c}40;background:color-mix(in srgb, ${c} 32%, var(--card-background-color, #fff));"
                        title="${card._evTitle(e)}${e.allDay
                          ? ` · ${card._t("all_day")}`
                          : ` · ${formatMinutes(card.hass, e.startMin)}–${formatMinutes(card.hass, e.endMin)}`}"
                      >
                        <span class="etitle ${card._isTodo(e) ? "todo-line" : ""}"
                          >${card._isTodo(e) ? card._renderTodoCheckbox(e) : nothing}${card._isTodo(
                            e,
                          )
                            ? html`<span class="todo-label"
                                >${before ? "« " : ""}${card._evTitle(e)}${after ? " »" : ""}</span
                              >`
                            : html`${before ? "« " : ""}${card._evTitle(e)}${after ? " »" : ""}`}</span
                        >
                        ${!e.allDay && w > 120
                          ? html`<span class="etime"
                              >${formatMinutes(card.hass, e.startMin)}–${formatMinutes(
                                card.hass,
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
              <span>${formatMinutes(card.hass, nowMin)}</span>
            </div>`
          : nothing}
      </div>
      ${!card._loading && !card._loadError && !card._dayHasEvents(day)
        ? html`<div class="empty">${card._t("no_events")}</div>`
        : nothing}
    </div>
  `;
}
