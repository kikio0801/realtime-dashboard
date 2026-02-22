"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogIn, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { registerUser } from '@/lib/mock-api'
import { useUser } from '@/hooks/use-user'

function JoinForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const key = searchParams.get('key') || ''
  const [nickname, setNickname] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { isAuthenticated, isLoading: isAuthLoading } = useUser()

  // Check if user is already registered via Supabase session
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      // User already registered, redirect to main silently
      router.push('/')
    }
  }, [router, isAuthenticated, isAuthLoading])


  const handleJoin = async () => {
    if (!key) {
      toast.error('QR 코드 키가 없습니다.')
      return
    }

    const trimmedNickname = nickname.trim()
    if (!trimmedNickname) {
      toast.error('닉네임을 입력해주세요.')
      return
    }

    if (trimmedNickname.length < 2) {
      toast.error('닉네임은 최소 2글자 이상이어야 합니다.')
      return
    }

    if (trimmedNickname.length > 20) {
      toast.error('닉네임은 최대 20글자까지 입력 가능합니다.')
      return
    }

    setIsLoading(true)

    try {
      // Register user via mock API
      await registerUser(key, trimmedNickname)

      // Redirect to welcome page
      router.push('/welcome')
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          toast.error('이미 사용 중인 QR 코드입니다.')
        } else {
          toast.error('입장에 실패했습니다. 다시 시도해주세요.')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleJoin()
    }
  }

  if (!key) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              유효하지 않은 접근
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-center">
            <p>올바른 QR 코드를 통해 접속해주세요.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            입장하기
          </CardTitle>
          <p className="text-muted-foreground text-center text-sm">
            닉네임을 입력하고 시작하세요
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nickname Input */}
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="예: 홍길동"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              maxLength={20}
              className="text-base"
              autoFocus
            />
            <p className="text-muted-foreground text-xs">
              2-20자 이내로 입력해주세요
            </p>
          </div>

          {/* QR Key Display (for debugging) */}
          <div className="bg-muted rounded-md p-3">
            <p className="text-muted-foreground text-xs">QR 코드 키</p>
            <p className="truncate font-mono text-sm">{key}</p>
          </div>

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            disabled={isLoading || !nickname.trim()}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                입장 중...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                입장하기
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <JoinForm />
    </Suspense>
  )
}
