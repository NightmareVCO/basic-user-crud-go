import LoginForm from "@components/authForms/loginForm/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import HomeButton from "@/ui/components/button/HomeButton";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const userAccessToken = cookieStore.get("accessToken");
  if (userAccessToken) redirect("/team");

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-9 overflow-y-auto bg-background p-4 md:gap-12 md:px-10 md:py-[34px]">
      <main className="flex flex-col items-center flex-1 w-full px-3 rounded-2xl bg-hero-section-centered-navbar md:rounded-3xl md:px-0">
        <div className="flex justify-between w-full p-4">
          <HomeButton />
        </div>
        <section className="flex flex-col items-center justify-center w-full gap-6 mt-16 my-14">
          <h1 className="text-center text-[clamp(2.125rem,1.142rem+3.659vw,4rem)] font-bold leading-none text-foreground">
            Login
          </h1>
        </section>

        <LoginForm />
      </main>
    </div>
  );
}
