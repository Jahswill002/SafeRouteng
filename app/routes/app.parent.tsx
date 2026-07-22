import { createFileRoute } from '@tanstack/react-router'
import { getParentDashboardFn } from '../server/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/app/parent')({
  component: ParentDashboard,
})

function ParentDashboard() {
  const { session } = Route.useRouteContext()
  
  const { data, isLoading } = useQuery({
    queryKey: ['parentDashboard', session.email],
    queryFn: () => getParentDashboardFn({ data: { email: session.email } }),
    refetchInterval: 5000 // Polling for real-time updates
  })

  if (isLoading || !data) return <div className="p-8 text-center animate-pulse">Loading Live Data...</div>

  const { students, bus, alerts } = data

  return (
    <div className="space-y-6">
      <h2 className="font-sora text-2xl font-bold text-primary">Parent Dashboard</h2>
      
      {bus ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                {bus.label}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${bus.status === 'en_route' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {bus.status === 'en_route' ? 'En Route' : bus.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">Route: <span className="font-medium text-gray-800">{bus.route}</span></p>
          </div>
          <div className="text-right w-full md:w-auto flex flex-row justify-between md:flex-col gap-2">
            <div>
              <p className="text-xs text-gray-400">Current Stop</p>
              <p className="font-semibold">{bus.currentStop}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Next Stop / ETA</p>
              <p className="font-semibold text-accent">{bus.nextStop} ({bus.etaMin}m)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl">No bus assigned currently.</div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-sora text-xl font-bold text-gray-700">My Children</h3>
          {students.map((student: any) => (
            <div key={student.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{student.name}</p>
                <p className="text-sm text-gray-500">{student.pickupStop}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                student.status === 'boarded' ? 'bg-emerald-100 text-emerald-700' :
                student.status === 'absent' ? 'bg-red-100 text-red-700' :
                student.status === 'dropped' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <h3 className="font-sora text-xl font-bold text-gray-700">Live Updates</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <li className="p-6 text-center text-gray-400">No recent alerts.</li>
              ) : (
                alerts.map((alert: any) => (
                  <li key={alert.id} className={`p-4 ${alert.kind === 'sos' ? 'bg-red-50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="text-xl">
                        {alert.kind === 'sos' ? '🚨' :
                         alert.kind === 'boarded' ? '✅' :
                         alert.kind === 'pre_alert' ? '⏱️' : 'ℹ️'}
                      </div>
                      <div>
                        <p className={`text-sm ${alert.kind === 'sos' ? 'font-bold text-red-700' : 'text-gray-800'}`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
