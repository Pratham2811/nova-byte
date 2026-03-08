import Session from "../../models/Session.js";

export const logoutUserController = async (req, res, next) => {
  try {
    const { sessionId } = req.signedCookies;
    const deleteSession=await Session.deleteOne({userId:sessionId});
    res.clearCookie('sessionId'); 
    return res.status(200).json({ success:true, message: 'User logged out' }) 
  } catch (error) {
    next(error)
  }
};
