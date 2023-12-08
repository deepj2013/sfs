import bcrypt from 'bcryptjs'
import {encryptPassword}  from "../helpers/encryption/encryption.js"
// import APIError, { HttpStatusCode } from "../exception/ErrorHandler.js"



// export const encryptPassword = async (password) => {
//     try {
//         var salt = bcrypt.genSaltSync(10)
//         var hash = bcrypt.hashSync(password, salt);
//         return hash
//     } catch (error) {
//         console.log(error)
//     }
// }

console.log(encryptPassword('123456'));