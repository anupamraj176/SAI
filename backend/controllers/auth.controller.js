import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSendCookie } from "../utils/generateTokenAndSendCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour
    });

    await user.save();

    // Generate JWT and cookie
    generateTokenAndSendCookie(res, user._id);

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please verify your email to activate your account.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try{
        const user = await User.findOne({
            verificationToken : code,
            verificationTokenExpiresAt : {$gt : Date.now()}
        })
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid or expired verification code"
            })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email,user.name);
        res.status(200).json({
            success : true,
            message : "Email verified successfully"
        });
    }
    catch(err){
        console.error("Email verification error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};  


export const login = async (req, res) => {
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }
        const isPasswordValid = await bcrypt.compare(password,user.password); 
        if(!isPasswordValid){
            return res.status(400).json({
                success : false,
                message : "Inavalid Credetials"
            })
        }
        generateTokenAndSendCookie(res,user._id);
        user.lastLogin = Date.now();
        await user.save();
        res.status(200).json({
            success : true,
            message : "Logged In Successfully",
            user : {
                ...user._doc,
                password : undefined
            }
        });
    }
    catch(err){
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success : true,
        message : "Logged Out Successfully"
    })
};
