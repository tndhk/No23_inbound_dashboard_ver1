import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import path from 'path'
import Papa from 'papaparse'

const prisma = new PrismaClient()

// Define paths relative to the project root (prisma directory)
const DATA_DIR = path.join(__dirname, '..', 'data') // Go up one level from prisma dir
const ARRIVALS_CSV_PATH = path.join(DATA_DIR, 'arrivals', 'country_visitors_by_year.csv')
const EXPENDITURE_CSV_PATH = path.join(DATA_DIR, 'expenditure', 'a1_travel_expenditure_by_country.csv')

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

async function main() {
  console.log('Starting seeding process...')

  try {
    // 1. Read CSV files
    console.log('Reading CSV files...')
    const [arrivalsCsvString, expenditureCsvString] = await Promise.all([
      readFile(ARRIVALS_CSV_PATH, 'utf-8'),
      readFile(EXPENDITURE_CSV_PATH, 'utf-8'),
    ])
    console.log('Successfully read CSV files.')

    // 2. Parse and process CSV data
    console.log('Parsing and processing CSV data...')

    // Process Arrivals
    const arrivalsParseResult = Papa.parse<ArrivalsCsvRow>(arrivalsCsvString, { header: true, skipEmptyLines: true })
    const yearlyArrivalsData = arrivalsParseResult.data
      .filter(row => row.Country === '総数')
      .map(row => ({
        year: parseInt(row.Year, 10),
        count: parseInt(row['Total Visitors'], 10),
      }))
      .filter(item => !isNaN(item.year) && !isNaN(item.count));

    // Process Expenditure
    const expenditureParseResult = Papa.parse<ExpenditureCsvRow>(expenditureCsvString, { header: true, skipEmptyLines: true })
    const countryExpenditureData = expenditureParseResult.data
      .filter((row, index) => index !== 0 && row.Country && row.Country !== 'その他' && row.Country !== '全国籍･地域')
      .map(row => ({
        country: row.Country,
        averageExpenditure: parseFloat(row.消費単価),
      }))
      .filter(item => item.country && !isNaN(item.averageExpenditure));

    console.log('Successfully processed CSV data.')

    // 3. Update the database using Prisma Transaction
    console.log('Seeding database...')
    await prisma.$transaction(async (tx) => {
      // Clear existing data
      console.log('Clearing existing data...')
      await tx.yearlyArrivals.deleteMany()
      await tx.countryExpenditure.deleteMany()
      console.log('Existing data cleared.')

      // Insert new data using loops with create
      console.log(`Inserting ${yearlyArrivalsData.length} yearly arrivals records...`)
      for (const arrival of yearlyArrivalsData) {
        await tx.yearlyArrivals.create({ data: arrival })
      }

      console.log(`Inserting ${countryExpenditureData.length} country expenditure records...`)
      const currentYear = new Date().getFullYear(); // Or derive year from CSV if available
      for (const expenditure of countryExpenditureData) {
        await tx.countryExpenditure.create({
          // Ensure the year field exists in the data object for the DB
          data: { ...expenditure, year: currentYear },
        })
      }

      console.log('New data inserted.')
    })
    console.log('Database seeding successful.')

  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('Prisma client disconnected.')
  }
}

main() 