import { connectToDomainDatabase } from "../mongoose.server";

export default class PermissionController {
  private request: Request;
  private domain: string;
  private Permission: any;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<PermissionController> => {
      await this.initializeModels();
      return this;
    })() as unknown as PermissionController;
  }

  private async initializeModels() {
    const { Permission } = await connectToDomainDatabase(this.domain);

    this.Permission = Permission;
  }

  private async hasPermissions(
    userPermissions: string[],
    requiredPermission: string
  ) {
    return userPermissions.includes(requiredPermission);
  }

  public async getPermissions() {
    try {
      const permissions = await this.Permission.find({}).exec();
      return permissions;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async checkPermisssion({
    userPermmisssions,
  }: {
    userPermmisssions: string[];
  }) {
    if (await this.hasPermissions(userPermmisssions, "fdfggjhk567689")) {
      console.log("Permission Granted!");
    } else {
      console.log("Permission Denied!");
    }
  }
}
