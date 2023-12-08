import APIError, { HttpStatusCode } from "../exception/ErrorHandler.js"
import { comparePassword, encryptPassword } from "../helpers/encryption/encryption.js"
import Admin from "../models/adminModel.js"
import { generateTokenService, getTokenOfUserService } from "./tokenServices.js"