//import utilities
import {
  encryptPassword,
  comparePassword,
} from "../helpers/encryption/encryption.js";
import APIError, { HttpStatusCode } from "../exceptions/ErrorHandler.js";
import {
  generateTokenService,
  getTokenOfUserService,
  cspCreateService
} from "../services/authServices.js";
import { getCspIdByIdentifierService } from "./cspServices.js";
//import Modals for Collections
import Admin from "../models/adminModel.js";
import cspcenter from "../models/cspcenterModel.js";
import { getObjectId } from "../helpers/mongoose/mongooseHelper.js";

//#region Admin Signup Service
export const adminSignUpService = async (requestData) => {
  try {
    let { name, mobile, email, password } = requestData;
    // Hashing Password
    password = await encryptPassword(password);
    //Preparing Object To Insert
    let adminObject = {
      name: name,
      mobile: mobile,
      email: email,
      password: password,
    };
    let admin = await Admin.create(adminObject);
    // Resolve Promise
    return admin;
  } catch (error) {
    throw new APIError(
      error.name,
      error.httpCode,
      error.isOperational,
      error.message
    );
  }
};
//#endregion

//#region Admin Login Service
export const adminLoginService = async (requestData) => {
  try {
    let { userId, password } = requestData;
    //#region User Pipeline
    let adminPipeline = [
      {
        $project: {
          mobile: "$mobile",
          password: "$password",
          name: "$name",
          email: { $toLower: "$email" },
        },
      },
      {
        $match: {
          mobile: userId,
        },
      },
    ];
    //#endregion

    let result = await Admin.aggregate(adminPipeline);
    if (result.length == 0) {
      throw new APIError(
        "UNAUTHORIZED_REQUEST",
        HttpStatusCode.UNAUTHORIZED_REQUEST,
        true,
        "Admin not found."
      );
    }
    let adminDetails = result[0];
    let hashedPassword = adminDetails.password;
    let isPasswordMatched = await comparePassword(password, hashedPassword);
    if (isPasswordMatched) {
      // getting Token of User
      let tokenObj = await getTokenOfUserService(adminDetails._id);

      if (tokenObj == null || new Date().getTime() > tokenObj.expiresAt) {
        await generateTokenService(userDetails._id);
        // getting Token of User
        tokenObj = await getTokenOfUserService(adminDetails._id);
      }

      return {
        token: tokenObj.token,
        expiresAt: tokenObj.expiresAt,
        userName: adminDetails.name,
      };
    } else {
      throw new APIError(
        "UNAUTHORIZED_REQUEST",
        HttpStatusCode.UNAUTHORIZED_REQUEST,
        true,
        "Password does not match."
      );
    }
  } catch (error) {
    throw new APIError(
      error.name,
      error.httpCode,
      error.isOperational,
      error.message
    );
  }
};

//#region Admin createcspcenter Service
export const gencspcenterService = async (requestData) => {
  try {
    const creationResult = await cspCreateService(requestData);
    let result = await activatecspcodeService(creationResult?.cspCode)
    return result
   
  } catch (error) {
    throw new APIError(
      error.name,
      error.httpCode,
      error.isOperational,
      error.message
    );
  }
};

//#region Admin activatecspcenter Service
export const activatecspcodeService = async (cspCode, email, mobile) => {
  try {
    if (!cspCode && !email && !mobile) {
      throw new Error(
        "At least one identifier (cspCode, email, mobile) must be provided."
      );
    }

    // Retrieve the CSP ID based on cspCode, email, or mobile
    let cspId = await getCspIdByIdentifierService(cspCode, email, mobile);
    if (!cspId) {
      throw new Error("CSP identifier not found.");
    }

    // Check current status before attempting to update
    const currentCsp = await cspcenter.findOne(
      { _id: getObjectId(cspId) },
      { status: 1 }
    );
    if (currentCsp && currentCsp.status === 1) {
      // CSP is already activated
      return "CSP is already activated.";
    }
    // Update the status of the CSP to 1
    let updateResult = await cspcenter.updateOne(
      { _id: getObjectId(cspId) },
      { $set: { status: 1 } }
    );

    // Check if the document was successfully updated
    if (updateResult.modifiedCount === 0) {
      throw new Error("CSP activation failed or was already active.");
    }

    // Retrieve the updated CSP document to get the cspCode
    let updatedCsp = await cspcenter.findOne(
      { _id: getObjectId(cspId) },
      { cspCode: 1, _id: 0 }
    );

    // Construct and return the success message
    if (updatedCsp) {
      return updatedCsp;
    } else {
      throw new Error("Failed to retrieve updated CSP details.");
    }
  } catch (error) {
    console.error("Error in activatecspcodeService:", error.message);
    throw error; // Re-throw the error for further handling
  }
};
