export interface User {
  id: number;
  name: string;
  email: string;
  status: boolean;
}

type GetUsersParameters = {
  backendName: string;
  query?: string;
  userAccessToken: string;
};

export const getUsers = async (getUsersParameters: GetUsersParameters) => {
  const { backendName, query, userAccessToken } = getUsersParameters;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
  const urlToFetch = query
    ? `${apiUrl}/${backendName}/users?q=${query}`
    : `${apiUrl}/${backendName}/users`;

  try {
    const response = await fetch(urlToFetch, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return [];
    }

    let users: User[] = [];
    try {
      users = await response.json();
    } catch {
      console.error("Error parsing JSON response");
      return [];
    }

    return users;
  } catch {
    console.error("Error fetching users");
    return [];
  }
};
