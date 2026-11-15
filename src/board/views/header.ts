import { html, nothing } from "lit";
import type { RawEvent } from "../../events";
import { formatCountdown, formatTime, formatWeekRange } from "../../localize";
import { daysUntil, fillTemplate, noticeActive, stripMarker } from "../../extras";
import type { LeaveInfo } from "../../extras";
import { WEATHER_ICON, personColor, toLocalDate } from "../utils";
import type { FamilyBoardCard } from "../../ha-family-board-card";

/** Wall display header: big clock, weekday + date, current weather, view toggle. */
export function renderClockHeader(card: FamilyBoardCard) {
  const now = new Date();
  const locale = card.hass.locale?.language || "en";
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(now);
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(now);
  return html`
    <div class="clockhead">
      ${backButton(card)}
      <div class="clock">
        <span class="ctime">${formatTime(card.hass, now)}</span>
        <span class="cdate"><b>${weekday}</b><span>${date}</span></span>
      </div>
      ${currentWeather(card)} ${renderCountdowns(card)}
      <span class="cspacer"></span>
      ${viewSwitch(card)}
    </div>
  `;
}

/** Current conditions from the weather entity (plus today's high/low), or nothing. */
export function currentWeather(card: FamilyBoardCard) {
  const ent = card._config.weather_entity;
  const st = ent && card._config.show_weather !== false ? card.hass.states[ent] : undefined;
  if (!st) return nothing;
  const temp = Number(st.attributes?.temperature);
  const unit = (st.attributes?.temperature_unit as string | undefined) ?? "°";
  const fmt = (card.hass as any).formatEntityState;
  const label = typeof fmt === "function" ? fmt(st) : st.state;
  const today = card._forecast[toLocalDate(new Date())];
  return html`<button class="cwx" @click=${() => card._moreInfo(ent!)}>
    <ha-icon icon="mdi:${WEATHER_ICON[st.state] || "weather-cloudy"}"></ha-icon>
    <span class="cwxmain">
      <span class="cwxtemp">${Number.isFinite(temp) ? Math.round(temp) : "–"}${unit}</span>
      <span class="cwxsub"
        >${label}${today
          ? html` · ↑${today.temp}°${today.low !== undefined ? html` ↓${today.low}°` : nothing}`
          : nothing}</span
      >
    </span>
  </button>`;
}

export function renderCountdowns(card: FamilyBoardCard) {
  if (!card._countdowns.length) return nothing;
  const now = new Date();
  return html`<div class="cdowns">
    ${card._countdowns.map((c) => {
      const n = daysUntil(now, c.start);
      return html`<button
        class="cdown ${n <= 1 ? "hot" : ""}"
        style="--c:${c.color}"
        title=${c.start.toLocaleDateString(card.hass.locale?.language)}
        @click=${() => card._goToDate(c.start)}
      >
        <span class="cdnum">${n <= 1 ? "🎉" : n}</span>
        <span class="cdtxt"><b>${c.title}</b><small>${card._countdownText(n)}</small></span>
      </button>`;
    })}
  </div>`;
}

/** Entity notices (bins, dishwasher, ...) plus urgent "leave now" hints for today. */
export function renderExtras(card: FamilyBoardCard) {
  void card._travelRev; // re-render when travel times arrive
  const notices = (card._config.notices ?? []).filter((n) => {
    const st = card.hass.states[n.entity]?.state;
    const done = card._noticeDone[n.entity];
    if (done && done.state === st && Date.now() - done.at < 120000) return false;
    return noticeActive(st, n.idle_states);
  });
  const now = Date.now();
  const leaving = card._raw
    .filter((r) => !card._isOff(r.personIdx) && r.start.getTime() > now)
    .map((r) => ({ r, l: card._leaveFor(r) }))
    .filter((x): x is { r: RawEvent; l: LeaveInfo } => !!x.l && x.l.level !== "info")
    .filter(
      (x, i, all) =>
        all.findIndex(
          (y) => y.r.summary === x.r.summary && y.r.start.getTime() === x.r.start.getTime(),
        ) === i,
    )
    .slice(0, 2);
  const cds = card._config.clock_header ? nothing : renderCountdowns(card);
  if (!notices.length && !leaving.length && cds === nothing) return nothing;
  return html`<div class="extras">
    ${cds}
    ${leaving.map(
      ({ r, l }) =>
        html`<div class="notice leave ${l.level}">
          <ha-icon icon="mdi:car"></ha-icon>
          <span class="ntxt"
            ><b>${card._leaveText(l)}</b
            ><small>${stripMarker(r.summary, "")} · ${formatTime(card.hass, r.start)}</small></span
          >
        </div>`,
    )}
    ${notices.map((n) => {
      const st = card.hass.states[n.entity];
      const name = String(st?.attributes?.friendly_name ?? n.entity);
      const title = n.title ? fillTemplate(n.title, { state: st!.state, name }) : st!.state;
      return html`<div class="notice" style=${n.color ? `--c:${n.color}` : ""}>
        <button class="nbody" @click=${() => card._moreInfo(n.entity)}>
          <ha-icon icon=${n.icon || "mdi:information-outline"}></ha-icon>
          <span class="ntxt"><b>${title}</b></span>
        </button>
        ${n.button && n.action
          ? html`<button class="nbtn" @click=${() => card._runNotice(n)}>
              <ha-icon icon="mdi:check"></ha-icon>${n.button}
            </button>`
          : nothing}
      </div>`;
    })}
  </div>`;
}

