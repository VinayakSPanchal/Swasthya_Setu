-- CreateTable
CREATE TABLE "public"."LocalDoctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "speciality" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "photoUrl" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "clinicName" TEXT,
    "experience" INTEGER,
    "education" TEXT,
    "languages" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LocalDoctor_speciality_idx" ON "public"."LocalDoctor"("speciality");

-- CreateIndex
CREATE INDEX "LocalDoctor_location_idx" ON "public"."LocalDoctor"("location");

-- CreateIndex
CREATE INDEX "LocalDoctor_rating_idx" ON "public"."LocalDoctor"("rating");
