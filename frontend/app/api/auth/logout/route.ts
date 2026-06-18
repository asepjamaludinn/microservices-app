import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthServiceUrl } from "@/lib/server-auth";
import { readJsonSafe } from "@/lib/api-response";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (token) {
    try {
      const authUrl = getAuthServiceUrl();

      await fetch(`${authUrl}/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch {
      // tetap hapus cookie meskipun backend logout gagal
    }
  }

  cookieStore.set({
    name: "jwt_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
}