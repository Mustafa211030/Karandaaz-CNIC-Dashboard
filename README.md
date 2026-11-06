# Karandaaz CNIC command center: live from Kobo on Vercel

Folder layout: `public/index.html` (dashboard, Tailwind + ECharts + three.js), `api/data.js` (reads Kobo with your token, server side only), `api/schema.js` (field-name check), `lib/` (Kobo client and the repeat-group mapping).

## Deploy (about 10 minutes)
1. **Collect three values from Kobo**
   - Token: log in, open `https://<your-server>/token/?format=json` (or Account settings > Security > API key).
   - Server: `https://kf.kobotoolbox.org`, `https://eu.kobotoolbox.org`, or your own.
   - Asset UID: the code in the form URL, `.../#/forms/<ASSET_UID>/summary`.
2. **Push this folder to a private GitHub repo.**
3. **Vercel:** Add New > Project > import the repo. Framework preset "Other", leave the build command empty.
4. **Environment variables** (Project > Settings > Environment Variables): `KOBO_SERVER`, `KOBO_ASSET_UID`, `KOBO_TOKEN`, `DASHBOARD_PASSCODE`. Then deploy.
   CLI alternative: `npm i -g vercel`, `vercel`, add the four variables with `vercel env add`, then `vercel --prod`.
5. **Check the field mapping:** open `https://YOUR-APP.vercel.app/api/schema?p=YOUR_PASSCODE`.
   For each entry in `fieldsTheDashboardWillTry` (cluster, province, district, res, cnic, front, back and so on), at least one name should appear in `keysFoundInFirstSubmission`.
   If one does not, set `FIELD_MAP` (see `.env.example`) to the right field name and redeploy.
6. Open the site and enter the passcode. A green "Live from Kobo" line in the header confirms the connection. It refreshes every 60 seconds, and "Refresh now" forces it.

## Security
- The token exists only in Vercel environment variables. It is never sent to the browser. Rotate it if it has been shared anywhere.
- The dashboard receives CNIC numbers to run its quality checks. Keep `DASHBOARD_PASSCODE` set and also enable Vercel Deployment Protection.

## Notes
- The server caches Kobo responses for 30 seconds.
- Kobo API timestamps are UTC, so a day boundary can differ slightly from your Excel export.
- Rate targets are edited on the KPI cards and saved per browser.
- If Kobo is unreachable, drop an exported `.xlsx` onto the page. Live sync pauses until you reload.
