import { getUserService } from "../../services/user/getUser.service.js";

export const getUserController = async (req, res) => {
 

  try {
   
    const userId=req.user.id
    const user = await getUserService(userId);
   
    
    return res.status(200).json({
      status: "success",
       user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};
