# Family Board Card

**Deutsch** · [English](README.en.md)

![Family Board Card – Tagesansicht](docs/preview-day.png)

Ein Familienkalender bzw. „Wer ist wann wo"-Board für [Home Assistant](https://www.home-assistant.io/). Personen stehen als Spalten oben (mit Avatar aus der `person.*`-Entität), links läuft die Zeitleiste. Die Karte zeigt auf einen Blick, welche Aktivitäten gleichzeitig an unterschiedlichen Orten stattfinden — für bis zu 10 Personen.

- **Planer (neu in v0.27)** – die Wandkalender-Ansicht im Skylight-Stil: ein Tag pro Spalte ab heute, farbige Termin-Kacheln je Person, Ganztägiges als Balken oben, Wetter pro Tag, laufender Termin mit Fortschritt. Derselbe Termin bei mehreren Personen wird **eine** Kachel mit allen Avataren. Wischen oder ‹ › blättert, ein Tipp auf den Tageskopf öffnet die Tagesansicht, der runde **＋**-Knopf (in allen Ansichten) legt einen Termin an und fragt „Für wen?“ – auch „Gemeinsam“ für beschreibbare gemeinsame Kalender; ein Tipp auf eine freie Stelle eines Tages legt den Termin direkt dort an.
- **Uhr-Kopf für Wandanzeigen** – `clock_header`: große Uhr, Wochentag/Datum und aktuelles Wetter mit Höchst-/Tiefstwert statt des Titels; optional ein runder **Zurück-Knopf** (`back_path`) und automatische Rückkehr nach Inaktivität (`auto_back`).
- **Wandkalender-Extras (neu in v0.29)** – **Countdowns** („⏳ Urlaub" → „noch 12× schlafen"), **Losfahren-Hinweis** mit Fahrzeit über Waze, **Hinweise mit Bestätigen-Knopf** (z. B. „Gelber Sack rausstellen · Erledigt") und **Wer ist wo** an den Personen-Chips.
- **Tagesansicht** – Personen als Spalten, geteilte Zeitachse, Jetzt-Linie; **überlappende Termine** werden nebeneinander dargestellt.
- **Wochenansicht** – Wochentage als Zeilen, Personen als Spalten, kompakte Termin-Chips.
- **Monatsansicht** – klassisches Monats-Grid mit farbigen Terminen pro Person; Klick auf einen Tag springt in die Tagesansicht.
- **Agenda-/Listenansicht** – chronologische Terminliste, nach Tagen gruppiert; ideal fürs Handy.
- **„Jetzt / als Nächstes"-Leiste** – optionale Glanz-Zeile über den Ansichten: pro Person auf einen Blick, was gerade läuft (mit Puls-Punkt) oder als Nächstes ansteht (inkl. Countdown) – ideal fürs Wandtablet.
- **Auto-Symbole** – optional bekommt jeder Termin per Stichwort ein passendes Emoji (Arzt → 🩺, Sport → 🏃, Geburtstag → 🎂, Schule → 🎒 …); eigene Regeln möglich. Titel, die schon ein Emoji haben, bleiben unberührt.
- **Zeitstrahl-Ansicht** – Personen als Zeilen links, die Zeit läuft horizontal: Termine als Balken auf einem Zeitstrahl (Gantt-Stil); überlappende Termine stapeln sich in Unterzeilen.
- **Ansichten wählbar** – im Editor festlegen, welche Umschalter (Tag/Zeitstrahl/Woche/Monat/Agenda) erscheinen.
- **Wochen-Navigation** – vor/zurück blättern, ein Klick auf den Datumsbereich springt zurück zu „heute".
- **Theme-aware** – übernimmt Farben und Schrift des aktiven Dashboard-Themes (nutzt durchgehend HA-CSS-Variablen).
- **Konfigurierbar** – Zeitraster 15/30/60 min, Tagesfenster, Wochenende ein/aus, Einfärben nach Person oder Ort, Auto-Aktualisierung.
- **Drag & Drop** – in der Tagesansicht Termine per Ziehen verschieben (Uhrzeit) und am unteren Rand die Dauer ändern; rastet aufs Zeitraster und schreibt direkt in den Kalender zurück – **nur** bei schreibbaren Kalendern, Einzeltermine (keine Serien).
- **Termine verwalten** – anlegen/bearbeiten/löschen direkt in der Karte, **aber nur** bei Kalendern, die das unterstützen (Local Calendar, CalDAV …). Schreibgeschützte Kalender (z. B. ICS-Abos) werden automatisch erkannt und nur angezeigt. Wiederkehrende Termine: Wahl **„nur dieser / dieser und folgende"**.
- **Mehrere Kalender pro Person** – z. B. Arbeit + privat in einer Spalte (im Editor auswählbar).
- **Gemeinsamer Kalender für alle** – optional kann ein Kalender einmal als **Querbalken über alle Personenspalten** dargestellt werden; ideal für Familienereignisse, Feiertage oder gemeinsame Termine.
- **Robuste Termin-Logik** – Ganztags-Events (Ende exklusiv), über Mitternacht laufende und mehrtägige Termine werden korrekt auf die Tage aufgeteilt; Zeitzonen werden berücksichtigt.
- **Mehrsprachig & lokalisiert** – Texte in Deutsch/Englisch, Wochentage und Uhrzeiten (12/24 h) aus der HA-Locale; relative Tage („Heute/Morgen").
- **Alltags-Politur** – vergangene Termine ausgegraut, Einfärben auch nach Kalender, Ort direkt in der Karten-App öffnen, störende Termine per Muster ausblenden.
- **Live-Fortschritt & Countdown** – laufende Termine zeigen einen Fortschrittsbalken (abschaltbar), kommende in der Agenda ein „in 20 Min."; aktualisiert minütlich.
- **Wetter** – Symbol + Temperatur pro Tag aus einer `weather.*`-Entität im Tages-/Agenda-Header (HA-Standort, nicht die Termin-Adresse).
- **Dichte Tage bleiben lesbar** – überlappen mehr Termine als `max_columns` erlaubt, werden die zusätzlichen Spalten zu einem „+N"-Chip zusammengefasst (Klick öffnet die Agenda) statt zu unlesbar schmalen Streifen zu schrumpfen.
- **Lange Termine als Hintergrund-Band** – Dauertermine (z. B. OGS/Betreuung, „Freispiel") ab einer einstellbaren Länge laufen als dezentes Vollbreiten-Band hinter der Spalte, statt die kurzen Stunden nebeneinander zu quetschen. So bekommen die eigentlichen Termine die volle Breite.
- **Auto-Fit-Höhe** – optional passt sich die Tagesansicht automatisch an die verfügbare Kartenhöhe an, sodass Start–Endstunde ohne Scrollen komplett sichtbar sind (ideal für Wandtablets/Kiosk).
- **Füllt den Bildschirm** – Personenspalten wachsen mit der Kartenbreite mit (Panel-Ansicht/breite Karten); mit `full_height` reicht das Board bis zum unteren Bildschirmrand. Spaltenbreite, Achsenbreite und Abstände sind einstellbar.
- **Vorläufige Termine** – Termine, deren Titel ein `tentative_patterns`-Muster enthält, werden gestrichelt und leicht transparent dargestellt (opt-in; der Kalender-Status wird bewusst nicht ausgewertet).
- **Entitäts-Badges pro Person** – beliebige Entitäten (Handy-Akku, Sensoren …) als kleine Chips unter dem Personenkopf; Klick öffnet den More-Info-Dialog.
- **To-dos pro Person** – offene Einträge aus einer oder mehreren `todo.*`-Listen erscheinen direkt im Kalender: in der Tagesansicht zusätzlich in einer eigenen **To-dos**-Zeile oben, mit Uhrzeit als Hinweis plus Termin mit Abhak-Kästchen. Per Klick lassen sie sich bearbeiten oder löschen.
- **Gemeinsame Kalender automatisch nur einmal** – wenn derselbe `calendar.*`-Eintrag bei mehreren Personen hinterlegt ist, wird er automatisch als gemeinsamer Termin statt doppelt pro Person dargestellt.
- **Kiosk-Modus** – optional nach X Minuten Inaktivität automatisch zurück zur Startansicht und zu „heute"; größere Touch-Ziele auf Touch-Geräten.
- **Visueller Editor 2.0** – komplett ohne YAML: Erststart-Assistent, Ein-Klick-Profile (🖥️ Wandtablet / 📱 Handy / 🧩 Standard), aufklappbare Themen-Gruppen mit Hilfetexten, Farbpaletten-Wähler pro Person **und pro Kalender** (inkl. Label), Feintuning-Regler (Schriftgröße, Ecken-Radius, Deckkraft) – Felder erscheinen nur, wenn die zugehörige Ansicht aktiv ist.
- **⚡ Zero-Config-Start** – beim Hinzufügen erkennt die Karte automatisch alle `person.*`-Entitäten und verknüpft passende Kalender per Namensabgleich; im Editor jederzeit per „✨ Automatisch erkennen" nachholbar.
- **Personen-Toggle** – Klick auf einen Personenkopf blendet die Person temporär aus (Spalte kollabiert zum Avatar); zweiter Klick holt sie zurück. Wirkt in allen Ansichten.
- **Termin-Aufräumer** – Allow-Liste (`show_patterns`), Titel-Ersetzung (`replace_patterns`, „Suchtext => Ersatz") und Duplikat-Filter (`filter_duplicates`, gleicher Termin in mehreren Kalendern nur 1×).
- **Mehrtägige Termine** – Segmente zeigen „(2/5)", damit klar ist, der wievielte Tag es ist.
- **Kalender-Mapping** – über `calendars:` bekommt jeder Kalender eine feste Farbe, ein eigenes Label, ein **mdi-Symbol** vor dem Titel und optional ein anderes **Titel-Feld**.
- **Titel aus einem anderen Feld** – Schul-/Stundenplan-Feeds schreiben das Fach oft in `description`, während `summary` nur „Klassenverbund" sagt: `title_field: description` zeigt endlich „Mathematik" statt dreimal dasselbe.
- **Karten-Link frei wählbar** – `map_url` mit Platzhalter `{location}` (Google Maps, Apple Maps, OpenStreetMap …), Default bleibt Google Maps.
- **Kompakt-Modus** – ein Schalter (`compact`) für kleinere Schriften und engere Abstände, statt drei Regler einzeln zu justieren.
- **Personen beim Start ausgeblendet** – `hidden: true` pro Person; die Spalte startet eingeklappt und ein Klick auf den Kopf holt sie zurück.

> Status: **v0.29 – Wandkalender: Planer-Ansicht, Uhr-Kopf, Countdowns, Losfahren-Hinweis, Hinweise, Anwesenheit; vollständige Familien-Tagesplanung: 6 Ansichten, Schreibzugriff, Auto-Layout (Trim/Fit/Full-Height), Hintergrund-Bänder, Badges, Kiosk-Modus, mobil optimiert, Karte und Editor vollständig lokalisiert.**

## Installation (HACS)

Die Karte ist Teil des offiziellen HACS-Stores:

1. HACS öffnen → nach **Family Board Card** suchen → installieren.
2. Die Lovelace-Resource wird im Storage-Mode automatisch als `/hacsfiles/ha-family-board-card/ha-family-board-card.js` registriert (im YAML-Mode manuell eintragen).
3. Karte aufs Dashboard setzen: `type: custom:family-board-card` – oder einfach „Family Board Card“ im Karten-Picker auswählen.

### Manuell (schneller Test ohne HACS)

`dist/ha-family-board-card.js` nach `config/www/` kopieren und als Resource hinzufügen:

```yaml
url: /local/ha-family-board-card.js
type: module
```

## Konfiguration

```yaml
type: custom:family-board-card
title: Familienplan  # optional, eigener Kartentitel
view: day            # day | planner | timeline | week | month | agenda
time_grid: 30        # 15 | 30 | 60
start_hour: 6
end_hour: 22
show_weekends: true
show_now_line: true
color_by: person     # person | location
hour_height: 64      # Pixel pro Stunde (40–96), Tagesansicht
refresh_interval: 300 # Sekunden; 0 = aus
shared_calendar:              # optional: ein oder mehrere gemeinsame Kalender
  - calendar.familie
  - calendar.schule
shared_todo:                  # optional: gemeinsame To-do-Listen
  - todo.familie
persons:
  - name: Anna
    person: person.anna       # Avatar (entity_picture) + Live-Status
    calendar: calendar.anna   # Quelle der Termine
    todo: todo.anna           # optional: offene To-dos direkt im Kalender anzeigen
    color: '#8B7CF6'          # optional, sonst Default-Palette
  - name: Ben
    person: person.ben
    calendar:                   # mehrere Kalender pro Person möglich
      - calendar.ben_arbeit
      - calendar.ben_privat
    todo:                       # mehrere To-do-Listen pro Person möglich
      - todo.ben
      - todo.familie
```

| Option          | Typ     | Default | Beschreibung |
|-----------------|---------|---------|--------------|
| `persons`       | Liste   | –       | 1–10 Personen mit `name`, `person`, `calendar` (String **oder Liste**), optional `todo` (String **oder Liste**), `color`, `badges` (Entitäten als Chips) und `hidden` (startet eingeklappt) |
| `shared_calendar` | string/list | – | Ein oder mehrere gemeinsame `calendar.*`, deren Termine einmal über alle Personen dargestellt werden; in der gemeinsamen Leiste stehen auch zeitgebundene Termine mit Uhrzeit |
| `shared_todo`   | string/list | – | Ein oder mehrere gemeinsame `todo.*`, deren offene Einträge einmal für alle gelten; sie werden auf dem Badge jeder Person mitgezählt und lassen sich dort in einem kompakten Fenster öffnen |
| `hide_empty_persons` | boolean | `false` | Wochenansicht: Personen ohne Termine in der Woche ausblenden |
| `show_focus`    | boolean | `false` | „Jetzt / als Nächstes"-Leiste pro Person über den Ansichten |
| `drag_drop`     | boolean | `true`  | Termine in der Tagesansicht per Ziehen verschieben / in der Dauer ändern (nur schreibbare Einzeltermine) |
| `auto_icons`    | boolean | `false` | Emoji je Termin nach Stichwort automatisch voranstellen |
| `icon_patterns` | Liste   | –       | Eigene Symbol-Regeln, z. B. `["Oma => 👵"]` |
| `auto_return`   | number  | `0`     | Kiosk: nach X Minuten ohne Berührung zurück zur Startansicht/heute (0 = aus) |
| `planner_days`  | number  | `7`     | Planer: Anzahl Tages-Spalten ab heute (1–14) |
| `clock_header`  | boolean | `false` | Wandanzeige: große Uhr, Datum und aktuelles Wetter statt des Titels |
| `back_path`     | string  | –       | Zeigt einen runden Zurück-Knopf, der zu diesem Pfad navigiert, z. B. `/dashboard-tablet/home` |
| `auto_back`     | number  | `0`     | Kiosk: nach X Minuten ohne Berührung (irgendwo auf der Seite) zu `back_path` zurück (0 = aus) |
| `home_zone`     | string  | `zone.home` | Zone, die als „zuhause" gilt (Anwesenheit, Start für Fahrzeiten) |
| `show_presence` | boolean | `true`  | Personen-Chips zeigen zuhause / Zone / unterwegs mit farbigem Ring |
| `countdowns`    | bool/Map | –      | Termine mit ⏳ im Titel als Countdown-Chips; Map: `marker`, `days`, `max` |
| `travel`        | Map     | –       | „Losfahren"-Hinweis über Waze: `origin`, `region`, `buffer`, `lead`, `places`, `geocode` |
| `notices`       | Liste   | –       | Hinweise aus Entitäten mit optionalem Bestätigen-Knopf (siehe unten) |
| `title`          | string  | –       | Eigener Kartentitel (Default: lokalisiert „Familienplan") |
| `view`          | string  | `day`   | Startansicht: `day`, `planner`, `timeline`, `week`, `month` oder `agenda` |
| `views`         | Liste   | alle    | Welche Ansichten im Umschalter erscheinen – in dieser Reihenfolge, z. B. `[planner, day, month]` |
| `time_grid`     | number  | `30`    | Raster der Zeitleiste in Minuten |
| `start_hour`    | number  | `6`     | Erste sichtbare Stunde |
| `end_hour`      | number  | `22`    | Letzte sichtbare Stunde |
| `show_weekends` | boolean | `true`  | Sa/So anzeigen |
| `show_now_line` | boolean | `true`  | Aktuelle Uhrzeit als Linie |
| `color_by`      | string  | `person`| Einfärben nach `person`, `location` oder `calendar` |
| `dim_past`      | boolean | `true`  | Bereits vergangene Termine ausgrauen |
| `hide_patterns` | Liste   | –       | Termine ausblenden, deren Titel eines der Textmuster enthält (z. B. `["Frei", "Privat"]`) |
| `show_patterns` | Liste   | –       | Allow-Liste: nur Termine zeigen, deren Titel eines der Muster enthält |
| `replace_patterns` | Liste | –      | Titel aufräumen: `"Suchtext => Ersatz"` (ohne `=>` wird der Text entfernt) |
| `filter_duplicates` | boolean | `false` | Identische Termine (Titel+Zeit) pro Person und in der Agenda nur einmal zeigen |
| `calendars`     | Map     | –       | Pro Kalender `color`, `label`, `icon` (mdi) und `title_field` (im Editor pflegbar) |
| `compact`       | boolean | `false` | Kompakte Darstellung: kleinere Schriften und engere Abstände |
| `map_url`       | string  | Google  | Vorlage für den Orts-Link, `{location}` wird eingesetzt, z. B. `https://maps.apple.com/?q={location}` |
| `event_size`    | number  | –       | Schriftgröße der Termin-Titel in px (Editor-Slider, setzt `--fb-event-size`) |
| `radius`        | number  | –       | Ecken-Radius der Termin-Blöcke in px (setzt `--fb-radius`) |
| `past_opacity`  | number  | –       | Deckkraft vergangener Termine in % (setzt `--fb-past-opacity`) |
| `show_progress` | boolean | `true`  | Fortschrittsbalken am laufenden Termin |
| `weather_entity`| string  | –       | `weather.*`-Entität für die Tages-Vorhersage (HA-Standort) |
| `show_weather`  | boolean | `true`* | Wetter im Header anzeigen (*wirkt nur, wenn `weather_entity` gesetzt) |
| `hour_height`   | number  | `64`    | Höhe einer Stunde in px (40–96) – Tagesansicht skalieren (Wandtablet); bei `fit_height` die Obergrenze |
| `hour_width`    | number  | `96`    | Zeitstrahl-Ansicht: Breite einer Stunde in px (48–240) |
| `fit_height`    | boolean | `false` | Tagesansicht automatisch so verkleinern, dass Start–Endstunde ohne Scrollen komplett sichtbar sind (Wandtablet/Kiosk) |
| `full_height`   | boolean | `false` | Board bis zum unteren Bildschirmrand strecken (Panel-/Wandtablet-Ansicht); Standard ist eine 58 %-Deckelung |
| `trim_hours`    | boolean | `true`  | Tagesansicht: leere Randstunden automatisch abschneiden, damit der belegte Teil des Tages die volle Höhe bekommt (min. 6-h-Fenster; `start_hour`/`end_hour` bleiben die Außengrenzen) |
| `col_min_width` | number  | `120`   | Mindestbreite (px) pro Personenspalte, darunter wird horizontal gescrollt; Spalten wachsen darüber hinaus mit der Kartenbreite |
| `background_hours` | number | `3`  | Timed-Termine ab dieser Länge (Std.) als dezentes Hintergrund-Band statt als Spalte; `0` = aus |
| `max_columns`   | number  | `3`     | Max. nebeneinander liegende Spalten pro Person/Tag; bei mehr Überlappungen erscheint ein „+N"-Chip (1–8) |
| `tentative_patterns` | Liste | –    | Termine mit passendem Titel-Muster als vorläufig (gestrichelt/transparent) markieren |
| `first_day`     | string  | `monday`| Wochenstart: `monday` oder `sunday` |
| `scroll_to_now` | boolean | `true`  | Tagesansicht beim Laden automatisch zur aktuellen Uhrzeit scrollen |
| `refresh_interval` | number | `300` | Auto-Aktualisierung der Termine in Sekunden (0 = aus); zusätzlich bei Tablet-Aufwachen |

Jede `calendar.*`-Entität funktioniert – egal ob `local_calendar` (lokal, ohne Cloud), Google oder CalDAV. Home Assistant liefert alle einheitlich.

## Aussehen anpassen (Theme / card-mod)

Die Karte übernimmt automatisch Farben & Schrift des Themes. Für Feintuning gibt es zusätzlich eigene CSS-Variablen, die du im **Theme** oder per **card-mod** überschreiben kannst:

| Token | Default | Wirkung |
|-------|---------|---------|
| `--fb-accent` | `--primary-color` | „Heute"-/Akzentfarbe (Planer: Datumskreis und ＋-Knopf) |
| `--fb-accent-text` | `--text-primary-color` | Schrift auf der Akzentfarbe |
| `--fb-switch-on` / `--fb-switch-on-text` | `--primary-color` | Aktiver Knopf im Ansichts-Umschalter |
| `--fb-planner-min` / `--fb-planner-gap` | `136px` / `10px` | Planer: Mindestbreite und Abstand der Tages-Spalten |
| `--fb-planner-size` | `14px` | Planer: Schriftgröße der Termin-Titel |
| `--fb-home-color` / `--fb-zone-color` | `#5bd68a` / `#8fd3ff` | Anwesenheits-Ring: zuhause / in einer Zone |
| `--fb-leave-soon` / `--fb-leave-now` | `#ffc46b` / `#ff7a85` | Losfahren: bald / jetzt |
| `--fb-notice-color` | `#7ee2b8` | Standardfarbe der Hinweise |
| `--fb-planner-height` | `62vh` | Planer: Höhe ohne `full_height` |
| `--fb-now-color` | `--error-color` | Jetzt-Linie & Fortschritt |
| `--fb-radius` | `7px` | Ecken der Termin-Blöcke |
| `--fb-radius-sm` | `5px` | Ecken der Chips |
| `--fb-avatar-size` | `34px` | Avatar-Größe |
| `--fb-past-opacity` | `0.5` | Deckkraft vergangener Termine |
| `--fb-title-size` | `16px` | Kartentitel |
| `--fb-name-size` | `13px` | Personennamen |
| `--fb-event-size` | `11.5px` | Termin-Titel |
| `--fb-time-size` | `9.5px` | Uhrzeiten im Block |
| `--fb-chip-size` | `10.5px` | Chip-Schriftgröße |
| `--fb-hourline` / `--fb-halfhour` / `--fb-row-shade` | – | Rasterlinien / Zeilenschattierung |
| `--fb-col-min` | `120px` | Mindestbreite einer Personenspalte |
| `--fb-axis-width` | `56px` | Breite der Zeitachse links |
| `--fb-board-max-height` | `58vh` | Höhen-Deckel des Tages-Boards (ohne `full_height`) |
| `--fb-event-pad` | `4px 7px` | Innenabstand der Termin-Blöcke |
| `--fb-head-pad` | `10px 6px` | Innenabstand der Personen-Köpfe |

Beispiel (card-mod):

```yaml
type: custom:family-board-card
card_mod:
  style: |
    :host {
      --fb-accent: #e91e63;
      --fb-event-size: 13px;
      --fb-radius: 12px;
      --fb-avatar-size: 40px;
    }
persons: …
```

## Sprachen

Karte **und** visueller Editor sprechen **Deutsch und Englisch**. Die Sprache folgt deinem Home-Assistant-Benutzerprofil; alles, was eine Übersetzung nicht abdeckt, fällt auf Englisch zurück. Datum, Wochentage und das Zeitformat (12/24 h) kommen über `Intl` aus der HA-Locale.

Noch eine Sprache? Ein Dictionary in [`src/localize.ts`](src/localize.ts) (Karte) und [`src/editor-i18n.ts`](src/editor-i18n.ts) (Editor) ergänzen – beides sind einfache Key/Value-Objekte, Pull Requests willkommen.

## Entwicklung

```bash
npm install
npm run build        # baut dist/ha-family-board-card.js
npm run watch        # Rebuild bei Änderungen
npm run lint         # tsc --noEmit (Typecheck)
npm test             # Vitest (Event-Logik)
npm run format       # Prettier
```

Schneller Loop gegen die laufende HA-Instanz: `dist/ha-family-board-card.js` nach `config/www/` kopieren und die Seite hart neu laden.

Die fehleranfällige Event-Logik (Splitting über Mitternacht, Ganztags-Exklusivität, Zeitzonen, Überlappungs-Layout) liegt isoliert in [`src/events.ts`](src/events.ts) und ist über [`src/events.test.ts`](src/events.test.ts) abgedeckt.

## Wandkalender-Extras (v0.29)

```yaml
home_zone: zone.home          # welche Zone „zuhause" ist (auch Start für Fahrzeiten)
show_presence: true           # Personen-Chips: Ring grün = zuhause, blau = in einer Zone, grau = unterwegs
countdowns:                   # oder einfach: countdowns: true
  marker: "⏳"                # Termine mit ⏳ im Titel werden heruntergezählt
  days: 365
  max: 3
travel:                       # „Losfahren in 10 Min" – braucht die Waze-Integration (waze_travel_time)
  origin: zone.home
  region: eu
  buffer: 5                   # Minuten Puffer fürs Parken
  lead: 120                   # nur Termine, die in den nächsten 120 Minuten beginnen
  places:                     # optional: Ortstext -> Zone oder "lat,lon"
    Sportverein: zone.sportverein
notices:                      # Hinweise mit Bestätigungs-Knopf, z. B. Mülltonne
  - entity: sensor.muell_hinweis
    title: "{state} rausstellen"
    icon: mdi:trash-can-outline
    color: "#7ee2b8"
    idle_states: [keine, unknown, unavailable]
    button: Erledigt
    action:
      action: input_boolean.turn_on
      target:
        entity_id: input_boolean.muell_rausgestellt
```

- **Countdowns** erscheinen im Uhr-Kopf (sonst über dem Board): „Urlaub · noch 12× schlafen", ab morgen mit 🎉. Ein Tipp springt zum Tag.
- **Losfahren:** Für Termine von heute mit Ort rechnet die Karte über Waze die Fahrzeit ab `origin` aus. Die Kachel zeigt „los 14:33", 15 Minuten vorher erscheint oben „Losfahren in 12 Min", danach rot „Jetzt losfahren!". Adressen werden über OpenStreetMap (Nominatim) in Koordinaten umgewandelt und im Browser zwischengespeichert. Wer das nicht möchte, setzt `geocode: false` und pflegt `places`. Online-Termine (Zoom, Teams, Links) werden übersprungen.
- **Hinweise** sind sichtbar, solange die Entität nicht in `idle_states` steht (Standard: off/unknown/unavailable/none …). `{state}` und `{name}` werden im Titel ersetzt. Der Knopf ruft `action` auf und blendet den Hinweis sofort aus.

## Zusatzkarte: Paperless „Noch zu zahlen“ (v0.30, PDF-Ansicht seit v0.31)

Das Paket bringt eine zweite Karte mit: `custom:paperless-pay-card`. Sie zeigt alle Dokumente aus
[Paperless-ngx](https://docs.paperless-ngx.com/) mit einem bestimmten Tag (z. B. „NochZuZahlen“) als Kacheln
mit Vorschaubild, Korrespondent und Datum. Ein großer Knopf **Bezahlt** entfernt den Tag, weitere Tags lassen sich
per Chip an- und abschalten. Antippen des Vorschaubilds öffnet das ganze PDF im Vollbild (alle Seiten
untereinander, Lupe zum Vergrößern). Dafür lädt die Karte beim ersten Öffnen
[pdf.js](https://mozilla.github.io/pdf.js/) von jsDelivr; ohne Internet bleibt es beim Vorschaubild der ersten Seite.

```yaml
type: custom:paperless-pay-card
url: http://192.168.10.164:8000      # Paperless, wie das Tablet es erreicht
token: <Nur-Lese-Token>               # liest Liste, Vorschaubilder, Tag- und Korrespondentennamen
tag: 15                               # diese Dokumente werden gezeigt
tags: [15, 18, 14, 13, 12]            # Chips zum Umschalten (Standard: nur `tag`)
paid_tag: 15                          # entfernt der Bezahlt-Knopf (Standard: `tag`)
service: rest_command.paperless_tags_setzen   # schreibt die Tags (Standard)
entity: sensor.topay                  # optional: neu laden, wenn sich der Zähler ändert
refresh: 300                          # Sekunden
```

Voraussetzungen:

- In Paperless `PAPERLESS_CORS_ALLOWED_HOSTS` um die Adresse von Home Assistant ergänzen, sonst blockiert der Browser.
- Der Token der Karte steht in der Dashboard-Konfiguration: nur einen Benutzer mit Leserechten verwenden.
- Geschrieben wird über einen Home-Assistant-Dienst, damit der Schreib-Token auf dem Server bleibt:

```yaml
rest_command:
  paperless_tags_setzen:
    url: "http://192.168.10.164:8000/api/documents/{{ id | int }}/"
    method: PATCH
    headers:
      Authorization: !secret paperless_auth   # "Token …"
    content_type: "application/json"
    payload: '{"tags": {{ tags | map("int") | list | to_json }}}'
```

## Termine anlegen / bearbeiten / löschen

In der Tagesansicht eine freie Stelle in der Personenspalte anklicken öffnet den Dialog zum Anlegen (die Uhrzeit wird aus der Klick-Position übernommen); ein Klick auf einen Termin öffnet ihn zum Bearbeiten/Löschen. Ob das möglich ist, hängt vom Kalender ab: Die Karte liest `supported_features` der jeweiligen `calendar.*`-Entität und blendet Schreibaktionen aus, wenn der Kalender sie nicht unterstützt. Intern werden die WebSocket-Kommandos `calendar/event/create|update|delete` genutzt (dieselben wie die native HA-Kalenderoberfläche).

## Roadmap

- [x] Termine anlegen/bearbeiten/löschen, nur bei schreibbaren Kalendern
- [x] Personen-Editor im visuellen Config-Editor
- [x] Wochen-Navigation & Nebeneinander-Layout überlappender Termine
- [x] Mehrsprachigkeit (i18n, DE/EN) + Locale-Zeitformat
- [x] Kiosk-/Wandtablet-Modus (`full_height`, `fit_height`, `auto_return`, Touch-Ziele)
- [x] Mobile-Layout (kompakte Spalten, wischbar)
- [x] Drag & Drop zum Verschieben von Terminen
- [x] Aufnahme in den offiziellen HACS-Store
- [x] Lokalisierter visueller Editor (DE/EN)
- [x] Planer-Ansicht und Uhr-Kopf für Wandkalender (Skylight-Stil)
- [x] Countdowns, Losfahren-Hinweis, Hinweise mit Bestätigen-Knopf, Anwesenheit
- [ ] Orts-/Konflikterkennung (z. B. „niemand zuhause", Abhol-Lücken)

## Lizenz

MIT
