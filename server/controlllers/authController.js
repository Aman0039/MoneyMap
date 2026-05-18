const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { express: "1h" });
}

//Register User

exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    //Validation check for missing feilds

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        //Check if email already exists

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "email already in use" });
        }

        //Create the new User;

        const user = await UserModel.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500)
            .json({ message: "Error registering user", error: err.message });
    }
}


//Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            id: user._id,
            user,
            toekn: generateToken(user._id),
        });
    } catch (err) {
        res.status(500)
            .json({ message: "Error registering user", error: err.message });
    }
};


// Get User info

exports.getUserInfo = async (req, res) => { 
    try {
        const user = await UserModel.findById(req.user.id).select("-password");

        if(!user) {
            return res.status(400).json({message : "User Not Found"});
        }

        res.status(200).json(user);
    } catch (error) {
        
    }
};
