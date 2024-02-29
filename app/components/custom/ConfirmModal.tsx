import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";

const ConfirmModal = ({
  isModalOpen,
  onCloseModal,
  title,
  children,
  formMethod = "POST",
  formAction = "",
}: {
  isModalOpen: boolean;
  onCloseModal: () => void;
  title: string;
  children: React.ReactNode;
  formMethod: string;
  formAction?: string;
}) => {
  // state to handle loading
  const [isLoading, setIsLoading] = useState(false);
  const submit = useSubmit();

  // function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const formValues: { [key: string]: string } = {};

      for (const [key, value] of formData.entries()) {
        formValues[key] = value as string;
      }
      //   stimulate a network request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(formValues);
      submit(
        {
          ...formValues,
        },
        {
          method: formMethod,
          action: formAction,
        }
      );
      setIsLoading(false);
      onCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isModalOpen}
      onClose={onCloseModal}
      className="dark:bg-slate-900 border-[1px] dark:border-slate-700/20 w-full md:w-1/2"
      motionProps={{
        variants: {
          enter: {
            scale: [1, 0.9],
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            scale: [0.9, 1],
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="font-montserrat">{title}</h3>
            </ModalHeader>
            <ModalBody>
              <Form
                method={formMethod}
                id="form"
                onSubmit={handleSubmit}
                action={formAction ? formAction : ""}
              >
                {children}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onCloseModal}>
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                type="submit"
                form="form"
              >
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
