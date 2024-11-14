import { Link } from "@nextui-org/react";

import Button from "./Button";

export default function LogOutButton() {
  return (
    <Link href="/auth/logout">
      <Button iconPlace="end" buttonType="delete">
        Logout
      </Button>
    </Link>
  );
}
