import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = "postgres://postgres:postgres@localhost:5432/EngenheirosPeles";

// for migrations
const migrationClient = postgres(connectionString, { max: 1 });

migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" })
    .then(() => {
        console.info("Migrations complete!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Migrations failed!", err);
        process.exit(1);
    });