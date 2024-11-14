import HomeButton from "@components/button/HomeButton";
import LogOutButton from "@components/button/LogOutButton";
import SearchInput from "@components/searchInput/SearchInput";
import UserInterface from "@components/userInterface/UserInterface";
import UserModal from "@components/userModal/UserModal";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const userAccessToken = cookieStore.get("accessToken");
  if (!userAccessToken) redirect("/auth/login");

  // eslint-disable-next-line unicorn/no-await-expression-member
  const query = (await searchParams).q;

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-9 overflow-y-auto bg-background p-4 md:gap-12 md:px-10 md:py-[34px]">
      <main className="flex flex-col items-center flex-1 w-full px-3 rounded-2xl bg-hero-section-centered-navbar md:rounded-3xl md:px-0">
        <div className="flex justify-between w-full p-4">
          <HomeButton />
          <LogOutButton />
        </div>
        <section className="flex flex-col items-center justify-center w-full gap-6 mt-16 my-14">
          <h1 className="text-center text-[clamp(2.125rem,1.142rem+3.659vw,4rem)] font-bold leading-none text-foreground">
            Team
          </h1>

          <div className="flex flex-col items-center w-full gap-y-5 lg:items-start lg:flex-row justify-evenly">
            <SearchInput />
            <UserModal currentUserAccessToken={userAccessToken.value} />
          </div>

          <UserInterface
            backendName="go"
            query={query as string}
            userAccessToken={userAccessToken.value}
          />
        </section>
      </main>
    </div>
  );
}
