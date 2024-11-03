import { Icon } from "@iconify/react";
import { Button, Link } from "@nextui-org/react";

export default function HomePage() {
  return (
    <div className="relative flex h-screen min-h-dvh w-full flex-col gap-9 overflow-y-auto bg-background p-4 md:gap-12 md:px-10 md:py-[34px]">
      <main className="flex flex-col items-center justify-center rounded-2xl h-full bg-hero-section-centered-navbar px-3 md:rounded-3xl md:px-0">
        <section className="my-14 mt-16 flex flex-col items-center justify-center gap-6">
          <Button
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
          </Button>
          <h1 className="text-center text-[clamp(2.125rem,1.142rem+3.659vw,4rem)] font-bold leading-none text-foreground">
            Easiest way to <br /> manage your team.
          </h1>
          <p className="text-center text-base text-default-600 sm:w-[466px] md:text-lg md:leading-6">
            GoTeam is a platform that helps you manage your team in the easiest
            way possible.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Button
              as={Link}
              href="/team"
              className="w-[163px] bg-foreground font-medium text-background"
              radius="full"
            >
              Get Started
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
