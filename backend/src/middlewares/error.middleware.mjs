// errorMiddleware.js
import { ApiError } from "../utils/apiError.mjs";
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
  });
};

export default errorHandler;
