import { connectToDomainDatabase } from "~/mongoose.server";

export default class SubscriptionController {
  private request: Request;
  private domain: string;
  private ClientDetail: any;
  private SubscriptionHistory: any;
  private connectionDetails: {
    databaseUri: string;
    _id: string;
    admin: string;
    storeName: string;
    subscription: string;
  };

  /**
   * Initialize a SubscriptionController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<SubscriptionController> => {
      await this.initializeModels();
      return this;
    })() as unknown as SubscriptionController;
  }

  private async initializeModels() {
    const { ClientDetail, SubscriptionHistory } = await connectToDomainDatabase(
      process.env.CENTRAL_DOMAIN as string
    );
    const { connectionDetails } = await connectToDomainDatabase(this.domain);

    this.ClientDetail = ClientDetail;
    this.SubscriptionHistory = SubscriptionHistory;
    this.connectionDetails = connectionDetails;
  }

  public getHistory = async () => {
    const client = await this.ClientDetail.findById(
      this.connectionDetails.admin
    ).populate("subscription");

    const currentSubcsription = await this.SubscriptionHistory.findById(
      client?.subscription
    );
    const history = await this.SubscriptionHistory.find({
      admin: this.connectionDetails.admin,
    }).sort({ createdAt: -1 });
    console.log(currentSubcsription);
    return { history, currentSubcsription };
  };

  public getCurrentPlan = async () => {
    const client = await this.ClientDetail.findById(
      this.connectionDetails.admin
    ).populate("subscription");

    const currentSubcsription = await this.SubscriptionHistory.findById(
      client.subscription
    );

    return currentSubcsription;
  };

  public completeSubscription = async ({}) => {
    console.log("sdfsdf");
  };
}
