// Manual/local run: `npm run fetch-news`.
// In production this same logic runs on a schedule via
// src/app/api/cron/fetch-news/route.ts (see vercel.json).
import { fetchAndStoreNews } from "../src/lib/fetchNews";

fetchAndStoreNews()
  .then((result) => {
    console.log(`Fetched ${result.fetched}, upserted ${result.upserted}.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
