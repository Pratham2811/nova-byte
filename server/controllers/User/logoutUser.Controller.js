export const logoutUserController = (req, res, next) => {
  try {
  res.clearCookie('token', { path: '/' }); 
    return res.status(200).json({ status: 'success', message: 'Logged out' }) 
  } catch (error) {
    console.log("Error From the logout", error);
  }
};
