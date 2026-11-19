import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

export const visitorCookieName = "irebere_visitor";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function readVisitorId() {
  const store = await cookies();
  const value = store.get(visitorCookieName)?.value;
  return value && uuidPattern.test(value) ? value : null;
}

export async function getOrCreateVisitorId() {
  const store = await cookies();
  const existing = store.get(visitorCookieName)?.value;
  if (existing && uuidPattern.test(existing)) return existing;

  const visitorId = randomUUID();
  store.set({
    name: visitorCookieName,
    value: visitorId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return visitorId;
}
