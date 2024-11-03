"use client";

import { updateUser } from "@actions/user.actions";
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

import type { User } from "../userInterface/UserInterface";

const formSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(2, { message: "Name must have at least 2 words" })
    .max(50, { message: "Name must have less than 50" }),
  email: z.string().email(),
});

export function useEditModal({ user }: { user: User }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  // eslint-disable-next-line unicorn/no-useless-undefined
  const [error, action, isPending] = useActionState(updateUser, undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("id", values.id.toString());
      formData.append("name", values.name);
      formData.append("email", values.email);

      startTransition(() => {
        action(formData);
      });

      toast.success("User updated successfully", {
        description: new Date().toLocaleString(),
      });

      form.reset({
        id: values.id,
        name: values.name,
        email: values.email,
      });
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

export default function EditModal({ user }: { user: User }) {
  const { form, isPending, error, isOpen, onOpen, onOpenChange, onSubmit } =
    useEditModal({ user });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <>
      <Button onPress={onOpen} iconPlace="end" buttonType="edit">
        Edit
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
            <form id="editUserForm" onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Edit a user
              </ModalHeader>
              <ModalBody>
                <input type="hidden" {...register("id")} value={user.id} />
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
                    form="editUserForm"
                    type="submit"
                    isLoading={isPending}
                    iconPlace="end"
                    buttonType="save"
                  >
                    Save
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
