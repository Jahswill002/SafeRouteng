import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  beforeLoad: ({ context }) => {
    const { session } = context as any
    if (session?.role === 'parent') throw redirect({ to: '/app/parent' })
    if (session?.role === 'matron') throw redirect({ to: '/app/matron' })
    if (session?.role === 'admin') throw redirect({ to: '/app/admin' })
    throw redirect({ to: '/' })
  }
})
