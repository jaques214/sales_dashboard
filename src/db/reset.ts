import { db } from '@/index';
import { addresses, customers, transactions, header, suppliers, products, taxTable, invoices, invoiceLines, payments, paymentLines, transactionLines } from './schema';
import { sql } from 'drizzle-orm';

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
