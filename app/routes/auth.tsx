import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { loginFn } from '../server/auth'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginFn({ data: { email, password_hash: password } })
      if (res.success) {
        await router.invalidate()
        if (res.role === 'parent') navigate({ to: '/app/parent' })
        else if (res.role === 'matron') navigate({ to: '/app/matron' })
        else if (res.role === 'admin') navigate({ to: '/app/admin' })
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-primary text-accent rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl mx-auto mb-4">
            S
          </div>
          <h2 className="font-sora text-3xl font-bold text-primary">Sign In</h2>
          <p className="text-gray-500 mt-2">Welcome back to SafeRoute NG</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              placeholder="e.g. parent@demo.ng"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              placeholder="demo1234"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-[#0f3460] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg disabled:opacity-70 flex justify-center"
          >
            {loading ? <span className="animate-pulse">Signing in...</span> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
          <p className="font-semibold mb-2">Demo Accounts:</p>
          <ul className="space-y-1">
            <li>🧑‍🍼 parent@demo.ng</li>
            <li>🧑🏿‍⚕️ matron@demo.ng</li>
            <li>👨🏿‍💻 admin@demo.ng</li>
            <li className="pt-2 text-xs">(Password: demo1234)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
