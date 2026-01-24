import dbConnect from "./src/lib/mongoose.js";
import Transaction from "./src/models/Transaction.js";

import UserSubscription from "./src/models/UserSubscription.js";

async function check() {
  await dbConnect();
  const subCount = await UserSubscription.countDocuments();
  const lastSub = await UserSubscription.findOne().sort({ createdAt: -1 });

  console.log("Total UserSubscriptions:", subCount);
  console.log("Last Subscription:", JSON.stringify(lastSub, null, 2));

  process.exit(0);
}

check();
