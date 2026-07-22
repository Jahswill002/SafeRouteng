import { createServerFn } from '@tanstack/start'
import { getDb } from './auth'

export const getParentDashboardFn = createServerFn({ method: 'GET' })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb()
    if (!db) {
      return { 
        students: [], 
        bus: null,
        alerts: []
      }
    }
    
    const { results: students } = await db.prepare("SELECT * FROM Students WHERE guardian_email = ?").bind(data.email).all()
    
    let bus = null
    let alerts = []
    if (students && students.length > 0) {
      const busId = students[0].busId
      const { results: buses } = await db.prepare("SELECT * FROM Buses WHERE id = ?").bind(busId).all()
      if (buses && buses.length > 0) bus = buses[0]
      
      const { results: recentAlerts } = await db.prepare("SELECT * FROM AlertEvents WHERE busId = ? ORDER BY timestamp DESC LIMIT 10").bind(busId).all()
      alerts = recentAlerts || []
    }
    
    return { students: students || [], bus, alerts }
  })

export const getMatronDashboardFn = createServerFn({ method: 'GET' })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb()
    if (!db) return { bus: null, students: [] }
    
    const { results: buses } = await db.prepare("SELECT * FROM Buses WHERE matron = ?").bind(data.email).all()
    if (!buses || buses.length === 0) return { bus: null, students: [] }
    
    const bus = buses[0]
    const { results: students } = await db.prepare("SELECT * FROM Students WHERE busId = ?").bind(bus.id).all()
    
    return { bus, students: students || [] }
  })

export const updateStudentStatusFn = createServerFn({ method: 'POST' })
  .validator((data: { studentId: string, status: string, busId: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb()
    if (!db) return { success: false }
    
    await db.prepare("UPDATE Students SET status = ? WHERE id = ?").bind(data.status, data.studentId).run()
    
    // Log alert event
    await db.prepare("INSERT INTO AlertEvents (id, busId, studentId, kind, message) VALUES (?, ?, ?, ?, ?)")
      .bind(`alt_${Date.now()}`, data.busId, data.studentId, 'boarded', `Student status updated to ${data.status}`)
      .run()
      
    return { success: true }
  })

export const triggerSOSFn = createServerFn({ method: 'POST' })
  .validator((data: { busId: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb()
    if (!db) return { success: false }
    
    await db.prepare("INSERT INTO AlertEvents (id, busId, studentId, kind, message) VALUES (?, ?, ?, ?, ?)")
      .bind(`alt_${Date.now()}`, data.busId, null, 'sos', 'SOS Triggered by Matron')
      .run()
      
    return { success: true }
  })

export const getAdminDashboardFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const db = getDb()
    if (!db) return { buses: [], alerts: [], students: [] }
    
    const { results: buses } = await db.prepare("SELECT * FROM Buses").all()
    const { results: alerts } = await db.prepare("SELECT * FROM AlertEvents ORDER BY timestamp DESC LIMIT 20").all()
    const { results: students } = await db.prepare("SELECT * FROM Students").all()
    
    return { buses: buses || [], alerts: alerts || [], students: students || [] }
  })
