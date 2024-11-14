"use client";

import { loginUser } from "@actions/auth.actions";
import Button from "@components/button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export function useLoginForm() {
  // eslint-disable-next-line unicorn/no-useless-undefined
  const [error, action, isPending] = useActionState(loginUser, undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);

      startTransition(() => {
        action(formData);
      });

      if (error?.length === 0) {
        toast.success("Logged in successfully!", {
          description: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    form,
    isPending,
    error,
    onSubmit,
  };
}

export default function LoginForm() {
  const { form, isPending, error, onSubmit } = useLoginForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      id="logInForm"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-4 max-w-96"
      {...form}
    >
      <Input
        {...register("email")}
        label="Email"
        placeholder="johndoe@gmail.com"
        variant="bordered"
        radius="full"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        isRequired
        isClearable
      />
      {/* password */}
      <Input
        {...register("password")}
        label="Password"
        placeholder="********"
        variant="bordered"
        radius="full"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        isRequired
        isClearable
        type="password"
      />

      <div className="flex flex-col items-center justify-center gap-y-3">
        <Button
          form="logInForm"
          type="submit"
          isLoading={isPending}
          iconPlace="end"
          buttonType="next"
        >
          Login
        </Button>
        <div>{error && <p className="text-red-500">{error}</p>}</div>
        <Link href="/auth/register">
          <span className="text-primary">
            Not have an account? Create one now!
          </span>
        </Link>
      </div>
    </form>
  );
}
