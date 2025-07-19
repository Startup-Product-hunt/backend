# 📚 Course Selling Platform – Backend API

A **Node.js + Express + MongoDB backend** for an online course‑selling platform. It includes **user authentication (JWT)**, **role-based access control**, **course management (CRUD)**, **user enrollment**, and **search & filtering**.

---

## ✨ Features Overview

| Area          | Capabilities                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| Auth          | Register, Login (JWT), Password hashing (bcrypt), Roles (`user`, `admin`)                                      |
| Security      | JWT auth middleware, Admin guard, Helmet headers, CORS config, Basic logging (morgan)                          |
| Courses       | Create / Read / Update / Delete (admin only), Public listing & single retrieval                                |
| Enrollment    | Enroll in course, List my courses, Check enrollment status                                                     |
| Search        | Full‑text search on `title`, `description`, `category`; filtering (category, price range), sorting, pagination |
| Structure     | Modular controllers, models, routes, middleware, config separation                                             |
| Extensibility | Placeholder for payments, progress tracking, reviews, analytics, caching                                       |

---

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Auth:** JSON Web Tokens (`jsonwebtoken`)
* **Security & Utils:** bcrypt, helmet, cors, morgan, dotenv
* **Dev:** nodemon

---

## 📂 Project Structure

```
project-root/
│
├── src/
│   ├── config/
│   │   └── db.js                # Database connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   └── enrollmentController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── courseModel.js
│   │   └── enrollmentModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   └── enrollmentRoutes.js
│   ├── app.js                   # Express app & middleware hookup
│   └── server.js                # (Optional) separate entry point
│
├── .env
├── package.json
└── README.md
```

> *You may use `app.js` directly as the entry or create a `server.js` that imports `app`.*

---

## 🔧 Installation & Setup

### 1. Clone

```bash
git clone https://github.com/yourusername/course-backend.git
cd course-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/course_platform
JWT_SECRET=your_secret_key
```

### 4. Run

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server default: `http://localhost:5000`

---

## 🔐 Authentication Flow

1. **Register** (`POST /api/auth/register`) → Creates user, returns JWT
2. **Login** (`POST /api/auth/login`) → Returns JWT
3. Include the token in protected requests:

   ```http
   Authorization: Bearer <JWT_TOKEN>
   ```
4. Middleware:

   * `protect` verifies JWT & attaches `req.user`
   * `adminOnly` checks `req.user.role === 'admin'`

Passwords are hashed with `bcrypt` pre-save hook.

---

## 📘 Data Models (Simplified)

### User

```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  timestamps: true
}
```

### Course

```js
{
  title: String,
  description: String,
  price: Number,
  category: String,
  content: [ { type: 'video'|'pdf'|'quiz', url: String } ],
  createdBy: ObjectId(User),
  timestamps: true
}
```

### Enrollment

```js
{
  user: ObjectId(User),
  course: ObjectId(Course),
  paymentStatus: 'pending' | 'completed', // currently default 'completed'
  enrolledAt: Date
}
```

---

## 🔎 Search & Filtering

Implemented inside enhanced `GET /api/courses`.

**Query Parameters:**

| Param      | Type   | Description                                       | Example                      |
| ---------- | ------ | ------------------------------------------------- | ---------------------------- |
| `q`        | string | Full-text search keywords                         | `q=react hooks`              |
| `category` | string | Filter by category                                | `category=Web%20Development` |
| `minPrice` | number | Minimum price                                     | `minPrice=0`                 |
| `maxPrice` | number | Maximum price                                     | `maxPrice=100`               |
| `sort`     | string | `price`, `-price`, `new` (= newest), or any field | `sort=-price`                |
| `page`     | number | Page number (1-based)                             | `page=2`                     |
| `limit`    | number | Page size                                         | `limit=20`                   |

**Sorting logic:**

* If text search: first by relevance (`textScore`).
* Additional user-provided sort merges onto existing sort precedence.
* Default (no search & no sort): newest (`createdAt: -1`).

**Response Shape:**

```json
{
  "page": 1,
  "limit": 10,
  "total": 38,
  "totalPages": 4,
  "items": [ { "_id": "...", "title": "...", "price": 29.99, "category": "...", "score": 12.3 } ]
}
```

---

## 🧪 API Endpoints

### Auth

| Method | Endpoint             | Desc                | Access |
| ------ | -------------------- | ------------------- | ------ |
| POST   | `/api/auth/register` | Register new user   | Public |
| POST   | `/api/auth/login`    | Login & receive JWT | Public |

**Register Example:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Secret123"}'
```

**Login Example:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Secret123"}'
```

### Courses

| Method | Endpoint           | Desc          | Access |
| ------ | ------------------ | ------------- | ------ |
| GET    | `/api/courses`     | List / search | Public |
| GET    | `/api/courses/:id` | Get one       | Public |
| POST   | `/api/courses`     | Create        | Admin  |
| PUT    | `/api/courses/:id` | Update        | Admin  |
| DELETE | `/api/courses/:id` | Delete        | Admin  |

