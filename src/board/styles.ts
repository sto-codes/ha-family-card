import { css } from "lit";

export const boardStyles = css`
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
  .titlewrap {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  button.back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    color: var(--primary-text-color);
    background: var(--fb-soft, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
  }
  button.back ha-icon {
    --mdc-icon-size: 26px;
  }
  /* wall display header: clock · date · weather · view toggle */
  .clockhead {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px 22px;
    padding: 14px 18px 12px;
    border-bottom: 1px solid var(--divider-color);
  }
  .clock {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .ctime {
    font-size: var(--fb-clock-size, 54px);
    font-weight: 300;
    letter-spacing: -2px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .cdate {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }
  .cdate b {
    font-size: 21px;
    font-weight: 750;
    letter-spacing: -0.3px;
  }
  .cdate span {
    font-size: 14px;
    color: var(--secondary-text-color);
  }
  button.cwx {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
    padding: 7px 14px 7px 10px;
    border-radius: 18px;
    background: var(--fb-soft, color-mix(in srgb, var(--primary-text-color) 7%, transparent));
  }
  button.cwx ha-icon {
    --mdc-icon-size: 34px;
    color: var(--fb-weather-icon, #ffd77a);
  }
  .cwxmain {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }
  .cwxtemp {
    font-size: 22px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .cwxsub {
    font-size: 12px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .cspacer {
    flex: 1;
  }
  /* presence: ring around the avatar + where they are */
  button.pchip.at-home .avatar {
    box-shadow: 0 0 0 2px var(--fb-home-color, #5bd68a) !important;
  }
  button.pchip.at-zone .avatar {
    box-shadow: 0 0 0 2px var(--fb-zone-color, #8fd3ff) !important;
  }
  button.pchip.at-away .avatar {
    box-shadow: 0 0 0 2px var(--divider-color) !important;
    opacity: 0.75;
  }
  .pcname {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;
  }
  .pcname small {
    font-size: 10.5px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  /* countdown chips */
  .cdowns {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  button.cdown {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
    padding: 5px 14px 5px 5px;
    border-radius: 18px;
    background: var(--fb-soft, color-mix(in srgb, var(--primary-text-color) 7%, transparent));
  }
  .cdnum {
    flex: none;
    min-width: 34px;
    height: 34px;
    padding: 0 4px;
    box-sizing: border-box;
    border-radius: 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
    background: color-mix(in srgb, var(--c) 30%, transparent);
    box-shadow: inset 0 0 0 1.5px var(--c);
  }
  button.cdown.hot .cdnum {
    background: var(--c);
  }
  .cdtxt {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    max-width: 170px;
  }
  .cdtxt b,
  .ntxt b {
    font-size: 13.5px;
    font-weight: 650;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cdtxt small,
  .ntxt small {
    font-size: 11.5px;
    color: var(--secondary-text-color);
  }
  /* notices strip under the header */
  .extras {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 16px 0;
  }
  .notice {
    --c: var(--fb-notice-color, #7ee2b8);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    border-radius: 16px;
    background: color-mix(in srgb, var(--c) 18%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 55%, transparent);
    animation: fb-fade 0.3s ease-out;
  }
  .notice > ha-icon,
  .notice .nbody ha-icon {
    --mdc-icon-size: 20px;
    color: var(--c);
    margin-left: 6px;
  }
  .notice .nbody {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    padding: 4px 6px 4px 0;
  }
  .ntxt {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1.15;
    padding-right: 8px;
  }
  .notice .nbtn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: none;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    padding: 7px 14px 7px 10px;
    border-radius: 12px;
    background: var(--c);
    color: #1b1726;
  }
  .notice .nbtn ha-icon {
    --mdc-icon-size: 18px;
  }
  .notice.morning {
    --c: var(--fb-morning-color, #8fd3ff);
    flex-wrap: wrap;
    padding: 6px 10px 6px 4px;
    row-gap: 6px;
  }
  .notice.morning .mrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px 3px 3px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--c) 14%, transparent);
    font-size: 13px;
    font-weight: 600;
  }
  .notice.morning .mrow.tip {
    padding-left: 8px;
  }
  .notice.morning .mrow ha-icon {
    --mdc-icon-size: 18px;
    color: var(--c);
  }
  .notice.morning .mini {
    margin: 0;
  }
  .notice.morning .mrow b {
    font-weight: 750;
  }
  .notice.leave {
    --c: var(--fb-leave-soon, #ffc46b);
  }
  .notice.leave.now {
    --c: var(--fb-leave-now, #ff7a85);
    animation: fb-attn 1.6s ease-in-out infinite;
  }
  @keyframes fb-attn {
    50% {
      background: color-mix(in srgb, var(--c) 34%, transparent);
    }
  }
  .plleave {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 3px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--secondary-text-color);
  }
  .plleave ha-icon {
    --mdc-icon-size: 14px;
    flex: none;
  }
  .plleave span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .plleave.soon {
    color: var(--fb-leave-soon, #ffc46b);
  }
  .plleave.now {
    color: var(--fb-leave-now, #ff7a85);
  }
  /* person filter chips */
  .pfilter {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-left: auto;
  }
  button.pchip {
    --fb-avatar-size: 24px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 3px 12px 3px 3px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--c) 55%, transparent);
    background: color-mix(in srgb, var(--c) 16%, transparent);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition:
      opacity 0.2s ease,
      background 0.2s ease;
  }
  button.pchip.off {
    opacity: 0.4;
    background: transparent;
    border-color: var(--divider-color);
  }
  button.pchip.off .avatar {
    filter: grayscale(1);
  }
  button.pchip.sel {
    background: color-mix(in srgb, var(--c) 34%, transparent);
    border-color: var(--c);
  }
  .whom {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  /* planner: one column per day, Skylight-style */
  .plnav {
    gap: 10px 14px;
  }
  .board.planner {
    display: grid;
    grid-template-columns: repeat(var(--pl-cols), minmax(var(--fb-planner-min, 136px), 1fr));
    gap: var(--fb-planner-gap, 10px);
    padding: 12px 14px 14px;
    margin-top: 0;
    height: var(--fb-planner-height, 62vh);
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: border-box;
    scroll-snap-type: x proximity;
    touch-action: pan-x pan-y;
  }
  .plcol {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    border-radius: var(--fb-planner-radius, 20px);
    background: var(--fb-col-bg, color-mix(in srgb, var(--primary-text-color) 4%, transparent));
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    scroll-snap-align: start;
    overflow: hidden;
  }
  .plcol.today {
    background: var(--fb-today-bg, color-mix(in srgb, var(--fb-accent) 10%, transparent));
    border-color: color-mix(in srgb, var(--fb-accent) 45%, transparent);
  }
  .plhead {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 9px 6px 8px;
  }
  .plwd {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .plcol.today .plwd {
    color: var(--primary-text-color);
  }
  .pldate {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: -1px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .plcol.today .pldate {
    font-weight: 650;
    font-size: 22px;
    letter-spacing: -0.5px;
    border-radius: 50%;
    background: var(--fb-accent);
    color: var(--fb-accent-text, var(--text-primary-color, #fff));
  }
  .plsub {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .plwx {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--primary-text-color);
  }
  .plwx ha-icon {
    --mdc-icon-size: 15px;
    color: var(--fb-weather-icon, var(--secondary-text-color));
  }
  .plhead {
    cursor: pointer;
    border-radius: 16px;
    -webkit-tap-highlight-color: transparent;
  }
  .plhead:active {
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
  }
  ha-card {
    position: relative;
  }
  button.plfab {
    position: absolute;
    right: 22px;
    bottom: 22px;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: var(--fb-accent);
    color: var(--fb-accent-text, var(--text-primary-color, #fff));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    transition: transform 0.12s ease;
  }
  button.plfab:active {
    transform: scale(0.94);
  }
  button.plfab ha-icon {
    --mdc-icon-size: 28px;
  }
  .plbody {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 2px 8px 12px;
    scrollbar-width: none;
    -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 18px), transparent);
    mask-image: linear-gradient(to bottom, #000 calc(100% - 18px), transparent);
  }
  .plbody::-webkit-scrollbar {
    display: none;
  }
  .plbody.creatable {
    cursor: copy;
  }
  .pchip .avatar.initials ha-icon {
    --mdc-icon-size: 16px;
    color: #1b1726;
  }
  .plfree {
    margin: 10px 0 0;
    padding: 14px 0;
    border-radius: 12px;
    border: 1px dashed color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    text-align: center;
    font-size: 12.5px;
    color: var(--secondary-text-color);
    opacity: 0.7;
  }
  .plall,
  .plev {
    flex: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      transform 0.12s ease,
      opacity 0.2s ease;
  }
  .plall:active,
  .plev:active {
    transform: scale(0.98);
  }
  .plall {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px 6px 10px;
    border-radius: 12px;
    background: var(--c);
    color: #fff;
    font-size: var(--fb-planner-size, 13.5px);
    font-weight: 650;
    min-height: 30px;
    box-sizing: border-box;
  }
  .plall .pltitle {
    flex: 1;
    min-width: 0;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    hyphens: auto;
    overflow-wrap: break-word;
  }
  .plall ha-icon.cicon {
    --mdc-icon-size: 16px;
    flex: none;
  }
  .plev {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px 10px 9px 13px;
    border-radius: 14px;
    background: color-mix(in srgb, var(--c) 17%, transparent);
    box-shadow: inset 4px 0 0 var(--c);
    overflow: hidden;
  }
  .plev.current .pltime {
    color: var(--primary-text-color);
  }
  .plev.current {
    background: color-mix(in srgb, var(--c) 30%, transparent);
    box-shadow:
      inset 4px 0 0 var(--c),
      0 0 0 1.5px var(--c),
      0 6px 18px color-mix(in srgb, var(--c) 35%, transparent);
  }
  .plev.tentative {
    background: transparent;
    box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--c) 70%, transparent);
    border: none;
    outline: 1.5px dashed var(--c);
    outline-offset: -1.5px;
  }
  .plmeta {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 18px;
  }
  .plev {
    container-type: inline-size;
  }
  @container (max-width: 80px) {
    .pltime .tend {
      display: none;
    }
  }
  .pltime {
    overflow: hidden;
    font-size: 12px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    color: color-mix(in srgb, var(--c) 55%, var(--primary-text-color));
    white-space: nowrap;
  }
  .plev .pltitle {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    font-size: var(--fb-planner-size, 14px);
    font-weight: 600;
    line-height: 1.25;
    hyphens: auto;
    overflow-wrap: break-word;
  }
  .plev .pltitle > span {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .plloc {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11.5px;
    color: var(--secondary-text-color);
    min-width: 0;
  }
  .plloc span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .plloc ha-icon {
    --mdc-icon-size: 13px;
    flex: none;
  }
  .plprog {
    height: 3px;
    border-radius: 2px;
    margin-top: 3px;
    background: color-mix(in srgb, var(--c) 25%, transparent);
    overflow: hidden;
  }
  .plprog span {
    display: block;
    height: 100%;
    background: var(--c);
  }
  .plwho {
    display: flex;
    justify-content: flex-end;
    margin-top: 1px;
  }
  .plwho .plowners {
    margin-left: 0;
  }
  .board.planner .plcol:last-child .plbody {
    padding-bottom: 76px;
  }
  .plowners {
    display: inline-flex;
    align-items: center;
    margin-left: auto;
    padding-left: 6px;
    flex: none;
  }
  .plowners .mini + .mini {
    margin-left: -6px;
  }
  .mini {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    box-shadow:
      0 0 0 1.5px var(--c),
      0 0 0 3px var(--fb-mini-ring, var(--card-background-color, #222));
  }
  .mini.initials {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: #1b1726;
  }
  .plgroup {
    --mdc-icon-size: 18px;
    opacity: 0.8;
  }
  .plall .mini {
    box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.8);
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
    background: var(--fb-switch-on, var(--primary-color));
    color: var(--fb-switch-on-text, var(--text-primary-color, #fff));
    font-weight: 600;
    box-shadow: 0 1px 4px
      color-mix(in srgb, var(--fb-switch-on, var(--primary-color)) 45%, transparent);
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
    color: var(--fb-accent-text, var(--text-primary-color, #fff));
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
    min-width: 0; /* datetime inputs have a wide intrinsic size; let them shrink */
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
