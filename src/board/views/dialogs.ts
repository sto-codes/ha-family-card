import { html, nothing } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { SHARED_PERSON_IDX, hashColor, personColor } from "../utils";
import type { FamilyBoardCard } from "../../ha-family-board-card";

export function renderDialog(card: FamilyBoardCard) {
  const d = card._dialog!;
  const readOnly = d.mode === "edit" && !d.canUpdate;
  const calName = card._calLabel(d.calendar);
  const heading =
    d.mode === "create"
      ? card._t("new_event")
      : readOnly
        ? card._t("event")
        : card._t("edit_event");
  return html`
    <div
      class="overlay"
      @click=${(e: MouseEvent) => {
        if (e.target === e.currentTarget) card._closeDialog();
      }}
    >
      <div class="dialog" role="dialog" aria-modal="true" aria-label=${heading}>
        <div class="dlg-head">
          <span>${heading}</span>
          <button class="icon" aria-label=${card._t("close")} @click=${card._closeDialog}>✕</button>
        </div>
        ${d.mode === "create" && d.pickPersons && d.pickPersons.length > 1
          ? html`<div class="fld">
              <span>${card._t("for_whom")}</span>
              <div class="whom">
                ${d.pickPersons.map((i) => {
                  if (i === SHARED_PERSON_IDX) {
                    const ids = card._writableFor(i);
                    const c = card._calMeta(ids[0]).color ?? hashColor(ids[0] ?? "shared");
                    return html`<button
                      class="pchip ${i === d.personIdx ? "sel" : ""}"
                      aria-pressed=${i === d.personIdx}
                      style="--c:${c}"
                      @click=${() => card._pickDialogPerson(i)}
                    >
                      <span class="avatar initials" style="background:${c}"
                        ><ha-icon icon="mdi:account-group"></ha-icon></span
                      ><span>${card._t("shared_events")}</span>
                    </button>`;
                  }
                  const p = card._persons[i];
                  return html`<button
                    class="pchip ${i === d.personIdx ? "sel" : ""}"
                    aria-pressed=${i === d.personIdx}
                    style="--c:${personColor(p, i)}"
                    @click=${() => card._pickDialogPerson(i)}
                  >
                    ${card._avatar(p, i)}<span>${card._personName(p, i)}</span>
                  </button>`;
                })}
              </div>
            </div>`
          : nothing}
        ${d.calendarOptions && d.calendarOptions.length > 1
          ? html`<label class="fld">
              <span>${card._t("field_calendar")}</span>
              ${
                // a fresh <select> per person: a reused one keeps the old value when
                // its options are swapped and would show an empty field
                keyed(
                  d.calendarOptions.join(","),
                  html`<select
                    .value=${d.calendar}
                    @change=${(e: Event) =>
                      card._dlgField("calendar", (e.target as HTMLSelectElement).value)}
                  >
                    ${d.calendarOptions.map(
                      (c) =>
                        html`<option value=${c} ?selected=${c === d.calendar}>
                          ${card._calLabel(c)}
                        </option>`,
                    )}
                  </select>`,
                )
              }
            </label>`
          : html`<div class="dlg-cal">${calName}</div>`}

        <label class="fld">
          <span>${card._t("field_title")}</span>
          <input
            type="text"
            .value=${d.summary}
            ?disabled=${readOnly}
            autofocus
            @input=${(e: Event) => card._dlgField("summary", (e.target as HTMLInputElement).value)}
          />
        </label>

        <label class="chk">
          <input
            type="checkbox"
            .checked=${d.allDay}
            ?disabled=${readOnly}
            @change=${(e: Event) => card._toggleAllDay((e.target as HTMLInputElement).checked)}
          />
          <span>${card._t("field_all_day")}</span>
        </label>

        <div class="row">
          <label class="fld">
            <span>${card._t("field_start")}</span>
            <input
              type=${d.allDay ? "date" : "datetime-local"}
              .value=${d.start}
              ?disabled=${readOnly}
              @input=${(e: Event) => card._dlgField("start", (e.target as HTMLInputElement).value)}
            />
          </label>
          <label class="fld">
            <span>${card._t("field_end")}</span>
            <input
              type=${d.allDay ? "date" : "datetime-local"}
              .value=${d.end}
              ?disabled=${readOnly}
              @input=${(e: Event) => card._dlgField("end", (e.target as HTMLInputElement).value)}
            />
          </label>
        </div>

        <label class="fld">
          <span>
            ${card._t("field_location")}
            ${d.location.trim()
              ? html`<a
                  class="maplink"
                  href=${card._mapUrl(d.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  @click=${(e: Event) => e.stopPropagation()}
                  >${card._t("open_map")}</a
                >`
              : nothing}
          </span>
          <input
            type="text"
            .value=${d.location}
            ?disabled=${readOnly}
            @input=${(e: Event) => card._dlgField("location", (e.target as HTMLInputElement).value)}
          />
        </label>

        <label class="fld">
          <span>${card._t("field_note")}</span>
          <textarea
            rows="2"
            .value=${d.description}
            ?disabled=${readOnly}
            @input=${(e: Event) =>
              card._dlgField("description", (e.target as HTMLTextAreaElement).value)}
          ></textarea>
        </label>

        ${d.mode === "edit" && d.recurring && !readOnly
          ? html`<div class="recur">
              <span class="recur-label">${card._t("recurring")}</span>
              <label class="recur-opt">
                <input
                  type="radio"
                  name="recur"
                  ?checked=${d.recurrenceRange === ""}
                  @change=${() => card._dlgField("recurrenceRange", "")}
                />
                <span>${card._t("recur_this")}</span>
              </label>
              <label class="recur-opt">
                <input
                  type="radio"
                  name="recur"
                  ?checked=${d.recurrenceRange === "THISANDFUTURE"}
                  @change=${() => card._dlgField("recurrenceRange", "THISANDFUTURE")}
                />
                <span>${card._t("recur_future")}</span>
              </label>
            </div>`
          : nothing}
        ${readOnly ? html`<div class="ro-note">${card._t("read_only")}</div>` : nothing}
        ${d.error ? html`<div class="dlg-error">${d.error}</div>` : nothing}

        <div class="dlg-actions">
          ${d.mode === "edit" && d.canDelete
            ? html`<button class="danger" ?disabled=${d.busy} @click=${card._deleteDialog}>
                ${card._t("delete")}
              </button>`
            : nothing}
          <span class="spacer"></span>
          <button class="ghost" ?disabled=${d.busy} @click=${card._closeDialog}>
            ${card._t("cancel")}
          </button>
          ${!readOnly
            ? html`<button class="primary" ?disabled=${d.busy} @click=${card._saveDialog}>
                ${d.busy ? "…" : card._t("save")}
              </button>`
            : nothing}
        </div>
      </div>
    </div>
  `;
}

export function renderTodoDialog(card: FamilyBoardCard) {
  const d = card._todoDialog!;
  const readOnly = !d.canUpdate;
  const heading = readOnly ? card._t("todo") : card._t("edit_todo");
  return html`
    <div
      class="overlay"
      @click=${(e: MouseEvent) => {
        if (e.target === e.currentTarget) card._closeTodoDialog();
      }}
    >
      <div class="dialog" role="dialog" aria-modal="true" aria-label=${heading}>
        <div class="dlg-head">
          <span>${heading}</span>
          <button class="icon" aria-label=${card._t("close")} @click=${card._closeTodoDialog}>
            ✕
          </button>
        </div>
        <div class="dlg-cal">${card._todoLabel(d.entityId)}</div>
        <label class="fld">
          <span>${card._t("field_title")}</span>
          <input
            type="text"
            .value=${d.summary}
            ?disabled=${readOnly}
            autofocus
            @input=${(e: Event) =>
              card._todoDlgField("summary", (e.target as HTMLInputElement).value)}
          />
        </label>
        ${d.supportsDueDate
          ? html`<label class="fld">
              <span>${card._t("field_due")}</span>
              <input
                type=${d.supportsDueDatetime ? "datetime-local" : "date"}
                .value=${d.due}
                ?disabled=${readOnly}
                @input=${(e: Event) =>
                  card._todoDlgField("due", (e.target as HTMLInputElement).value)}
              />
            </label>`
          : nothing}
        ${d.supportsDescription
          ? html`<label class="fld">
              <span>${card._t("field_note")}</span>
              <textarea
                rows="2"
                .value=${d.description}
                ?disabled=${readOnly}
                @input=${(e: Event) =>
                  card._todoDlgField("description", (e.target as HTMLTextAreaElement).value)}
              ></textarea>
            </label>`
          : nothing}
        ${d.error ? html`<div class="dlg-error">${d.error}</div>` : nothing}
        <div class="dlg-actions">
          ${d.canUpdate
            ? html`<button class="ghost" ?disabled=${d.busy} @click=${card._completeTodoDialog}>
                ${card._t("todo_complete")}
              </button>`
            : nothing}
          ${d.canDelete
            ? html`<button class="danger" ?disabled=${d.busy} @click=${card._deleteTodoDialog}>
                ${card._t("delete")}
              </button>`
            : nothing}
          <span class="spacer"></span>
          <button class="ghost" ?disabled=${d.busy} @click=${card._closeTodoDialog}>
            ${card._t("cancel")}
          </button>
          ${!readOnly
            ? html`<button class="primary" ?disabled=${d.busy} @click=${card._saveTodoDialog}>
                ${d.busy ? "…" : card._t("save")}
              </button>`
            : nothing}
        </div>
      </div>
    </div>
  `;
}

export function renderTodoBadgeDialog(card: FamilyBoardCard) {
  const d = card._todoBadgeDialog!;
  const name = card._personName(card._persons[d.personIdx], d.personIdx);
  const items = card._todoItemsForPerson(d.personIdx);
  return html`
    <div
      class="overlay"
      @click=${(e: MouseEvent) => {
        if (e.target === e.currentTarget) card._closeTodoBadgeDialog();
      }}
    >
      <div class="dialog todo-badge-dialog" role="dialog" aria-modal="true" aria-label=${name}>
        <div class="dlg-head">
          <span>${name} · ${items.length} ${card._t("todo_items")}</span>
          <button class="icon" aria-label=${card._t("close")} @click=${card._closeTodoBadgeDialog}>
            ✕
          </button>
        </div>
        <div class="todo-badge-list">
          ${items.map((item) => {
            const dueLabel = card._formatTodoDue(item.due);
            return html`
              <div
                class="todo-badge-item"
                role="button"
                tabindex="0"
                @click=${() => card._openTodoFromBadge(item)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    card._openTodoFromBadge(item);
                  }
                }}
                title=${item.summary}
              >
                ${card._renderTodoItemCheckbox(item)}
                <span class="todo-badge-copy">
                  <span class="todo-badge-title">${item.summary}</span>
                  <span class="todo-badge-meta"
                    >${item.listLabel}${dueLabel ? ` · ${dueLabel}` : ""}</span
                  >
                </span>
              </div>
            `;
          })}
        </div>
      </div>
    </div>
  `;
}
