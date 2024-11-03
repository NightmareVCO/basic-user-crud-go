"use client";

import { createUser } from "@actions/user.actions";
import Button from "@components/button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
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
});

export function useUserModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  // eslint-disable-next-line unicorn/no-useless-undefined
  const [error, action, isPending] = useActionState(createUser, undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);

      startTransition(() => {
        action(formData);
      });

      toast.success("User created successfully", {
        description: new Date().toLocaleString(),
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    form,
    isPending,
    error,
    isOpen,
    onOpen,
    onOpenChange,
    onSubmit,
  };
}

export default function UserModal() {
  const { form, isPending, error, isOpen, onOpen, onOpenChange, onSubmit } =
    useUserModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <>
      <Button onPress={onOpen} iconPlace="end" buttonType="add">
        Add new member
      </Button>
      <Modal
        isOpen={isOpen}
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form id="createUserForm" onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Create a new user
              </ModalHeader>
              <ModalBody>
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
              </ModalBody>
              <ModalFooter className="flex flex-col justify-center gap-y-4 xs:flex-row">
                <div className="flex w-full justify-evenly">
                  <Button onPress={onClose} iconPlace="end" buttonType="cancel">
                    Cancel
                  </Button>
                  <Button
                    form="createUserForm"
                    type="submit"
                    isLoading={isPending}
                    iconPlace="end"
                    buttonType="save"
                  >
                    Add
                  </Button>
                </div>
                <div>{error && <p className="text-red-500">{error}</p>}</div>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
