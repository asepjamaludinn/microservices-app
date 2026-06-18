import { cookies } from "next/headers";

export async function getJwtToken() {
  const cookieStore = await cookies();
  return cookieStore.get("jwt_token")?.value;
}

export function getProjectServiceUrl() {
  return process.env.PROJECT_SERVICE_URL || "http://127.0.0.1:8002";
}

export function getAuthServiceUrl() {
  return process.env.AUTH_SERVICE_URL || "http://127.0.0.1:8001";
}
