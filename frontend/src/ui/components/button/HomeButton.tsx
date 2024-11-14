import { Link } from "@nextui-org/react";

import Button from "./Button";

export default function HomeButton() {
  return (
    <Link href="/">
      <Button iconPlace="start" buttonType="back">
        Go back
      </Button>
    </Link>
  );
}
