const multer=require('multer');
const storage=multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,`${Date.now()}-${file.orginalname}`);
    },
});
const fileFilter=(req,file,cb)=>{
    const allowedTypes=['image/jpeg','image/png','image/jpg'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(new Error('Only .jpeg, .jpg and .png formats are allowed'),false);
    }
};
const upload=multer({storage,fileFilter});
module.exports=upload;