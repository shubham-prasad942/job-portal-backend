const userSchema = require("../models/userSchema");
const ApiRes = require("../utils/ApiRes");
const ApiErr = require("../utils/ApiErr");
const bcrypt = require("bcrypt");
const uploadFile = require("../storage/storage.server");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    password,
    address,
    role,
    niches,
    coverLetter,
  } = req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !password ||
    !address ||
    !role
  ) {
    throw new ApiErr(400, "Please fill in all the required fields");
  }
  if (role === "jobseeker" && !req.file) {
    throw new ApiErr(400, "Resume is required for job seekers");
  }
  const isAlreadyExist = await userSchema.findOne({
    $or: [{ email }, { phone }],
  });
  if (isAlreadyExist) {
    throw new ApiErr(400, "User already exists");
  }
  let realResume;
  if (req.file) {
    const resumeData = await uploadFile(req.file);
    realResume = {
      public_id: resumeData.id,
      url: resumeData.url,
    };
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await userSchema.create({
    firstname,
    lastname,
    email,
    phone,
    password: hashPassword,
    address,
    role,
    resume: realResume,
    niches,
    coverLetter,
  });
  user.password = undefined;
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "10d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json(new ApiRes(201, "User registered successfully", user));
};

const userLogin = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    throw new ApiErr(400, "Please fill in all the required fields");
  }
  const user = await userSchema.findOne({ email });
  if (!user) {
    throw new ApiErr(400, "User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiErr(400, "Incorrect password");
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "10d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  user.password = undefined;
  res.status(200).json(new ApiRes(200, "User logged in successfully", user));
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.status(200).json(new ApiRes(200, "User logged out successfully"));
};

const getUser = async (req, res) => {
  const user = req.user;
  const userData = await userSchema.findOne({ _id: user._id });
  res
    .status(200)
    .json(new ApiRes(200, "User logged in successfully", userData));
};

const updateProfile = async (req, res) => {
  const user = await userSchema.findById(req.user._id);

  if (!user) {
    throw new ApiErr(404, "User does not exist");
  }

  const allowedUpdate = ["firstname", "lastname", "email", "phone", "address"];

  Object.keys(req.body).forEach((key) => {
    if (!allowedUpdate.includes(key)) {
      throw new ApiErr(400, "Invalid update field");
    }

    if (req.body[key] !== "") {
      user[key] = req.body[key];
    }
  });

  if (req.file) {
    const uploaded = await uploadFile(req.file);

    if (user.resume?.public_id) {
      await deleteFile(user.resume.public_id);
    }

    user.resume = {
      public_id: uploaded.id,
      url: uploaded.url,
    };
  }

  await user.save();

  user.password = undefined;

  res.status(200).json(
    new ApiRes(200, "User profile updated successfully", user)
  );
};

module.exports = { userRegister, userLogin, logout, getUser, updateProfile };
