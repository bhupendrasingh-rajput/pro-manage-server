const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../Models/userModel');

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Enter all details!",
                success: false
            })
        }

       
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(404).json({
                message: "User already exists!",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const userResponse = await newUser.save();

        const token = jwt.sign({ userId: userResponse._id }, process.env.SECRET_KEY);

        res.status(200).json({
            message: "User created Successfully!",
            name: userResponse.name,
            token: token,
        });

    } catch (err) {
        console.log("Error : ", err);
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Enter all the credentials!",
                success: false
            })
        }

        const registeredUser = await User.findOne({ email });

        if (!registeredUser) {
            return res.status(404).json({
                message: "User Does not exist!",
                success: false
            })
        }

        const matchedPassword = await bcrypt.compare(password, registeredUser.password);

        if (!matchedPassword) {
            return res.status(400).json({
                message: "Unmatched Password!",
                success: false
            })
        }

        const token = await jwt.sign({ userId: registeredUser._id }, process.env.SECRET_KEY);

        res.json({
            message: "User Logged in Successfully!",
            name: registeredUser.name,
            token: token
        })

    } catch (err) {
        console.log("Error: ", err);
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, oldPassword, newPassword } = req.body;
        
        const token = req.headers.authorization;

        const decodedToken = jwt.decode(token);

        const userId = decodedToken.userId;

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized User!' });
        }

        if (name) {
            user.name = name;
        }

        if (oldPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid old password' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }


        await user.save();

        return res.status(200).json({
            message: 'Information Updated!',
            name: user.name,
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { userRegister, userLogin, updateUser };