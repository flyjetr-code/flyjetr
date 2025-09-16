# Design Updates v1 - FlyJetr 2.0

This document tracks design updates and interface improvements for the FlyJetr 2.0 system. This is a living document that should be updated as the design evolves.

---

## Current Design System

**Primary Colors (Minimal Palette):**
- Text: #666666 (Gray)
- Background: #ffffff (White)
- Black: #000000 (Headers, buttons, and important text)
- Red: #ef4444 (Warnings, errors, and pending states)

**Typography:**
- Primary Font: Inter + Plus Jakarta Sans
- Font Weight: 500 (medium) for body text
- Clean, modern sans-serif approach

**Design Principles:**
- Minimalist aesthetic matching main website
- Clean lines with 3px border radius
- Subtle shadows and hover effects
- Professional, aviation-focused appearance
- MINIMAL COLOR PALETTE: Only black, white, and red

---

## Design Update History

### v1.9 - 2025-09-16 12:15 EDT — Consolidated UI/Flow updates (Admin + Client)
**Change**: Simplified status model; refined admin dashboard, modal, and client-sharing flow.
**Why**: Reduce confusion, enforce minimal palette, align with latest product direction.
**Impact**:
- Status simplified to three text-only states: "pending client info", "in progress", "complete" (no color badges).
- Row-level Share button removed. Sharing is internal-only via modal button: "Copy Client Form Link" (visible only when status is "pending client info").
- Header layout: dark logo on its own top row; larger title below aligned with the primary action.
- Dashboard is full-width, minimal, responsive.
- Create Trip now opens modal immediately; persists in background (local-first fallback when Firestore not configured).
- Favicon switched to `public/favicon.png`; page title set to "FlyJetr Admin — Trip Management".

### v1.8 - 2025-09-16 12:05 EDT — Passenger & Luggage UX
**Change**: Replaced “Guest” with “Passenger”; simplified passenger fields; upgraded passport upload; luggage wording and declarations overhaul.
**Why**: Reduce friction and collect only essential data; align wording with aviation.
**Impact**:
- Passenger section per flight: only Name + Passport file (classic upload icon button + filename display).
- Luggage labels: "Traditional Carry-On Bags", "Traditional Checked Bags"; explicit count inputs; "Miscellaneous Bags (e.g., Golf bag, Guitar)".
- Declarations converted to yes/no with add-one-by-one lists for: Misc items, Pets, Hazardous materials (e.g., Lithium battery), Firearms (e.g., Small firearm). Items render as editable list rows with remove.
- Added per-flight arrays to track declaration items (`miscItems`, `petItems`, `hazardousItems`, `firearmItems`).

### v1.7 - 2025-09-16 11:30 EDT — Create Trip flow hardening
**Change**: Local-first UX with Firestore background persistence; error-resilient update/delete.
**Why**: Allow development without credentials; guarantee immediate feedback.
**Impact**:
- Create Trip inserts a temporary trip locally, opens modal, then attempts Firestore save. On success, temp id is replaced; on failure, local state remains.
- Update/Delete fall back to local state when Firestore is unavailable.

