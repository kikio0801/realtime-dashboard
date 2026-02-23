import { useState, useEffect } from 'react'
import { LogOut, Settings, User } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@/hooks/use-user'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserNav() {
  const [mounted, setMounted] = useState(false)
  const { user, logout, isLoading } = useUser()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full border-0 bg-[#5D4037] opacity-100"
      />
    )
  }

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full border-0 bg-[#5D4037]/50 animate-pulse"
      />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-primary-foreground hover:text-primary-foreground relative h-8 w-8 rounded-full border-0 bg-[#5D4037] opacity-100 ring-0 hover:bg-[#4E342E]"
        >
          <Avatar className="h-8 w-8 bg-transparent">
            {/* <AvatarImage src="/avatars/01.png" alt="@user" /> */}
            <AvatarFallback className="bg-transparent text-inherit">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user?.name || 'User'}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.key ? `Key: ${user.key}` : 'anonymous'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => toast.info('아직 구현되지 않은 기능 입니다.')} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info('아직 구현되지 않은 기능 입니다.')} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
