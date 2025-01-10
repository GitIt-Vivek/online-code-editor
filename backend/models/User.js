const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// .exports is a property through which we export the user model.
module.exports = mongoose.model("User", userSchema);

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzdhYmJkOTQ2NzdhYWIzN2JjMjkxNjUiLCJ1c2VybmFtZSI6IlZpdmVrIFByYWRoYW4iLCJpYXQiOjE3MzYwOTY4NDQsImV4cCI6MTczNjEwMDQ0NH0.qpUic8AC2bBrWMF-6-gl704ho_JyE-4yJRT0PlX9I6g
