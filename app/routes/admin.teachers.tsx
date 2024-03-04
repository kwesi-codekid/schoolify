import CustomTable from "~/components/custom/CustomTable";
import CustomInput from "~/components/custom/CustomInput";
import CustomSelect from "~/components/custom/CustomSelect";
import CustomDatePicker from "~/components/custom/CustomDatepicker";

import AdminLayout from "~/layouts/AdminLayout";
import { useEffect, useState } from "react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import AdminController from "~/controllers/AdminController";
import StudentController from "~/controllers/StudentController";
import { useLoaderData } from "@remix-run/react";
import TeacherController from "~/controllers/TeacherController";

const AdminTeachersManagement = () => {
  const { students, totalPages, search_term, user, page } = useLoaderData();

  const [studentData, setStudentData] = useState(students);

  useEffect(() => {
    setStudentData(students);
  }, [students]);

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

  const createTeacherFormItems = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10">
      {/* personal info */}
      <div className="flex flex-col gap-5">
        <CustomInput name="firstName" label="First Name" />
        <CustomInput name="lastName" label="Last Name" />
        <CustomInput name="phone" label="Phone" />
        <CustomInput name="email" label="Email" />
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
      </div>
      {/* personal info */}
      <div className="flex flex-col gap-5">
        <CustomDatePicker label="Date of Employment" name="employmentDate" />
        <CustomInput name="address" label="Address" />
        <CustomInput name="password" label="Password" />
        <CustomInput name="confirmPassword" label="Confirm Password" />
      </div>
    </div>
  );

  const [editRecord, setEditRecord] = useState(null);

  return (
    <AdminLayout pageTitle="Teachers Management">
      <section className="p-4 backdrop-blur-[1px]">
        <CustomTable
          items={studentData}
          totalPages={totalPages}
          columns={columns}
          addButtonText="Create Teacher"
          createRecordFormItems={createTeacherFormItems}
          editRecord={editRecord}
          setEditRecord={setEditRecord}
        />
      </section>
    </AdminLayout>
  );
};

export default AdminTeachersManagement;

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname + url.search;

  const formData = await request.formData();
  const _id = formData.get("_id") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const gender = formData.get("gender") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const intent = formData.get("intent") as string;
  const studentController = await new TeacherController(request);

  if (intent == "create") {
    console.log({
      firstName,
      lastName,
      gender,
      email,
      password,
      address,
      phone,
    });

    return await studentController.createTeacher({
      path,
      firstName,
      lastName,
      gender,
      email,
      password,
      address,
      phone,
    });
  } else if (intent == "update") {
    return await studentController.updateTeacher({
      _id,
      path,
      firstName,
      lastName,
      gender,
      email,
      address,
      phone,
    });
  } else if (intent == "delete") {
    return await studentController.deleteTeacher({ _id, path });
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
