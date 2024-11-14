import Button from "@components/button/Button";
import { Icon } from "@iconify/react";
import { Button as NextUIButton } from "@nextui-org/button";
import { Link } from "@nextui-org/react";

export default function HomePage() {
  return (
    <div className="relative flex h-screen min-h-dvh w-full flex-col gap-9 overflow-y-auto bg-background p-4 md:gap-12 md:px-10 md:py-[34px]">
      <main className="flex flex-col items-center justify-center h-full px-3 rounded-2xl bg-hero-section-centered-navbar md:rounded-3xl md:px-0">
        <section className="flex flex-col items-center justify-center gap-6 mt-16 my-14">
          <NextUIButton
            className="h-9 bg-background px-[18px] text-default-500 shadow-[0_2px_15px_0_rgba(0,0,0,0.05)]"
            endContent={
              <Icon
                className="pointer-events-none flex-none outline-none [&>path]:stroke-[1.5]"
                icon="solar:arrow-right-linear"
                width={20}
              />
            }
            radius="full"
          >
            New onboarding experience
          </NextUIButton>
          <h1 className="text-center text-[clamp(2.125rem,1.142rem+3.659vw,4rem)] font-bold leading-none text-foreground">
            Easiest way to <br /> manage your team.
          </h1>
          <p className="text-center text-base text-default-600 sm:w-[466px] md:text-lg md:leading-6">
            GoTeam is a platform that helps you manage your team in the easiest
            way possible.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Link href="/team">
              <Button buttonType="next" iconPlace="end">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
