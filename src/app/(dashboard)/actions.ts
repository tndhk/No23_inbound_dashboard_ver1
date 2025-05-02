'use server'

import { readFile } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import Papa from 'papaparse'
// import { YearlyArrivals, CountryExpenditure } from '@prisma/client' // Not strictly needed if we use types below

// Define paths relative to the project root
const DATA_DIR = path.join(process.cwd(), 'data')
const ARRIVALS_CSV_PATH = path.join(DATA_DIR, 'arrivals', 'country_visitors_by_year.csv')
const EXPENDITURE_CSV_PATH = path.join(DATA_DIR, 'expenditure', 'a1_travel_expenditure_by_country.csv')

// Removed unused interfaces: YearlyArrival, CountryExpenditureInput

// Type definition for PapaParse results
interface ArrivalsCsvRow {
  Year: string
  Country: string
  'Total Visitors': string
}

interface ExpenditureCsvRow {
  Country: string
  回答数: string // Answer count - might not be needed
  消費単価: string // Average Expenditure
}

export async function updateDashboardData(): Promise<{
  success: boolean
  error?: string
}> {
  console.log('Starting data update process (JS version)...')

  try {
    // 1. Read CSV files
    console.log('Reading CSV files...')
    const [arrivalsCsvString, expenditureCsvString] = await Promise.all([
      readFile(ARRIVALS_CSV_PATH, 'utf-8'),
      readFile(EXPENDITURE_CSV_PATH, 'utf-8'),
    ])

    // 2. Parse and process CSV data
    console.log('Parsing and processing CSV data...')

    // Process Arrivals
    const arrivalsParseResult = Papa.parse<ArrivalsCsvRow>(arrivalsCsvString, { header: true, skipEmptyLines: true })
    const yearlyArrivalsData = arrivalsParseResult.data
      .filter(row => row.Country === '総数') // Filter for total rows
      .map(row => ({
        year: parseInt(row.Year, 10),
        count: parseInt(row['Total Visitors'], 10),
      }))
      .filter(item => !isNaN(item.year) && !isNaN(item.count)); // Ensure valid numbers

    // Process Expenditure
    // Need to skip the second row (index 1) which is descriptive header in the sample
    const expenditureParseResult = Papa.parse<ExpenditureCsvRow>(expenditureCsvString, { header: true, skipEmptyLines: true })
    const countryExpenditureData = expenditureParseResult.data
      .filter((row, index) => index !== 0 && row.Country && row.Country !== 'その他' && row.Country !== '全国籍･地域') // Skip first data row (index 1 overall), filter out summary rows/invalid rows
      .map(row => ({
        country: row.Country,
        averageExpenditure: parseFloat(row.消費単価),
      }))
      .filter(item => item.country && !isNaN(item.averageExpenditure)); // Ensure valid data

    console.log('Successfully processed CSV data.')

    // 3. Update the database using Prisma Transaction
    console.log('Updating database...')
    await prisma.$transaction(async (tx) => {
      // Clear existing data
      await tx.yearlyArrivals.deleteMany()
      await tx.countryExpenditure.deleteMany()
      console.log('Cleared existing data.')

      // Insert new data using loops with create
      console.log(`Inserting ${yearlyArrivalsData.length} yearly arrivals records...`)
      for (const arrival of yearlyArrivalsData) {
        await tx.yearlyArrivals.create({ data: arrival })
      }

      console.log(`Inserting ${countryExpenditureData.length} country expenditure records...`)
      const currentYear = new Date().getFullYear();
      for (const expenditure of countryExpenditureData) {
        await tx.countryExpenditure.create({
          data: { ...expenditure, year: currentYear }, // Add current year
        })
      }

      console.log('Inserted new data.')
    })
    console.log('Database update successful.')

    // 4. Revalidate the cache for the dashboard page
    revalidatePath('/(dashboard)')
    console.log('Cache revalidated for / (dashboard).')

    return { success: true }
  } catch (error: unknown) {
    console.error('Data update failed:', error)
    let errorMessage = 'An unknown error occurred during data update.';
    if (error instanceof Error) {
      errorMessage = error.message; // Extract message safely
    }
    return {
      success: false,
      error: errorMessage,
    }
  }
} 