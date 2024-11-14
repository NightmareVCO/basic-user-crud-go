"use client";

import { deleteUser } from "@actions/user.actions";
import Button from "@components/button/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { startTransition, useActionState } from "react";
import { toast } from "sonner";

export function useDeleteModal(currentUserAccessToken: string) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  // eslint-disable-next-line unicorn/no-useless-undefined
  const [error, action, isPending] = useActionState(deleteUser, undefined);

  const onPress = async (id: number) => {
    try {
      startTransition(() => {
        action({
          id,
          currentUserAccessToken,
        });
      });

      toast.success("User deleted successfully", {
        description: new Date().toLocaleString(),
      });

      setTimeout(() => {
        globalThis.location.reload();
      }, 600);

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isPending,
    error,
    isOpen,
    onOpen,
    onOpenChange,
    onPress,
  };
}

export default function DeleteModal({
  id,
  currentUserAccessToken,
}: {
  id: number;
  currentUserAccessToken: string;
}) {
  const { isPending, error, isOpen, onOpen, onOpenChange, onPress } =
    useDeleteModal(currentUserAccessToken);

  return (
    <>
      <Button onPress={onOpen} iconPlace="end" buttonType="delete">
        Delete
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
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete User
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this user?</p>
              </ModalBody>
              <ModalFooter className="flex flex-col justify-center gap-y-4 xs:flex-row">
                <div className="flex w-full justify-evenly">
                  <Button onPress={onClose} iconPlace="end" buttonType="cancel">
                    Cancel
                  </Button>
                  <Button
                    onPress={() => onPress(id)}
                    isLoading={isPending}
                    iconPlace="end"
                    buttonType="save"
                  >
                    Delete
                  </Button>
                </div>
                <div>{error && <p className="text-red-500">{error}</p>}</div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
