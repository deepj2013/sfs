import {cspLoginService, getCspDetailService} from "../services/cspServices.js";

//csp login controller 
export const cspLoginController = async (req, res, next) => {
    try {
      let requestData  = req.body;
      const result = await cspLoginService(requestData);
      return res.status(200).json({ msg: "Success", result });
    } catch (error) {
      next(error);
    }
};

//csp login controller 
export const getCspDetailsController = async (req, res, next) => {
    try {
      let userId  = await req.userId;    
     const result = await getCspDetailService(userId);
      return res.status(200).json({ msg: `Get detail for ${result?.cspCode}`, result });
    } catch (error) {
      next(error);
    }
};

//csp login controller 
export const updateCspDetailsController = async (req, res, next) => {
    try {
      let requestData  = req.body;
      const result = await cspLoginService(requestData);
      return res.status(200).json({ msg: "Success", result });
    } catch (error) {
      next(error);
    }
};