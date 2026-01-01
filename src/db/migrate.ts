import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';

// for migrations
migrate(drizzle(process.env.DATABASE_URL!), { migrationsFolder: "./drizzle" })
    .then(() => {
        console.info("Migrations complete!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Migrations failed!", err);
        process.exit(1);
    });