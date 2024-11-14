import CardInterface from "@components/cardInterface/CardInterface";
import type { User } from "@data/user.data";

export default function UserCardRender({
  users,
  currentUserAccessToken,
}: {
  users: User[];
  currentUserAccessToken: string;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2">
      {users?.map((user) => (
        <CardInterface
          user={user}
          key={user.id}
          currentUserAccessToken={currentUserAccessToken}
        />
      ))}
    </div>
  );
}
