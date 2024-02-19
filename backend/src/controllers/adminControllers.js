import { adminSignUpService, adminLoginService, gencspcenterService, activatecspcodeService } from "../services/adminServices.js";

//admin Singup controller 
export const adminSignupController = async (req, res, next) => {
  try {
    let requestData  = req.body;
    await adminSignUpService(requestData);
    return res.status(200).json({ msg: "Success" });
  } catch (error) {
    next(error);
  }
};

//admin Singup controller 
export const adminLoginController = async (req, res, next) => {
  try {
    let requestData  = req.body;
    const result = await adminLoginService(requestData);
    return res.status(200).json({ msg: "Success", result });
  } catch (error) {
    next(error);
  }
};


//admin generate CSP controller 
export const genCspController = async (req, res, next) => {
  try {
    let requestData  = req.body;
    const result = await gencspcenterService(requestData);
    return res.status(200).json({  msg: `Your CSP center created code: ${result.cspCode}  `, result  });
  } catch (error) {
    next(error);
  }
};

export const activateCspController = async (req, res, next) => {
  try {
    let requestData  = req.body;
    const result = await activatecspcodeService(requestData.cspCode, requestData.email, requestData.mobile );
    return res.status(200).json({ msg: `Your CSP center activated code: ${result.cspCode}  `, result });
  } catch (error) {
    next(error);
  }
};