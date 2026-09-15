// Manual/local run: `npm run fetch-news`.
// In production this same logic runs on a schedule via
// src/app/api/cron/fetch-news/route.ts (see vercel.json).
import { fetchAndStoreNews, generateMissingTakeaways } from "../src/lib/fetchNews";

fetchAndStoreNews()
  .then(async (result) => {
    console.log(`Fetched ${result.fetched}, upserted ${result.upserted}.`);
    const takeaways = await generateMissingTakeaways();
    console.log(`Takeaways: ${takeaways.succeeded}/${takeaways.attempted} generated.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
