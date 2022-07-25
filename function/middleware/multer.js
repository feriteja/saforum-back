const multer = require("multer");
const fs = require("fs");

const DIR = "./public/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR + "tmp/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/");
    const filename = file.originalname.split(" ").join("-").split(".")[0];
    cb(null, `${filename}-${Date.now()}.${ext[1]}`);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

module.exports = { upload };
