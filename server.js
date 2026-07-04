require("dotenv").config();

const express    = require("express");
const session    = require("express-session");
const passport   = require("passport");
const mongoose   = require("mongoose");
const MongoStore = require("connect-mongo");
const morgan     = require("morgan");
const path       = require("path");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

require("./src/utils/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user      = req.user || null;
  res.locals.botInvite = process.env.BOT_INVITE_URL;
  next();
});

app.use("/",         require("./src/routes/index"));
app.use("/auth",     require("./src/routes/auth"));
app.use("/dashboard",require("./src/routes/dashboard"));
app.use("/api",      require("./src/routes/api"));

app.use((req, res) => {
  res.status(404).render("error", { code: 404, message: "Page not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { code: 500, message: "Something went wrong" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
