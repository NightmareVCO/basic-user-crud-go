import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";

export default function NoUserCard() {
  return (
    <Card className="max-w-[400px] min-w-[350px]">
      <CardHeader className="flex justify-center gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col justify-center">
          <p className="text-md">GoTeam</p>
          <p className="text-small text-default-500">GoTeam.com</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-center">Start adding your team</p>
      </CardBody>
    </Card>
  );
}
