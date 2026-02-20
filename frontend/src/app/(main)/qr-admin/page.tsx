"use client"

import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { v4 as uuidv4 } from 'uuid'
import { RefreshCw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function QRAdminPage() {
  const [qrState, setQrState] = useState<{
    key: string;
    baseUrl: string;
    mounted: boolean;
  }>({
    key: '',
    baseUrl: '',
    mounted: false
  })
  const [copied, setCopied] = useState(false)

  // 클라이언트 사이드 초기화
  useEffect(() => {
    // [모바일 접속 주의사항]
    // 1. PC와 모바일이 동일한 Wi-Fi 네트워크에 연결되어 있어야 합니다.
    // 2. 브라우저 주소창에 localhost가 아닌 Network IP(예: 192.168.x.x)로 접속한 상태에서 QR을 생성해야 합니다.
    
    interface SystemInfo {
      local_ip: string;
      all_ips: Array<{ interface: string; ip: string }>;
      port: number;
    }

    const initialize = async () => {
      let detectedBaseUrl = window.location.origin;
      const apiHost = window.location.hostname;
      
      const processIpData = (data: SystemInfo) => {
        // 현재 localhost로 접속 중이라면, QR 코드는 편리하게 Network IP 주소로 생성합니다.
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          detectedBaseUrl = `http://${data.local_ip}:3000`;
        }
      };

      try {
        // 1차 시도: 현재 접속한 호스트 (IP 또는 localhost)
        const response = await fetch(`http://${apiHost}:8000/api/system/info`);
        const data = await response.json();
        processIpData(data);
      } catch (error) {
        console.warn('Primary IP fetch failed, trying localhost fallback:', error);
        try {
          // 2차 시도 (PC 로컬용): localhost fallback
          const response = await fetch(`http://localhost:8000/api/system/info`);
          const data = await response.json();
          processIpData(data);
        } catch (fallbackError) {
          console.error('All IP detection attempts failed:', fallbackError);
        }
      }

      setQrState({
        key: uuidv4(),
        baseUrl: detectedBaseUrl,
        mounted: true
      })
    };

    const timeout = setTimeout(initialize, 0)
    return () => clearTimeout(timeout)
  }, [])

  const { key: qrKey, baseUrl, mounted } = qrState
  
  // QR 코드 URL 생성
  const qrUrl = mounted ? `${baseUrl}/join?key=${qrKey}` : ''

  // 새로운 QR 코드 생성
  const handleGenerateNew = () => {
    setQrState(prev => ({
      ...prev,
      key: uuidv4()
    }))
    setCopied(false)
    toast.success('새로운 QR 코드가 생성되었습니다!')
  }

  // URL을 클립보드에 복사
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
              <strong>새 QR 생성:</strong> 필요 시 &quot;새 QR 생성&quot; 버튼으로 새로운
              QR 코드를 만들 수 있습니다.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
