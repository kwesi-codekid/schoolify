import { LoaderFunction, json } from "@remix-run/node";
import ParentController from "~/controllers/ParentController";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") as string;

  const branchController = new ParentController(request);
  const { parents } = await branchController.getParents({
    search_term,
    page: 1,
    limit: 15,
  });

  return json(parents);
};
