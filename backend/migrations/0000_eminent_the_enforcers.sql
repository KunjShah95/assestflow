CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"action" varchar(100) NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "allocations" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	"department_id" integer,
	"allocated_at" timestamp DEFAULT now(),
	"expected_return_date" date,
	"returned_at" timestamp,
	"condition_checkin_notes" text,
	"status" varchar(20) DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "asset_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"warranty_period_days" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "asset_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category_id" integer NOT NULL,
	"asset_tag" varchar(20) NOT NULL,
	"serial_number" varchar(255),
	"acquisition_date" date,
	"acquisition_cost" numeric(12, 2),
	"condition" varchar(50) DEFAULT 'good',
	"location" varchar(255),
	"photo_urls" text[],
	"is_bookable" boolean DEFAULT false,
	"status" varchar(30) DEFAULT 'available' NOT NULL,
	"current_holder_employee_id" integer,
	"current_department_id" integer,
	"qr_code" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "assets_asset_tag_unique" UNIQUE("asset_tag")
);
--> statement-breakpoint
CREATE TABLE "audit_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_cycle_id" integer NOT NULL,
	"auditor_employee_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_cycles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"scope_department_id" integer,
	"scope_location" varchar(255),
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" varchar(20) DEFAULT 'open',
	"created_by_admin_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_cycle_id" integer NOT NULL,
	"asset_id" integer NOT NULL,
	"status" varchar(30) NOT NULL,
	"notes" text,
	"checked_by_employee_id" integer,
	"checked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"booker_employee_id" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'upcoming',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parent_department_id" integer,
	"head_employee_id" integer,
	"status" varchar(20) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"department_id" integer,
	"role" varchar(20) DEFAULT 'employee' NOT NULL,
	"status" varchar(20) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "maintenance_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"requested_by_employee_id" integer NOT NULL,
	"description" text NOT NULL,
	"priority" varchar(20) DEFAULT 'medium',
	"photo_url" text,
	"status" varchar(30) DEFAULT 'pending',
	"approved_by" integer,
	"assigned_technician" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"reference_type" varchar(50),
	"reference_id" integer,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"rule_type" varchar(50) NOT NULL,
	"conditions" jsonb NOT NULL,
	"action" varchar(20) NOT NULL,
	"priority" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "policies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "transfers" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"from_employee_id" integer,
	"to_employee_id" integer NOT NULL,
	"status" varchar(20) DEFAULT 'requested',
	"requested_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	"approved_by" integer,
	"reason" text
);
