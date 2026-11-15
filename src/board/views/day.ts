import { html, nothing } from "lit";
import { formatMinutes, weekdayNames } from "../../localize";
import { pad } from "../utils";
import { weekNav } from "./header";
import type { FamilyBoardCard } from "../../ha-family-board-card";

export function renderDayTabs(card: FamilyBoardCard) {
  const short = weekdayNames(card.hass, "short", card._firstDayJs);
  return html`
    <div class="tabs" role="tablist">
      ${card._visibleDays.map(
        (d) => html`
          <button
            role="tab"
            aria-selected=${d === card._day}
            class="${d === card._day ? "on" : ""} ${card._isRealToday(d) ? "today" : ""}"
            @click=${() => (card._day = d)}
          >
            ${short[d]}
          </button>
        `,
      )}
    </div>
  `;
}

export function renderDay(card: FamilyBoardCard) {
  const day = card._visibleDays.includes(card._day) ? card._day : card._visibleDays[0];
  const px = card._pxPerMin;
  const hourPx = 60 * px;
  const { startMin, endMin } = card._dayWindow(day);
  const height = (endMin - startMin) * px;
  const full = weekdayNames(card.hass, "long", card._firstDayJs);
  const sharedAllDay = card._sharedAllDay(day).filter((e) => !card._isTodo(e));
  const sharedTimed = card._sharedTimed(day);

  const hours: number[] = [];
  for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);

  const now = new Date();
  const nowMin = Math.max(startMin, Math.min(endMin, now.getHours() * 60 + now.getMinutes()));
  const showNow = card._config.show_now_line !== false && card._isRealToday(day);
  const hasAllDay =
    sharedAllDay.length > 0 || card._persons.some((_, i) => card._allDayFor(day, i).length > 0);

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
    <div class="board">
      <div class="header-row">
        <div class="axis-spacer"></div>
        ${card._persons.map((p, i) => {
          const stateObj = p.person ? card.hass.states[p.person] : undefined;
          const off = card._isOff(i);
          return html`
            <div
              class="phead ${off ? "off" : ""}"
              role="button"
              tabindex="0"
              title=${card._personName(p, i)}
              @click=${() => card._togglePerson(i)}
              @keydown=${(k: KeyboardEvent) => {
                if (k.key === "Enter" || k.key === " ") {
                  k.preventDefault();
                  card._togglePerson(i);
                }
              }}
            >
              ${card._avatar(p, i)}
              ${off
                ? nothing
                : html`<div class="pname">${card._personName(p, i)}</div>
                    <div class="pstatus">${stateObj ? card._statusLabel(stateObj.state) : ""}</div>
                    ${card._badges(p, i)}`}
            </div>
          `;
        })}
      </div>
      ${hasAllDay
        ? html`
            <div class="allday-row">
              <div class="axis-spacer allday-label">${card._t("all_day")}</div>
              <div class="allday-main">
                ${sharedAllDay.length
                  ? html`<div class="allday-shared">
                      ${sharedAllDay.map((e) => {
                        const c = card._eventColor(e);
                        const tent = card._isTentative(e);
                        return html`
                          <div
                            class="adchip shared ${tent ? "tentative" : ""}"
                            style="${card._sharedGridStyle(e)};border-left:3px ${tent
                              ? "dashed"
                              : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                            title="${card._evTitle(e)}"
                            tabindex="0"
                            role="button"
                            @click=${() => card._openEvent(e)}
                            @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
                          >
                            ${card._isTodo(e)
                              ? html`<span class="todo-line">
                                  ${card._renderTodoCheckbox(e)}
                                  <span class="todo-label"
                                    >${e.continuesBefore ? "« " : ""}${card._evTitle(
                                      e,
                                    )}${e.continuesAfter ? " »" : ""}</span
                                  >
                                </span>`
                              : html`${e.continuesBefore ? "« " : ""}${card._evTitle(
                                  e,
                                )}${e.continuesAfter ? " »" : ""}`}
                          </div>
                        `;
                      })}
                    </div>`
                  : nothing}
                <div class="allday-grid">
                  ${card._persons.map((_p, i) => {
                    const calendarItems = card._allDayFor(day, i).filter((e) => !card._isTodo(e));
                    return html`
                      <div class="allday-cell ${card._isOff(i) ? "off" : ""}">
                        ${calendarItems.map((e) => {
                          const c = card._eventColor(e);
                          const tent = card._isTentative(e);
                          return html`
                            <div
                              class="adchip ${tent ? "tentative" : ""}"
                              style="border-left:3px ${tent
                                ? "dashed"
                                : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                              title="${card._evTitle(e)}"
                              tabindex="0"
                              role="button"
                              @click=${() => card._openEvent(e)}
                              @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
                            >
                              ${e.continuesBefore ? "« " : ""}${card._evTitle(e)}${e.continuesAfter
                                ? " »"
                                : ""}
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
              html`<div class="hour" style="top:${(h * 60 - startMin) * px}px">${pad(h)}:00</div>`,
          )}
        </div>
        ${card._persons.map((p, i) => {
          const canCreate = card._personCanCreate(p);
          const layout = card._dayLayout(day, i);
          return html`
            <div
              class="col ${canCreate ? "creatable" : ""} ${card._isOff(i) ? "off" : ""}"
              @click=${(ev: MouseEvent) => card._onColClick(ev, i, day, px, startMin)}
              style="background-image:
                repeating-linear-gradient(var(--fb-row-shade) 0 ${hourPx}px, transparent ${hourPx}px ${2 *
              hourPx}px),
                repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${hourPx /
              2}px),
                repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${hourPx}px)"
            >
              ${card
                ._bgFor(day, i)
                .filter((e) => e.endMin > startMin && e.startMin < endMin)
                .map((e, bi) => {
                  const top = (e.startMin - startMin) * px;
                  const h = Math.max((e.endMin - e.startMin) * px - 3, 16);
                  const c = card._eventColor(e);
                  const tent = card._isTentative(e);
                  return html`
                    <div
                      class="band ${card._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                      tabindex="0"
                      role="button"
                      @click=${(ev: MouseEvent) => {
                        ev.stopPropagation();
                        card._openEvent(e);
                      }}
                      @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
                      style="top:${top + 1.5}px;height:${h}px;
                             border:1.5px dashed ${c}55;
                             background:${c}0d;
                             background:repeating-linear-gradient(45deg,
                               color-mix(in srgb, ${c} 8%, transparent) 0 8px,
                               transparent 8px 16px)"
                      title="${card._evTitle(e)} · ${formatMinutes(
                        card.hass,
                        e.startMin,
                      )}–${formatMinutes(card.hass, e.endMin)}"
                    >
                      <span
                        class="etitle"
                        style="margin-top:${bi * 19}px;
                               background:${c}26;
                               background:color-mix(in srgb, ${c} 16%, var(--card-background-color, #fff))"
                        >${e.continuesBefore ? "« " : ""}${card._evTitle(e)}${e.continuesAfter
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
                    // live preview while dragging card event (in minute space)
                    const dragging = card._drag?.raw === e.ref;
                    let sMin = e.startMin;
                    let eMin = e.endMin;
                    if (dragging && card._drag) {
                      const g = card._dragGrid;
                      if (card._drag.mode === "move") {
                        const ns = Math.round((e.startMin + card._drag.deltaMin) / g) * g;
                        eMin = e.endMin + (ns - e.startMin);
                        sMin = ns;
                      } else {
                        let dur = Math.round((e.endMin - e.startMin + card._drag.deltaMin) / g) * g;
                        if (dur < g) dur = g;
                        eMin = e.startMin + dur;
                      }
                    }
                    let top = (sMin - startMin) * px;
                    const h = Math.max((eMin - sMin) * px - 3, 16);
                    const c = card._eventColor(e);
                    const leftPct = (e.col / e.cols) * 100;
                    const widthPct = ((e.span ?? 1) / e.cols) * 100;
                    const tent = card._isTentative(e);
                    const slim = h < 24; // very short events: single-line strip on top
                    const canDrag = card._draggable(e);
                    if (slim && e.cols === 1 && !dragging) {
                      top = Math.max(top, lastSlimBottom + 1);
                      lastSlimBottom = top + h;
                    }
                    return html`
                      <div
                        class="event ${card._isPast(e) ? "past" : ""} ${tent
                          ? "tentative"
                          : ""} ${card._isTodo(e) ? "todo" : ""} ${slim ? "slim" : ""} ${canDrag
                          ? "draggable"
                          : ""} ${dragging ? "dragging" : ""}"
                        tabindex="0"
                        role="button"
                        @pointerdown=${(ev: PointerEvent) =>
                          card._onEventPointerDown(ev, e, "move")}
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          if (card._suppressClick) {
                            card._suppressClick = false;
                            return;
                          }
                          card._openEvent(e);
                        }}
                        @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
                        style="top:${top + 1.5}px;height:${h}px;
                             left:calc(${leftPct}% + 2px);width:calc(${widthPct}% - 4px);
                             border-left:3px ${tent
                          ? "dashed"
                          : "solid"} ${c};background:${c}40;background:color-mix(in srgb, ${c} 32%, var(--card-background-color, #fff));"
                        title="${card._evTitle(e)} · ${formatMinutes(
                          card.hass,
                          e.startMin,
                        )}–${formatMinutes(card.hass, e.endMin)}"
                      >
                        <span class="etitle ${card._isTodo(e) ? "todo-line" : ""}"
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
                        ${h > 32 || dragging
                          ? html`<span class="etime"
                              >${formatMinutes(card.hass, sMin)}–${formatMinutes(
                                card.hass,
                                eMin,
                              )}</span
                            >`
                          : nothing}
                        ${card._progressOn && card._isCurrent(e) && !dragging
                          ? html`<div class="eprog">
                              <div style="width:${card._progressPct(e)}%"></div>
                            </div>`
                          : nothing}
                        ${canDrag && !slim
                          ? html`<div
                              class="rz"
                              @pointerdown=${(ev: PointerEvent) =>
                                card._onEventPointerDown(ev, e, "resize")}
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
                      title="${o.count} ${card._t("more_events")}"
                      @click=${(ev: MouseEvent) => {
                        ev.stopPropagation();
                        card._showDayAgenda(day);
                      }}
                      @keydown=${(k: KeyboardEvent) => {
                        if (k.key === "Enter" || k.key === " ") {
                          k.preventDefault();
                          card._showDayAgenda(day);
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
            const bandStyle = card._sharedBandStyle(e, px, startMin);
            if (!bandStyle) return nothing;
            const { height: bandHeight } = card._sharedBandBox(e, px, startMin);
            const c = card._eventColor(e);
            const tent = card._isTentative(e);
            return html`
              <div
                class="shared-band ${card._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                tabindex="0"
                role="button"
                @click=${(ev: MouseEvent) => {
                  ev.stopPropagation();
                  card._openEvent(e);
                }}
                @keydown=${(k: KeyboardEvent) => card._onItemKey(k, e)}
                style="${bandStyle};
                       border-left:3px ${tent ? "dashed" : "solid"} ${c};
                       background:${c}1f;
                       background:color-mix(in srgb, ${c} 14%, var(--card-background-color, #fff))"
                title="${card._evTitle(e)} · ${formatMinutes(
                  card.hass,
                  e.startMin,
                )}–${formatMinutes(card.hass, e.endMin)}"
              >
                <span class="shared-tag">${card._sharedLabel(e)}</span>
                <span class="etitle"
                  >${e.continuesBefore ? "« " : ""}${card._calIconEl(e)}${card._evTitle(
                    e,
                  )}${e.continuesAfter ? " »" : ""}</span
                >
                ${bandHeight > 24
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
        ${showNow
          ? html`<div class="nowline" style="top:${(nowMin - startMin) * px}px">
              <span>${formatMinutes(card.hass, nowMin)}</span>
            </div>`
          : nothing}
        ${!card._loading && !card._loadError && !card._dayHasEvents(day)
          ? html`<div class="empty">${card._t("no_events")}</div>`
          : nothing}
      </div>
    </div>
  `;
}
