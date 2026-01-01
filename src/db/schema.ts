import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar, char, integer, smallint, date, time, numeric } from 'drizzle-orm/pg-core';

export const addresses = pgTable('address', {
    id: serial('id').primaryKey(),
    addressDetail: varchar('address_detail', { length: 210 }),
    city: varchar('city', { length: 100 }),
    postalCode: varchar('postal_code'),
    country: char('country', { length: 2 }).default('PT'),
});

export type NewAddress = typeof addresses.$inferInsert;

export const header = pgTable('company_header', {
    id: serial('id').primaryKey(),
    taxNumber: integer('tax_number').notNull().unique(),
    companyName: varchar('company_name', { length: 100 }),
    fiscalYear: smallint('fiscal_year').notNull(),
    startDate: date('start_date'),
    endDate: date('end_date'),
    currencyCode: char('currency_code', { length: 3 }),
    telephone: varchar('telephone'),
    email: varchar('email'),
    addressID: integer('address_id').references(() => addresses.id),
});

export type NewHeader = typeof header.$inferInsert;

export const customers = pgTable('customer', {
    id: varchar('id').primaryKey(),
    companyName: varchar('company_name', { length: 100 }).notNull(),
    telephone: varchar('telephone'),
    billingAddressID: integer('billing_address_id').references(() => addresses.id),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export const suppliers = pgTable('supplier', {
    taxID: varchar('tax_id', { length: 11 }).primaryKey(),
    companyName: varchar('company_name', { length: 200 }),
    telephone: varchar('telephone'),
    addressID: integer('address_id').references(() => addresses.id),
});

export const products = pgTable('product', {
    id: varchar('id').primaryKey(),
    productGroup: varchar('product_group', { length: 100 }),
    description: varchar('description', { length: 200 }),
})

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const invoices = pgTable('invoice', {
    id: varchar('id').primaryKey(),
    invoiceDate: date('invoice_date'),
    taxPayable: numeric('tax_payable', { precision: 9, scale: 2 }),
    netTotal: numeric('net_total', { precision: 9, scale: 2 }),
    grossTotal: numeric('gross_total', { precision: 9, scale: 2 }),
    invoiceType: char('invoice_type', { length: 2 }),
    customerID: varchar('customer_id').references(() => customers.id)
})

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
    customer: one(customers, {
        fields: [invoices.customerID],
        references: [customers.id],
    }),
    paymentLine: one(paymentLines, {
        fields: [invoices.id],
        references: [paymentLines.originatingON],
    }),
    line: many(invoiceLines)
}));

export type NewInvoice = typeof invoices.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;

export const invoiceLines = pgTable('invoice_lines', {
    id: serial('id').primaryKey(),
    invoiceID: varchar('invoice_id').references(() => invoices.id),
    productCode: varchar('product_code').references(() => products.id),
    quantity: integer('quantity'),
    unitOfMeasure: varchar('unit_of_measure', { length: 20 }),
    unitPrice: numeric('unit_price', { scale: 2 }),
    creditAmount: numeric('credit_amount', { precision: 9, scale: 2 }),
    taxPointDate: date('tax_point_date'),
    taxTableID: integer('tax_table_id').references(() => taxTable.id),
});

export type NewInvoiceLine = typeof invoiceLines.$inferInsert;

export const invoiceLineRelations = relations(invoiceLines, ({ one }) => ({
    invoice: one(invoices, {
        fields: [invoiceLines.invoiceID],
        references: [invoices.id],
    }),
    product: one(products, {
        fields: [invoiceLines.productCode],
        references: [products.id],
    }),
    taxTable: one(taxTable, {
        fields: [invoiceLines.taxTableID],
        references: [taxTable.id],
    }),
}));

export const taxTable = pgTable('tax_table', {
    id: serial('id').primaryKey(),
    taxType: char('tax_type', { length: 3 }),
    taxCountryRegion: char('tax_country_region', { length: 5 }),
    description: varchar('description'),
    taxCode: char('tax_code', { length: 3 }),
    taxPercentage: numeric('tax_percentage', { precision: 5, scale: 2 }),
});

export type NewTaxTable = typeof taxTable.$inferInsert;

export const payments = pgTable('payments', {
    paymentRefNo: varchar('payment_ref_no').primaryKey(),
    taxPayable: numeric('tax_payable', { precision: 9, scale: 2 }),
    netTotal: numeric('net_total', { precision: 9, scale: 2 }),
    grossTotal: numeric('gross_total', { precision: 9, scale: 2 }),
    paymentType: char('payment_type', { length: 2 }),
    paymentMechanism: char('payment_mechanism', { length: 2 }),
    paymentDate: date('payment_date'),
    customerID: varchar('customer_id').references(() => customers.id)
});

export type NewPayment = typeof payments.$inferInsert;

export const paymentRelations = relations(payments, ({ one }) => ({
    customer: one(customers, {
        fields: [payments.customerID],
        references: [customers.id],
    }),
    paymentLine: one(paymentLines, {
        fields: [payments.paymentRefNo],
        references: [paymentLines.paymentID],
    }),
}));

