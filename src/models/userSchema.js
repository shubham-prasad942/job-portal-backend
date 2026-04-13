const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minLength: [3, "firstname must be at least 3 characters long"],
    maxLength: [15, "firstname must be at most 15 characters long"],
  },
  lastname: {
    type: String,
    required: true,
    minLength: [3, "lastname must be at least 3 characters long"],
    maxLength: [15, "lastname must be at most 15 characters long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    minLength: [10, "Phone number must be at least 10 characters long"],
    maxLength: [10, "Phone number must be at most 10 characters long"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be at least 8 characters long"],
  },
  address: {
    type: String,
    required: true,
  },
  niches: {
    type: String,
    enum: [
      "Information Technology",
      "Healthcare",
      "Finance",
      "Education",
      "Marketing",
      "Construction",
      "Manufacturing",
      "Government",
      "Sales",
      "Design",
    ],
  },
  resume: {
    public_id: String,
    url: String,
  },
  coverLetter: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["jobseeker", "employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
