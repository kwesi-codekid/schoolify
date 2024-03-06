/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomInput from "~/components/custom/CustomInput";
import CustomSelect from "~/components/custom/CustomSelect";
import CustomDatePicker from "~/components/custom/CustomDatepicker";
import UploadFileInput from "~/components/custom/upload-file-input";

import { useAsyncList } from "@react-stately/data";
import { EyeOutlined } from "~/assets/icons/EyeOutlined";
import { EditIcon } from "~/assets/icons/EditIcon";
import { DeleteIcon } from "~/assets/icons/DeleteIcon";
import { PlusIcon } from "~/assets/icons/PlusIcon";

import AdminLayout from "~/layouts/AdminLayout";
import React, { useEffect, useState } from "react";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import AdminController from "~/controllers/AdminController";
import ClassController from "~/controllers/ClassController";
import emptyFolderSVG from "~/assets/svgs/empty_folder.svg";
import StudentController from "~/controllers/StudentController";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Tooltip,
  useDisclosure,
  Button,
  Input,
  Pagination,
} from "@nextui-org/react";
import CreateRecordModal from "~/components/custom/CreateRecordModal";
import EditRecordModal from "~/components/custom/EditRecordModal";
import ConfirmModal from "~/components/custom/ConfirmModal";

const AdminStudentsManagement = () => {
  const { student, search_term, user, page } = useLoaderData();

  const [studentData, setStudentData] = useState(student);

  useEffect(() => {
    setStudentData(student);
  }, [student]);

  const columns = [
    {
      key: "firstName",
      name: "First Name",
    },
    {
      key: "lastName",
      name: "Last Name",
    },
    {
      key: "gender",
      name: "Gender",
    },
    {
      key: "class",
      name: "Class",
    },
    {
      key: "actions",
      name: "Actions",
    },
  ];

  const registerStudentFormItems = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10">
      {/* personal info */}
      <div className="flex flex-col gap-5">
        <CustomInput name="firstName" label="First Name" />
        <CustomInput name="lastName" label="Last Name" />
        <CustomSelect
          items={[
            {
              label: "Male",
              value: "male",
              id: "male",
              chipColor: "primary",
            },
            {
              label: "Female",
              value: "female",
              id: "female",
              chipColor: "secondary",
            },
          ]}
          name="gender"
          label="Gender"
        />

        <CustomDatePicker
          label="Date of Birth"
          name="dob"
          placeholder="Date of Birth"
        />

        <CustomInput name="address" label="Address" />
      </div>
      {/* personal info */}
      <div className="flex flex-col gap-5">
        <CustomSelect
          items={[
            {
              label: "Male",
              value: "male",
              id: "male",
              chipColor: "primary",
            },
            {
              label: "Female",
              value: "female",
              id: "female",
              chipColor: "secondary",
            },
          ]}
          name="parent"
          label="Parent"
        />
        <CustomSelect
          items={[
            {
              label: "Male",
              value: "male",
              id: "male",
              chipColor: "primary",
            },
            {
              label: "Female",
              value: "female",
              id: "female",
              chipColor: "secondary",
            },
          ]}
          name="emergencyContactRelationship"
          label="Emergency Contact Relationship"
        />
        <CustomInput
          name="emergencyContactName"
          label="Emergency Contact Name"
        />
        <CustomInput
          name="emergencyContactPhone"
          label="Emergency Contact Phone"
        />

        <UploadFileInput name="profileImage" />
      </div>
    </div>
  );

  const [editRecord, setEditRecord] = useState<any>(null);
  const editStudentFormItems = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10">
      {/* personal info */}
      <div className="flex flex-col gap-5">
        <CustomInput
          name="firstName"
          label="First Name"
          defaultValue={editRecord?.firstName}
        />
        <CustomInput
          name="lastName"
          label="Last Name"
          defaultValue={editRecord?.lastName}
        />
        <CustomSelect
          items={[
            {
              label: "Male",
              value: "male",
              id: "male",
              chipColor: "primary",
            },
            {
              label: "Female",
              value: "female",
              id: "female",
              chipColor: "secondary",
            },
          ]}
          name="gender"
          label="Gender"
        />

        <CustomDatePicker
          label="Date of Birth"
          name="dob"
          placeholder="Date of Birth"
        />

        <CustomInput name="address" label="Address" />
      </div>
      {/* personal info */}
      <div className="flex flex-col gap-5">
        <CustomSelect
          items={[
            {
              label: "Male",
              value: "male",
              id: "male",
              chipColor: "primary",
            },
            {
              label: "Female",
              value: "female",
              id: "female",
              chipColor: "secondary",
            },
          ]}
          name="parent"
          label="Parent"
        />
        <CustomSelect
          items={[
            {
              label: "Male",
              value: "male",
              id: "male",
              chipColor: "primary",
            },
            {
              label: "Female",
              value: "female",
              id: "female",
              chipColor: "secondary",
            },
          ]}
          name="emergencyContactRelationship"
          label="Emergency Contact Relationship"
        />
        <CustomInput
          name="emergencyContactName"
          label="Emergency Contact Name"
        />
        <CustomInput
          name="emergencyContactPhone"
          label="Emergency Contact Phone"
        />

        <UploadFileInput name="profileImage" />
      </div>
    </div>
  );

  // navigation logic
  const navigate = useNavigate();

  // table data:: useAsync logic, loading states
  const [isLoading, setIsLoading] = useState(true);
  const list = useAsyncList({
    async load() {
      setIsLoading(false);

      return {
        items: studentData,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });
  useEffect(() => {
    list.reload();
  }, [studentData]);
  // end table data:: useAsync logic, loading states

  // delete record stuff
  const deleteDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = React.useState<string>("");
  const openDeleteModal = (deleteId: string) => {
    setDeleteId(deleteId);
    deleteDisclosure.onOpen();
  };

  // create record stuff
  const createRecordDisclosure = useDisclosure();
  const openCreateRecordModal = () => {
    createRecordDisclosure.onOpen();
  };

  // edit record stuff
  const editRecordDisclosure = useDisclosure();
  const openEditRecordModal = (record: any) => {
    setEditRecord(record);
    editRecordDisclosure.onOpen();
  };

  // table top content
  const tableTopContent = (
    <div className="flex items-center justify-between">
      <div className="w-1/3 rounded-xl flex items-center gap-2">
        <Form method="get" className="flex items-center justify-center gap-2">
          <Input
            className="rounded-xl"
            classNames={{
              inputWrapper: "!h-10",
            }}
            name="search_term"
            radius="lg"
            defaultValue={search_term}
            size="sm"
          />
          <Button
            className="h-10 font-montserrat"
            color="primary"
            variant="flat"
            type="submit"
          >
            Search
          </Button>
        </Form>
      </div>
      <Button
        className="font-montserrat"
        size="md"
        color="primary"
        startContent={<PlusIcon />}
        onPress={openCreateRecordModal}
      >
        <Input className="hidden" name="intent" value={"create"} />
        Register Student
      </Button>
    </div>
  );
  // end table top content

  return (
    <AdminLayout pageTitle="Student Management">
      <section className="p-4 backdrop-blur-[1px]"></section>

      {/* create modal */}
      <CreateRecordModal
        title="Create Record"
        isModalOpen={createRecordDisclosure.isOpen}
        onCloseModal={createRecordDisclosure.onClose}
        size={"5xl"}
      >
        {registerStudentFormItems}
      </CreateRecordModal>

      {/* edit modal */}
      <EditRecordModal
        record={editRecord}
        title="Edit Record"
        isModalOpen={editRecordDisclosure.isOpen}
        onCloseModal={editRecordDisclosure.onClose}
      >
        {editStudentFormItems}
      </EditRecordModal>

      {/* delete modal */}
      <ConfirmModal
        title="Delete Record"
        isModalOpen={deleteDisclosure.isOpen}
        onCloseModal={deleteDisclosure.onClose}
        formMethod="POST"
        formAction=""
      >
        <Input className="hidden" name="intent" value={"delete"} />
        <Input className="hidden" name="_id" value={deleteId} />
        <p className="font-nunito">
          Are you sure you want to delete this user?
        </p>
      </ConfirmModal>
    </AdminLayout>
  );
};

export default AdminStudentsManagement;

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname + url.search;

  const formData = await request.formData();
  const _id = formData.get("_id") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const gender = formData.get("gender") as string;
  const dob = formData.get("dob") as string;
  const studentClass = formData.get("class") as string;
  const address = formData.get("address") as string;
  const parent = formData.get("parent") as string;
  const profileImage = formData.get("profileImage") as string;
  const status = formData.get("status") as string;

  const intent = formData.get("intent") as string;
  const studentController = await new StudentController(request);

  if (intent == "create") {
    return await studentController.createStudent({
      path,
      firstName,
      lastName,
      gender,
      dob,
      studentClass,
      address,
      profileImage,
    });
  } else if (intent == "update") {
    return await studentController.updateStudent({
      _id,
      path,
      firstName,
      lastName,
      gender,
      dob,
      studentClass,
      address,
      profileImage,
      status,
    });
  } else if (intent == "delete") {
    return await studentController.deleteStudent({ _id, path });
  } else {
    return true;
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { studentId } = params;
  const adminController = await new AdminController(request);
  const user = await adminController.getAdmin();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const status = url.searchParams.get("order_status") as string;
  const from = url.searchParams.get("from") as string;
  const to = url.searchParams.get("to") as string;

  const studentController = await new StudentController(request);
  const student = await studentController.getStudent({ id: studentId });

  return { student, search_term, user, page };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Students | Schoolify" },
    {
      name: "description",
      content: "Schoolify easily",
    },
    { name: "og:title", content: "Schoolify" },
    {
      name: "og:description",
      content: "Schoolify easily",
    },
    {
      name: "og:image",
      content:
        "https://res.cloudinary.com/app-deity/image/upload/v1701282976/qfdbysyu0wqeugtcq9wq.jpg",
    },
    { name: "og:url", content: "https://www.printmoney.money" },
  ];
};
