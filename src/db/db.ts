import { db } from '@/index';
import { Address, Customer, DocumentTotals, Invoice, LineElement, Payment, Product, Supplier, Tax, Transaction } from "./SAFTInterface";
import { invoices01, customers01, products01, taxTable01, header01, suppliers01, transactions01, payments01 } from "./utils";
import { addresses, customers, NewAddress, transactions, NewHeader, header, suppliers, products, taxTable, NewTaxTable, invoices, NewInvoice, invoiceLines, NewInvoiceLine, NewPayment, payments, paymentLines, NewPaymentLine, transactionLines, NewTransactionLine } from './schema';

async function main() {
    const companyAddress = header01.companyAddress;

    const newCompanyAddr = {
        city: companyAddress.city,
        addressDetail: companyAddress.addressDetail,
        postalCode: companyAddress.postalCode,
        country: companyAddress.country,
    }

    const insertedCompanyAddresses = await db.insert(addresses).values(newCompanyAddr).returning({ insertedId: addresses.id });

    const newHeader: NewHeader = {
        taxNumber: header01.taxRegistrationNumber,
        companyName: header01.companyName,
        fiscalYear: header01.fiscalYear,
        startDate: header01.startDate,
        endDate: header01.endDate,
        currencyCode: header01.currencyCode,
        telephone: header01.telephone,
        email: header01.email,
        addressID: insertedCompanyAddresses[0].insertedId!,
    }

    await db.insert(header).values(newHeader).returning();

    const newAddresses: NewAddress[] = customers01.map((customer: Customer) => {
        const billingAddress: Address = customer.billingAddress;

        return {
            city: billingAddress.city,
            addressDetail: billingAddress.addressDetail,
            postalCode: billingAddress.postalCode,
            country: billingAddress.country,
        }
    });

    const insertedAddresses = await db.insert(addresses).values(newAddresses).returning();

    const newCustomers = customers01.map((customer: Customer) => {
        const billingAdddress: Address = customer.billingAddress;

        const addr = insertedAddresses.find((element) => element.postalCode === billingAdddress.postalCode)

        return {
            id: `PT${customer.customerTaxID}`,
            companyName: customer.companyName,
            telephone: `+351 ${customer.telephone}`,
            billingAddressID: addr!.id,
        }

    });

    await db.insert(customers).values(newCustomers).returning();

    const newSupplierAddresses: NewAddress[] = suppliers01.map((supplier: Supplier) => {
        const supplierAddress: Address = supplier.billingAddress;

        return {
            city: supplierAddress.city,
            addressDetail: supplierAddress.addressDetail,
            postalCode: supplierAddress.postalCode,
            country: supplierAddress.country,
        }
    });

    const insertedSupplierAddresses = await db.insert(addresses).values(newSupplierAddresses).returning();

    const newSuppliers = suppliers01.map((supplier: Supplier) => {
        const supplierAddress: Address = supplier.billingAddress;
        const stringValue = supplier.supplierID.substring(0, supplier.supplierID.length - 2);

        const addr = insertedSupplierAddresses.find((element) => {
            return (element.addressDetail === supplierAddress.addressDetail && element.postalCode === supplierAddress.postalCode)
        })

        return {
            taxID: stringValue,
            companyName: supplier.companyName,
            telephone: supplier.telephone,
            addressID: addr!.id,
        }
    });

    await db.insert(suppliers).values(newSuppliers).returning();

    const newProducts = products01.map((product: Product) => {
        return {
            id: product.productCode.replace('.', ''),
            productGroup: product.productGroup,
            description: product.productDescription,
        }
    })

    await db.insert(products).values(newProducts).returning();

    const newTaxTable: NewTaxTable[] = taxTable01.map((taxTable: Tax) => {
        return {
            taxType: taxTable.taxType,
            taxCountryRegion: taxTable.taxCountryRegion,
            description: taxTable.description,
            taxCode: taxTable.taxCode,
            taxPercentage: `${taxTable.taxPercentage}`,
        }
    })

    const insertedTaxTable: NewTaxTable[] = await db.insert(taxTable).values(newTaxTable).returning();

    let newLine: NewInvoiceLine[] = [];

    const newInvoices: NewInvoice[] = invoices01.map((invoice: Invoice) => {
        const key = invoice.invoiceNo.replace(' ', '.');
        const final_key = key.replace('/', '');
        const documentTotals: DocumentTotals = invoice.documentTotals;
        const customerTaxID = invoice.customerID.substring(0, invoice.customerID.length - 2)
        const line: LineElement[] = invoice.line;


        line.map((line: LineElement) => {
            const taxes: Tax = line.tax;

            const tax: NewTaxTable | undefined = insertedTaxTable.find((element: NewTaxTable) => {
                return (element.taxCode === taxes.taxCode ||
                    element.taxCountryRegion === taxes.taxCountryRegion ||
                    element.taxPercentage === `${taxes.taxPercentage}`)
            })

            const tempNewLine = {
                invoiceID: final_key,
                productCode: line.productCode.replace('.', ''),
                quantity: line.quantity,
                unitOfMeasure: line.unitOfMeasure,
                unitPrice: `${line.unitPrice}`,
                creditAmount: `${line.creditAmount} `,
                taxPointDate: line.taxPointDate,
                taxTableID: tax!.id,
            }

            newLine.push(tempNewLine);

            return tempNewLine;
        })

        return {
            id: final_key,
            invoiceDate: invoice.invoiceDate,
            taxPayable: `${documentTotals.taxPayable} `,
            netTotal: `${documentTotals.netTotal} `,
            grossTotal: `${documentTotals.grossTotal} `,
            invoiceType: invoice.invoiceType,
            customerID: customerTaxID
        }
    })

    await db.insert(invoices).values(newInvoices).returning();

    await db.insert(invoiceLines).values(newLine).returning();

    let newPaymentLine: NewPaymentLine[] = [];

    const newPayments: NewPayment[] = payments01.map((payment: Payment) => {
        const key = payment.paymentRefNo.replace(' ', '.');
        const final_key = key.replace('/', '');
        const documentTotals = payment.documentTotals;
        const method = payment.paymentMethod;
        const customerTaxID = payment.customerID.substring(0, payment.customerID.length - 2)
        const line = payment.line;
        const originatingON = line.sourceDocumentID.originatingON.replace(' ', '.');
        const invoiceID = originatingON.replace('/', '');
        const taxes: Tax = line.tax;

        const tax: NewTaxTable | undefined = insertedTaxTable.find((element: NewTaxTable) => {
            return (element.taxCode === taxes.taxCode ||
                element.taxCountryRegion === taxes.taxCountryRegion ||
                element.taxPercentage === `${taxes.taxPercentage}`)
        })

        const newLine: NewPaymentLine = {
            creditAmount: `${line.creditAmount}`,
            originatingON: invoiceID,
            paymentID: final_key,
            taxTableID: tax!.id
        }

        newPaymentLine.push(newLine);

        return {
            paymentRefNo: final_key,
            taxPayable: `${documentTotals.taxPayable}`,
            netTotal: `${documentTotals.netTotal}`,
            grossTotal: `${documentTotals.grossTotal}`,
            paymentType: payment.paymentType,
            paymentMechanism: method.paymentMechanism,
            paymentDate: method.paymentDate,
            customerID: customerTaxID
        }
    });

    await db.insert(payments).values(newPayments).returning();

    await db.insert(paymentLines).values(newPaymentLine).returning();

    let newTLines: NewTransactionLine[] = []

    const newTransactions = transactions01.map((transaction: Transaction) => {
        const supplierTaxID = transaction.supplierID!.substring(0, transaction.supplierID!.length - 2);
        const transactionLine = transaction.lines.debitLine;

        const newTLine: NewTransactionLine = {
            amount: `${transactionLine.debitAmount}`,
            transactionID: transactionLine.sourceDocumentID.replace(' ', '.').replace('/', ''),
        }

        newTLines.push(newTLine);

        return {
            id: transactionLine.sourceDocumentID.replace(' ', '.').replace('/', ''),
            transactionDate: transaction.transactionDate,
            supplierID: supplierTaxID,
        }
    })

    await db.insert(transactions).values(newTransactions).returning();

    await db.insert(transactionLines).values(newTLines).returning();

    process.exit(0);
}

main();
