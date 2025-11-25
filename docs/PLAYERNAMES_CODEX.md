# Player Names Investigation - 2025-11-25 10:45:00

## What I Checked
1. **Database schema** – `backend/prisma/schema.prisma` shows `PlayerProfile.id` and `MissionResult.id` both default to `cuid()` (non-UUID strings) and `username` is a required field on every profile.
2. **Seed data** – `backend/prisma/seed.ts` populates eight learner profiles with explicit usernames (e.g., `TanWeiMing`, `IbrahimHassan`). This confirms the data layer is expected to have names.
3. **Players API output** – `backend/src/services/player.service.ts` (and the compiled `dist` version) simply forwards the Prisma `playerProfile` records, so every item in `data` should include the `username` column alongside rank/level/xp.
4. **Frontend usage** – `frontend/app/dashboard/players/page.tsx:171-219` renders each card using `const username = player.username || 'Unknown';`. Detail views request `/api/players/:id` to populate the dashboard banner when a card is opened.
5. **Runtime errors** – Your screenshot shows `GET http://localhost:4000/api/players/cn... 400 (Bad Request)` and the UI banner “Player not found”. That means the detail request never reaches Prisma because the request validator bounces it.

## Findings
- **Names falling back to “Unknown”**: since the UI only uses `player.username`, the only way to hit the fallback is for the API payload to omit/empty that field. Given the schema + seed scripts do populate it, the existing records in your running database are likely missing usernames (custom data import or manual edits). Running `npx prisma studio` or a quick script (`await prisma.playerProfile.findMany({ select: { id: true, username: true } })`) against the current DATABASE_URL will confirm—they should all come back with empty strings. Once populated, the UI will immediately show the text because no code change is required.
- **“Player not found” on card click**: `player_profiles.id` uses CUIDs, but `playerIdSchema` enforces `z.string().uuid('Invalid player ID format')` (`backend/src/schemas/player.schema.ts:14-16`). Any request to `/api/players/:id`, `/api/players/:id/progress`, etc. therefore returns 400 before the DB is queried. That is exactly what the network log shows.

## Recommended Fixes / Solutions
1. **Clean up usernames in the live DB**
   - Run a one-off SQL/Prisma script to backfill `player_profiles.username` with real values (from your source system or even a placeholder based on email) and enforce the NOT NULL constraint. Example snippet:
     ```ts
     const players = await prisma.playerProfile.findMany({ where: { username: '' } });
     for (const player of players) {
       await prisma.playerProfile.update({ where: { id: player.id }, data: { username: `Cadet-${player.id.slice(-4)}` } });
     }
     ```
   - After updating, reload `/dashboard/players` and the cards will read the populated values via `player.username`.
2. **Align the ID validator with the database**
   - Change `playerIdSchema` to accept CUIDs (e.g., `z.string().cuid('Invalid player ID format')`) or loosen it to `z.string().min(1)` if you ever switch ID strategies. Apply the same update to every schema that currently calls `z.string().uuid()` for player IDs (players, analytics). Once this change is deployed, clicking a card will successfully call `/api/players/:id`, and the detail drawer/banner will populate instead of showing “Player not found”.

With these two fixes, both the name display and the detail fetch error should disappear without touching the authentication flow.
