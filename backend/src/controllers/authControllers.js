import { cspCreateService } from "../services/authServices.js";

//admin createCsp controller 
export const cspCreateController = async (req, res, next) => {
    try {
      let requestData  = req.body;
      const result = await cspCreateService(requestData);
      return res.status(200).json({ msg: "Success", result });
    } catch (error) {
      next(error);
    }
  };