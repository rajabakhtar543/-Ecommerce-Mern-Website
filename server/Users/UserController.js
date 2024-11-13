const { hashpassword, comparePassword } = require("../config/helper/authhelper")
const { UserSchema } = require("./usersModel")
const JWT = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose = require("mongoose");
const { Logger } = require("concurrently");

const registercontroller =async (req,res)=>{
    try {
        const {name,email,password,address,phone} = req.body
        //validation 
        if(!name){
            return res.send({message:'Name Is Required'})
        }
        if(!email){
            return res.send({message:'Email Is Required'})
        }
        if(!password){
            return res.send({message:'Password Is Required'})
        }
        if(!address){
            return res.send({message:'Address Is Required'})
        }
        if(!phone){
            return res.send({message:'Number Is Required'})
        }
        //check user 
        const Existinguser = await UserSchema.findOne({email})
        //existing User
        if(Existinguser){
            return   res.status(200).send({
                success:false,
                message : 'Already Registered Please Login'
            })

            }
            
        
        const hashedpassword = await hashpassword(password);
        const user = await new UserSchema({name,email,address,password:hashedpassword,phone}).save()
        res.status(200).send({
            success:true,
            message:"User registered successfully ",user
        })
     

               
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message :`error in registration ${error}`
        })
    }

}
const logincontroller = async(req,res) => {
    try {
          const {email,password} = req.body;
          if(!email || !password){
            return res.status(404).send({
                success : false,
                message : 'Invalid Email And Password'
            })
          }
          const user = await UserSchema.findOne({email})
      
  
          if(!user){
            return res.status(404).send({
                success :false,
                message: 'Invalid Email'
            })
          }
 

      const compare = await comparePassword(password,user.password)
      if (!compare){
        res.status(200).send({
            success : false,
            message:"paasword is invalid"
        })

      }
      // token
     const token = JWT.sign({_id: user._id}, process.env.SECRET_KEY,{expiresIn:'7d'})
     res.status(200).send({
       success:true,
       message : 'Login Succesfully',
       user:{"_id": user._id,
        'name':user.name,
        'phone':user.phone,
              'email':user.email,
              "address":user.address,
              "role":user.role

           
       },token

     })
          

        
    } catch (error) 
    {
        console.log(error)
    
    }

}
const updateProfileController = async (req, res) => {

    try {
      // Your code for updating profile
      const { name,address,email,phone } = req.body;
    
      const user = await UserSchema.findOne({email});
      
   
     
      const updatedUser = await UserSchema.findByIdAndUpdate(
        user._id,
        {
          name: name || user.name,
         
          address: address || user.address,
          phone: phone || user.phone,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    }
       
      catch (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          message: "Error WHile Update profile",
          error,
        });
      }
    };

    let tokenStore = {}; // Temporary in-memory store for tokens

    const ResetRequest = async (req, res) => {
        const { email } = req.body;
    
        try {
            // Find user by email
            const user = await UserSchema.findOne({ email });
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "Email not registered"
                });
            }
    
            // Generate a unique token
            const token = crypto.randomBytes(20).toString('hex');
            tokenStore[token] = email;
    
            // Create a Nodemailer transporter
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: "your-email@gmail.com",
                  pass: "your-email-password",
              },
              port: 465,
              secure: true, // true for 465, false for other ports
              logger: true, // Enable logging to see detailed debug information
              debug: true,  // Include SMTP traffic in logs
          });
          
    
            // Send email with reset link containing the token
            const resetLink = `http://localhost:3000/reset-password/${token}`;
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'Password Reset Request',
                text: `Click this link to reset your password: ${resetLink}`
            };
    
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    return res.status(500).send({
                        success: false,
                        message: 'Failed to send email',
                        error
                    });
                } else {
                    res.send({
                        success: true,
                        message: 'Password reset email sent successfully'
                    });
                }
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Server error',
                error
            });
        }
    };

const ResetPassword = (req, res) => {
const { token } = req.params;
const { newPassword } = req.body;

// Check if token is valid
const email = tokenStore[token];
if (!email) {
    return res.status(400).json({ success: false, message: 'Invalid or expired token' });
}

// Handle password update (in a real application, you would update the password in your database)
console.log(`Resetting password for email: ${email} to new password: ${newPassword}`);

// Remove token from store after password reset
delete tokenStore[token];

res.status(200).json({ success: true, message: 'Password updated successfully' });
};
const getAllusers= async(req,res)=>{
    const User = await UserSchema.find({})
    .populate('address')
     // Exclude the 'photos' field from the default selection
    .limit(12)
    .sort({ createdAt: -1 });

return res.status(200).send({
    success: true,
    message: 'All Users list',
    TotalUsers: User.length,
    User // Changed 'product' to 'products' for consistency
});
}


module.exports = {registercontroller,logincontroller,ResetPassword,ResetRequest,updateProfileController,getAllusers}