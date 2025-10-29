const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const checklistRoutes = require('./routes/checklistRoutes');
const homeRoutes = require('./routes/homeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const todoRoutes = require('./routes/todoRoutes');
const authRouters = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");


require("dotenv").config();
mongoose.connect("mongodb://localhost:27017/Maintenance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(checkUser);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//Routes
app.use(authRouters); //1
app.use('/', homeRoutes);
app.use('/checklist', requireAuth , checklistRoutes);
app.use('/report', requireAuth, reportRoutes);
app.use('/todo', requireAuth, todoRoutes);


app.use((req, res, next) => {
  const publicRoutes = ["/", "/login", "/signup", "/logout"];
  if (publicRoutes.includes(req.path) || req.path.startsWith("/public/")) {
    return next();
  }
  if (!req.user) {
    return res.redirect("/");
  }
  next();
});



app.listen(port, "0.0.0.0", () => {
  console.log(`http://localhost:${port}`);
});
