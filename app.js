const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_1,
];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const generalRoute = require("./routes/generalRoute");
const googleAuthRoute = require("./routes/loginWithGoogle");
const checkForAuthenticationCookie = require("./middlewares/authMiddleware");
const { authorizeRoles } = require("./middlewares/roleMiddleware");

app.use("/api/auth", authRoutes, passwordResetRoutes, googleAuthRoute);
app.use("/api/courses/general", generalRoute);
app.use("/api/courses", checkForAuthenticationCookie("token"), courseRoutes);
app.use("/api/enroll", checkForAuthenticationCookie("token"), enrollmentRoutes);
app.use("/api/user", checkForAuthenticationCookie("token"), userRoutes);
app.use("/api/event", checkForAuthenticationCookie("token"), authorizeRoles(["admin"]), eventRoutes);

app.get("/", (req, res) => res.send("API is running..."));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
