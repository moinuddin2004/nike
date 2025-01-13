import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.mjs";
import {
  registerUser,
  loginUser,
  logoutUser,
  // refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  getAllUser,
  deleteUser,
  deleteAnyUser
  // forgotPassword
} from "../controllers/user.controller.mjs";
import { verifyJWT } from "../middlewares/auth.middleware.mjs";


const router = Router();
router.route("/register").post(registerUser);



router.route("/login").post(loginUser);
// secure route
router.route("/logout").post( verifyJWT,logoutUser);
router.route("/all-user").get( getAllUser);
// router
//   .route("/forgot-password")
//   .post( forgotPassword);
// router.route("/refresh-accessToken").post( refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/delete-account")
  .delete(verifyJWT, deleteUser);
router
  .route("/delete-user-account/:id")
  .delete(deleteAnyUser);

export default router;
