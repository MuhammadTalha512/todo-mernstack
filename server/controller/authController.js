const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User");

const generateToken = (user) => {
  return Jwt.sign(
    {
      email: user.email,
      _id: user._id,
      name: user.firstName + " " + user.lastName,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
};

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const signIn =async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await UserModel.findOne({email})
        if(!user)return res.status(400).json({message:"Invalid user"})
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(201).json({message:"invalid password"})
 
        const token = generateToken(user);
        res.status(201).json({
         message: "User Login successfully",
         token,
         user: {
         id: user._id,
         name: user.firstName + " " + user.lastName,
         email: user.email,
      },
    });
    } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
    }
}

const profile =(req,res)=>{
try {
    res.status(201).json({message:"user profile", user:req.user})
} catch (error) {
    res.status(500).json({message:"error feching user profile", error})
}
}

const logout=(req,res)=>{
res.status(201).json({message:"User Logout Successfully"})
}

module.exports = { signUp, signIn, profile, logout };
