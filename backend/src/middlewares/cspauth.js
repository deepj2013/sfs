import jwt from "jsonwebtoken"
import APIError, { HttpStatusCode } from "../exceptions/ErrorHandler.js";

export const cspAuth = async (req, res, next) => {
    try {
        const token = req.headers['auth-token'];
        
        if (!token) {
            throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Unauthorized Token');
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (new Date().getTime() > verify.tokenExpiryTime) {
            throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Token has been expired. Kindly Relogin!');
        }
        // if (verify.role!== 2) {
        //     throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Token is not related to any CSPId');
        // }
        req.userId = verify.userId;

        next()
    } catch (error) {
        next(error)
    }
}
