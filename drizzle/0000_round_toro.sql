CREATE TABLE IF NOT EXISTS "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"address_detail" varchar(210),
	"city" varchar(100),
	"postal_code" varchar,
	"country" char(2) DEFAULT 'PT'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"id" varchar PRIMARY KEY NOT NULL,
	"company_name" varchar(100) NOT NULL,
	"telephone" varchar,
	"billing_address_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company_header" (
	"id" serial PRIMARY KEY NOT NULL,
	"tax_number" integer NOT NULL,
	"company_name" varchar(100),
	"fiscal_year" smallint NOT NULL,
	"start_date" date,
	"end_date" date,
	"currency_code" char(3),
	"telephone" varchar,
	"email" varchar,
	"address_id" integer,
	CONSTRAINT "company_header_tax_number_unique" UNIQUE("tax_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" varchar,
	"product_code" varchar,
	"quantity" integer,
	"unit_of_measure" varchar(20),
	"unit_price" numeric,
	"credit_amount" numeric(9, 2),
	"tax_point_date" date,
	"tax_table_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice" (
	"id" varchar PRIMARY KEY NOT NULL,
	"invoice_date" date,
	"tax_payable" numeric(9, 2),
	"net_total" numeric(9, 2),
	"gross_total" numeric(9, 2),
	"invoice_type" char(2),
	"customer_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"credit_amount" numeric(9, 2),
	"originating_on" varchar,
	"payment_id" varchar,
	"tax_table_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"payment_ref_no" varchar PRIMARY KEY NOT NULL,
	"tax_payable" numeric(9, 2),
	"net_total" numeric(9, 2),
	"gross_total" numeric(9, 2),
	"payment_type" char(2),
	"payment_mechanism" char(2),
	"payment_date" date,
	"customer_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" varchar PRIMARY KEY NOT NULL,
	"product_group" varchar(100),
	"description" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipping_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"delivery_date" date,
	"stock_movement_id" varchar(60),
	"address_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_movement" (
	"document_id" varchar(60) PRIMARY KEY NOT NULL,
	"movement_status" char(1),
	"movement_status_date" date,
	"movement_status_time" time,
	"period" numeric(2, 0),
	"movement_date" date,
	"movement_type" char(2),
	"movement_start_time" time,
	"movement_end_time" time,
	"customer_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_movement_line" (
	"id" serial PRIMARY KEY NOT NULL,
	"quantity" integer,
	"unit_of_measure" varchar(20),
	"unit_price" numeric,
	"credit_amount" numeric(9, 2),
	"stock_movement_id" varchar(60),
	"product_code" varchar,
	"tax_table_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier" (
	"tax_id" varchar(11) PRIMARY KEY NOT NULL,
	"company_name" varchar(200),
	"telephone" varchar,
	"address_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tax_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"tax_type" char(3),
	"tax_country_region" char(5),
	"description" varchar,
	"tax_code" char(3),
	"tax_percentage" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(9, 2),
	"transaction_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" varchar PRIMARY KEY NOT NULL,
	"transaction_date" date,
	"supplier_id" varchar(11)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer" ADD CONSTRAINT "customer_billing_address_id_address_id_fk" FOREIGN KEY ("billing_address_id") REFERENCES "address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company_header" ADD CONSTRAINT "company_header_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_product_code_product_id_fk" FOREIGN KEY ("product_code") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_tax_table_id_tax_table_id_fk" FOREIGN KEY ("tax_table_id") REFERENCES "tax_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_lines" ADD CONSTRAINT "payment_lines_originating_on_invoice_id_fk" FOREIGN KEY ("originating_on") REFERENCES "invoice"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_lines" ADD CONSTRAINT "payment_lines_payment_id_payments_payment_ref_no_fk" FOREIGN KEY ("payment_id") REFERENCES "payments"("payment_ref_no") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_lines" ADD CONSTRAINT "payment_lines_tax_table_id_tax_table_id_fk" FOREIGN KEY ("tax_table_id") REFERENCES "tax_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipping_address" ADD CONSTRAINT "shipping_address_stock_movement_id_stock_movement_document_id_fk" FOREIGN KEY ("stock_movement_id") REFERENCES "stock_movement"("document_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipping_address" ADD CONSTRAINT "shipping_address_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_movement_line" ADD CONSTRAINT "stock_movement_line_stock_movement_id_stock_movement_document_id_fk" FOREIGN KEY ("stock_movement_id") REFERENCES "stock_movement"("document_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_movement_line" ADD CONSTRAINT "stock_movement_line_product_code_product_id_fk" FOREIGN KEY ("product_code") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_movement_line" ADD CONSTRAINT "stock_movement_line_tax_table_id_tax_table_id_fk" FOREIGN KEY ("tax_table_id") REFERENCES "tax_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supplier" ADD CONSTRAINT "supplier_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_lines" ADD CONSTRAINT "transaction_lines_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_supplier_id_supplier_tax_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("tax_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
