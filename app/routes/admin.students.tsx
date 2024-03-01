import CustomTable from "~/components/custom/CustomTable";
import CustomInput from "~/components/custom/CustomInput";
import CustomSelect from "~/components/custom/CustomSelect";
import CustomDatePicker from "~/components/custom/CustomDatepicker";

import AdminLayout from "~/layouts/AdminLayout";
import { useState } from "react";

const AdminStudentsManagement = () => {
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
