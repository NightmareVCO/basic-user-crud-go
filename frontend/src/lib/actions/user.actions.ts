"use server";
import { revalidatePath } from "next/cache";

const BACKEND_NAME = "go";

export async function createUser(
  previousState: "Error creating user" | null | undefined | null,
  payloads: {
    name: string;
    email: string;
    currentUserAccessToken: string;
  },
) {
  const apiUrl = process.env.PUBLIC_API_URL ?? "http://localhost:8000/api";
  const urlToFetch = `${apiUrl}/${BACKEND_NAME}/users`;
  const { name, email, currentUserAccessToken } = payloads;

  try {
    const response = await fetch(urlToFetch, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUserAccessToken}`,
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
  payload: { id: number; currentUserAccessToken: string },
) {
  const { id, currentUserAccessToken } = payload;

  const apiUrl = process.env.PUBLIC_API_URL ?? "http://localhost:8000/api";
  const urlToFetch = `${apiUrl}/${BACKEND_NAME}/users/${id}`;

  try {
    const response = await fetch(urlToFetch, {
      method: "DELETE",
      cache: "force-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUserAccessToken}`,
      },
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
  payload: {
    id: number;
    name: string;
    email: string;
    currentUserAccessToken: string;
  },
) {
  const apiUrl = process.env.PUBLIC_API_URL ?? "http://localhost:8000/api";
  const { id, name, email, currentUserAccessToken } = payload;

  const urlToFetch = `${apiUrl}/${BACKEND_NAME}/users/${id}`;

  try {
    const response = await fetch(urlToFetch, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUserAccessToken}`,
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
