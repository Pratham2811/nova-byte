import { getUserService } from "../../services/user/getUser.service.js";

export const getUserController = async (req, res) => {
 

  try {
   

    const user = await getUserService(req.user.name);
    console.log(user);
    
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};
