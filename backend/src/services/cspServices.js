import APIError, { HttpStatusCode } from "../exceptions/ErrorHandler.js";
import cspcenter from "../models/cspcenterModel.js";

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
      return document._id // Convert ObjectId to string if necessary
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
