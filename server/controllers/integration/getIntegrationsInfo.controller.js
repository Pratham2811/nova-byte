import IntegratedAppsModel from "../../models/IntegratedAppsModel.js";

export async function getIntegrations(req, res, next) {
  try {
    const integratedApps = await IntegratedAppsModel.find({
      userId: req.user.id,
    })
      .lean()
      .select("userId status scope email providerAccountId provider");

    return res.status(200).json({
      success: true,
      message: "Integrations apps found",
      integratedApps,
    });
  } catch (error) {
    next(error);
  }
}
