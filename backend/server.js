const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path")

const userRoutes = require("./routes/userRoutes")
const codeRoutes = require("./routes/codeRoutes")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI) 
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Default Route

app.use("/users", userRoutes);
app.use("/snippets", codeRoutes);

app.get("/snippets/createProject", (req, res) => {
  res.send("Backend is running!");
});
// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
