import { createServerFn } from '@tanstack/start'
import { getEvent, setCookie, getCookie, deleteCookie } from 'vinxi/http'

// A mock D1 database type for TypeScript
export interface Env {
  DB: any;
}

export const getDb = () => {
  const event = getEvent();
  // We use `any` here as Cloudflare workers types might not be installed,
  // but in production it's available at event.context.cloudflare.env.DB
  return (event.context as any).cloudflare?.env?.DB;
}

export const loginFn = createServerFn({ method: 'POST' })
  .validator((data: { email: string; password_hash: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb();
    if (!db) {
      // Fallback for local dev if D1 isn't bound correctly yet
      console.warn("DB not found in context, mocking login");
      if (data.email.includes("parent")) {
        setCookie("session", JSON.stringify({ email: data.email, role: "parent" }));
        return { success: true, role: "parent" };
      }
      if (data.email.includes("matron")) {
        setCookie("session", JSON.stringify({ email: data.email, role: "matron" }));
        return { success: true, role: "matron" };
      }
      if (data.email.includes("admin")) {
        setCookie("session", JSON.stringify({ email: data.email, role: "admin" }));
        return { success: true, role: "admin" };
      }
      throw new Error("Invalid credentials");
    }

    const { results } = await db.prepare("SELECT * FROM Users WHERE email = ? AND password_hash = ?").bind(data.email, data.password_hash).all();
    
    if (results && results.length > 0) {
      const user = results[0];
      setCookie("session", JSON.stringify({ email: user.email, role: user.role }));
      return { success: true, role: user.role };
    }
    
    throw new Error("Invalid credentials");
  });

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie("session");
  return { success: true };
});

export const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const sessionStr = getCookie("session");
  if (!sessionStr) return null;
  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
});
