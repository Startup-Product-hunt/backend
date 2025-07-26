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
const googleAuthRoute = require("./routes/loginWithGoogle");
const userRoutes = require("./routes/userRoutes");
const generalRoutes = require('./routes/generalRoute');
const productRoutes = require('./routes/productRoute');
const eventRoutes = require("./routes/eventRoutes")
const checkForAuthenticationCookie = require('./middlewares/authMiddleware')
const {authorizeRoles} = require('./middlewares/roleMiddleware')

app.use("/api/auth", authRoutes, googleAuthRoute);
app.use("/api/user",checkForAuthenticationCookie('token'), userRoutes,productRoutes);
app.use("/api/general",generalRoutes);
app.use("/api/admin",checkForAuthenticationCookie('token'),authorizeRoles(['admin']),eventRoutes)

app.get("/", (req, res) => res.send("API is running..."));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
