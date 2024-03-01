import { LoaderFunction, MetaFunction } from "@remix-run/node";
import AdminController from "~/controllers/AdminController.server";
import AdminLayout from "~/layouts/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout pageTitle="Dashboard">
      <h1>Admin Dashboard</h1>
    </AdminLayout>
  );
};

export default AdminDashboard;

export const loader: LoaderFunction = async ({ request }) => {
  const adminController = await new AdminController(request);
  const user = await adminController.getAdmin();
  // const statsController = new StatisticsController(request);
  // const totals = await statsController.getDashboardStats();
  return {
    // totals,
    user,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | Schoolify" },
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
