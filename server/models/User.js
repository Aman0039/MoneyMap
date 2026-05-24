const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null }
},
    { timestamps: true }

);

UserSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
    
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        next(error)
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;