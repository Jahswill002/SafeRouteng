import { createFileRoute } from '@tanstack/react-router'
import { getAdminDashboardFn } from '../server/api'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const Route = createFileRoute('/app/admin')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => getAdminDashboardFn(),
    refetchInterval: 5000
  })
  
  const [filterBusId, setFilterBusId] = useState('all')

  if (isLoading || !data) return <div className="p-8 text-center animate-pulse">Loading Fleet Data...</div>

  const { buses, alerts, students } = data

  const enRouteBuses = buses.filter((b: any) => b.status === 'en_route').length
  const delayedBuses = alerts.filter((a: any) => a.kind === 'delay' && new Date(a.timestamp).getTime() > Date.now() - 3600000).length
  const recentIncidents = alerts.filter((a: any) => a.kind === 'sos' && new Date(a.timestamp).getTime() > Date.now() - 3600000 * 24).length

  const filteredStudents = filterBusId === 'all' ? students : students.filter((s: any) => s.busId === filterBusId)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-sora text-3xl font-bold text-primary">Fleet Dashboard</h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-semibold mb-1">Total Buses</p>
          <p className="text-3xl font-bold text-primary">{buses.length}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-3xl shadow-sm border border-blue-100 flex flex-col justify-center">
          <p className="text-blue-600 text-sm font-semibold mb-1">En Route</p>
          <p className="text-3xl font-bold text-blue-700">{enRouteBuses}</p>
        </div>
        <div className="bg-amber-50 p-5 rounded-3xl shadow-sm border border-amber-100 flex flex-col justify-center">
          <p className="text-amber-600 text-sm font-semibold mb-1">Delayed</p>
          <p className="text-3xl font-bold text-amber-700">{delayedBuses}</p>
        </div>
        <div className="bg-red-50 p-5 rounded-3xl shadow-sm border border-red-100 flex flex-col justify-center">
          <p className="text-red-600 text-sm font-semibold mb-1">Incidents Today</p>
          <p className="text-3xl font-bold text-red-700">{recentIncidents}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-sora text-xl font-bold text-gray-700">Fleet Status</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {buses.map((bus: any) => (
              <div key={bus.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-lg">{bus.label}</h4>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    bus.status === 'en_route' ? 'bg-blue-100 text-blue-700' :
                    bus.status === 'arrived' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {bus.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>Route: <span className="font-medium text-gray-800">{bus.route}</span></p>
                  <p>Driver: <span className="font-medium text-gray-800">{bus.driver}</span></p>
                  <p>Matron: <span className="font-medium text-gray-800">{bus.matron}</span></p>
                </div>
                
                {bus.status === 'en_route' && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{bus.currentStop}</span>
                      <span>ETA: {bus.etaMin}m</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(5, bus.progress * 100))}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sora text-xl font-bold text-gray-700">Full Manifest</h3>
              <select 
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none"
                value={filterBusId}
                onChange={(e) => setFilterBusId(e.target.value)}
              >
                <option value="all">All Buses</option>
                {buses.map((b: any) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                      <th className="p-4 font-semibold">Student</th>
                      <th className="p-4 font-semibold">Grade</th>
                      <th className="p-4 font-semibold">Bus</th>
                      <th className="p-4 font-semibold">Stop</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {filteredStudents.map((student: any) => {
                      const b = buses.find((b: any) => b.id === student.busId)
                      return (
                        <tr key={student.id} className="hover:bg-gray-50/50">
                          <td className="p-4 font-medium">{student.name}</td>
                          <td className="p-4 text-gray-500">{student.grade}</td>
                          <td className="p-4 text-gray-600">{b?.label || student.busId}</td>
                          <td className="p-4 text-gray-500">{student.pickupStop}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              student.status === 'boarded' ? 'bg-emerald-100 text-emerald-700' :
                              student.status === 'absent' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-sora text-xl font-bold text-gray-700 mb-6">Incident Audit Trail</h3>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 h-[800px] overflow-y-auto">
            <ul className="divide-y divide-gray-50">
              {alerts.length === 0 ? (
                <li className="p-6 text-center text-gray-400">No logs found.</li>
              ) : (
                alerts.map((alert: any) => {
                  const isSos = alert.kind === 'sos'
                  return (
                    <li key={alert.id} className={`p-4 ${isSos ? 'bg-red-50 rounded-xl m-2 border border-red-100' : ''}`}>
                      <div className="flex gap-3">
                        <div className="text-2xl mt-1 flex-shrink-0">
                          {isSos ? '🚨' :
                           alert.kind === 'delay' ? '⚠️' :
                           alert.kind === 'boarded' ? '✅' : 'ℹ️'}
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${isSos ? 'text-red-600' : 'text-gray-500'}`}>
                              {buses.find((b:any) => b.id === alert.busId)?.label || alert.busId}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(alert.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className={`text-sm ${isSos ? 'font-bold text-red-800' : 'text-gray-700'}`}>
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
