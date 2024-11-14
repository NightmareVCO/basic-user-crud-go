// import { useState } from "react";

import NoUserCard from "@components/noUserCard/NoUserCard";
import UserCardRender from "@components/userCardRender/UserCardRender";
import { getUsers } from "@data/user.data";

interface UserInterfaceProperties {
  backendName: "go" | "node" | "python";
  query: string;
  userAccessToken: string;
}

export default async function UserInterface({
  backendName,
  query,
  userAccessToken,
}: UserInterfaceProperties) {
  const users = await getUsers({
    backendName,
    query: query as string,
    userAccessToken,
  });

  return (
    <>
      {users?.length === 0 ? (
        <NoUserCard />
      ) : (
        <section className="w-full px-10">
          <UserCardRender
            users={users}
            currentUserAccessToken={userAccessToken}
          />
        </section>
      )}
    </>
  );
}
