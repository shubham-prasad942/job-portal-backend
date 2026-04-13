const appSchema = require("../models/applicationSchema");
const jobSchema = require("../models/jobSchema.js");
const ApiRes = require("../utils/ApiRes");
const ApiErr = require("../utils/ApiErr");
const uploadFile = require("../storage/storage.server");
const app = require("../app.js");
const userSchema = require("../models/userSchema.js");

const postApplication = async (req, res) => {
  const jobId = req.params.id;

  const job = await jobSchema.findById(jobId);
  if (!job) {
    throw new ApiErr(404, "Job does not exist");
  }

  const alreadyApplied = await appSchema.findOne({
    "jobSeekerInfo.id": req.user._id,
    "jobInfo.jobId": jobId,
  });

  if (alreadyApplied) {
    throw new ApiErr(400, "You have already applied for this job");
  }

  if (!req.body) {
    throw new ApiErr(400, "No data received");
  }

  const { firstname, lastname, email, phone, address, coverLetter } = req.body;

  if (!firstname || !lastname || !email || !phone || !address || !coverLetter) {
    throw new ApiErr(400, "Please fill in all required fields");
  }

  let resumeData;
  if (req.file) {
    const uploaded = await uploadFile(req.file);
    resumeData = {
      public_id: uploaded.id,
      url: uploaded.url,
    };
  }

  const application = await appSchema.create({
    jobSeekerInfo: {
      id: req.user._id,
      firstname,
      lastname,
      email,
      phone,
      address,
      coverLetter,
      role: "jobseeker",
      resume: resumeData,
    },
    employerInfo: {
      id: job.postedBy,
      role: "employer",
    },
    jobInfo: {
      jobId: jobId,
      jobTitle: job.title,
    },
  });

  res
    .status(201)
    .json(new ApiRes(201, "Application submitted successfully", application));
};

const employerApplication = async (req, res) => {
  const id = req.user._id;
  const applications = await appSchema.find({
    "employerInfo.id": id,
    "deletedBy.employer": false,
  });
  res
    .status(200)
    .json(new ApiRes(200, "Applications fetched successfully", applications));
};

const jobSeekerApplication = async (req, res) => {
  const id = req.user._id;
  const application = await appSchema.find({
    "employerInfo.id": id,
    "deletedBy.jobseeker": false,
  });
  res.status(200).json(200, "Applications fetched successfully", application);
};

const deleteApplication = async (req, res) => {
  const id = req.params.id;
  const application = await appSchema.findByIdAndDelete(id);
  if (!application) throw new ApiErr(404, "Application does not exist");
  res.status(200).json(new ApiRes(200, "Application deleted successfully"));
};

const getMyApplication = async (req, res) => {
  const userId = req.user._id;
  const applications = await appSchema.find({ "employerInfo.id": userId });
  res
    .status(200)
    .json(new ApiRes(200, "Application fetched successfully", applications));
};

module.exports = {
  postApplication,
  employerApplication,
  jobSeekerApplication,
  deleteApplication,
  getMyApplication,
};
