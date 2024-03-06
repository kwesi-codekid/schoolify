/* eslint-disable @typescript-eslint/no-explicit-any */
// import CustomInput from "~/components/custom/CustomInput";
// import CustomSelect from "~/components/custom/CustomSelect";
// import CustomDatePicker from "~/components/custom/CustomDatepicker";
// import UploadFileInput from "~/components/custom/upload-file-input";

// import { useAsyncList } from "@react-stately/data";
// import { PlusIcon } from "~/assets/icons/PlusIcon";

import AdminLayout from "~/layouts/AdminLayout";
import { useEffect, useState } from "react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import AdminController from "~/controllers/AdminController";
// import emptyFolderSVG from "~/assets/svgs/empty_folder.svg";
import StudentController from "~/controllers/StudentController";
import { useLoaderData } from "@remix-run/react";

const AdminStudentsManagement = () => {
  const { student, search_term, user, page } = useLoaderData();

  const [studentData, setStudentData] = useState(student);

  useEffect(() => {
    setStudentData(student);
  }, [student]);

  // table data:: useAsync logic, loading states
  // const [isLoading, setIsLoading] = useState(true);
  // const list = useAsyncList({
  //   async load() {
  //     setIsLoading(false);

  //     return {
  //       items: studentData,
  //     };
  //   },
  //   async sort({ items, sortDescriptor }) {
  //     return {
  //       items: items.sort((a, b) => {
  //         const first = a[sortDescriptor.column];
  //         const second = b[sortDescriptor.column];
  //         let cmp =
  //           (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

  //         if (sortDescriptor.direction === "descending") {
  //           cmp *= -1;
  //         }

  //         return cmp;
  //       }),
  //     };
  //   },
  // });
  // useEffect(() => {
  //   list.reload();
  // }, [studentData]);
  // end table data:: useAsync logic, loading states

  return (
    <AdminLayout pageTitle="Student Management">
      <section className="p-4 backdrop-blur-[1px]"></section>
    </AdminLayout>
  );
};

export default AdminStudentsManagement;

export const action: ActionFunction = async ({ request }) => {
  // const url = new URL(request.url);
  // const path = url.pathname + url.search;
  // const formData = await request.formData();
  // const _id = formData.get("_id") as string;
  // const firstName = formData.get("firstName") as string;
  // const lastName = formData.get("lastName") as string;
  // const gender = formData.get("gender") as string;
  // const dob = formData.get("dob") as string;
  // const studentClass = formData.get("class") as string;
  // const address = formData.get("address") as string;
  // const parent = formData.get("parent") as string;
  // const profileImage = formData.get("profileImage") as string;
  // const status = formData.get("status") as string;
  // const intent = formData.get("intent") as string;
  // const studentController = await new StudentController(request);
  // if (intent == "create") {
  //   return await studentController.createStudent({
  //     path,
  //     firstName,
  //     lastName,
  //     gender,
  //     dob,
  //     studentClass,
  //     address,
  //     profileImage,
  //   });
  // } else if (intent == "update") {
  //   return await studentController.updateStudent({
  //     _id,
  //     path,
  //     firstName,
  //     lastName,
  //     gender,
  //     dob,
  //     studentClass,
  //     address,
  //     profileImage,
  //     status,
  //   });
  // } else if (intent == "delete") {
  //   return await studentController.deleteStudent({ _id, path });
  // } else {
  //   return true;
  // }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { studentId } = params;
  const adminController = await new AdminController(request);
  const user = await adminController.getAdmin();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const studentController = await new StudentController(request);
  const student = await studentController.getStudent({
    id: studentId as string,
  });

  return { student, search_term, user, page };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Student Details | Schoolify" },
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
