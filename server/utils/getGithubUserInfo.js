export const getGithubUser = async (accessToken) => {
  try {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!userResponse.ok) {
      throw new Error("Failed to fetch GitHub user");
    }
    const user = await userResponse.json();
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!emailResponse.ok) {
      throw new Error("Failed to fetch GitHub emails");
    }
    const emails = await emailResponse.json();
    const primaryEmail = emails.find(
      (email) => email.primary && email.verified,
    );

    user.email = primaryEmail ? primaryEmail.email : null;

    return user;
  } catch (error) {
    console.error("GitHub user fetch error:", error);
    throw error;
  }
};
