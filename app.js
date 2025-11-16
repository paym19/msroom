require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 4400;
const session = require("express-session"); // ✅ เพิ่มบรรทัดนี้

mongoose.connect(process.env.MONGODB_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)
.then(()=> {
    console.log('Connected to MongoDb Atlas!');
})
.catch((err)=>{
    console.error('Error connecting to MongoDB Atlas:',err);
})

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// import routers
const authRoutes = require('./Routes/authRoute');
const userRoutes = require('./Routes/userRoute');
const organizationRoutes = require('./Routes/organizationRoute');
const roomRoutes = require('./Routes/roomRoute');
const reservationRoutes = require('./Routes/reservationRoute');
const notificationRoutes = require('./Routes/notificationRoute');
const logRoutes = require('./Routes/logRoute');
const uploadRoutes = require('./Routes/uploadRoute');
const passport = require('passport');
require('./config/googleAuth');

app.set('trust proxy', 1);
// ✅ ต้องอยู่ก่อน passport.initialize() และ passport.session()
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure: process.env.NODE_ENV === 'production', // true เมื่อ deploy จริง
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }// ถ้าใช้ HTTPS ให้เปลี่ยนเป็น true
}));

app.use(passport.initialize());
app.use(passport.session());



// use routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/logs', logRoutes)
app.use('/api/uploads',uploadRoutes);




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
