-- CreateTable
CREATE TABLE "CountryArrivals" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "CountryArrivals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CountryArrivals_country_year_key" ON "CountryArrivals"("country", "year");
