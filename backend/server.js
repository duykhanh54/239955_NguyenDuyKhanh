require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));

app.use(express.json());

// Kiem tra trang thai Backend
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'HR Backend is running'
  });
});

// API quan ly nhan vien
app.use('/api/employees', employeeRoutes);

// Xu ly loi chung
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Loi may chu' });
});

// Ket noi MongoDB Atlas va khoi dong server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Chua cau hinh MONGODB_URI trong file .env');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: '239955_NguyenDuyKhanh'
    });

    console.log('Da ket noi MongoDB Atlas');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend dang chay tai cong ${PORT}`);
    });
  } catch (error) {
    console.error('Khong the khoi dong Backend:', error.message);
    process.exit(1);
  }
}

startServer();
