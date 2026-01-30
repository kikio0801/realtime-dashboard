import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const handleResetAuth = () => {
    // Clear all authentication data
    localStorage.removeItem('user_key')
    localStorage.removeItem('user_name')
    // Clear registered users from mock API database
    localStorage.removeItem('qr_auth_users')
    // Clear patient data for fresh start
    localStorage.removeItem('smart_pulse_patients')
    // Reload main page to reflect changes
    window.location.href = '/'
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-4 py-8 md:max-w-none md:p-0">
      <div className="animate-fade-in text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Demo Page
        </h1>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          Clean and minimal starting point.
        </p>
      </div>

      <div className="grid gap-4">
        <Card className="animate-fade-in-delay-1">
          <CardHeader>
            <CardTitle className="text-lg">Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              This is a static demo page visible to everyone. Log in to access
              your dashboard.
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-delay-2">
          <CardHeader>
            <CardTitle className="text-lg">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-full" />
                <span>Mobile First Design</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-full" />
                <span>Monochrome Theme</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth Reset Card */}
        <Card className="animate-fade-in-delay-2 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">개발자 도구</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAuth}
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              인증 초기화 (QR 재인증)
            </Button>
            <p className="text-muted-foreground mt-2 text-center text-xs">
              QR 인증 및 환자 데이터를 초기화합니다
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
