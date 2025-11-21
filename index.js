const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const checklistRoutes = require('./routes/checklistRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');
const todoRoutes = require('./routes/todoRoutes');
const authRouters = require("./routes/authRoutes");
const assignmentRoutes = require('./routes/assignmentRoutes');
const queryAssignmentRoutes = require('./routes/queryAssignmentRoutes');
const waterRoutes = require('./routes/waterelectric/waterRoutes');
const electricRoutes = require('./routes/waterelectric/electricRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const reportChecklistRoutes = require('./routes/reportChecklistRoutes');
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
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'));


app.use('/workorders', workOrderRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(checkUser);
// Default title for views to avoid EJS ReferenceError when `title` is not provided
app.use((req, res, next) => {
  res.locals.title = 'Maintenance System';
  next();
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//Routes
app.use(authRouters); //1
app.use('/', dashboardRoutes);
app.use('/reportchecklist', reportChecklistRoutes);
app.use('/checklist', requireAuth , checklistRoutes);
app.use('/report', requireAuth, reportRoutes);
app.use('/todo', requireAuth, todoRoutes);
app.use('/assignments', requireAuth, assignmentRoutes);
app.use('/queryassignments', requireAuth, queryAssignmentRoutes);
app.use('/water', requireAuth, waterRoutes);
app.use('/electric', requireAuth, electricRoutes);

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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
