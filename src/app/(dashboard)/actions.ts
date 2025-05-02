'use server'

import { exec } from 'child_process'
import { readFile } from 'fs/promises'
import path from 'path'
import { promisify } from 'util'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { YearlyArrivals, CountryExpenditure } from '@prisma/client'

const execPromise = promisify(exec)

// Define paths relative to the project root
const OUTPUT_DIR = path.join(process.cwd(), 'processed_data')
const YEARLY_ARRIVALS_JSON = path.join(OUTPUT_DIR, 'yearly_arrivals.json')
const COUNTRY_EXPENDITURE_JSON = path.join(OUTPUT_DIR, 'country_expenditure.json')

interface ProcessedArrivalsData {
  year: number
  count: number
}

interface ProcessedExpenditureData {
  country: string
  averageExpenditure: number
}

export async function updateDashboardData(): Promise<{
  success: boolean
  error?: string
}> {
  console.log('Starting data update process...')

  try {
    // 1. Run the Python script using Docker Compose
    console.log('Running ingest script via Docker...')
    // Ensure the service name 'ingest-script' matches docker-compose.yml
    // Use `docker compose` (with space) for newer Docker versions
    const { stdout: dockerStdout, stderr: dockerStderr } =
      await execPromise(
        'docker compose run --rm ingest-script python /app/scripts/ingest.py'
      )
    console.log('Docker script stdout:', dockerStdout)
    if (dockerStderr) {
      console.error('Docker script stderr:', dockerStderr)
      // Optionally treat stderr as an error depending on the script's behavior
      // For now, we log it but proceed unless the script explicitly failed
    }
    console.log('Ingest script finished.')

    // 2. Read the generated JSON files
    console.log('Reading processed JSON files...')
    const [arrivalsDataJson, expenditureDataJson] = await Promise.all([
      readFile(YEARLY_ARRIVALS_JSON, 'utf-8'),
      readFile(COUNTRY_EXPENDITURE_JSON, 'utf-8'),
    ])

    const arrivalsData: ProcessedArrivalsData[] = JSON.parse(arrivalsDataJson)
    const expenditureData: ProcessedExpenditureData[] = JSON.parse(expenditureDataJson)
    console.log('Successfully read JSON files.')

    // 3. Update the database using Prisma Transaction
    console.log('Updating database...')
    await prisma.$transaction(async (tx) => {
      // Clear existing data
      await tx.yearlyArrivals.deleteMany()
      await tx.countryExpenditure.deleteMany()
      console.log('Cleared existing data.')

      // Insert new data using loops with create instead of createMany
      console.log(`Inserting ${arrivalsData.length} yearly arrivals records...`)
      for (const arrival of arrivalsData) {
        await tx.yearlyArrivals.create({ data: arrival })
      }

      console.log(`Inserting ${expenditureData.length} country expenditure records...`)
      for (const expenditure of expenditureData) {
        await tx.countryExpenditure.create({
          data: { ...expenditure, year: new Date().getFullYear() }, // Add current year
        })
      }

      console.log('Inserted new data.')
    })
    console.log('Database update successful.')

    // 4. Revalidate the cache for the dashboard page
    revalidatePath('/(dashboard)') // Use the layout path if applicable, or specific page path
    console.log('Cache revalidated for / (dashboard).')

    return { success: true }
  } catch (error: any) {
    console.error('Data update failed:', error)
    return {
      success: false,
      error:
        error.stderr || // Docker errors might be in stderr
        error.message ||
        'An unknown error occurred during data update.',
    }
  }
} 