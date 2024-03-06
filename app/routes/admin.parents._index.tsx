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
import ParentController from "~/controllers/ParentController";

const AdminParentsManagement = () => {
  const { parents, totalPages, search_term, user, page } = useLoaderData();

  const items = [
    // {
    //   id: 1,
    //   name: "John Doe",
    //   email: "jdoe@gmail.com",
    //   phone: "1234567890",
    //   class: "Parent 1",
    //   section: "A",
    // },
  ];

  const columns = [
    {
      key: "name",
      name: "Parent Name",
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

  const createParentFormItems = (
    <div className="flex flex-col gap-5">
      <CustomInput name="className" label="Parent Name" />
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
        label="Parent Teacher"
      />
      <CustomInput name="description" label="Description" />
    </div>
  );

  const [editRecord, setEditRecord] = useState(null);

  return (
    <AdminLayout pageTitle="Parents Management">
      <section className="p-4 backdrop-blur-[1px]">
        <CustomTable
          items={parents}
          totalPages={totalPages}
          columns={columns}
          addButtonText="New Parent"
          createRecordFormItems={createParentFormItems}
          createRecordModalSize="md"
          editRecord={editRecord}
          setEditRecord={setEditRecord}
        />
      </section>
    </AdminLayout>
  );
};

export default AdminParentsManagement;

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname + url.search;

  const formData = await request.formData();
  const _id = formData.get("_id") as string;
  const className = formData.get("className") as string;
  const classTeacher = formData.get("classTeacher") as string;
  const description = formData.get("description") as string;

  const intent = formData.get("intent") as string;
  const classController = await new ParentController(request);

  if (intent == "create") {
    return await classController.createParent({
      path,
      name: className,
      teacher: classTeacher,
      description,
    });
  } else if (intent == "update") {
    return await classController.updateParent({
      _id,
      path,
      name: className,
      teacher: classTeacher,
      description,
    });
  } else if (intent == "delete") {
    return await classController.deleteParent({ _id, path });
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

  const classController = await new ParentController(request);
  const { parents, totalPages } = await classController.getParents({
    page,
    search_term,
  });

  return { parents, totalPages, search_term, user, page };
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
