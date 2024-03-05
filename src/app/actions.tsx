'use server';

import {
    addresses,
    customers,
    db,
    invoiceLines,
    invoices,
    Product,
    products,
    suppliers,
    taxTable,
    transactions
} from '@/db/schema'
import {asc, desc, eq, sql} from 'drizzle-orm';

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

type TopProducts = {
    product: string | null,
    unit: string | null,
    quantity: number,
    invoicetotal: number,
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
    }
    catch (error) {
        console.error(error)
    }

    return customersPerCity;
}

export async function getTopProducts() {
    let topProducts: TopProducts[] = [];

    try {
        topProducts = await db.select({
            product: products.description,
            unit: invoiceLines.unitPrice,
            quantity: sql<number>`sum(${invoiceLines.quantity})`,
            invoicetotal: sql<number>`sum(${invoiceLines.creditAmount})`,
        }).from(invoiceLines).innerJoin(products, eq(invoiceLines.productCode, products.id))
            .groupBy(sql`${products.description}, ${invoiceLines.unitPrice}`).limit(3).orderBy(sql<number>`sum(${invoiceLines.creditAmount}) desc`)
    }
    catch (error) {
        console.error(error)
    }

    return topProducts;
}

export async function getInvoiceSize() {
    let numberInvoices: { count: number }[] = [];

    try {
        numberInvoices = await db.select({
            count: sql<number>`cast(count(${invoices.id}) as int)`,
        }).from(invoices)
    }
    catch (error) {
        console.error(error)
    }

    return numberInvoices[0].count;
}

export async function getSalesPerMonth() {
    let salesPerMonth: {netTotal: number, date: number }[] = [];

    try {
        salesPerMonth = await db.select({
            netTotal: sql<number>`sum(${invoices.netTotal})`,
            date: sql<number>`EXTRACT(MONTH FROM ${invoices.invoiceDate})`
        }).from(invoices)
        .groupBy(sql<number>`EXTRACT(MONTH FROM ${invoices.invoiceDate})`)
        .orderBy(asc(sql<number>`EXTRACT(MONTH FROM ${invoices.invoiceDate})`))
    }
    catch (error) {
        console.error(error)
    }

    return salesPerMonth;
}

export async function getProductsByCategory() {
    let productsByCategory: {category: string | null, qtd: number }[] = [];

    try {
        productsByCategory = await db.select({
            category: products.productGroup,
            qtd: sql<number>`sum(${invoiceLines.quantity})`,
        }).from(invoiceLines).innerJoin(products, eq(invoiceLines.productCode, products.id))
        .groupBy(sql<number>`sum(${invoiceLines.quantity})`)

    }
    catch (error) {
        console.error(error)
    }

    return productsByCategory;
}

export async function getTotalRevenue() {
    try {
        const totalRevenue = await db.select({
            revenue: sql<number>`sum(${invoices.grossTotal})`,
        }).from(invoices)

        const { revenue } = totalRevenue[0];
        return revenue;
    }
    catch (error) {
        console.error(error)
    }
}

export async function getRevenueByProduct() {
    try {
        return await db.select({
            product: products.description,
            revenue: sql<number>`sum(
            ${invoiceLines.creditAmount} + ${invoiceLines.creditAmount} * (${taxTable.taxPercentage} / 100)
            )`
        }).from(invoiceLines).innerJoin(products, eq(invoiceLines.productCode, products.id))
            .innerJoin(taxTable, eq(invoiceLines.taxTableID, taxTable.id))
            .groupBy(products.description)
            .orderBy(desc(sql<number>`sum(
            ${invoiceLines.creditAmount} + ${invoiceLines.creditAmount} * (${taxTable.taxPercentage} / 100)
            )`));
    }
    catch (error) {
        console.error(error)
    }
}