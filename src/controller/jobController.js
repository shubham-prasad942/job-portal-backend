const jobSchema = require("../models/jobSchema");
const ApiRes = require("../utils/ApiRes");
const ApiErr = require("../utils/ApiErr");
const userSchema = require("../models/userSchema");

const postJob = async (req, res) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    salary,
    offers,
    hiringMultipleCandidates,
    jobNiche,
    newsLettersSent,
    personalWebsiteTitle,
    personalWebsiteUrl,
  } = req.body;
  if (
    !title ||
    !jobType ||
    !location ||
    !companyName ||
    !introduction ||
    !responsibilities ||
    !qualifications ||
    !salary ||
    !jobNiche
  )
    throw new ApiErr(400, "Please provide full job details");
  let userId = req.user._id;
  const job = await jobSchema.create({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    salary,
    offers,
    hiringMultipleCandidates,
    personalWebsites:
      personalWebsiteTitle && personalWebsiteUrl
        ? {
            title: personalWebsiteTitle,
            url: personalWebsiteUrl,
          }
        : undefined,
    jobNiche,
    newsLettersSent,
    postedBy: userId,
  });
  res.status(201).json(new ApiRes(201, "New Job Created", job));
};

const getJob = async (req, res) => {
  const job = await jobSchema.find();
  res.status(200).json(new ApiRes(200, "Jobs fetched successfully", job));
};

const deleteJob = async (req, res) => {
  const id = req.params.id;
  const job = await jobSchema.findByIdAndDelete(id);
  res.status(200).json(new ApiRes(200, "Job deleted successfully", job));
};

const getSingleJob = async (req, res) => {
  const job = await jobSchema.findOne({ _id: req.params.id });
  res.status(200).json(new ApiRes(200, "Job fetched successfully", job));
};

const getMyJob = async (req, res) => {
  const userId = req.user._id;
  const jobs = await jobSchema.find({postedBy : userId})
  res.status(200).json(new ApiRes(200, "Job fetched successfully", jobs))
};

module.exports = { postJob, getJob, deleteJob, getSingleJob, getMyJob };
