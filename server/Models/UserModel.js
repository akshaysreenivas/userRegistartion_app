const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profilePicURL: {
        type: String
    },
});

userSchema.pre("save", async function (next) {
    try {
        const user = this
        // only hash password if passowrd is modified or new
        if (!user.isModified('password')) return next()
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error)
    }

});

//Export the model
module.exports = mongoose.model('Users', userSchema);