export const logoutUserController = (req, res, next) => {
  try {
    res.clearCookie("userId");
    return res.status(204).json({
        status:"success",
        message:"user Logged Out Succesfully"
    });
  } catch (error) {
    console.log("Error From the logout", error);
  }
};
