const multer = require("multer");
const uuid = require("uuid");
const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const app = express();
const port = 15544;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("destination");
    const locals = req.res.locals;
    const __filePath = `./public/uploads`;
    const userPath = path.join(__dirname, __filePath);
    fs.ensureDirSync(userPath);
    cb(null, userPath);
  },
  filename: function (req, file, cb) {
    console.log("filename");
    const locals = req.res.locals;
    const fileInfo = path.parse(file.originalname);
    locals["__fileExt"] = fileInfo.ext;
    cb(null, uuid.v4() + fileInfo.ext);
  },
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("req", req.file); // req.file undefined,File name does not exist, but the file does exist. This request will not go through the destination function and filename function processing
  res.send("upload success");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
