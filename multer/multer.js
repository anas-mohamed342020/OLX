const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {nanoid} = require('nanoid');
const multerFunction = (folderName) => {
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(file);
      const folderDist = path.join(__dirname, `../uploads/${req.user.email}/${folderName}`);
      const isExisted = fs.existsSync(folderDist);
      if (isExisted) {
        cb(null, folderDist);
      } else {
        fs.mkdirSync(folderDist, { recursive: true });
        cb(null, folderDist);
      }
    },
    filename:(req,file,cb)=>{
        const picName = `${nanoid()}_${req.user.firstName}_${req.user.lastName}_${file.originalname}`
        cb(null,picName)
    }
    
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png"
    ) {
      cb(null, true);
    } else {
      req.multerError = true;
      req.type = file.mimetype
      cb(null, false);
    }
  };
  const uploads = multer({dest:path.join(__dirname, `../uploads`),fileFilter,storage})
  return uploads;
};

module.exports = { multerFunction };
