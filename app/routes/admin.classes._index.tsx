/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomTable from "~/components/custom/CustomTable";
import CustomInput from "~/components/custom/CustomInput";
import CustomSelect from "~/components/custom/CustomSelect";

import AdminLayout from "~/layouts/AdminLayout";
import { useState } from "react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ClassController from "~/controllers/ClassController";
import { Avatar, Input, Select, SelectItem } from "@nextui-org/react";
import TeacherController from "~/controllers/TeacherController";

const AdminClassesManagement = () => {
  const { classes, totalPages, search_term, user, page, teachers } =
    useLoaderData<any>();

  const teacherItems = teachers.map((teacher: any) => ({
    label: `${teacher.firstName} ${teacher.lastName}`,
    value: teacher._id,
    id: teacher._id,
    chipColor: "primary",
  }));

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
          return items.map((item: any) => (
            <div key={item._id} className="flex items-center gap-2">
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
        name="classTeacher"
        label="Class Teacher"
        defaultKey={editRecord?.teacher}
      />
      <CustomInput
        name="description"
        label="Description"
        defaultValue={editRecord?.description}
      />
    </div>
  );

  return (
    <AdminLayout pageTitle="Classes Management">
      <section className="p-4 backdrop-blur-[1px]">
        <CustomTable
          items={classes}
          totalPages={totalPages}
          columns={columns}
          addButtonText="New Class"
          createRecordFormItems={createClassFormItems}
          createRecordModalSize="md"
          editRecordFormItems={editClassFormItems}
          editRecord={editRecord}
          setEditRecord={setEditRecord}
        />
      </section>
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
