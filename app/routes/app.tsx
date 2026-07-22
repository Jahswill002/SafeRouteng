import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { getSessionFn, logoutFn } from '../server/auth'

export const Route = createFileRoute('/app')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({ to: '/auth' })
    }
    return { session }
  },
  component: AppLayout,
})

function AppLayout() {
  const { session } = Route.useRouteContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutFn()
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col font-inter text-gray-800">
      <header className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-accent text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
            S
          </div>
          <h1 className="font-sora text-xl font-bold tracking-tight">SafeRoute NG</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300 hidden sm:inline-block">
            {session.email} ({session.role})
          </span>
          <button 
            onClick={handleLogout}
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
