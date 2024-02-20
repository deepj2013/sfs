import { cspCreateService } from "../services/authServices.js";

//admin createCsp controller
export const cspCreateController = async (req, res, next) => {
  try {
    let requestData = req.body;
    const result = await cspCreateService(requestData);
    return res.status(200).json({ msg: "Success", result });
  } catch (error) {
    // Determine the type of error and set an appropriate status code
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    // Send a generic error message or a specific one based on the error type
    const errorMessage =
      statusCode === 400 ? error.message : "An error occurred on the server.";
    return res.status(statusCode).json({ error: errorMessage });
  }
};
