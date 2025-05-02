import { prisma } from '@/lib/prisma'

/**
 * Gets all yearly arrival records, ordered by year ascending.
 * @returns A promise that resolves to an array of YearlyArrivals objects.
 */
export async function getYearlyArrivals() {
  try {
    const yearlyArrivals = await prisma.yearlyArrivals.findMany({
      orderBy: {
        year: 'asc',
      },
    })
    return yearlyArrivals
  } catch (error) {
    console.error('Database Error: Failed to fetch yearly arrivals.', error)
    // In a real app, you might want to throw a more specific error
    // or return an empty array or a specific error object.
    throw new Error('Failed to fetch yearly arrivals data.')
  }
}

/**
 * Gets all country expenditure records.
 * @returns A promise that resolves to an array of CountryExpenditure objects.
 */
export async function getCountryExpenditures() {
  try {
    const countryExpenditures = await prisma.countryExpenditure.findMany()
    return countryExpenditures
  } catch (error) {
    console.error('Database Error: Failed to fetch country expenditures.', error)
    throw new Error('Failed to fetch country expenditure data.')
  }
}

/**
 * Gets country-specific arrival records for a given year, ordered by count descending.
 * @param year The year to fetch data for.
 * @returns A promise that resolves to an array of CountryArrivals objects.
 */
export async function getCountryArrivalsByYear(year: number) {
  try {
    const countryArrivals = await prisma.countryArrivals.findMany({
      where: {
        year: year,
      },
      orderBy: {
        count: 'desc',
      },
    })
    return countryArrivals
  } catch (error) {
    console.error(`Database Error: Failed to fetch country arrivals for ${year}.`, error)
    throw new Error(`Failed to fetch country arrivals data for ${year}.`)
  }
} 