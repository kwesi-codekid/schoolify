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

const AdminStudentsManagement = () => {
  const { students } = useLoaderData();
  console.log(students);

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
      name: "Name",
    },
    {
      key: "email",
      name: "Email",
    },
    {
      key: "phone",
      name: "Phone",
    },
    {
      key: "class",
      name: "Class",
    },
    {
      key: "section",
      name: "Section",
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
          name="class"
          label="Class"
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
      </div>
    </div>
  );

  const [editRecord, setEditRecord] = useState(null);

  return (
    <AdminLayout pageTitle="Student Management">
      <section className="p-4 backdrop-blur-[1px]">
        <CustomTable
          items={items}
          totalPages={1}
          columns={columns}
          addButtonText="Register Student"
          createRecordFormItems={registerStudentFormItems}
          editRecord={editRecord}
          setEditRecord={setEditRecord}
        />
      </section>
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

  return { students, totalPages, search_term, user, page };
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
