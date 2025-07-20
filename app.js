const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal server error' });
});

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);
const enrollmentRoutes = require('./routes/enrollmentRoutes');
app.use('/api/enroll', enrollmentRoutes);
const passwordResetRoutes = require('./routes/passwordResetRoutes');
app.use('/api/auth', passwordResetRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/event', eventRoutes);

app.get('/', (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
