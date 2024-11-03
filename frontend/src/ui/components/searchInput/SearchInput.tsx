"use client";

import { Icon } from "@iconify/react";
import { Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function useSearch() {
  const searchParameters = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const parameters = new URLSearchParams(searchParameters);

      if (event.target.value) {
        if (event.target.value.length > 2)
          parameters.set("q", event.target.value);
      } else parameters.delete("q");

      replace(`${pathname}?${parameters}`);
    },
    300,
  );

  return { handleSearch };
}

export default function SearchInput() {
  const { handleSearch } = useSearch();

  return (
    <div className="flex items-center w-full max-w-[600px] gap-3  sm:gap-6">
      <Input
        classNames={{
          base: "max-w-full",
          mainWrapper: "h-full",
          input: "text-small group-data-[has-value=true]:text-white",
          inputWrapper:
            "bg-foreground font-medium text-white data-[hover=true]:bg-foreground group-data-[focus=true]:bg-foreground",
        }}
        radius="full"
        placeholder="Type to search..."
        startContent={
          <Icon
            className="pointer-events-none flex-none outline-none [&>path]:stroke-[1.5]"
            icon="solar:magnifer-linear"
            width={20}
          />
        }
        type="search"
        onChange={handleSearch}
      />
    </div>
  );
}
