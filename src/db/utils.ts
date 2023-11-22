//import * as data from '../src/files/saft.json';
import { Customer, Header, Invoice, Payment, Product, Saft, Supplier, Tax, Transaction } from './SAFTInterface';
import readXMLFile from './parser';

const obj: Saft = { ...readXMLFile() } as const

export const header01: Header = obj.auditFile.header;

export const customers01: Customer[] = obj.auditFile.masterFiles.customer.slice(1);

export const suppliers01: Supplier[] = obj.auditFile.masterFiles.supplier;

export const products01: Product[] = obj.auditFile.masterFiles.product.slice(1);

export const taxTable01: Tax[] = obj.auditFile.masterFiles.taxTable.taxTableEntry;

export const invoices01: Invoice[] = obj.auditFile.sourceDocuments.salesInvoices.invoice;

export const transactions01: Transaction[] = obj.auditFile.generalLedgerEntries.journal[1].transaction

export const payments01: Payment[] = obj.auditFile.sourceDocuments.payments.payment!;

export const FISCAL_YEAR = 2022;

export const euro = Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
});