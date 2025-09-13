const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");

async function registerUser(req, res) {
    const {username , email , password} = req.body;
    
    if(!email || !password || !username) {
        return res.status(400).json({
            message : "Enter your Credentials"
        })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or : [{email} , {username}]
    })

    if(isUserAlreadyExist) {
        return res.status(422).json({
            message : "Email & Username already Exist"
        })
    }

    const hashPassword = await bcrypt.hash(password , 10);

    const user = await userModel.create({
        username,
        email,
        password : hashPassword
    })

    const token = jwt.sign({
        _id : user._id
    }, jwt_secret);

    res.cookie("token" , token);

    res.status(201).json({
        message : "User Created Successfully",
        user : {
            email,
            username,
            token
        }
    })
}

async function loggedInUser(req, res) {
    const {email , username , password} = req.body;

    if(!email || !password ) {
        return res.status(400).json({
            message : "Enter your credentials"
        })
    }

    const user = await userModel.findOne({
        $or : [{username} , {email}]
    })

    if(!user) {
        return res.status(400).json({
            message : "User Not Found"
        })
    }

    const isCorrectPassword = await bcrypt.compare(password , user.password);

    if(!isCorrectPassword) {
        return res.status(400).json({
            message : "Invalid Passoword"
        })
    }

    const token = jwt.sign({
        _id : user._id
    }, jwt_secret);

    res.cookie("token" , token);

    res.status(200).json({
        message : "User Logged In Successfully",
        token
    })

}

module.exports = {registerUser , loggedInUser}