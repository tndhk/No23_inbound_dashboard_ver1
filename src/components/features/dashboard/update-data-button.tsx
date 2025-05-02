'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { updateDashboardData } from '@/app/(dashboard)/actions' // Assuming action is defined here
import { Loader2 } from 'lucide-react' // Loading spinner icon

export function UpdateDataButton() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const handleClick = async () => {
    setMessage(null) // Clear previous message
    startTransition(async () => {
      try {
        const result = await updateDashboardData()
        if (result?.success) {
          setMessage('データが正常に更新されました。')
          // Optionally trigger a page refresh or rely on revalidatePath
          // window.location.reload(); // Example: force refresh
        } else {
          setMessage(`エラー: ${result?.error || '不明なエラーが発生しました。'}`)
        }
      } catch (error) {
        console.error('Failed to update data:', error)
        setMessage('データ更新中に予期せぬエラーが発生しました。')
      }
    })
  }

  return (
    <div className="flex flex-col items-start space-y-2">
      <Button onClick={handleClick} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            更新中...
          </>
        ) : (
          '最新データに更新'
        )}
      </Button>
      {message && (
        <p
          className={`text-sm ${message.startsWith('エラー') ? 'text-red-600' : 'text-green-600'}`}
        >
          {message}
        </p>
      )}
    </div>
  )
} 