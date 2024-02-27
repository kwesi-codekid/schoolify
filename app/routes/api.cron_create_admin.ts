import type { LoaderFunction } from "@remix-run/node";
import ClientSetupController from "~/controllers/ClientSetupController";

export const loader: LoaderFunction = async ({ request }) => {
  console.log("GET: cron_create_admin.ts");

  const clientConnections = await new ClientSetupController(request);
  const connections = await clientConnections.getConnections();

  return connections;
};
