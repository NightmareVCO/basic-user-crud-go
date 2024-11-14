"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
const BACKEND_NAME = "go";

export async function logoutUser() {
  // eslint-disable-next-line unicorn/no-await-expression-member
  (await cookies()).delete("accessToken");

  revalidatePath("/auth/logout", "page");
}

export async function loginUser(
  previousState:
    | "Error logging in"
    | "User not found"
    | "Server error validating user"
    | "Invalid credentials"
    | null
    | undefined
    | null,
  formData: FormData,
) {
  const apiUrl = process.env.PUBLIC_API_URL ?? "http://localhost:8000/api";
  const urlToFetch = `${apiUrl}/${BACKEND_NAME}/auth/login`;
  const { email, password } = Object.fromEntries(formData);

  try {
    const response = await fetch(urlToFetch, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "force-cache",
    });
    console.log(response);

    if (!response.status || response.status === 201) return "Error logging in";
    if (response.status === 404) return "User not found";
    if (response.status === 500) return "Server error validating user";
    if (response.status === 401) return "Invalid credentials";

    const token = await response.json();
    const cookiesStore = await cookies();
    cookiesStore.set("accessToken", token, { maxAge: 86_400 });
  } catch {
    return "Error logging in";
  }

  revalidatePath("/auth/login", "page");
}

export async function registerUser(
  previousState:
    | "Error registering user"
    | "Invalid data"
    | "User already exists"
    | "Server error registering user"
    | null
    | undefined
    | null,
  formData: FormData,
) {
  const apiUrl = process.env.PUBLIC_API_URL ?? "http://localhost:8000/api";
  const urlToFetch = `${apiUrl}/${BACKEND_NAME}/auth/register`;
  const { name, email, password } = Object.fromEntries(formData);

  try {
    const response = await fetch(urlToFetch, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      cache: "force-cache",
    });

    if (!response.status || response.status === 201)
      return "Error registering user";
    if (response.status === 400) return "Invalid data";
    if (response.status === 409) return "User already exists";
    if (response.status === 500) return "Server error registering user";
  } catch {
    return "Error registering user";
  }

  revalidatePath("/auth/register", "page");
}
