// transactionProvider.js
import { getClient } from "../config/db.js";

export async function transactionProvide(workFunction, options = {}) {
  const client = getClient();           // NO await here
  const session = client.startSession();

  try {
    const result = await session.withTransaction(
      async () => {
        // VERY IMPORTANT: await this
        return await workFunction(session);
      },
      {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" },
        ...options,
      }
    );

    return result;
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    throw error; // propagate to route
  } finally {
    await session.endSession(); // session lifecycle belongs here
  }
}
