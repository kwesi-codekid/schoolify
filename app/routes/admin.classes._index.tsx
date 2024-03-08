/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomTable from "~/components/custom/CustomTable";
import CustomInput from "~/components/custom/CustomInput";
import CustomSelect from "~/components/custom/CustomSelect";
import AdminLayout from "~/layouts/AdminLayout";

import { useEffect, useState } from "react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useAsyncList } from "@react-stately/data";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Avatar,
  Button,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Image,
  useDisclosure,
} from "@nextui-org/react";

import ClassController from "~/controllers/ClassController";
import TeacherController from "~/controllers/TeacherController";

import { DeleteIcon } from "~/assets/icons/DeleteIcon";
import { EditIcon } from "~/assets/icons/EditIcon";
import { EyeOutlined } from "~/assets/icons/EyeOutlined";
import emptyFolderSVG from "~/assets/svgs/empty_folder.svg";
import CreateRecordModal from "~/components/custom/CreateRecordModal";
import EditRecordModal from "~/components/custom/EditRecordModal";
import ConfirmModal from "~/components/custom/ConfirmModal";
import React from "react";
import { PlusIcon } from "@radix-ui/react-icons";

const AdminClassesManagement = () => {
  const { classes, totalPages, search_term, user, page, teachers } =
    useLoaderData<any>();

  const [classesData, setClassesData] = useState(classes);
  useEffect(() => {
    setClassesData(classes);
  }, [classes]);

  // navigation logic
  const navigate = useNavigate();

  // table data:: useAsync logic, loading states
  const [isLoading, setIsLoading] = useState(true);
  const list = useAsyncList({
    async load() {
      setIsLoading(false);

      return {
        items: classesData,
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
  }, [classesData]);
  // end table data:: useAsync logic, loading states

  const columns = [
    {
      key: "name",
      name: "Class Name",
    },
    {
      key: "teacher",
      name: "Assigned Teacher",
    },
    {
      key: "description",
      name: "Description",
    },
    {
      key: "actions",
      name: "Actions",
    },
  ];

  const createClassFormItems = (
    <div className="flex flex-col gap-5">
      <CustomInput name="className" label="Class Name" />
      <Select
        items={teachers}
        label="Assigned to"
        name="classTeacher"
        placeholder="Select a teacher"
        size="lg"
        className="font-nunito"
        classNames={{
          trigger: "dark:!bg-slate-800 dark:!border-slate-700/20",
          popoverContent: "dark:!bg-slate-800 dark:!border-slate-700/20",
          label: "font-nunito font-bold mb-2",
        }}
        listboxProps={{
          itemClasses: {
            base: [
              "rounded-md",
              "dark:hover:!bg-slate-700",
              "dark:!text-slate-200",
            ],
          },
        }}
        renderValue={(items: any) => {
          return items.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Avatar
                alt={item.data.firstName}
                className="flex-shrink-0"
                size="sm"
                src={item.data.profileImage}
              />
              <div className="flex flex-col">
                <span>{item.data.firstName + item.data.lastName}</span>
                <span className="text-default-500 text-tiny">
                  {item.data.email}
                </span>
              </div>
            </div>
          ));
        }}
      >
        {(teacher: any) => (
          <SelectItem key={teacher._id} textValue={teacher._id}>
            <div className="flex gap-2 items-center">
              <Avatar
                alt={teacher.firstName}
                className="flex-shrink-0"
                size="sm"
                src={teacher.profileImage}
              />
              <div className="flex flex-col">
                <span className="text-small">{`${teacher.firstName} ${teacher.lastName}`}</span>
                <span className="text-tiny text-default-400">
                  {teacher.email}
                </span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
      <CustomInput name="description" label="Description" />
    </div>
  );

  const [editRecord, setEditRecord] = useState(null);
  const editClassFormItems = (
    <div className="flex flex-col gap-5">
      <Input className="hidden" name="_id" defaultValue={editRecord?._id} />
      <CustomInput
        name="className"
        label="Class Name"
        defaultValue={editRecord?.name}
      />
      <Select
        items={teachers}
        label="Assigned to"
        name="classTeacher"
        placeholder="Select a teacher"
        size="lg"
        className="font-nunito"
        defaultSelectedKeys={
          editRecord?.teacher._id ? [editRecord?.teacher._id] : []
        }
        classNames={{
          trigger: "dark:!bg-slate-800 dark:!border-slate-700/20",
          popoverContent: "dark:!bg-slate-800 dark:!border-slate-700/20",
          label: "font-nunito font-bold mb-2",
        }}
        listboxProps={{
          itemClasses: {
            base: [
              "rounded-md",
              "dark:hover:!bg-slate-700",
              "dark:!text-slate-200",
            ],
          },
        }}
        renderValue={(items: any) => {
          return items.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Avatar
                alt={item.data.firstName}
                className="flex-shrink-0"
                size="sm"
                src={item.data.profileImage}
              />
              <div className="flex flex-col">
                <span>{item.data.firstName + item.data.lastName}</span>
                <span className="text-default-500 text-tiny">
                  {item.data.email}
                </span>
              </div>
            </div>
          ));
        }}
      >
        {(teacher: any) => (
          <SelectItem key={teacher._id} textValue={teacher._id}>
            <div className="flex gap-2 items-center">
              <Avatar
                alt={teacher.firstName}
                className="flex-shrink-0"
                size="sm"
                src={teacher.profileImage}
              />
              <div className="flex flex-col">
                <span className="text-small">{`${teacher.firstName} ${teacher.lastName}`}</span>
                <span className="text-tiny text-default-400">
                  {teacher.email}
                </span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
      <CustomInput
        name="description"
        label="Description"
        defaultValue={editRecord?.description}
      />
    </div>
  );

  // modal states
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
        Create Class
      </Button>
    </div>
  );
  // end table top content

  return (
    <AdminLayout pageTitle="Classes Management">
      <section className="p-4 backdrop-blur-[1px] flex flex-col gap-4">
        {/* <CustomTable
          items={classes}
          totalPages={totalPages}
          columns={columns}
          addButtonText="New Class"
          createRecordFormItems={createClassFormItems}
          createRecordModalSize="md"
          editRecordFormItems={editClassFormItems}
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
            {list.items.map((studentClass: any, index) => (
              <TableRow key={index}>
                <TableCell className="font-nunito text-sm">
                  {studentClass.name}
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  <div className="flex gap-2 items-center">
                    <Avatar
                      alt={studentClass.teacher.firstName}
                      className="flex-shrink-0"
                      size="sm"
                      src={studentClass.teacher.profileImage}
                    />
                    <div className="flex flex-col">
                      <span>
                        {studentClass.teacher.firstName +
                          " " +
                          studentClass.teacher.lastName}
                      </span>
                      <span className="text-default-500 text-tiny">
                        {studentClass.teacher.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-nunito text-sm">
                  {studentClass.description}
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
                          navigate(`/admin/classes/${studentClass._id}`);
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
                        onClick={() => openEditRecordModal(studentClass)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                      <Button
                        onClick={() => openDeleteModal(studentClass._id)}
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
        {createClassFormItems}
      </CreateRecordModal>

      {/* edit modal */}
      <EditRecordModal
        record={editRecord}
        title="Edit Record"
        isModalOpen={editRecordDisclosure.isOpen}
        onCloseModal={editRecordDisclosure.onClose}
      >
        {editClassFormItems}
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

export default AdminClassesManagement;

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname + url.search;

  const formData = await request.formData();
  const _id = formData.get("_id") as string;
  const className = formData.get("className") as string;
  const classTeacher = formData.get("classTeacher") as string;
  const description = formData.get("description") as string;

  const intent = formData.get("intent") as string;
  const classController = await new ClassController(request);

  if (intent == "create") {
    return await classController.createStudentClass({
      path,
      name: className,
      teacher: classTeacher,
      description,
    });
  } else if (intent == "update") {
    return await classController.updateStudentClass({
      _id,
      path,
      name: className,
      teacher: classTeacher,
      description,
    });
  } else if (intent == "delete") {
    return await classController.deleteStudentClass({ _id, path });
  } else {
    return true;
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  // const adminController = await new AdminController(request);
  // const user = await adminController.getAdmin();

  const user = {
    name: "Admin",
    email: "admin@gmail.com",
    role: "admin",
  };

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const status = url.searchParams.get("order_status") as string;

  const classController = await new ClassController(request);
  const { classes, totalPages } = await classController.getStudentClasss({
    page,
    search_term,
  });

  const studentController = await new TeacherController(request);
  const { teachers } = await studentController.getTeachers({
    limit: 100,
  });

  return { classes, totalPages, search_term, user, page, teachers };
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
