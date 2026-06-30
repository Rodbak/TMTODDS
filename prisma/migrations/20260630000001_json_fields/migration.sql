-- Migration: json_fields
-- Converts two String? columns to native JSONB for type safety and queryability.
--
-- researchUrls on SlipMatch: was stored as a raw JSON string.
--   Existing data: cast the text to jsonb. Rows with NULL stay NULL.
--   Rows with invalid JSON will error — fix them before running:
--     SELECT id, "researchUrls" FROM "SlipMatch" WHERE "researchUrls" IS NOT NULL;
--
-- rawJson on Payment: same treatment.

-- Step 1: add new JSONB columns alongside the old text columns
ALTER TABLE "SlipMatch" ADD COLUMN "researchUrls_new" JSONB;
ALTER TABLE "Payment"   ADD COLUMN "rawJson_new"      JSONB;

-- Step 2: migrate existing data (cast text → jsonb where not null)
UPDATE "SlipMatch"
SET "researchUrls_new" = "researchUrls"::jsonb
WHERE "researchUrls" IS NOT NULL;

UPDATE "Payment"
SET "rawJson_new" = "rawJson"::jsonb
WHERE "rawJson" IS NOT NULL;

-- Step 3: drop old text columns
ALTER TABLE "SlipMatch" DROP COLUMN "researchUrls";
ALTER TABLE "Payment"   DROP COLUMN "rawJson";

-- Step 4: rename new columns to the canonical names
ALTER TABLE "SlipMatch" RENAME COLUMN "researchUrls_new" TO "researchUrls";
ALTER TABLE "Payment"   RENAME COLUMN "rawJson_new"      TO "rawJson";
