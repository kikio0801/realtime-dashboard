"use client"

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores'
import { Header } from './header'
import { Sidebar } from './sidebar'

import { useUser } from '@/hooks/use-user'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen, isCollapsed, setOpen } = useSidebarStore()
  const { isAuthenticated, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  // Define public routes that don't need authentication within MainLayout
  const isPublicRoute = pathname === '/' || pathname?.startsWith('/qr-admin')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, setOpen])

  useEffect(() => {
    if (!isPublicRoute && !isLoading && !isAuthenticated) {
      router.push('/join')
    }
  }, [isLoading, isAuthenticated, router, isPublicRoute])

  if (!isPublicRoute && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isPublicRoute && !isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="relative min-h-screen">
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        <Header />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      {/* Sidebar Overlay - Only visible on mobile/tablet when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-90 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
          role="presentation"
        />
      )}

      <Sidebar />
    </div>
  )
}
