export type CurrentUser = {
  name: string;
  email?: string;
  role?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }

  return data;
}

export async function loginUser(payload: LoginPayload) {
  return safeJson<{ user: CurrentUser }>(
    await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
}

export async function registerUser(payload: RegisterPayload) {
  return safeJson<{ message?: string }>(
    await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
}

export async function getCurrentUser() {
  return safeJson<{ user: CurrentUser }>(
    await fetch("/api/auth/me", {
      cache: "no-store",
    }),
  );
}

export async function logoutUser() {
  return fetch("/api/auth/logout", {
    method: "POST",
  });
}
