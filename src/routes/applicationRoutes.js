const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { isAuthenticated, isAuthorized } = require("../middleware/userAuth");
const {
  postApplication,
  employerApplication,
  jobSeekerApplication,
  deleteApplication,
  getMyApplication,
} = require("../controller/appController");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/post/:id",
  isAuthenticated,
  isAuthorized("jobseeker"),
  upload.single("resume"),
  asyncHandler(postApplication),
);
router.get("/employer/get", isAuthenticated, asyncHandler(employerApplication));
router.get(
  "/jobseeker/get",
  isAuthenticated,
  asyncHandler(jobSeekerApplication),
);
router.delete("/delete/:id", isAuthenticated, asyncHandler(deleteApplication))
router.get("/get/myapp", isAuthenticated , asyncHandler(getMyApplication))


module.exports = router;
