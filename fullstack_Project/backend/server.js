const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const fieldRoutes = require('./routes/fieldRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const ruleRoutes = require('./routes/ruleRoutes');
const logRoutes = require('./routes/logRoutes');
const userRoutes = require('./routes/userRoutes');
const farmRoutes = require('./routes/farmRoutes');
const templateRoutes = require('./routes/templateRoutes'); // Import

connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Smart Farming API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/templates', templateRoutes); // Mount
app.use('/api/fields', fieldRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/logs', logRoutes);
// app.use('/api/settings', settingsRoutes); // If needed, or use auth/user routes for settings

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '127.0.0.1', () => console.log(`Server running on port ${PORT}`));
