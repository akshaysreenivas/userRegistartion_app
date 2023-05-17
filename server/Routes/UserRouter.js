const router = require("express").Router();
// importing functions 
const { register, updateProfilePhoto, changePassword, editProfile, getUserProfile } = require("../Controllers/UserController");
const upload = require("../Middleware/multer");
const authentication = require("../middleware/authentication");


// routes  
router.get("/userDetails", authentication, getUserProfile);
router.post("/register", upload.single("image"), register);
router.post("/upload_image", authentication, upload.single("image"), updateProfilePhoto);
router.post("/changePassword", authentication, changePassword);
router.post("/updateDetails", authentication, editProfile);



module.exports = router;