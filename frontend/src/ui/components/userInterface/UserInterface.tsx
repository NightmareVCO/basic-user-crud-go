// import { useState } from "react";

import NoUserCard from "@components/noUserCard/NoUserCard";
import UserCardRender from "@components/userCardRender/UserCardRender";

export interface User {
  id: number;
  name: string;
  email: string;
  status: boolean;
}

interface UserInterfaceProperties {
  backendName: "go" | "node" | "python";
  query: string | string[] | undefined;
}

export default async function UserInterface({
  backendName,
  query,
}: UserInterfaceProperties) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
  const urlToFetch = query
    ? `${apiUrl}/${backendName}/users?q=${query}`
    : `${apiUrl}/${backendName}/users`;

  const response = await fetch(urlToFetch, { cache: "no-cache" });
  const users: User[] = await response.json();

  return (
    <>
      {users?.length === 0 ? (
        <NoUserCard />
      ) : (
        <section className="w-full px-10">
          <UserCardRender users={users} />
        </section>
      )}
    </>
  );
}
