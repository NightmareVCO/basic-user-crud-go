import CardInterface from "@components/cardInterface/CardInterface";

import type { User } from "../userInterface/UserInterface";

export default function UserCardRender({ users }: { users: User[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2">
      {users?.map((user) => <CardInterface user={user} key={user.id} />)}
    </div>
  );
}
