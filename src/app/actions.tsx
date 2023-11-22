'use server';

import { Product, addresses, customers, invoices, products, suppliers, transactions, db } from '@/db/schema'
import { eq, sql } from 'drizzle-orm';
import { RowList } from 'postgres';

type InvoiceTable = {
    id: string;
    date: string | null,
    taxPayable: string | null,
    netTotal: string | null,
    grossTotal: string | null,
    name: string,
}

type PurchaseTable = {
    id: string;
    date: string | null,
    name: string | null,
}

type CustomerSupplierTable = {
    id: string,
    companyName: string | null,
    telephone: string | null,
    addressDetail: string | null,
    city: string | null,
    postalCode: string | null,
    country: string | null
}

type CustomerPerCity = {
    customerCount: number,
    city: string | null,
}

export async function getInvoices() {
    let filteredInvoices: InvoiceTable[] = [];

    try {
        filteredInvoices = await db.select({
            id: invoices.id,
            date: invoices.invoiceDate,
            taxPayable: invoices.taxPayable,
            netTotal: invoices.netTotal,
            grossTotal: invoices.grossTotal,
            name: customers.companyName,
        }).from(customers).innerJoin(invoices, eq(customers.id, invoices.customerID))
    }
    catch (error) {
        console.error(error)
    }

    //console.log(filteredInvoices)
    return filteredInvoices;
}

export async function getPurchases() {
    let filteredPurchases: PurchaseTable[] = [];

    try {
        filteredPurchases = await db.select({
            id: transactions.id,
            date: transactions.transactionDate,
            name: suppliers.companyName,
        }).from(suppliers).innerJoin(transactions, eq(suppliers.taxID, transactions.supplierID))
    }
    catch (error) {
        console.error(error)
    }

    //console.log(filteredPurchases)
    return filteredPurchases;
}

export async function getSuppliers() {
    let allSuppliers: CustomerSupplierTable[] = [];

    try {
        allSuppliers = await db.select({
            id: suppliers.taxID,
            companyName: suppliers.companyName,
            telephone: suppliers.telephone,
            addressDetail: addresses.addressDetail,
            city: addresses.city,
            postalCode: addresses.postalCode,
            country: addresses.country
        }).from(addresses).innerJoin(suppliers, eq(addresses.id, suppliers.addressID))
    }
    catch (error) {
        console.error(error)
    }

    //console.log(allSuppliers)
    return allSuppliers;
}

export async function getCustomers() {
    let allCustomers: CustomerSupplierTable[] = [];

    try {
        allCustomers = await db.select({
            id: customers.id,
            companyName: customers.companyName,
            telephone: customers.telephone,
            addressDetail: addresses.addressDetail,
            city: addresses.city,
            postalCode: addresses.postalCode,
            country: addresses.country
        }).from(addresses).innerJoin(customers, eq(addresses.id, customers.billingAddressID))
    }
    catch (error) {
        console.error(error)
    }

    //console.log(allCustomers)
    return allCustomers;
}

export async function getProducts() {
    let allProducts: Product[] = [];

    try {
        allProducts = await db.select().from(products)
    }
    catch (error) {
        console.error(error)
    }

    //console.log(allProducts)
    return allProducts;
}

export async function getCustomersPerCity() {
    let customersPerCity: CustomerPerCity[] = [];

    try {
        customersPerCity = await db.select({
            customerCount: sql<number>`count(${customers.companyName})`,
            city: addresses.city
        }).from(addresses).innerJoin(customers, eq(addresses.id, customers.billingAddressID))
            .groupBy(sql`${addresses.city}`)

        console.log(customersPerCity);
    }
    catch (error) {
        console.error(error)
    }

    return customersPerCity;
}