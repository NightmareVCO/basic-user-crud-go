"use client";

import { registerUser } from "@actions/auth.actions";
import Button from "@components/button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must have at least 2 words" })
    .max(50, { message: "Name must have less than 50" }),
  email: z.string().email(),
  password: z.string().min(8),
});

export function useRegisterForm() {
  // eslint-disable-next-line unicorn/no-useless-undefined
  const [error, action, isPending] = useActionState(registerUser, undefined);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);

      startTransition(() => {
        action(formData);
      });

      if (error?.length === 0 || !error) {
        toast.success("Registered successfully!", {
          description: new Date().toLocaleString(),
        });

        form.reset();
        router.push("/auth/login");
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
    action,
  };
}

export default function RegisterForm() {
  const { form, isPending, error, onSubmit } = useRegisterForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      id="registerForm"
      className="flex flex-col w-full gap-4 max-w-96"
      onSubmit={handleSubmit(onSubmit)}
      {...form}
    >
      {/* name */}
      <Input
        {...register("name")}
        label="Name"
        placeholder="John Doe"
        variant="bordered"
        radius="full"
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        isRequired
        isClearable
      />
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
          form="registerForm"
          type="submit"
          isLoading={isPending}
          iconPlace="end"
          buttonType="save"
        >
          Register
        </Button>
        <div>{error && <p className="text-red-500">{error}</p>}</div>
        <Link href="/auth/login">
          <span className="text-primary">Already have an account? Login</span>
        </Link>
      </div>
    </form>
  );
}
