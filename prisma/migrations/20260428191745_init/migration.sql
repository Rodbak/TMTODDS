-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');
CREATE TYPE "SlipTier" AS ENUM ('FREE', 'FIXED', 'CONFIRMED', 'CORRECT_SCORE');
CREATE TYPE "SlipStatus" AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE "MatchResultStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'VOID');
CREATE TYPE "PaymentProvider" AS ENUM ('PAYSTACK');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "referralCode" TEXT NOT NULL,
  "points" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "priceGhs" INTEGER NOT NULL,
  "durationDays" INTEGER NOT NULL,
  "includesFixed" BOOLEAN NOT NULL DEFAULT false,
  "includesConfirmed" BOOLEAN NOT NULL DEFAULT false,
  "includesCorrectScore" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',

  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slip" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "tier" "SlipTier" NOT NULL,
  "status" "SlipStatus" NOT NULL DEFAULT 'DRAFT',
  "bodyMd" TEXT NOT NULL,
  "publishAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdById" TEXT NOT NULL,

  CONSTRAINT "Slip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlipMatch" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "slipId" TEXT NOT NULL,
  "kickoffAt" TIMESTAMP(3),
  "league" TEXT,
  "homeTeam" TEXT NOT NULL,
  "awayTeam" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "pick" TEXT NOT NULL,
  "odds" DOUBLE PRECISION NOT NULL,
  "bookmaker" TEXT,
  "bestSiteUrl" TEXT,
  "researchUrls" TEXT,
  "externalFixtureId" TEXT,
  "resultStatus" "MatchResultStatus" NOT NULL DEFAULT 'PENDING',
  "finalHomeScore" INTEGER,
  "finalAwayScore" INTEGER,

  CONSTRAINT "SlipMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "provider" "PaymentProvider" NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "userId" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'GHS',
  "reference" TEXT NOT NULL,
  "rawJson" TEXT,

  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription"
  ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription"
  ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Slip"
  ADD CONSTRAINT "Slip_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SlipMatch"
  ADD CONSTRAINT "SlipMatch_slipId_fkey" FOREIGN KEY ("slipId") REFERENCES "Slip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Payment"
  ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment"
  ADD CONSTRAINT "Payment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

CREATE UNIQUE INDEX "Plan_key_key" ON "Plan"("key");

CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");
CREATE INDEX "Subscription_endsAt_idx" ON "Subscription"("endsAt");

CREATE UNIQUE INDEX "Slip_slug_key" ON "Slip"("slug");
CREATE INDEX "Slip_status_publishAt_idx" ON "Slip"("status", "publishAt");
CREATE INDEX "Slip_tier_idx" ON "Slip"("tier");

CREATE INDEX "SlipMatch_slipId_idx" ON "SlipMatch"("slipId");
CREATE INDEX "SlipMatch_resultStatus_idx" ON "SlipMatch"("resultStatus");

CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");
CREATE INDEX "Payment_userId_status_idx" ON "Payment"("userId", "status");