### v1.6 - 2025-01-27 18:45 - Minimal Color Palette Implementation
**Change**: Removed ALL blue colors and implemented minimal black, white, red color scheme
**Why**: User feedback to keep design minimal and use only black, white, and red colors
**Impact**: 
- Removed ALL blue colors from buttons, status badges, and interface elements
- Implemented minimal color palette: black (#000000), white (#ffffff), red (#ef4444), gray (#666666)
- Updated all buttons to use black background with white text
- Updated status colors to use only black, gray, and red
- Updated form focus states to use black instead of blue
- Completely minimal and clean aesthetic

### v1.5 - 2025-01-27 18:30 - Interactive Dashboard & Status System Fix
**Change**: Fixed status system confusion and made dashboard fully interactive
**Why**: User feedback about mixed status types and need for trip editing functionality
**Impact**: 
- Implemented proper two-status system (Trip Creation + Trip Operational)
- Added flight numbers column that's responsive to trip creation
- Made dashboard fully interactive with trip editing modal
- Added "Add Trip" and "Edit Trip" functionality
- Added trip deletion capability

**Files affected**:
- src/pages/Dashboard.jsx - Complete interactive functionality
- src/pages/Dashboard.css - Updated styling and modal support
- Added proper status color scheme without blue confusion

### v1.4 - 2025-01-27 — Status Legend removed
**Change**: Removed status legend component from dashboard.
**Impact**: Less clutter; status is communicated inline per row (text only).

### v1.3 - 2025-01-27 — Full-screen dashboard
**Change**: Enforced 100vw, hid horizontal overflow.
**Impact**: Uses full browser width; improved table readability.

### v1.2 - 2025-01-27 — Dark logo integration
**Change**: Added dark logo to admin header; aligned with main site aesthetic.

### v1.1 - 2025-01-27 — Docs housekeeping
**Change**: Split design updates into a dedicated file and linked from primary design doc.



# Updated Notes on Interface Design and Process Flow
# FlyJetr Interfaces — Process Flow and Edit Permissions (v1)

Last updated: 09/16/2025 12:25 EDT — SX

---

## 1) High-level Process Flow

1. Broker creates a Trip in the Admin app
   - Minimum: client name/email, at least one Flight (dep/arr, date/time, aircraft), Trip status auto = "pending client info".
   - A unique client form URL is generated for the Trip.
2. Broker shares client link
   - Internal-only button in the Admin modal: "Copy Client Form Link" (visible when status is "pending client info").
3. Client completes their portion of the same Trip/Flight objects
   - Edits passenger and luggage data, and submits Catering/Transportation requests (per flight).
4. Broker reviews client submissions and finalizes
   - Broker can adjust anything; if acceptable, status moves to "in progress" or directly to "complete" after ops.
5. Ongoing updates (optional)
   - Broker continues to operate trip (operator/catering/transportation orders, etc.) and closes the Trip (status = complete).

Status model (text-only):
- pending client info → in progress → complete

---

## 2) Data Objects (same objects, different permissions)

- Trip
  - id, clientName, clientEmail, status, createdAt, flights[]
- Flight (per entry)
  - id, departure, arrival, date, time, aircraftType,
  - passengers[] (name, passportFile),
  - luggage { carryOn, checked, misc, totalWeight, miscItems[], petItems[], hazardousItems[], firearmItems[] },
  - cateringTransport { per-flight section, see below }

---

## 3) Edit Permissions Matrix (Broker vs Client)

| Object / Field | Broker (Admin) | Client (Link) |
| --- | --- | --- |
| Trip.status | Edit | Read |
| Trip.clientName / clientEmail | Edit | Read |
| Flight.departure / arrival | Edit | Read |
| Flight.date / time | Edit | Read |
| Flight.aircraftType | Edit | Read |
| Flight.passengers[].name | Edit | Edit |
| Flight.passengers[].passportFile | Edit (upload/replace) | Edit (upload/replace) |
| Flight.luggage.carryOn / checked / misc / totalWeight | Edit | Edit |
| Flight.luggage.miscItems[] | Edit (add/edit/remove) | Edit (add/edit/remove) |
| Flight.luggage.petItems[] | Edit (add/edit/remove) | Edit (add/edit/remove) |
| Flight.luggage.hazardousItems[] | Edit (add/edit/remove) | Edit (add/edit/remove) |
| Flight.luggage.firearmItems[] | Edit (add/edit/remove) | Edit (add/edit/remove) |
| Flight.cateringTransport (per flight) | Edit (review/confirm) | Edit (request/describe) |

Notes:
- Both parties edit the same underlying Trip and Flight objects; client edits are constrained to specific sections.
- Broker can override or finalize any client entries during review.

---

## 4) Client Form — Sections (per flight)

1. Passengers
   - Repeatable rows: Name (text), Passport upload (file). Classic upload button with filename.
2. Luggage Manifest
   - Traditional Carry-On Bags (count)
   - Traditional Checked Bags (count)
   - Miscellaneous Bags (count) + optional detailed items list (e.g., Golf bag, Guitar)
   - Estimated Total Weight (lbs)
   - Declarations (Yes/No → add items one-by-one)
     - Pets → Pet #1, Pet #2, ... (free text label per item)
     - Hazardous Materials → examples: Lithium battery
     - Firearms → examples: Small firearm
3. Catering & Transportation (new)
   - Catering requests (free text, dietary notes)
   - Transportation requests (pickup, dropoff, times, notes)
   - Optional contact phone for coordination

Submit: saves on the Trip/Flight objects and notifies Broker (out of scope here; webhook later).

---

## 5) Broker Admin — Modal Layout (per trip)

- Client Information: clientName, clientEmail, Trip status (pending client info / in progress / complete)
- Flights (list)
  - Core fields: dep/arr, date/time, aircraftType
  - Passengers (same component as client; broker can edit all)
  - Luggage Manifest (same as client; broker can edit all)
  - Catering & Transportation (broker can edit/confirm Vendor orders later)
- Internal Actions
  - Copy Client Form Link (only when status = pending client info)
  - Save Changes (always available)
  - Delete Trip (danger)

---

## 6) Data & Storage Notes

- Passport files → Google Cloud Storage (bucket path proposal): `/contacts/{contactId}/trips/{tripId}/flights/{flightId}/passports/{index}`; Trip stores `downloadURL` references.
- Client link format: `/client/trip/{tripId}` (generated on creation; copied by Broker internally).
- Security: client form URL scoped to trip; no admin actions exposed.

---

## 7) Validation & UX Rules

- Minimal palette: black / white / red / gray.
- Text-only statuses; no colored badges.
- Local-first UX: create trip opens modal immediately; persistence attempts in background.
- File inputs show selected filename; classic upload icon used.
- Yes/No toggles for declarations, with add-one-by-one rows.

---

## 8) Open Items / Next Iterations

- Persist passport files to Storage and store URLs on Trip/Flight.passengers[].
- Add per-flight Catering/Transportation vendor order creation (post-MVP).
- Add basic audit trail to `docs/vibe-log.md` when rules/policies change.
