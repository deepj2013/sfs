import APIError, { HttpStatusCode } from "../exceptions/ErrorHandler.js";
import Token from "../models/tokenModel.js";
import jwt from "jsonwebtoken";
import {
  comparePassword,
  encryptPassword,
} from "../helpers/encryption/encryption.js";
import {getCspIdByCspCodeService} from "./cspServices.js"
import cspcenter from "../models/cspcenterModel.js";

//#region Generate JWT Token
export const generateTokenService = async (userId) => {
  try {
    //generate new token
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let generatedTime = new Date().getTime();
    let tokenExpiryTime = generatedTime + 24 * 60 * 60 * 1000; // Token Expires In 1 Day

    let data = {
      userId: userId,
      tokenExpiryTime: tokenExpiryTime,
    };

    const token = jwt.sign(data, jwtSecretKey);

    // Deleting Previous Token
    await Token.findOneAndDelete({ userId: userId });

    // Creating Token Object To Store In DB
    let tokenObject = {
      userId: userId,
      token: token,
      expiresAt: tokenExpiryTime,
    };

    let tokenData = await Token.create(tokenObject);
    await tokenData.save();

    // Resolve Promise
    return Promise.resolve();
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

//#region Get Token Of User
export const getTokenOfUserService = async (userId) => {
  try {
    //#region Token Pipeline
    let tokenPipeline = [
      {
        $match: {
          userId: userId,
        },
      },
    ];
    //#endregion

    let res = await Token.aggregate(tokenPipeline);
    if (res.length > 0) {
      return res[0];
    } else {
      return null;
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
//#endregion


//#region create CSP Service
export const cspCreateService = async (requestData) => {
  try {
    
    let { name, email, mobile, password, fathername, zipCode, dob } = requestData;
    // Convert email to lowercase to ensure case-insensitive matching
    email = email.toLowerCase();
    // Check if an account with the same email or mobile already exists
    let existingUser = await cspcenter.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });
    // If an existing user is found, throw a custom error
    if (existingUser) {
      let existingField = existingUser.email === email ? "email" : "mobile";
      throw new APIError(
        "BAD_INPUT",
        HttpStatusCode.BAD_INPUT,
        true,
        `The ${existingField} is already used with another account. Please use a different ${existingField}.`
      );
    }

    let cspCode = null;

    while (cspCode == null) {
      cspCode = await generateNewcspCodeService();
    }

    password = await encryptPassword(password);

    let cspObject = {
      cspCode: cspCode,
      name: name,
      email: email,
      mobile: mobile,
      password: password,
      status: 0,
      fathername: fathername,
      zipCode: zipCode,
      dob : dob
    };
    let csp = await cspcenter.create(cspObject);
    
    return csp;
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

//#region Generate New Referral Code Service
export const generateNewcspCodeService = async () => {
    try {
        let random = Math.floor(10000 + Math.random() * 90000)

        // Verifying Generated Referral Code
        const isFound = await getCspIdByCspCodeService(random.toString())

        if (isFound == null) {
            return random
        }
        else {
            return null
        }
    } catch (error) {
        throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
    }
}
//#endregion