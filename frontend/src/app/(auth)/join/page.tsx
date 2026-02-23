"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogIn, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { registerUser } from '@/lib/auth-api'
import { useUser } from '@/hooks/use-user'
import { z } from 'zod'

// 유효성 검사 스키마
const joinSchema = z.object({
  nickname: z
    .string()
    .min(2, '이름은 최소 2글자 이상이어야 합니다.')
    .max(10, '이름은 최대 10글자까지 입력 가능합니다.')
    .regex(/^[가-힣]+$/, '이름은 한글로만 입력해주세요.'),
  phoneNumber: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '올바른 전화번호 형식(010-0000-0000)으로 입력해주세요.')
})

// 전화번호 자동 하이픈 포매팅 함수
const formatPhoneNumber = (value: string) => {
  const onlyNums = value.replace(/[^0-9]/g, '')
  if (onlyNums.length < 4) return onlyNums
  if (onlyNums.length < 8) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`
}

function JoinForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const key = searchParams.get('key') || ''
  const [nickname, setNickname] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
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
    const trimmedPhone = phoneNumber.trim()

    if (!trimmedNickname) {
      toast.error('이름을 입력해주세요.')
      return
    }

    if (!trimmedPhone) {
      toast.error('전화번호를 입력해주세요.')
      return
    }

    try {
      const parsedData = joinSchema.safeParse({ nickname: trimmedNickname, phoneNumber: trimmedPhone })
      
      if (!parsedData.success) {
        // Zod의 flatten()을 사용하면 에러 메시지 배열을 쉽게 가져올 수 있음
        const errorMessages = Object.values(parsedData.error.flatten().fieldErrors).flat()
        toast.error(errorMessages[0] || '입력값이 올바르지 않습니다.')
        return
      }

      setIsLoading(true)
      // API 전송 시 전화번호 하이픈 제거
      const purePhoneNumber = parsedData.data.phoneNumber.replace(/-/g, '')

      // Register user via API
      const { isLinked } = await registerUser(key, parsedData.data.nickname, purePhoneNumber)

      // Redirect to welcome page
      router.push(`/welcome?linked=${isLinked}`)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists') || error.message.includes('사용 중인')) {
          toast.error('이미 사용 중인 QR 코드입니다. 새로운 QR 코드를 발급 받아주세요.')
        } else {
          toast.error('입장에 실패했습니다. 다시 시도해주세요.')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
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
            보안 접속
          </CardTitle>
          <p className="text-muted-foreground text-center text-sm">
            원활한 세션 연동을 위해 이름과 전화번호를 입력해주세요
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nickname Input */}
          <div className="space-y-2">
            <Label htmlFor="nickname">이름 (실명)</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="예: 홍길동"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              maxLength={10}
              className="text-base"
              autoFocus
            />
          </div>

          {/* PhoneNumber Input */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">전화번호</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="예: 010-1234-5678"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              maxLength={13}
              className="text-base"
            />
            <p className="text-muted-foreground text-xs">
              가입 여부 확인을 위해 숫자만 입력해주세요 (하이픈 자동 입력)
            </p>
          </div>

          {/* QR Key Display (for debugging) */}
          <div className="bg-muted rounded-md p-3">
            <p className="text-muted-foreground text-xs">QR 발급 키 (디버그용)</p>
            <p className="truncate font-mono text-sm">{key}</p>
          </div>

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            disabled={isLoading || !nickname.trim() || !phoneNumber.trim()}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                접속 중...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                접속 확인
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
