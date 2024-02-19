import jwt from "jsonwebtoken"
import APIError, { HttpStatusCode } from "../exceptions/ErrorHandler.js";

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers['x-auth-token'];
        
        if (!token) {
            throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Unauthorized Token');
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (new Date().getTime() > verify.tokenExpiryTime) {
            throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Token has been expired. Kindly Relogin!');
        }
        if (verify.userId.toString() !== '65d05d430e70f27d480825fa') {
            throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'This token does not belong to admin!');
        }
        next()
    } catch (error) {
        next(error)
    }
}

