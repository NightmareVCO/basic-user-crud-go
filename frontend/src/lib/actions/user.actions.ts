"use server";
import { revalidatePath } from "next/cache";

const BACKEND_NAME = "go";

export async function createUser(
  previousState: "Error creating user" | null | undefined | null,
  formData: FormData,
) {
  const apiUrl = process.env.PUBLIC_API_URL ?? "http://localhost:8000/api";
  const urlToFetch = `${apiUrl}/${BACKEND_NAME}/users`;
  const { name, email } = Object.fromEntries(formData);

  try {
    const response = await fetch(urlToFetch, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
      cache: "force-cache",
    });

    if (!response.status || response.status === 201) {
      return "Error creating user";
    }
  } catch {
    return "Error creating user";
  }

  revalidatePath("/team", "page");
}

export async function deleteUser(
  previousState: "Error deleting user" | null | undefined | null,
  id: number,
) {
  const apiUrl = process.env.PUBLIC_API_URL ?? "http://localhost:8000/api";
  const urlToFetch = `${apiUrl}/${BACKEND_NAME}/users/${id}`;

  try {
    const response = await fetch(urlToFetch, {
      method: "DELETE",
      cache: "force-cache",
    });

    if (!response.status || response.status === 204) {
      return "Error deleting user";
    }
  } catch {
    return "Error deleting user";
  }

  revalidatePath("/team", "page");
}

export async function updateUser(
  previousState: "Error updating user" | null | undefined | null,
  formData: FormData,
) {
  const apiUrl = process.env.PUBLIC_API_URL ?? "http://localhost:8000/api";
  const { id, name, email } = Object.fromEntries(formData);

  const urlToFetch = `${apiUrl}/${BACKEND_NAME}/users/${id}`;

  try {
    const response = await fetch(urlToFetch, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
      cache: "force-cache",
    });

    if (!response.status || response.status === 204) {
      return "Error updating user";
    }
  } catch {
    return "Error updating user";
  }

  revalidatePath("/team", "page");
}
