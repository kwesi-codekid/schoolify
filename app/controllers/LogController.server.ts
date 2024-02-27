// export default class LogController {
//   private Order: any;

//   /**
//    * Initialize a LogController instance
//    * @returns this
//    */
//   constructor() {
//     console.log("Log Class");
//   }

//   public async create({
//     employee,
//     action,
//     order,
//     product,
//   }: {
//     employee: string;
//     action: string;
//     order?: string;
//     product?: string;
//   }) {
//     await Log.create({
//       employee,
//       action,
//       order,
//       product,
//     });

//     return true;
//   }

//   public async getLogs({
//     page,
//     employee,
//     to,
//     from,
//   }: {
//     page: number;
//     employee?: string;
//     to: string;
//     from: string;
//   }) {
//     const fromDate = from ? new Date(from) : new Date();
//     fromDate.setHours(0, 0, 0, 0);
//     const toDate = to ? new Date(to) : new Date();
//     toDate.setHours(23, 59, 59, 999);

//     const limit = 10; // Number of logs per page
//     const skipCount = (page - 1) * limit;

//     const searchFilter: any = employee
//       ? {
//           $or: [{ employee: employee }],
//         }
//       : {};

//     // Add date range to the search filter
//     searchFilter.createdAt = {
//       $gte: fromDate,
//       $lte: toDate,
//     };

//     const logs = await Log.find(searchFilter)
//       .skip(skipCount)
//       .limit(limit)
//       .populate("employee")
//       .sort({ createdAt: "desc" })
//       .exec();

//     const totalLogsCount = await Log.countDocuments(searchFilter).exec();
//     const totalPages = Math.ceil(totalLogsCount / limit);

//     return { logs, totalPages };
//   }

//   allEmployeeLogs = async ({ user }: { user: string }) => {
//     // const limit = 10;
//     // const skipCount = (page - 1) * limit;
//     //
//     // const totalOrdersCount = await Order.countDocuments({}).exec();
//     // const totalPages = Math.ceil(totalOrdersCount / limit);

//     try {
//       const orders = await this.Order.find({ user })
//         // .skip(skipCount)
//         // .limit(limit)
//         .populate({
//           path: "orderItems.product",
//           populate: {
//             path: "images",
//             model: "images",
//           },
//         })
//         .populate("user")
//         .exec();

//       return orders;
//     } catch (error) {
//       console.error("Error retrieving orders:", error);
//     }
//   };
// }

console.log("something");
