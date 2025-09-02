-- CreateEnum
CREATE TYPE "public"."DroneStatus" AS ENUM ('AVAILABLE', 'IN_MISSION', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."MissionStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'ABORTED');

-- CreateEnum
CREATE TYPE "public"."SurveyPattern" AS ENUM ('GRID', 'CROSSHATCH', 'PERIMETER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Drone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "status" "public"."DroneStatus" NOT NULL DEFAULT 'AVAILABLE',
    "batteryLevel" INTEGER NOT NULL DEFAULT 100,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Drone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "public"."MissionStatus" NOT NULL DEFAULT 'PLANNED',
    "flightPath" JSONB,
    "flightAltitude" DOUBLE PRECISION NOT NULL,
    "dataCollectionParams" JSONB,
    "surveyPattern" "public"."SurveyPattern" NOT NULL DEFAULT 'GRID',
    "overlapPercentage" DOUBLE PRECISION,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "estimatedTimeLeft" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "droneId" TEXT,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SurveyReport" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "flightDuration" INTEGER NOT NULL,
    "distanceCovered" DOUBLE PRECISION NOT NULL,
    "areaCovered" DOUBLE PRECISION NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mission_droneId_key" ON "public"."Mission"("droneId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyReport_missionId_key" ON "public"."SurveyReport"("missionId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");
