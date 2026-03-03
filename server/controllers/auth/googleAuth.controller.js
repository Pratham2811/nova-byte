import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv"
dotenv.config()
const client = new OAuth2Client({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uris: process.env.REDIRECT_URI,
});

const authURL = client.generateAuthUrl({
  scope: ["profile", "openid", "email"],
  prompt: "consent",
});
console.log(process.env.CLIENT_ID);

export async function googleAuthController(req, res) {
  try {
    res.redirect(authURL);
  } catch (error) {
    console.log(error);
  }
}
export async function googleAuthCallbackController(req, res) {
  try {
    const{code}=req.query;
    console.log(query);
    
  } catch (error) {
    console.log(error);
  }
}