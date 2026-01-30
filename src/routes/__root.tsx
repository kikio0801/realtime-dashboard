import type { QueryClient } from '@tanstack/react-query'
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { MainLayout } from '@/components/layout'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // Don't show layout on join and welcome pages
  if (currentPath === '/join' || currentPath === '/welcome') {
    return <Outlet />
  }

  // Show layout for all other pages
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
