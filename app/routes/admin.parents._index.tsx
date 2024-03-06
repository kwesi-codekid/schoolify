/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Input } from "@nextui-org/react";

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
      key: "firstName",
      name: "First Name",
    },
    {
      key: "lastName",
      name: "Last Name",
    },
    {
      key: "title",
      name: "Title",
    },
    {
      key: "email",
      name: "Email",
    },
    {
      key: "phoneNumber",
      name: "Phone",
    },
    {
      key: "address",
      name: "Residential Address",
    },
    {
      key: "actions",
      name: "Actions",
    },
  ];

  const createParentFormItems = (
    <div className="flex flex-col gap-5">
      <CustomInput name="firstName" label="First Name" />
      <CustomInput name="lastName" label="Last Name" />
      <CustomInput name="email" label="Email" />
      <CustomInput name="phone" label="Phone" />
      <CustomInput name="title" label="Title" />

      <CustomInput name="address" label="Address" />
    </div>
  );

  const [editRecord, setEditRecord] = useState<any>(null);
  const editParentFormItems = (
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
      <CustomInput
        name="email"
        label="Email"
        defaultValue={editRecord?.email}
      />
      <CustomInput
        name="phone"
        label="Phone"
        defaultValue={editRecord?.phoneNumber}
      />
      <CustomInput
        name="title"
        label="Title"
        defaultValue={editRecord?.title}
      />

      <CustomInput
        name="address"
        label="Address"
        defaultValue={editRecord?.address}
      />
    </div>
  );

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
          editRecordFormItems={editParentFormItems}
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
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const title = formData.get("title") as string;

  const intent = formData.get("intent") as string;
  const classController = await new ParentController(request);

  if (intent == "create") {
    return await classController.createParent({
      path,
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      address,
      title,
    });
  } else if (intent == "update") {
    return await classController.updateParent({
      _id,
      path,
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      address,
      title,
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
    { title: "Parents | Schoolify" },
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
