import { Icon } from "@iconify/react";
import {
  Button as NextUIButton,
  type InternalForwardRefRenderFunction,
  type LinkProps,
} from "@nextui-org/react";
import type { ReactNode } from "react";

type ButtonType =
  | "add"
  | "delete"
  | "edit"
  | "save"
  | "cancel"
  | "back"
  | "next";

const getIcon = (buttonType: ButtonType) => {
  const iconProperties = {
    className:
      "pointer-events-none flex-none outline-none [&>path]:stroke-[1.5]",
    width: 20,
  };

  switch (buttonType) {
    case "add": {
      return <Icon {...iconProperties} icon="solar:add-circle-linear" />;
    }
    case "delete": {
      return <Icon {...iconProperties} icon="solar:minus-circle-linear" />;
    }
    case "edit": {
      return <Icon {...iconProperties} icon="solar:user-circle-linear" />;
    }
    case "save": {
      return <Icon {...iconProperties} icon="solar:save-linear" />;
    }
    case "cancel": {
      return <Icon {...iconProperties} icon="solar:close-linear" />;
    }
    case "back": {
      return <Icon {...iconProperties} icon="solar:arrow-left-linear" />;
    }
    case "next": {
      return <Icon {...iconProperties} icon="solar:arrow-right-linear" />;
    }
    default: {
      return;
    }
  }
};

export default function Button({
  children,
  buttonType,
  type,
  isLoading,
  iconPlace,
  form,
  as,
  href,
  onPress,
}: {
  children: ReactNode;
  buttonType: ButtonType;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  iconPlace?: "start" | "end";
  form?: string;
  as?: InternalForwardRefRenderFunction<"a", LinkProps, never>;
  href?: string;
  onPress?: () => void;
}) {
  const endContent = getIcon(buttonType);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
      <NextUIButton
        className="w-[175px] bg-foreground font-medium text-background"
        radius="full"
        as={as}
        href={href}
        type={type}
        form={form}
        isLoading={isLoading}
        startContent={iconPlace === "start" ? endContent : undefined}
        endContent={iconPlace === "end" ? endContent : undefined}
        onPress={onPress}
      >
        {children}
      </NextUIButton>
    </div>
  );
}
