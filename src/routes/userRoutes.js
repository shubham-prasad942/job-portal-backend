const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { userRegister, userLogin, logout, getUser , updateProfile} = require("../controller/userController");
const multer = require("multer");
const {isAuthenticated} = require("../middleware/userAuth");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("resume"), asyncHandler(userRegister));
router.post("/login", asyncHandler(userLogin));
router.get("/logout", isAuthenticated ,asyncHandler(logout));    
router.get("/get", isAuthenticated, asyncHandler(getUser));
router.put("/update/profile", isAuthenticated, upload.single("resume"), asyncHandler(updateProfile));


module.exports = router;
