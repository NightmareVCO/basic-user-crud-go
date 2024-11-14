"use client";

import { Spacer, Spinner } from "@nextui-org/react";
import { startTransition, useActionState, useEffect } from "react";

import { logoutUser } from "@/lib/actions/auth.actions";

export default function LogOut() {
  // eslint-disable-next-line unicorn/no-useless-undefined, @typescript-eslint/no-unused-vars
  const [_, action] = useActionState(logoutUser, undefined);

  useEffect(() => {
    startTransition(() => {
      action();
    });

    setTimeout(() => {
      globalThis.location.href = "/auth/login";
    }, 600);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-9 overflow-y-auto bg-background p-4 md:gap-12 md:px-10 md:py-[34px]">
      <main className="flex flex-col items-center flex-1 w-full px-3 rounded-2xl bg-hero-section-centered-navbar md:rounded-3xl md:px-0">
        <section className="flex flex-col items-center justify-center w-full gap-6 mt-16 my-14">
          <h1 className="text-center text-[clamp(2.125rem,1.142rem+3.659vw,4rem)] font-bold leading-none text-foreground">
            Logging Out
          </h1>
          <Spacer y={2} />
          <Spinner size="lg" color="white" />
        </section>
      </main>
    </div>
  );
}
