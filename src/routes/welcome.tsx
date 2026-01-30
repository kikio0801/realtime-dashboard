import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PartyPopper } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/welcome')({
  component: WelcomePage,
})

function WelcomePage() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('user_name') || 'Guest'

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: '/' })
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  const handleContinue = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="space-y-6 pt-12 pb-8">
          {/* Celebration Icon */}
          <div className="flex justify-center">
            <div className="bg-primary/10 rounded-full p-6">
              <PartyPopper className="text-primary h-16 w-16" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">환영합니다!</h1>
            <p className="text-primary text-xl font-medium">{userName}님</p>
            <p className="text-muted-foreground text-sm">
              성공적으로 입장하셨습니다
            </p>
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
