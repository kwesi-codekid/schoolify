import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import { connectToDomainDatabase } from "~/mongoose";
import AdminController from "~/controllers/AdminController";

export default class FeatureController {
  private request: Request;
  private Feature: any;

  /**
   * Initialize a FeatureController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;

    return (async (): Promise<FeatureController> => {
      await this.initializeModels();
      return this;
    })() as unknown as FeatureController;
  }

  private async initializeModels() {
    const { Feature } = await connectToDomainDatabase(
      process.env.CENTRAL_DOMAIN as string
    );

    this.Feature = Feature;
  }

  /**
   * Get all feature requests
   * @param param0 null
   * @returns list of features
   */
  public getFeatureRequests = async ({
    search_term,
    page,
  }: {
    search_term: string;
    page: number;
  }) => {
    try {
      const limit = 10;
      const skipCount = (page - 1) * limit;

      // Define a search filter based on the search_term

      const searchFilter = search_term
        ? {
            $or: [
              {
                title: {
                  $regex: new RegExp(
                    search_term
                      .split(" ")
                      .map((term) => `(?=.*${term})`)
                      .join(""),
                    "i"
                  ),
                },
              },
              {
                description: {
                  $regex: new RegExp(
                    search_term
                      .split(" ")
                      .map((term) => `(?=.*${term})`)
                      .join(""),
                    "i"
                  ),
                },
              },
            ],
          }
        : {};

      // Find feature requests that match the search filter
      const featureRequests = await this.Feature.find(searchFilter)
        .skip(skipCount)
        .limit(limit);

      // Count the total number of matching feature requests for pagination
      const totalCount = await this.Feature.countDocuments(searchFilter);
      const totalPages = Math.ceil(totalCount / limit);

      return { featureRequests, totalPages };
    } catch (error) {
      console.error("Error retrieving feature requests:", error);
    }
  };

  public getUserRequests = async ({ user }: { user: string }) => {
    try {
      const featureRequests = await this.Feature.find({ user });
      return featureRequests;
    } catch (error) {
      console.error("Error retrieving carts:", error);
    }
  };

  /**
   * Request a new feature
   * @param params name
   */
  public create = async ({
    user,
    title,
    description,
    request_type,
  }: {
    user: string;
    title: string;
    description: string;
    request_type: string;
  }) => {
    const feature = await this.Feature.create({
      user, // send full user object since its going into the central database which have no connection to the user database in individual databases
      title,
      description,
      request_type,
    });

    return feature;
    //   return json(
    //     {
    //       errors: { name: "Product already exists" },
    //       fields: { name, price, description, category },
    //     },
    //     { status: 400 }
    //   );
  };

  /**
   * update an existing feature request
   * @param params name
   */
  public update = async ({
    _id,
    user,
    title,
    description,
    request_type,
  }: {
    _id: string;
    user: string;
    title: string;
    description: string;
    request_type: string;
  }) => {
    try {
      await this.Feature.findOneAndUpdate(
        { _id, user },
        {
          title,
          description,
          request_type,
        }
      );
      return redirect(`/console/feature-requests`);
    } catch (error) {
      return json(
        {
          status: "error",
          message: "You can't update this request!",
        },
        { status: 400 }
      );
    }
  };

  /**
   * Upvote a feature
   * @param param0 featureId
   * @returns Feature
   */
  public upvoteFeature = async ({ featureId }: { featureId: string }) => {
    const adminController = await new AdminController(this.request);
    const adminId = await adminController.getAdminId();

    // Find the feature by its ID
    const feature = await this.Feature.findById(featureId);

    if (!feature) {
      // Handle the case where the feature doesn't exist
      throw new Error("Feature not found");
    }

    // Check if the upvoter's ID is not already in the upvotes array
    const isUpvoted = feature.upvotes.some(
      (upvote) => upvote.user.toString() === adminId
    );

    if (!isUpvoted) {
      // If the upvoter hasn't already upvoted, add their upvote
      feature.upvotes.push({ user: adminId });
      await feature.save();
    }

    return feature;
  };

  /**
   * Delete an item from the feature-requests
   * @param id String
   * @returns null
   */
  public delete = async ({ id }: { id: string }) => {
    // delete entry
    try {
      await this.Feature.findByIdAndDelete(id);
      return json(
        { status: "success", message: "Product deleted successfully" },
        { status: 200 }
      );
    } catch (err) {
      return json(
        { status: "error", message: "error occured" },
        { status: 400 }
      );
    }
  };
}
