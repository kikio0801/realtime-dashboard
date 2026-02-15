import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import QRCode from 'react-qr-code'
import { v4 as uuidv4 } from 'uuid'
import { RefreshCw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export const Route = createFileRoute('/qr-admin')({
  component: QRAdminPage,
})

function QRAdminPage() {
  const [qrKey, setQrKey] = useState<string>(() => uuidv4())
  const [copied, setCopied] = useState(false)

  // Generate QR URL
  const baseUrl = __APP_URL__ || window.location.origin
  const qrUrl = `${baseUrl}/join?key=${qrKey}`

  // Generate new QR code
  const handleGenerateNew = () => {
    const newKey = uuidv4()
    setQrKey(newKey)
    setCopied(false)
    toast.success('새로운 QR 코드가 생성되었습니다!')
  }

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      setCopied(true)
      toast.success('URL이 클립보드에 복사되었습니다!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for insecure context
      try {
        const textArea = document.createElement('textarea')
        textArea.value = qrUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        setCopied(true)
        toast.success('URL이 클립보드에 복사되었습니다!')
        setTimeout(() => setCopied(false), 2000)
      } catch {
        toast.error('URL 복사에 실패했습니다.')
      }
    }
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">QR 코드 생성</h1>
      </div>

      {/* QR Code Display */}
      <Card>
        <CardHeader>
          <CardTitle>현재 QR 코드</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {/* QR Code */}
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <QRCode value={qrUrl} size={256} />
          </div>

          {/* URL Display */}
          <div className="w-full space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              접속 URL
            </label>
            <div className="bg-muted flex items-center justify-between gap-2 rounded-md p-3">
              <span className="flex-1 truncate text-sm">{qrUrl}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyUrl}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full gap-3">
            <Button
              onClick={handleGenerateNew}
              className="flex-1"
              size="lg"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />새 QR 생성
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>사용 방법</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="text-muted-foreground list-inside list-decimal space-y-2">
            <li>
              <strong>QR 코드 배포:</strong> 생성된 QR 코드를 유저에게
              보여주거나 인쇄하여 배포합니다.
            </li>
            <li>
              <strong>유저 스캔:</strong> 유저가 QR 코드를 스캔하면 자동으로
              입장 페이지로 이동합니다.
            </li>
            <li>
              <strong>정보 입력:</strong> 유저가 닉네임을 입력하고 입장하면
              시스템에 등록됩니다.
            </li>
            <li>
              <strong>새 QR 생성:</strong> 필요 시 "새 QR 생성" 버튼으로 새로운
              QR 코드를 만들 수 있습니다.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
