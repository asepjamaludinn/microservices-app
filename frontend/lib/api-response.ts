import { NextResponse } from "next/server";

export async function readJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function getErrorMessage(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") return fallback;

  const obj = data as {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
  };

  if (obj.errors) {
    const firstError = Object.values(obj.errors).flat()[0];
    if (firstError) return firstError;
  }

  return obj.error || obj.message || fallback;
}

export function gatewayError(message: string, status = 500) {
  return NextResponse.json({ status: "Error", error: message }, { status });
}
