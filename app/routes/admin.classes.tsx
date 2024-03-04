import CustomTable from "~/components/custom/CustomTable";
import CustomInput from "~/components/custom/CustomInput";
import CustomSelect from "~/components/custom/CustomSelect";
import CustomDatePicker from "~/components/custom/CustomDatepicker";

import AdminLayout from "~/layouts/AdminLayout";
import { useState } from "react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import AdminController from "~/controllers/AdminController";
import StudentController from "~/controllers/StudentController";
import { useLoaderData } from "@remix-run/react";
import ClassController from "~/controllers/ClassController";

const AdminClassesManagement = () => {
  const { classes, totalPages, search_term, user, page } = useLoaderData();
  console.log(classes);

  const items = [
    // {
    //   id: 1,
    //   name: "John Doe",
    //   email: "jdoe@gmail.com",
    //   phone: "1234567890",
    //   class: "Class 1",
    //   section: "A",
    // },
  ];

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
      />
      <CustomInput name="description" label="Description" />
    </div>
  );

  const [editRecord, setEditRecord] = useState(null);

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

  return { classes, totalPages, search_term, user, page };
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
