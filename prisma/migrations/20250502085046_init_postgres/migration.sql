-- CreateTable
CREATE TABLE "YearlyArrivals" (
    "year" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "YearlyArrivals_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "CountryExpenditure" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "averageExpenditure" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CountryExpenditure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YearlyArrivals_year_key" ON "YearlyArrivals"("year");

-- CreateIndex
CREATE UNIQUE INDEX "CountryExpenditure_country_year_key" ON "CountryExpenditure"("country", "year");
