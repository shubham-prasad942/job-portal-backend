const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  postJob,
  getJob,
  deleteJob,
  getSingleJob,
  getMyJob,
} = require("../controller/jobController");
const { isAuthenticated, isAuthorized } = require("../middleware/userAuth");

const router = express.Router();

router.post(
  "/post",
  isAuthenticated,
  isAuthorized("employer"),
  asyncHandler(postJob),
);
router.get("/getAll", isAuthenticated, asyncHandler(getJob));
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("employer"),
  asyncHandler(deleteJob),
);

router.get("/get/myjob", isAuthenticated, asyncHandler(getMyJob));
router.get("/get/:id", isAuthenticated, asyncHandler(getSingleJob));

module.exports = router;
