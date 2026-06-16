const fs = require("fs");
const path = require("path");
const multer = require("multer");

const spaceUploadDir = path.join(__dirname, "..", "uploads", "spaces");
const circleUploadDir = path.join(__dirname, "..", "uploads", "circles");

fs.mkdirSync(spaceUploadDir, { recursive: true });
fs.mkdirSync(circleUploadDir, { recursive: true });

const createStorage = (uploadDir) =>
  multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only jpg, png, and webp images are allowed"));
  }

  return cb(null, true);
};

const uploadSpaceImages = multer({
  storage: createStorage(spaceUploadDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: "avatarImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

const uploadCircleImages = multer({
  storage: createStorage(circleUploadDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([{ name: "bannerImage", maxCount: 1 }]);

module.exports = {
  uploadSpaceImages,
  uploadCircleImages,
};
