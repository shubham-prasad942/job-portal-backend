const mongoose = require("mongoose");
const validator = require("validator");

const appSchema = new mongoose.Schema({
  jobSeekerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, "Phone number must be at least 10 characters long"],
      maxLength: [10, "Phone number must be at most 10 characters long"],
    },
    address: {
      type: String,
      required: true,
    },
    resume: {
      public_id: String,
      url: String,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["jobseeker"],
    },
  },
  employerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["employer"],
    },
  },
  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
  },
  deletedBy: {
    employer: {
      type: Boolean,
      default: false,
    },
    jobseeker: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = mongoose.model("app", appSchema);
