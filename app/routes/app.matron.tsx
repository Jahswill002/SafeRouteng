import { createFileRoute } from '@tanstack/react-router'
import { getMatronDashboardFn, updateStudentStatusFn, triggerSOSFn } from '../server/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export const Route = createFileRoute('/app/matron')({
  component: MatronDashboard,
})

function MatronDashboard() {
  const { session } = Route.useRouteContext()
  const queryClient = useQueryClient()
  const [sosLoading, setSosLoading] = useState(false)
  
  const { data, isLoading } = useQuery({
    queryKey: ['matronDashboard', session.email],
    queryFn: () => getMatronDashboardFn({ data: { email: session.email } }),
  })

  const updateMutation = useMutation({
    mutationFn: (vars: { studentId: string, status: string, busId: string }) => updateStudentStatusFn({ data: vars }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matronDashboard'] })
    }
  })

  const sosMutation = useMutation({
    mutationFn: (busId: string) => triggerSOSFn({ data: { busId } }),
    onSuccess: () => {
      setSosLoading(false)
      alert('SOS signal sent to Admin and Parents.')
    }
  })

  if (isLoading || !data) return <div className="p-8 text-center animate-pulse">Loading Roster...</div>

  const { bus, students } = data

  if (!bus) return <div className="p-6">No bus assigned to your account.</div>

  const handleSos = () => {
    if (confirm('EMERGENCY: Are you sure you want to trigger SOS? This will alert parents and admins immediately.')) {
      setSosLoading(true)
      sosMutation.mutate(bus.id)
    }
  }

  const boardedCount = students.filter((s: any) => s.status === 'boarded').length
  const totalCount = students.length

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-primary text-white p-6 rounded-3xl shadow-lg">
        <div>
          <h2 className="font-sora text-2xl font-bold">{bus.label}</h2>
          <p className="text-gray-300 text-sm">{bus.route}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-accent">{boardedCount}<span className="text-xl text-gray-400">/{totalCount}</span></p>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">Boarded</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2">
        <ul className="divide-y divide-gray-50">
          {students.map((student: any) => (
            <li key={student.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-gray-800">{student.name}</p>
                <p className="text-sm text-gray-500">{student.pickupStop}</p>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ studentId: student.id, status: 'absent', busId: bus.id })}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    student.status === 'absent' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600'
                  }`}
                >
                  Absent
                </button>
                <button
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ studentId: student.id, status: 'boarded', busId: bus.id })}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    student.status === 'boarded' 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gray-100 text-gray-500 hover:bg-emerald-100 hover:text-emerald-600'
                  }`}
                >
                  Boarded
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSos}
        disabled={sosLoading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-5 rounded-3xl shadow-[0_4px_20px_rgba(220,38,38,0.4)] flex justify-center items-center gap-2 transition-transform active:scale-95"
      >
        <span className="text-2xl">🚨</span> 
        {sosLoading ? 'SENDING...' : 'SOS EMERGENCY'}
      </button>
    </div>
  )
}
