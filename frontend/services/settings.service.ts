export type UpdatePasswordPayload = {
  old_password: string;
  new_password: string;
};

async function safeJson<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request gagal");
  }

  return data;
}

export async function updatePassword(payload: UpdatePasswordPayload) {
  return safeJson<{ message: string }>(
    await fetch("/api/auth/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
}
