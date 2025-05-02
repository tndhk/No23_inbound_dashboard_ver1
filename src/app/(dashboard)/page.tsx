import {
  getYearlyArrivals,
  getCountryExpenditures,
  getCountryArrivalsByYear,
} from '@/dal/dashboard'
import { ArrivalsLineChart } from '@/components/features/dashboard/arrivals-line-chart'
import { ExpenditureBarChart } from '@/components/features/dashboard/expenditure-bar-chart'
import { CountryArrivalsBarChart } from '@/components/features/dashboard/country-arrivals-bar-chart'

export default async function DashboardPage() {
  const targetYear = 2024 // Or dynamically determine the latest year

  // Fetch data in parallel
  const [yearlyArrivals, countryExpenditures, countryArrivals2024] =
    await Promise.all([
      getYearlyArrivals(),
      getCountryExpenditures(),
      getCountryArrivalsByYear(targetYear),
    ])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">訪日観光ダッシュボード</h1>
      </div>

      {/* Adjust grid layout for 3 charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Make the line chart potentially span more columns on larger screens if needed */}
        <div className="lg:col-span-2">
          <ArrivalsLineChart data={yearlyArrivals} />
        </div>
        <ExpenditureBarChart data={countryExpenditures} />
        <div className="lg:col-span-3"> {/* Let the new chart span full width on large screens */}
          <CountryArrivalsBarChart data={countryArrivals2024} year={targetYear} />
        </div>
      </div>
    </div>
  )
} 