import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { addresses, customers, transactions, header, suppliers, products, taxTable, invoices, invoiceLines, payments, paymentLines, transactionLines } from './schema';
import { sql } from 'drizzle-orm';

const connectionString = "postgres://postgres:postgres@localhost:5432/EngenheirosPeles";

// for query purposes
const queryClient = postgres(connectionString);
export const db: PostgresJsDatabase = drizzle(queryClient);

async function reset() {
    await db.execute(sql`TRUNCATE TABLE ${transactionLines} RESTART IDENTITY;`)
    await db.delete(transactions).returning();
    await db.delete(suppliers).returning();
    await db.execute(sql`TRUNCATE TABLE ${paymentLines} RESTART IDENTITY;`)
    await db.delete(payments).returning();
    await db.execute(sql`TRUNCATE TABLE ${invoiceLines} RESTART IDENTITY;`)
    await db.delete(invoices).returning();
    await db.delete(products).returning();
    await db.delete(customers).returning();
    await db.execute(sql`TRUNCATE TABLE ${header} RESTART IDENTITY;`)
    //await db.delete(taxTable).returning();
    //await db.delete(addresses).returning();
    await db.execute(sql`TRUNCATE TABLE ${taxTable} RESTART IDENTITY CASCADE;`)
    await db.execute(sql`TRUNCATE TABLE ${addresses} RESTART IDENTITY CASCADE;`)

    process.exit(0);
}

reset();
