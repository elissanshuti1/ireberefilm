import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "irebere_admin";
const SESSION_DAYS = 7;

const configuredSecret = process.env.AUTH_SECRET;
if (!configuredSecret) throw new Error("AUTH_SECRET is missing. Add it to .env.local");
const secret: string = configuredSecret;

function sign(value: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionToken() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  return Number(payload) > Date.now();
}

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export function verifyAdminPassword(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "elissa";
  const salt = process.env.ADMIN_PASSWORD_SALT;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!salt || !expectedHash || username.trim() !== expectedUser) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export const adminCookieName = COOKIE_NAME;
