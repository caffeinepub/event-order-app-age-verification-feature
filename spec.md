# Event Order

## Current State
Venues display name, tagline, city, description, and menu item counts on cards in VenueSelector. The Venue interface has no event name or date fields.

## Requested Changes (Diff)

### Add
- `eventName` (string) and `eventDate` (string) fields to the `Venue` interface in venues.ts
- Assign unique, realistic event names and upcoming 2026 dates to every venue in the venues array
- Display event name and date prominently on each venue card in VenueSelector (below the venue name, above the tagline, styled with a calendar icon)

### Modify
- VenueSelector venue card body to show eventName and eventDate with a Calendar icon
- venues.ts Venue interface to include the two new fields

### Remove
- Nothing removed

## Implementation Plan
1. Add `eventName: string` and `eventDate: string` to the Venue interface in venues.ts
2. Add eventName and eventDate to every venue object in the venues array (realistic names and 2026 dates)
3. Update VenueSelector card body to display eventName and eventDate with a Calendar icon, styled clearly
