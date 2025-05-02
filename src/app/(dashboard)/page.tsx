import { getYearlyArrivals, getCountryExpenditures } from '@/dal/dashboard'
import { ArrivalsLineChart } from '@/components/features/dashboard/arrivals-line-chart'
import { ExpenditureBarChart } from '@/components/features/dashboard/expenditure-bar-chart'

export default async function DashboardPage() {
  // Fetch data in parallel
  const [yearlyArrivals, countryExpenditures] = await Promise.all([
    getYearlyArrivals(),
    getCountryExpenditures(),
  ])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">訪日観光ダッシュボード</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ArrivalsLineChart data={yearlyArrivals} />
        <ExpenditureBarChart data={countryExpenditures} />
      </div>
    </div>
  )
} 