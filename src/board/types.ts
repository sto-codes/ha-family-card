import type { LovelaceCardConfig } from "custom-card-helpers";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export type ViewName = "day" | "planner" | "week" | "month" | "agenda" | "timeline";
export const ALL_VIEWS: ViewName[] = ["day", "planner", "timeline", "week", "month", "agenda"];
export const PLANNER_DAYS_DEFAULT = 7;

export interface PersonConfig {
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
  planner_days?: number; // planner view: number of day columns starting today. default 7
  clock_header?: boolean; // wall display: big clock, date and current weather as the card header
  back_path?: string; // shows a back button that navigates to this dashboard path
  auto_back?: number; // kiosk: minutes without touch before navigating to back_path. 0=off
  home_zone?: string; // zone that counts as "home" for presence and travel. default zone.home
  show_presence?: boolean; // person chips show where everyone is. default true
  countdowns?: boolean | CountdownConfig; // "⏳ Urlaub" events become countdown chips
  travel?: TravelConfig; // "time to leave" for today's events with a location (Waze)
  notices?: NoticeConfig[]; // banners driven by entities, e.g. "Put the bin out" + done button
}

export interface CountdownConfig {
  marker?: string; // default ⏳
  days?: number; // how far ahead to look. default 365
  max?: number; // chips shown at most. default 3
}

export interface TravelConfig {
  origin?: string; // zone / person / "lat,lon". default home_zone
  region?: "eu" | "us" | "na" | "il" | "au"; // Waze region. default eu
  buffer?: number; // minutes added for parking etc. default 5
  lead?: number; // only events starting within this many minutes. default 120
  vehicle_type?: "car" | "taxi" | "motorcycle";
  places?: Record<string, string>; // location text -> zone.x or "lat,lon"
  geocode?: boolean; // look up addresses at OpenStreetMap (Nominatim). default true
}

export interface NoticeConfig {
  entity: string; // shown while its state is not off/unknown/unavailable/...
  title?: string; // "{state} rausstellen"; default: the state
  icon?: string;
  color?: string;
  idle_states?: string[]; // states that hide the notice
  button?: string; // label of the confirm button
  action?: { action: string; target?: Record<string, unknown>; data?: Record<string, unknown> };
}

export interface CountdownItem {
  title: string;
  start: Date;
  color: string;
}

export interface TravelEntry {
  at: number; // ms timestamp of the lookup
  min?: number; // driving minutes; undefined = not routable / at home
}

/** A collapsed "+N more" marker for dense overlap clusters in the day view. */
export interface Overflow {
  col: number;
  cols: number;
  startMin: number;
  endMin: number;
  count: number;
}

export type TodoStatus = "needs_action" | "completed";

export interface TodoItem {
  uid?: string;
  summary: string;
  status: TodoStatus;
  due?: string;
  description?: string;
}

export interface PersonTodoItem extends TodoItem {
  entityId: string;
  listLabel: string;
}

export interface NormalizedSharedGroup {
  ids: string[];
  personIdxs: number[];
  label?: string;
}

export interface TodoDialogState {
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

export interface TodoBadgeDialogState {
  personIdx: number;
}

/** State of the create/edit dialog. */
export interface DialogState {
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
  pickPersons?: number[]; // planner "+": persons to choose from (avatar row in the dialog)
  busy?: boolean;
  error?: string;
}
