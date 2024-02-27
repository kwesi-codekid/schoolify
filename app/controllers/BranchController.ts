import { json, redirect } from "@remix-run/node";
import { connectToDomainDatabase } from "../mongoose.server";
import { commitFlashSession, getFlashSession } from "~/flash-session";

export default class BranchController {
  private request: Request;
  private domain: string;
  private Branch: any;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<BranchController> => {
      await this.initializeModels();
      return this;
    })() as unknown as BranchController;
  }

  private async initializeModels() {
    const { Branch } = await connectToDomainDatabase(this.domain);

    this.Branch = Branch;
  }

  public async createBranch({ location }: { location: string }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const existingBranch = await this.Branch.findOne({ location });

    if (existingBranch) {
      session.flash("message", {
        title: "Branch already exists",
        status: "error",
      });
      return redirect("/console/settings/shop_branches", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    // create new admin
    const branch = await this.Branch.create({
      location,
    });

    if (!branch) {
      session.flash("message", {
        title: "Error Adding branch",
        status: "error",
      });
      return redirect("/console/settings/shop_branches", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Branch Added Successful",
      status: "success",
    });
    return redirect("/console/settings/shop_branches", {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  }

  public async getBranches() {
    try {
      const branches = await this.Branch.find({}).exec();

      return branches;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getFeaturedBranches() {
    try {
      const categories = await this.Branch.find({
        featured: true,
      }).exec();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getActiveBranches() {
    try {
      const categories = await this.Branch.find({
        status: "active",
      }).exec();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async updateBranch({
    _id,
    name,
    description,
    status,
    featured,
  }: {
    _id: string;
    name: string;
    description: string;
    status: string;
    featured: string;
  }) {
    try {
      await this.Branch.findOneAndUpdate(
        { _id },
        {
          name,
          status,
          description,
          featured: featured == "true" ? true : false,
        }
      );
      return redirect(`/console/categories`, 200);
    } catch (error) {
      return json(
        {
          errors: {
            name: "Error occured while updating product branch",
            error: error,
          },
          fields: { name, status, description },
        },
        { status: 400 }
      );
    }
  }

  public deleteBranch = async (id: string) => {
    try {
      await this.Branch.findByIdAndDelete(id);
      return json({ message: "Branch deleted successfully" }, { status: 200 });
    } catch (err) {
      throw err;
    }
  };
}
