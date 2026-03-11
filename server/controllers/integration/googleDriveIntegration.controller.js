import { OAuth2Client } from "google-auth-library";
import IntegratedAppsModel from "../../models/IntegratedAppsModel.js";
const client = new OAuth2Client({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirectUri: "http://localhost:80/api/integrations/google-drive/callback",
});

export async function googleDriveIntegrationController(req, res, next) {
  try {
    const authUrl = await client.generateAuthUrl({
      scope: [
        "https://www.googleapis.com/auth/drive.readonly",
        "profile",
        "email",
      ],
      prompt: "consent",
      access_type: "offline",
      redirect_uri:
        "http://localhost:80/api/integrations/google-drive/callback",
    });
    return res.status(200).json({
      success: true,
      message: "auth Url sent",
      authUrl,
    });
  } catch (error) {
    console.log(error);
  } finally {
  }
}
export async function googleDriveIntegrationCallbackController(req, res) {
  try {
    const { code } = req.query;

    const { tokens } = await client.getToken(code);

    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    const googleUser = await userInfoRes.json();

    const user = req.user;

    await IntegratedAppsModel.findOneAndUpdate(
      {
        userId: user.id,
        provider: "google-drive",
        providerAccountId: googleUser.id,
      },
      {
        email: googleUser.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expiry_date,
      },
      { upsert: true, new: true },
    );

    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { type: "GOOGLE_DRIVE_CONNECTED" },
              "*"
            );
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);

    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { type: "ERROR_CONNECTING_DRIVE" },
              "*"
            );
            window.close();
          </script>
        </body>
      </html>
    `);
  }
}
