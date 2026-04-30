const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const taskRoutes = require("./routes/taskroutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ ROUTES
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", require("./routes/reportRoutes"));

// ✅ MONGODB CONNECTION
mongoose.connect(
  "mongodb://test:test123@ac-d131eiu-shard-00-00.zghiff5.mongodb.net:27017,ac-d131eiu-shard-00-01.zghiff5.mongodb.net:27017,ac-d131eiu-shard-00-02.zghiff5.mongodb.net:27017/gamifiedTodo?ssl=true&replicaSet=atlas-10o42g-shard-0&authSource=admin&retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ✅ SERVER START
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
