const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
      destination: function (req, res, cb){
         cb(null, '/uploads');
      },
      filename: function(req, file, cb){
         cb(null, `${Date.now()}-${file.originalname}`)
      }
});

const filterFile = (req, file, cb) => {
    //   accept only image files
    if(file.mimetype.startWith('image/')){
           cb(null, true);
    }else{
         cb(new Error('Only image files are allowed'), true)
    }
}