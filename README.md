# Course Selling Platform – Backend

Node.js + Express + MongoDB backend for selling courses. Provides JWT auth (HTTP‑only cookie), role-based access (user/admin), course CRUD (admin), enrollment, search/filter, and password reset via email OTP.

## Stack

Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Nodemailer, Helmet, CORS, Morgan, cookie-parser.

## Features

* **Auth**: Register, Login (JWT in httpOnly cookie), Logout, Role (user/admin).
* **Courses**: Public list & detail; admin create/update/delete.
* **Enrollment**: User enrolls, list own courses, check enrollment.
* **Search**: Text search + filters (category, price range), sort, pagination.
* **Password Reset**: Email OTP (6-digit) → verify → reset token → new password.

## Quick Start

```bash
npm install
npm run dev   # or: npm start
```

Server default: `http://localhost:5000`

## Environment (.env)

> **Do NOT commit real secrets. Replace placeholders.**

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/product-hunt
JWT_SECRET=very_secret
CLIENT_URL=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password   
SMTP_SECURE=false
EMAIL_FROM="Product Hunt <your_email@gmail.com>"
APP_NAME=Product Hunt
FRONTEND_URL=http://localhost:3000
```

## API Summary

**Auth**

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/logout`
* Password reset:

  * `POST /api/auth/forgot-password`
  * `POST /api/auth/verify-otp`
  * `POST /api/auth/reset-password`

**Courses**

* `GET /api/courses` (search + list)
* `GET /api/courses/:id`
* `POST /api/courses` *(admin)*
* `PUT /api/courses/:id` *(admin)*
* `DELETE /api/courses/:id` *(admin)*

**Enrollment**

* `POST /api/enroll/:courseId`
* `GET /api/enroll/my-courses`
* `GET /api/enroll/:courseId`


## Auth Cookie

* Cookie name: `token`
* httpOnly, `lax`, 7d expiry.
* Send `credentials: 'include'` (fetch) or `withCredentials: true` (Axios).

## Password Reset Flow (3-step)

1. `forgot-password` → email OTP (10 min).
2. `verify-otp` → returns `resetToken` (15 min).
3. `reset-password` with email + resetToken + newPassword.

## Promote Admin (dev)

```js
mongosh
use product-hunt
db.users.updateOne({ email: "user@example.com" }, { $set: { role: "admin" } })
```

## Scripts

Add to `package.json`:

```json
"scripts": { "dev": "nodemon app.js", "start": "node app.js" }
```

## Security Notes

Use HTTPS in production (`secure: true` cookies), rate-limit auth/reset routes, never log OTPs, keep `JWT_SECRET` strong.

## License

MIT
