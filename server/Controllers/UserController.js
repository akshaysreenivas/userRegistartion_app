const UserModel = require("../Models/UserModel")
const jwt = require("jsonwebtoken")
const fs = require("fs")



// creating user account  
module.exports.register = async (req, res, next) => {
    try {
        const { username, address, password, } = req.body;
        const profilePicURL = `public/${req.file.profileUrl}`
        // checking if the values are null
        if (!username || !address || !password) throw Error("All fields required");

        // checking if account already exists  
        const alreadyExist = await UserModel.findOne({
            username
        });

        if (alreadyExist) {
            throw new Error("User already exists");
        }
        const user = await UserModel.create({ username, address, password, profilePicURL });

        // creating jwt token
        const maxAge = 3 * 24 * 60 * 60;
        const createToken = (id) => {
            return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
        };
        const token = createToken(user._id);
        res.status(200).json({ status: true, message: "Login Success", token: token });

    } catch (err) {
        res.json({ message: err.message, status: false })
    }
};


// updating  profile picture  
module.exports.updateProfilePhoto = async (req, res ) => {
    try {
        // getting id of the user         
        const { _id } = req.user;
        if (!req.file) throw new Error("Can't Upload Profile Photo");

        const url = "/images/" + req.file.filename;
        const updatedUser = await UserModel.findOneAndUpdate({ _id: _id }, { $set: { profilePicURL: url } })

            // deleting the old image   
        if (req.body.oldProfileImg && updatedUser) {
            fs.unlink("public" + req.body.oldProfileImg, (err => {
                if (err) throw Error(err);
            }));
        }
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        res.json({ message: error.message, status: false })
    }
};



// changing user password    
module.exports.changePassword = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        // getting the password 
        const { password } = req.body;

        // hashing password   
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // updating user details    
        const updatedUser = await UserModel.findOneAndUpdate({ _id: _id },
            { $set: { password: hashedPassword} })

        // sending response    
        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        res.json({ message: error.message, status: false })
    }
};


// edit profile details
module.exports.editProfile = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        // getting valus from body    
        const { name, address } = req.body;
        // updating user details    
        const updatedUser = await UserModel.findOneAndUpdate({ _id: _id },
            { $set: { name, address} });
       
        // sending response    
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        res.json({ message: error.message, status: false })
    }
};

module.exports.getUserProfile = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const user = await UserModel.findOne({ _id: _id }, { password: 0 }).lean();
        res.status(200).json({ status: true, message: "success", user });
    } catch (error) {
        next(error);
    }
};

