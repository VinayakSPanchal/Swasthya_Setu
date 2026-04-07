-- CreateTable
CREATE TABLE "public"."LocalDoctor" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "hospital" TEXT,
    "clinicName" TEXT,
    "yearsExperience" INTEGER,
    "contact" TEXT,
    "address" TEXT,
    "pincode" TEXT,
    "platformDoctorId" TEXT,
    "isOnPlatform" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocalDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalDoctor_platformDoctorId_key" ON "public"."LocalDoctor"("platformDoctorId");

-- CreateIndex
CREATE INDEX "LocalDoctor_region_idx" ON "public"."LocalDoctor"("region");

-- CreateIndex
CREATE INDEX "LocalDoctor_locality_idx" ON "public"."LocalDoctor"("locality");

-- CreateIndex
CREATE INDEX "LocalDoctor_specialty_idx" ON "public"."LocalDoctor"("specialty");

-- CreateIndex
CREATE INDEX "LocalDoctor_region_locality_specialty_idx" ON "public"."LocalDoctor"("region", "locality", "specialty");
