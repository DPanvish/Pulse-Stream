import multer from "multer";
import path from "path";

const storage = multer.diskstorage({
    destination(req, file, cb){
        cb(null, "uploads/");
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const checkFileType = (file, cb) => {
    const filetypes = /mp4|mov|avi|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(extname && mimetype) {
        return cb(null, true);
    }else {
        cb("Error: Videos Only!");
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 100000000 }, // Limit: 100MB 
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

export default upload;