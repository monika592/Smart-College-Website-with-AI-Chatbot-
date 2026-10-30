// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const chatbotRouter = require("./routes/chatbot.js");
const adminRouter = require("./routes/admin.js");
const { trainFromWebsite } = require("./utils/websiteLoader.js");

dotenv.config();
const app = express();

// Create router instance
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// MongoDB connection (optional)
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/rjcollege", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("⚠️ MongoDB:", err.message));

// Admin login route
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'rjcollege2024';
  
  if (username === adminUsername && password === adminPassword) {
    res.json({
      success: true,
      message: 'Login successful'
    });
  } else {
    res.json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Add this route to your server
app.use('/api', router);

app.use("/api/chatbot", chatbotRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "admin.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Initialize chatbot
  trainFromWebsite();
  
  console.log('\n🎉 **RJ College Chatbot is Ready!**');
  console.log('\n👨‍💼 **Admin Panel available at:** http://localhost:' + PORT + '/admin');
  console.log('\n📋 **Try asking these questions:**');
  console.log('   • "Who is the principal?"');
  console.log('   • "What departments are available?"');
  console.log('   • "Tell me about IT department"');
  console.log('   • "What courses are offered?"');
  console.log('   • "How to apply for admission?"');
  console.log('   • "Contact information"');
  console.log('   • "About the college"');
  console.log('   • "Who is the president?"');
});