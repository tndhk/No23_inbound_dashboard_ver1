-- CreateTable
CREATE TABLE "YearlyArrivals" (
    "year" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CountryExpenditure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "country" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "averageExpenditure" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "YearlyArrivals_year_key" ON "YearlyArrivals"("year");

-- CreateIndex
CREATE UNIQUE INDEX "CountryExpenditure_country_year_key" ON "CountryExpenditure"("country", "year");
