/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Form, useSubmit, useNavigation } from "@remix-run/react";
import { useEffect } from "react";

const EditRecordModal = ({
  isModalOpen,
  onCloseModal,
  title,
  children,
}: {
  isModalOpen: boolean;
  onCloseModal: () => void;
  title: string;
  children: React.ReactNode;
  record: any;
}) => {
  // state to handle loading
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  const submit = useSubmit();

  // function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const formValues: { [key: string]: string } = {};

      for (const [key, value] of formData.entries()) {
        formValues[key] = value as string;
      }

      submit(
        {
          path: location.pathname + location.search,
          intent: "update",
          ...formValues,
        },
        {
          method: "POST",
          replace: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (navigation.state === "idle") {
      onCloseModal();
    }
  }, [navigation, onCloseModal]);

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isModalOpen}
      onClose={onCloseModal}
      className="dark:bg-slate-900 border-[1px] dark:border-slate-700/20 w-full md:w-1/2"
      size="5xl"
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
            <ModalHeader className="flex flex-col gap-1 font-montserrat">
              {title}
            </ModalHeader>
            <ModalBody>
              <Form method={"POST"} id="form" onSubmit={handleSubmit}>
                {children}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                className="font-montserrat"
                color="danger"
                variant="flat"
                onPress={onCloseModal}
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                className="font-montserrat"
                color="primary"
                type="submit"
                form="form"
              >
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditRecordModal;
