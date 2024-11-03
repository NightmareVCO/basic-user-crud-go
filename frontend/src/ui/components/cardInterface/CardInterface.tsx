"use client";

import type { User } from "@components/userInterface/UserInterface";
import DeleteModal from "@components/userModal/DeleteUserModal";
import EditModal from "@components/userModal/EditUserModal";
import { Card, CardBody, CardFooter, Divider, Image } from "@nextui-org/react";
import { Suspense } from "react";

export default function CardInterface({ user }: { user: User }) {
  return (
    <Card className="w-full col-span-10 lg:col-span-1">
      <CardBody className="flex flex-row gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{user.name}</p>
          <p className="text-small text-default-500">{user.email}</p>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex flex-col gap-y-4 justify-evenly xs:flex-row">
        <Suspense>
          <DeleteModal id={user.id} />
        </Suspense>
        <Suspense>
          <EditModal user={user} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
