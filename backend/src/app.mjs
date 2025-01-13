import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.mjs";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true,limit:"16kb" }));    
app.use(express.static("public"));
app.use(cookieParser());


//import router
import userRouter from "./routes/user.routes.mjs";
import shoesRouter from "./routes/shoes.routes.mjs";


app.use("/api/v1/users",userRouter)
app.use("/api/v1/shoes", shoesRouter)

app.use(errorHandler);


export  {app}


// http://res.cloudinary.com/moinuddin/image/upload/v1707590666/lo83tqskxoqgjnkn5vpe.png