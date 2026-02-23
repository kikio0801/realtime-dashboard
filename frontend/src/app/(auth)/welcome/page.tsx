"use client"

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PartyPopper, Link as LinkIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'

function WelcomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isLinked = searchParams.get('linked') === 'true'
  
  const { user, isLoading } = useUser()
  const userName = isLoading ? '...' : (user?.name || 'Guest')

  // Auto-redirect after 3 seconds
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router, isLoading])

  const handleContinue = () => {
    router.push('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="space-y-6 pt-12 pb-8">
          {/* Celebration Icon */}
          <div className="flex justify-center">
            <div className={`rounded-full p-6 ${isLinked ? 'bg-green-500/10' : 'bg-primary/10'}`}>
              {isLinked ? (
                <LinkIcon className="text-green-500 h-16 w-16" />
              ) : (
                <PartyPopper className="text-primary h-16 w-16" />
              )}
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">환영합니다!</h1>
            <p className="text-primary text-xl font-medium">{userName}님</p>
            {isLinked ? (
              <p className="text-green-600 text-sm font-medium">
                기존 담당 환자 기록과 성공적으로 연동되었습니다!
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                성공적으로 입장하셨습니다
              </p>
            )}
          </div>

          {/* Progress indicator */}
          <div className="space-y-3">
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div className="bg-primary animate-progress h-full w-full rounded-full" />
            </div>
            <p className="text-muted-foreground text-center text-xs">
              잠시 후 메인 페이지로 이동합니다...
            </p>
          </div>

          {/* Continue Button */}
          <Button onClick={handleContinue} className="w-full" size="lg">
            바로 시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  )
}
