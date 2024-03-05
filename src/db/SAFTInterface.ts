export type Saft = {
    auditFile: AuditFile;
}

export type AuditFile = {
    header:               Header;
    masterFiles:          MasterFiles;
    generalLedgerEntries: GeneralLedgerEntries;
    sourceDocuments:      SourceDocuments;
}

export type GeneralLedgerEntries = {
    numberOfEntries: number;
    totalDebit:      number;
    totalCredit:     number;
    journal:        Journal[];
    payment?:        Payment[];
    invoice:        Invoice[];
    workDocument?:   WorkDocument;
}

export type Invoice = {
    invoiceNo:         string;
    aTCUD:             number;
    documentStatus:    InvoiceDocumentStatus;
    hash:              string;
    hashControl:       number;
    period:            number;
    invoiceDate:       string;
    invoiceType:       string;
    specialRegimes:    SpecialRegimes;
    sourceID:          string | "estg";
    systemEntryDate:   string;
    transactionID?:    string;
    customerID:        string;
    shipTo:            Ship;
    shipFrom:          Ship;
    movementStartTime: string;
    line:              LineElement[];
    documentTotals:    DocumentTotals;
    withholdingTax:    WithholdingTax;
}

export type InvoiceDocumentStatus = {
    invoiceStatus:     string;
    invoiceStatusDate: string;
    sourceID:          string | "estg";
    sourceBilling:     string;
    reason?:           string;
}

export type WorkStatus = "A" | "N";

export type SourceBilling = "O" | "P";

export type DocumentTotals = {
    taxPayable:  number;
    netTotal:    number;
    grossTotal:  number;
    settlement?: Settlement;
}

export type Settlement = {
    settlementAmount: number;
}

export type LineElement = {
    lineNumber:         number;
    productCode:        string;
    productDescription: string;
    quantity:           number;
    unitOfMeasure:      string;
    unitPrice:          number;
    taxPointDate:       string;
    description:        string;
    creditAmount:       number;
    tax:                Tax;
    settlementAmount:   number;
}

export type Tax = {
    taxType:          string;
    taxCountryRegion: string;
    taxCode:          string;
    description?:     string;
    taxPercentage:    number;
}

export type Ship = {
    deliveryDate: string;
    address:      Address;
}

export type Address = {
    streetName?:   string;
    addressDetail: string;
    city:          string;
    postalCode:    string;
    region?:       string;
    country:       string;
}

export type SpecialRegimes = {
    selfBillingIndicator:         number;
    cashVATSchemeIndicator:       number;
    thirdPartiesBillingIndicator: number;
}

export type WithholdingTax = {
    withholdingTaxAmount: number;
}

export type Journal = {
    journalID:   number;
    description: string;
    transaction: Transaction[];
}

export type Transaction = {
    transactionID:     string;
    period:            number;
    transactionDate:   string;
    sourceID:          string | "estg";
    description:       string;
    docArchivalNumber: number;
    transactionType:   WorkStatus;
    gLPostingDate:     string;
    lines:             Lines;
    supplierID?:       string;
}

export type Lines = {
    creditLine: ItLine;
    debitLine:  ItLine;
}

export type ItLine = {
    recordID:         number;
    accountID:        number;
    sourceDocumentID: string;
    systemEntryDate:  string;
    description:      string;
    creditAmount?:    number;
    debitAmount?:     number;
}

export type Payment = {
    paymentRefNo:    string;
    aTCUD:           number;
    period:          number;
    transactionID:   string;
    transactionDate: string;
    paymentType:     string;
    documentStatus:  PaymentDocumentStatus;
    paymentMethod:   PaymentMethod;
    sourceID:        string | "estg";
    systemEntryDate: string;
    customerID:      string;
    line:            PaymentLine;
    documentTotals:  DocumentTotals;
}

export type PaymentDocumentStatus = {
    paymentStatus:     WorkStatus;
    paymentStatusDate: string;
    sourceID:          string | "estg";
    sourcePayment:     SourceBilling;
}

export type PaymentLine = {
    lineNumber:       number;
    sourceDocumentID: SourceDocumentID;
    settlementAmount: number;
    creditAmount:     number;
    tax:              Tax;
}

export type SourceDocumentID = {
    originatingON: string;
    invoiceDate:   string;
}

export type PaymentMethod = {
    paymentMechanism: string;
    paymentAmount:    number;
    paymentDate:      string;
}

export type WorkDocument = {
    documentNumber:  string;
    aTCUD:           number;
    documentStatus:  WorkDocumentDocumentStatus;
    hash:            number;
    hashControl:     number;
    period:          number;
    workDate:        string;
    workType:        string;
    sourceID:        string | "estg";
    systemEntryDate: string;
    customerID:      string;
    line:            LineElement[];
    documentTotals:  DocumentTotals;
}

export type WorkDocumentDocumentStatus = {
    workStatus:     WorkStatus;
    workStatusDate: string;
    sourceID:       string | "estg";
    sourceBilling:  SourceBilling;
}

export type Header = {
    auditFileVersion:          string;
    companyID:                 string;
    taxRegistrationNumber:     number;
    taxAccountingBasis:        string;
    companyName:               string;
    companyAddress:            Address;
    fiscalYear:                number;
    startDate:                 string;
    endDate:                   string;
    currencyCode:              string;
    dateCreated:               string;
    taxEntity:                 string;
    productCompanyTaxID:       number;
    softwareCertificateNumber: number;
    productID:                 string;
    productVersion:            string;
    telephone:                 string;
    email:                     string;
}

export type MasterFiles = {
    generalLedgerAccounts: GeneralLedgerAccounts;
    customer:              Customer[];
    supplier:              Supplier[];
    product:               Product[];
    taxTable:              TaxTable;
}

export type Customer = {
    customerID:           string;
    accountID:            number | string;
    customerTaxID:        number;
    companyName:          string;
    billingAddress:       Address;
    shipToAddress:        Address;
    selfBillingIndicator: number;
    telephone?:           number;
}

export type GeneralLedgerAccounts = {
    taxonomyReference: string;
    account:           Account[];
}

export type Account = {
    accountID:            number;
    accountDescription:   string;
    openingDebitBalance:  number;
    openingCreditBalance: number;
    closingDebitBalance:  number;
    closingCreditBalance: number;
    groupingCategory:     string;
    groupingCode?:        number;
    taxonomyCode?:        number;
}

export type Product = {
    productType:        SourceBilling;
    productCode:        string;
    productGroup:       string;
    productDescription: string;
    productNumberCode:  string;
}

export type Supplier = {
    supplierID:           string;
    accountID:            number;
    supplierTaxID:        number;
    companyName:          string;
    billingAddress:       Address;
    shipFromAddress:      Address;
    telephone:            string;
    selfBillingIndicator: number;
    fax?:                 string;
}

export type TaxTable = {
    taxTableEntry: Tax[];
}

export type SourceDocuments = {
    salesInvoices:    GeneralLedgerEntries;
    workingDocuments: GeneralLedgerEntries;
    payments:         GeneralLedgerEntries;
}
