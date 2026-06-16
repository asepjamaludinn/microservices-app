import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "jwt_token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
}
