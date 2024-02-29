import CustomTable from "~/components/custom/CustomTable";
import AdminLayout from "~/layouts/AdminLayout";
import { useState } from "react";

const AdminStudentsManagement = () => {
  const items = [
    {
      id: 1,
      name: "John Doe",
      email: "jdoe@gmail.com",
      phone: "1234567890",
      class: "Class 1",
      section: "A",
    },
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

  const [editRecord, setEditRecord] = useState(null);

  return (
    <AdminLayout pageTitle="Student Management">
      <section className="p-4">
        <CustomTable
          items={items}
          totalPages={1}
          columns={columns}
          addButtonText="Register Student"
          editRecord={editRecord}
          setEditRecord={setEditRecord}
        />
      </section>
    </AdminLayout>
  );
};

export default AdminStudentsManagement;
