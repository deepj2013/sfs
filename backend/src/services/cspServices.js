import APIError, { HttpStatusCode } from "../exceptions/ErrorHandler.js";
import cspcenter from "../models/cspcenterModel.js";
import { getTokenOfUserService, generateTokenService } from "./authServices.js";
import { comparePassword } from "../helpers/encryption/encryption.js";
import { getObjectId } from "../helpers/mongoose/mongooseHelper.js";

//#region Get UserId by Referral Code
export const getCspIdByCspCodeService = async (cspCode) => {
  try {
    let cspDetailsPipeline = [
      {
        $match: {
          cspCode: cspCode,
        },
      },
      {
        $project: {
          cspId: "$_id",
        },
      },
    ];

    let cspId = null;

    let result = await cspcenter.aggregate(cspDetailsPipeline);
    if (result.length > 0) {
      cspId = result[0].cspId;
    }

    // Resolve Promise
    return cspId;
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

//region Get Id with cspCode, Email, mobile
export const getCspIdByIdentifierService = async (cspCode, email, mobile) => {
  try {
    // Define the query based on provided arguments
    let query = {};
    if (cspCode) query.cspCode = cspCode;
    else if (email) query.email = email;
    else if (mobile) query.mobile = mobile;
    else
      throw new Error(
        "At least one identifier (cspCode, email, mobile) must be provided."
      );

    // Assuming `cspcenter` is your MongoDB collection
    // Use find with projection to return only the _id field
    let document = await cspcenter.findOne(query, { _id: 1 });

    // Check if a document was found
    if (document) {
      return document._id; // Convert ObjectId to string if necessary
    } else {
      return null; // Or handle the case where no document was found as needed
    }
  } catch (error) {
    // Handle or throw error appropriately
    throw new APIError(
      error.name,
      error.httpCode || 500, // Default to 500 if httpCode is not provided
      error.isOperational,
      error.message
    );
  }
};

//#region Admin Login Service
export const cspLoginService = async (requestData) => {
  try {
    let { userId, password } = requestData;
    let cspPipeline = [
      {
        $match: {
          $or: [
            { mobile: userId },
            { email: { $regex: new RegExp("^" + userId + "$", "i") } }, // Case-insensitive match for email
          ],
        },
      },
      {
        $project: {
          mobile: "$mobile",
          password: "$password",
          name: "$name",
          email: "$email",
          status: "$status",
          // Project the email as is, the case conversion is handled in $match
        },
      },
    ];
    let result = await cspcenter.aggregate(cspPipeline);
    if (result.length == 0) {
      throw new APIError(
        "UNAUTHORIZED_REQUEST",
        HttpStatusCode.UNAUTHORIZED_REQUEST,
        true,
        "CSP not found."
      );
    }
    let cspuserDetails = result[0];

    if (cspuserDetails.status === 0) {
      throw new APIError(
        "UNAUTHORIZED_REQUEST",
        HttpStatusCode.UNAUTHORIZED_REQUEST,
        true,
        "CSP is not activated.Please contact to administrator"
      );
    } else {
      let hashedPassword = cspuserDetails.password;
      let isPasswordMatched = await comparePassword(password, hashedPassword);
      if (isPasswordMatched) {
        // getting Token of User
        let tokenObj = await getTokenOfUserService(cspuserDetails._id);

        if (tokenObj == null || new Date().getTime() > tokenObj.expiresAt) {
          await generateTokenService(cspuserDetails._id);
          // getting Token of User
          tokenObj = await getTokenOfUserService(cspuserDetails._id);
        }
        return {
          token: tokenObj.token,
          userId: cspuserDetails._id,
          role: 2,
          expiresAt: tokenObj.expiresAt,
        };
      } else {
        throw new APIError(
          "UNAUTHORIZED_REQUEST",
          HttpStatusCode.UNAUTHORIZED_REQUEST,
          true,
          "Password does not match."
        );
      }
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

export const getCspDetailService = async (userId) => {
  try {
    console.log("userId ", getObjectId(userId));
    let result = await cspcenter.findOne({ _id: getObjectId(userId) });
    console.log(result);
    if (result.length > 0) {
      throw new APIError(
        "UNAUTHORIZED_REQUEST",
        HttpStatusCode.UNAUTHORIZED_REQUEST,
        true,
        "CSP Detail not found."
      );
    } else {
      return result;
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