**Create Course (Admin):**

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Node Basics","description":"Intro","price":19.99,"category":"Backend","content":[{"type":"video","url":"https://example.com/v1.mp4"}]}'
```

### Enrollment

| Method | Endpoint                 | Desc                | Access             |
| ------ | ------------------------ | ------------------- | ------------------ |
| POST   | `/api/enroll/:courseId`  | Enroll user         | Authenticated User |
| GET    | `/api/enroll/my-courses` | List my enrollments | Authenticated User |
| GET    | `/api/enroll/:courseId`  | Check enrolled?     | Authenticated User |

**Enroll Example:**

```bash
curl -X POST http://localhost:5000/api/enroll/66aa9999... \
  -H "Authorization: Bearer <USER_TOKEN>"
```

---

## 🧾 Common Responses & Errors

| Scenario              | Status | JSON                                               |
| --------------------- | ------ | -------------------------------------------------- |
| Duplicate email       | 400    | `{ "message": "User already exists" }`             |
| Bad credentials       | 400    | `{ "message": "Invalid email or password" }`       |
| Missing token         | 401    | `{ "message": "No token, authorization denied" }`  |
| Invalid token         | 401    | `{ "message": "Token is not valid" }`              |
| Forbidden (not admin) | 403    | `{ "message": "Admin access only" }`               |
| Not found (course)    | 404    | `{ "message": "Course not found" }`                |
| Already enrolled      | 400    | `{ "message": "Already enrolled in this course" }` |

---

## 👤 Making an Admin User

Use `mongosh`:

```js
use course_platform
db.users.updateOne({ email: "alice@example.com" }, { $set: { role: "admin" } })
```

---

## 🧱 Indexes (Search Optimization)

Text index on `courses`:

```js
db.courses.createIndex(
  { title: "text", description: "text", category: "text" },
  { weights: { title: 5, description: 2, category: 1 }, name: "CourseTextIndex" }
)
```

Additional indexes: `{ category:1 }`, `{ price:1 }`, `{ createdAt:-1 }`.

---

## 🧪 Sample Test Script (Node Fetch)

```js
const fetch = (...a) => import('node-fetch').then(({default:f}) => f(...a));
(async () => {
  const reg = await fetch('http://localhost:5000/api/auth/register', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name:'TestUser', email:'testuser@example.com', password:'Secret123' })
  }).then(r=>r.json());
  console.log('REGISTER:', reg);

  const log = await fetch('http://localhost:5000/api/auth/login', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ email:'testuser@example.com', password:'Secret123' })
  }).then(r=>r.json());
  console.log('LOGIN:', log);

  const courses = await fetch('http://localhost:5000/api/courses?q=node', {
    headers:{ Authorization: 'Bearer '+log.token }
  }).then(r=>r.json());
  console.log('COURSES:', courses);
})();
```

---

## 🧩 Suggested Next Enhancements

| Feature           | Description                                      | Notes                                    |
| ----------------- | ------------------------------------------------ | ---------------------------------------- |
| Payments          | Integrate Stripe / Razorpay; set `paymentStatus` | Add webhook handling                     |
| Password Reset    | Token or OTP email flow                          | Requires mail service (e.g., Nodemailer) |
| Course Progress   | Track lessons completed                          | Add progress schema                      |
| Reviews & Ratings | User feedback & average rating                   | Aggregate pipeline                       |
| Caching Layer     | Redis or in-memory LRU for hot queries           | Key: serialized query params             |
| Fuzzy Search      | Atlas Search / external engine                   | Autocomplete suggestions                 |
| Admin Analytics   | Revenue, enrollments per course                  | Precompute daily snapshots               |
| Rate Limiting     | Protect auth & search endpoints                  | `express-rate-limit`                     |
| Validation        | Schema-level request validation                  | `express-validator` or `zod`             |
| CI/CD             | Automated tests & deployment                     | GitHub Actions                           |

---

## 🧪 Basic Validation Ideas (Add Later)

* Enforce password policy: length ≥ 8, letters + numbers.
* Sanitize & trim input fields.
* Limit course content array length & validate URLs.

---

## 🛡 Security Notes

* Never log raw passwords (already hashed via pre-save).
* Rotate `JWT_SECRET` in production with care (forces re-login).
* Consider short-lived access + refresh tokens for higher security.
* Use HTTPS in production; set secure cookie if moving to cookie auth.

---

## 🏗 Deployment Tips

| Concern     | Recommendation                                         |
| ----------- | ------------------------------------------------------ |
| Environment | Use separate `.env` per environment (dev/stage/prod)   |
| Logging     | Use a structured logger (pino / winston) in prod       |
| Scaling     | Horizontal scale with stateless JWT; shared DB & cache |
| Backups     | Periodic MongoDB snapshots                             |
| Monitoring  | Health check endpoint & uptime monitoring              |

---

## 📝 License

Licensed under the **MIT License**. You are free to use, modify, and distribute with attribution.

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feat/new-feature`
3. Commit changes: `git commit -m "feat: add new feature"`
4. Push: `git push origin feat/new-feature`
5. Open Pull Request

---

## 📬 Contact

For questions / improvements open an issue or reach out to the maintainer.

---

Happy building! 🚀
