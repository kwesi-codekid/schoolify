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
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import AdminController from "~/controllers/AdminController";
import ClassController from "~/controllers/ClassController";
import emptyFolderSVG from "~/assets/svgs/empty_folder.svg";
import StudentController from "~/controllers/StudentController";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Image,
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
  Chip,
} from "@nextui-org/react";
import CreateRecordModal from "~/components/custom/CreateRecordModal";
import EditRecordModal from "~/components/custom/EditRecordModal";
import ConfirmModal from "~/components/custom/ConfirmModal";

const AdminStudentsManagement = () => {
  const { students, totalPages, search_term, user, page, classes } =
    useLoaderData<any>();
  console.log(students);

  const [studentData, setStudentData] = useState(students);

  useEffect(() => {
    setStudentData(students);
  }, [students]);

  const columns = [
    {
      key: "profileImage",
      name: "Profile Image",
    },
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
      key: "status",
      name: "Status",
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

        <CustomSelect
          items={classes.map((c: any) => ({
            label: c.name,
            value: c._id,
            id: c._id,
            chipColor: "primary",
          }))}
          name="class"
          label="Class"
        />
        <CustomInput name="address" label="Address" />
        <CustomDatePicker placeholder="Date of Birth" name="dob" />
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
        <Input className="hidden" name="_id" defaultValue={editRecord?._id} />
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
          defaultKey={editRecord?.gender}
        />

        <CustomDatePicker
          placeholder="Date of Birth"
          name="dob"
          defaultValue={new Date(editRecord?.dob)
            .toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-")}
        />
        <CustomSelect
          items={classes.map((c: any) => ({
            label: c.name,
            value: c._id,
            id: c._id,
            chipColor: "primary",
          }))}
          name="class"
          label="Class"
          defaultKey={editRecord?.class._id}
        />
        <CustomInput
          name="address"
          label="Address"
          defaultValue={editRecord?.address}
        />
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
          defaultKey={editRecord?.parent}
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
          defaultValue={editRecord?.emergencyContact?.name}
        />
        <CustomInput
          name="emergencyContactPhone"
          label="Emergency Contact Phone"
          defaultValue={editRecord?.emergencyContact?.phone}
        />

        <CustomSelect
          items={[
            {
              label: "Active",
              value: "active",
              id: "active",
              chipColor: "success",
            },
            {
              label: "Inactive",
              value: "inactive",
              id: "inactive",
              chipColor: "danger",
            },
          ]}
          name="status"
          label="Status"
          defaultKey={editRecord?.status}
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
    async sort({ items, sortDescriptor }: { items: any; sortDescriptor: any }) {
      return {
        items: items.sort((a: any, b: any) => {
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
      <section className="p-4 backdrop-blur-[1px] flex flex-col gap-4">
        {/* <CustomTable
          items={studentData}
          totalPages={totalPages}
          columns={columns}
          addButtonText="Register Student"
          createRecordFormItems={registerStudentFormItems}
          editRecord={editRecord}
          setEditRecord={setEditRecord}
        /> */}
        {tableTopContent}
        <Table
          aria-label="Students Table"
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
          isHeaderSticky
          classNames={{
            wrapper: "!bg-slate-900/80",
          }}
          bottomContent={
            totalPages > 1 ? (
              <div className="flex w-full items-center">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={(page) => {
                    let baseUrl = location.pathname + location.search;
                    const regex = /([?&]page=)\d+/g;

                    if (
                      baseUrl.includes("?page=") ||
                      baseUrl.includes("&page=")
                    ) {
                      baseUrl = baseUrl.replace(regex, `$1${page}`);
                    } else {
                      baseUrl += baseUrl.includes("?")
                        ? `&page=${page}`
                        : `?page=${page}`;
                    }

                    navigate(baseUrl);
                  }}
                />
              </div>
            ) : null
          }
        >
          <TableHeader className="!bg-blue-500">
            {columns.map((column) => (
              <TableColumn
                className="font-montserrat bg-slate-900"
                key={column.key}
                allowsSorting
              >
                {column.name}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            // items={list.items}
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
            emptyContent={
              isLoading ? (
                <></>
              ) : (
                <div className="flex items-center justify-center flex-col gap-3">
                  <img src={emptyFolderSVG} alt="No data" />
                  <p className="font-nunito text-lg md:text-xl">
                    No records found
                  </p>
                </div>
              )
            }
          >
            {list.items.map((student: any, index) => (
              <TableRow key={index}>
                <TableCell className="!w-16">
                  {student.profileImage === "" ? (
                    // show intials
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <p className="font-nunito text-sm text-white">
                        {student.firstName.charAt(0).toUpperCase()}
                        {student.lastName.charAt(0).toUpperCase()}
                      </p>
                    </div>
                  ) : (
                    <Image
                      isZoomed
                      src={student.profileImage}
                      alt="profile image"
                      radius="full"
                      classNames={{
                        img: "size-10",
                      }}
                    />
                  )}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {student.firstName}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {student.lastName}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {student.gender}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {student.class.name}
                </TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    classNames={{
                      content: "font-nunito text-xs",
                    }}
                    size="sm"
                    color={student.status === "active" ? "success" : "danger"}
                  >
                    {student.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center">
                    <Tooltip content="Details">
                      <Button
                        variant="light"
                        radius="full"
                        color="default"
                        isIconOnly
                        size="sm"
                        onPress={() => {
                          navigate(`/admin/students/${student._id}`);
                        }}
                      >
                        <EyeOutlined className="size-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Edit user">
                      <Button
                        variant="light"
                        radius="full"
                        color="primary"
                        isIconOnly
                        size="sm"
                        onClick={() => openEditRecordModal(student)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                      <Button
                        onClick={() => openDeleteModal(student._id)}
                        variant="light"
                        radius="full"
                        color="danger"
                        isIconOnly
                        size="sm"
                      >
                        <DeleteIcon className="size-4" />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

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
  const emergencyContactName = formData.get("emergencyContactName") as string;
  const emergencyContactPhone = formData.get("emergencyContactPhone") as string;
  const emergencyContactRelationship = formData.get(
    "emergencyContactRelationship"
  ) as string;

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
      parent,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
    });
  } else if (intent == "update") {
    console.log({ _id, path });

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
      parent,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
    });
  } else if (intent == "delete") {
    return await studentController.deleteStudent({ _id, path });
  } else {
    return true;
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const adminController = await new AdminController(request);
  const user = await adminController.getAdmin();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const status = url.searchParams.get("order_status") as string;
  const from = url.searchParams.get("from") as string;
  const to = url.searchParams.get("to") as string;

  const studentController = await new StudentController(request);
  const { students, totalPages } = await studentController.getStudents({
    page,
    search_term,
  });

  const classController = await new ClassController(request);
  const { classes } = await classController.getStudentClasss({
    limit: 1000,
    page,
  });

  return { students, totalPages, search_term, user, page, classes };
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
