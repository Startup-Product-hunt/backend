const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const CLIENT_URL = process.env.CLIENT_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const qs = require("querystring");
const User = require("../models/userModel");
const setTokenCookie = require("../authService/setTokenCookie");


const redirectToGoogle = (req, res) => {
  const googleAuthURL =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid profile email`;
  res.redirect(googleAuthURL);
};

const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "Authorization code missing" });
  }

  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = response.data;

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { sub: googleId, name, email, picture } = userResponse.data;

    if (!googleId) {
      return res
        .status(400)
        .json({ message: "Google ID missing from response" });
    }

    let user = await User.findOne({ googleId });

    if (user) {
      if (user.email !== email) {
        user.email = email;
        await user.save();
      }
    } else {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        user = await User.create({
          googleId,
          name: name,
          email,
          profilePhoto: picture,
          password: null,
          role: "user",
        });
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    setTokenCookie(res, token);
    const encodedName = encodeURIComponent(user.fullName);
    const encodedEmail = encodeURIComponent(user.email);
    const encodedRole = encodeURIComponent(user.role);

    return res.redirect(
      `${CLIENT_URL}/?name=${encodedName}&email=${encodedEmail}&role=${encodedRole}`
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  googleCallback,
  redirectToGoogle,
};