/** "Jetzt / als Nächstes" glance bar — one chip per (visible) person. */
export function renderFocus(card: FamilyBoardCard) {
  return html`
    <div class="focus">
      ${card._persons.map((p, i) => {
        if (card._isOff(i)) return nothing;
        const { current, next } = card._focusFor(i);
        const c = personColor(p, i);
        const icon = (r: RawEvent) => (card._config.auto_icons ? card._autoIcon(r.summary) : "");
        return html`
          <div class="fchip" title=${card._personName(p, i)}>
            ${card._avatar(p, i)}
            <div class="fbody">
              <span class="fname">${card._personName(p, i)}</span>
              ${current
                ? html`<span class="fnow">
                    <span class="fdot" style="background:${c}"></span>${icon(current)}
                    ${current.summary}
                    <small>bis ${formatTime(card.hass, current.end)}</small>
                  </span>`
                : next
                  ? html`<span class="fnext">
                      ${card._t("focus_next")}: ${icon(next)} ${next.summary}
                      <small>${formatCountdown(card.hass, next.start)}</small>
                    </span>`
                  : html`<span class="ffree">${card._t("focus_free")}</span>`}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

/** Floating "+" (all views): new event; asks "for whom?" when several can be chosen. */
export function renderFab(card: FamilyBoardCard) {
  if (card._creators().length === 0) return nothing;
  return html`<button
    class="plfab"
    aria-label=${card._t("add_event")}
    @click=${() => card._openCreateFor(card._createDate())}
  >
    <ha-icon icon="mdi:plus"></ha-icon>
  </button>`;
}

export function weekNav(card: FamilyBoardCard) {
  const { monday } = card._weekBounds();
  return html`
    <div class="weeknav">
      <button class="nav" aria-label=${card._t("prev_week")} @click=${card._prevWeek}>‹</button>
      <button class="nav-now" @click=${card._thisWeek}>
        ${formatWeekRange(card.hass, monday)}
      </button>
      <button class="nav" aria-label=${card._t("next_week")} @click=${card._nextWeek}>›</button>
    </div>
  `;
}

/** Avatar chips that hide/show a person in every view (legend-style filter). */
export function renderPersonFilter(card: FamilyBoardCard) {
  return html`<div class="pfilter" role="group" aria-label=${card._t("filter_persons")}>
    ${card._persons.map((p, i) => {
      const off = card._isOff(i);
      const where = card._presence(p);
      return html`<button
        class="pchip ${off ? "off" : ""} ${where ? `at-${where.kind}` : ""}"
        aria-pressed=${!off}
        style="--c:${personColor(p, i)}"
        @click=${() => card._togglePerson(i)}
      >
        ${card._avatar(p, i)}${card._presenceLabel(p, i)}
      </button>`;
    })}
  </div>`;
}

/** Segmented view toggle (only when more than one view is enabled). */
export function viewSwitch(card: FamilyBoardCard) {
  if (card._enabledViews.length < 2) return nothing;
  return html`<div class="switch" role="tablist">
    ${card._enabledViews.map(
      (v) =>
        html`<button
          role="tab"
          aria-selected=${card._view === v}
          class=${card._view === v ? "on" : ""}
          @click=${() => (card._view = v)}
        >
          ${card._t(v)}
        </button>`,
    )}
  </div>`;
}

/** Round back button, shown when `back_path` is set (wall tablet: back to the home dashboard). */
export function backButton(card: FamilyBoardCard) {
  if (!card._config.back_path) return nothing;
  return html`<button class="back" aria-label=${card._t("back")} @click=${card._navigateBack}>
    <ha-icon icon="mdi:chevron-left"></ha-icon>
  </button>`;
}
