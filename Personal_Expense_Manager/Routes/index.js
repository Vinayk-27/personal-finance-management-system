import express from 'express'
import mongoose, { Schema } from 'mongoose';
import { Link } from 'react-router-dom';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Load environment variables from .env file



const saltRounds = 10;
const router = express.Router();
const userSchema = new mongoose.Schema({
    username:{type:String , required:true},
    email:{type:String, required:true},
    password:{type:String,required:true}
})

const Login_details = mongoose.model('Login_details', userSchema);

router.post('/signup',async (req,res)=>{
    
        const existingUser =  await Login_details.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false,message: "User already exists. Please login." });
        }
        
        console.log(req.body);
       

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = new Login_details({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({ success: true, message: "User registered successfully" });

    
})
router.post('/login', async (req, res) => {
    try {
        const user = await Login_details.findOne({ email: req.body.email });
      
        
        if (!user) {
            return res.status(403).json({ message: "Invalid email ", success: false });
        }

        // Use the password from the request body and compare it with the stored hash
        const isPassEqual = await bcrypt.compare(req.body.password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: "Invalid password", success: false });
        }

        // If authentication is successful, create the JWT token
        console.log('JWT_SECRET:', process.env.JWT_SECRET);

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return the response with the token and user data
        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken:jwtToken,
            email: user.email,
            _id:user._id,
            username: user.username
        });
    } catch (err) {
        console.error("Error during login:", err); // Log the error for debugging
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});

export default router;




// 201 for successful signup
// 400 if the user already exists
// 500 for server error