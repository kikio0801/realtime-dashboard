import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebarStore } from '@/stores'
import { UserNav } from './user-nav'

export function Header() {
  const { toggle } = useSidebarStore()

  return (
    <header
      className="bg-background sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b-4 px-6 backdrop-blur-md transition-all duration-300 ease-in-out"
      style={{ borderColor: 'rgba(201, 176, 132, 0.4)' }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation</span>
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <UserNav />
      </div>
    </header>
  )
}
