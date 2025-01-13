import { asyncHandler } from "../utils/asyncHandlers.mjs";
import { ApiError } from "../utils/apiError.mjs";
import { prisma } from "../db/db.mjs";
// import { User } from "../models/user.models.mjs";
import { uploadOnCloudinary } from "../utils/cloudinary.mjs";
import { ApiResponse } from "../utils/apiResponse.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import mongoose from "mongoose";
// import nodemailer from "nodemailer";

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend
  const { fullName, email, password } = req.body;
  
  console.log(fullName, email, password);
  

  // Check if fields are empty
  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the user already exists (only by email)
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User with the provided email already exists");
  }

  // Handle avatar upload (if avatar is provided)
  let avatarUrl = null;
  if (req.files && req.files.avatar) {
    try {
      const avatar = req.files.avatar[0]; // Assuming the avatar is in req.files.avatar[0]
      const result = await cloudinary.uploader.upload(avatar.path, {
        folder: "avatars", // You can customize the folder name
      });
      avatarUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }
  }

  console.log(password);
  

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user in the database (no username field)
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });

  // Retrieve the user without password
  const createdUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      fullName: true,
      email: true,
    },
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Respond with the created user details (excluding password)
  return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});


//

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie

  const { email, password } = req.body;
  console.log(email);

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  // const user = await User.findOne({
  //   $or: [{ username }, { email }],
  // });

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // console.log(user.password);
  // console.log(password);
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  // const loggedInUser = await User.findById(user._id).select(
  //   "-password -refreshToken"
  // );
  const loggedInUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      fullName: true,
      email: true,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.id,
    },
  });

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(newPassword, salt);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }
  const updateUser = await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   // console.log(email);
//    const user= await prisma.user.findFirst({
//      where: {
//       email
//     }
//   })
// let userId=user.id
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
//   const token =await bcrypt.hash(userId.toString(), 10);

//   if (!token) {
//     throw new ApiError(500, "Error while generating reset password token");
//   }
//   let text = `Subject: Reset Your Password

// Dear ${user.fullName},

// You recently requested to reset your password for your account. Please click the link below to reset your password:

// ${`http://localhost:5173/reset-password/${user}/${token}`}

// If you did not request a password reset, please ignore this email. This link is valid for [expiry time] hours.

// Thank you,
// MOIN'S Team"`;
// // console.log(process.env.EMAIL_PASSWORD);

//   var transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   var mailOptions = {
//     from: `<${process.env.EMAIL}>`,
//     to: email,
//     subject: "Reset Your Password",
//     text: text,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error.message);
//     } else {
//      return res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
//     }
//   });
// });

const getCurrentUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      fullName,
      email,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const getAllUser = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  return res
    .clearCookie("accessToken", { secure: true, httpOnly: true })
    .status(200)
    .json(new ApiResponse(200, user, "User deleted successfully"));
});

const deleteAnyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User deleted successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  // refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  getAllUser,
  deleteUser,
  deleteAnyUser,
  // resetPassword,
  // forgotPassword,
};