export const paymentLines = pgTable('payment_lines', {
    id: serial('id').primaryKey(),
    creditAmount: numeric('credit_amount', { precision: 9, scale: 2 }),
    originatingON: varchar('originating_on').references(() => invoices.id),
    paymentID: varchar('payment_id').references(() => payments.paymentRefNo),
    taxTableID: integer('tax_table_id').references(() => taxTable.id)
})

export type NewPaymentLine = typeof paymentLines.$inferInsert;

export const paymentLinesRelations = relations(paymentLines, ({ one }) => ({
    taxTable: one(taxTable, {
        fields: [paymentLines.taxTableID],
        references: [taxTable.id],
    }),
}));

export const transactions = pgTable('transaction', {
    id: varchar('id').primaryKey(),
    transactionDate: date('transaction_date'),
    supplierID: varchar('supplier_id', { length: 11 }).references(() => suppliers.taxID),
})

export const transactionRelations = relations(transactions, ({ one }) => ({
    supplier: one(suppliers, {
        fields: [transactions.supplierID],
        references: [suppliers.taxID],
    }),
    transactionLine: one(transactionLines, {
        fields: [transactions.id],
        references: [transactionLines.transactionID],
    })
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
    transactions: many(transactions),
}));

export const transactionLines = pgTable('transaction_lines', {
    id: serial('id').primaryKey(),
    amount: numeric('amount', { precision: 9, scale: 2 }),
    transactionID: varchar('transaction_id').references(() => transactions.id),
});

export type NewTransactionLine = typeof transactionLines.$inferInsert;

export const stockMovement = pgTable('stock_movement', {
    documentID: varchar('document_id', { length: 60 }).primaryKey(),
    movementStatus: char('movement_status', { length: 1 }),
    movementStatusDate: date('movement_status_date'),
    movementStatusTime: time('movement_status_time'),
    period: numeric('period', { precision: 2, scale: 0 }),
    movementDate: date('movement_date'),
    movementType: char('movement_type', { length: 2 }),
    movementStartTime: time('movement_start_time'),
    movementEndTime: time('movement_end_time'),
    customerID: varchar('customer_id').references(() => customers.id)
});

export const customersRelations = relations(customers, ({ many }) => ({
    invoices: many(invoices),
    payments: many(payments),
    movement: many(stockMovement)
}));

export const stockMovementLines = pgTable('stock_movement_line', {
    id: serial('id').primaryKey(),
    quantity: integer('quantity'),
    unitOfMeasure: varchar('unit_of_measure', { length: 20 }),
    unitPrice: numeric('unit_price', { scale: 2 }),
    creditAmount: numeric('credit_amount', { precision: 9, scale: 2 }),
    stockMovementID: varchar('stock_movement_id', { length: 60 }).references(() => stockMovement.documentID),
    productCode: varchar('product_code').references(() => products.id),
    taxTableID: integer('tax_table_id').references(() => taxTable.id),
});

export const taxTableRelations = relations(taxTable, ({ many }) => ({
    invoiceLines: many(invoiceLines),
    paymentLines: many(paymentLines),
    movementLines: many(stockMovementLines)
}));

export const productRelations = relations(products, ({ many }) => ({
    invoiceLines: many(invoiceLines),
    movementLines: many(stockMovementLines)
}));

export const movementLinesRelations = relations(stockMovementLines, ({ one }) => ({
    product: one(products, {
        fields: [stockMovementLines.productCode],
        references: [products.id],
    }),
    taxTable: one(taxTable, {
        fields: [stockMovementLines.taxTableID],
        references: [taxTable.id],
    }),
    movement: one(stockMovement, {
        fields: [stockMovementLines.stockMovementID],
        references: [stockMovement.documentID],
    }),
}));

export const shippingAddress = pgTable('shipping_address', {
    id: serial('id').primaryKey(),
    deliveryDate: date('delivery_date'),
    stockMovementID: varchar('stock_movement_id', { length: 60 }).references(() => stockMovement.documentID),
    addressID: integer('address_id').references(() => addresses.id),
});

export const movementRelations = relations(stockMovement, ({ one, many }) => ({
    customer: one(customers, {
        fields: [stockMovement.customerID],
        references: [customers.id],
    }),
    movementLine: many(stockMovementLines),
    shippingAddress: many(shippingAddress)
}));

export const shippingAddressRelations = relations(shippingAddress, ({ one }) => ({
    movement: one(stockMovement, {
        fields: [shippingAddress.stockMovementID],
        references: [stockMovement.documentID],
    }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
    customer: one(customers, {
        fields: [addresses.id],
        references: [customers.billingAddressID],
    }),
    supplier: one(suppliers, {
        fields: [addresses.id],
        references: [suppliers.addressID],
    }),
    header: one(header, {
        fields: [addresses.id],
        references: [header.addressID],
    }),
    shipping: one(shippingAddress, {
        fields: [addresses.id],
        references: [shippingAddress.addressID],
    }),
}));