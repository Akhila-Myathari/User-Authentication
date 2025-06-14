import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from "../dbConfig/nodemailer.js";


export const register = async(req,res)=>{
    const {name,email,password} = req.body;
    if(!name||!email||!password){
        return res.json({success:false,message:'Missing Details'})
    }
    try{
        const existingUser = await userModel.findOne({email:email})
        if(existingUser){
            return res.json({success:false,message:"user already exist"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await userModel.create({
            name,
            email,
            password : hashedPassword
        })
        const token = jwt.sign({
            id:user._id
        },
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    );
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000
        })
       // console.log(process.env.SMTP_USER)
       // console.log(process.env.SMTP_PASS)
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: email,
            subject:"welcome to greatstack",
            text:`welcome to greatstack.your account has been created using ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success:true});
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.json({success:false,message:"email and password are required"});
    }

    try{
        const user = await userModel.findOne({email:email});
        if(!user){
            return res.json({success:false,message:"credentials are not matched"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"credentials are not matched"});
        }
        const token = await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge:7*24*60*60*1000
        });
        
        return res.json({success:true});

    }catch(error){
        return res.json({success:false,message:error.message});
    }
}

export const logout = async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({success:true,message:"Logged Out"})

    }catch(error){
        return res.json({success:false,message:error.message})
    }
}

export const sendVerifyOpt = async(req,res)=>{
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success:false,message:"Account Already Verified"})
        }
       const otp = String(Math.floor(Math.random()* 900000));
       user.verifyOtp = otp;
       user.verifyOtpExpiresAt = Date.now() + 24*60*60*1000

       await user.save();
       const mailOption = {
        from:process.env.SENDER_EMAIL,
        to:user.email,
        subject:"Account verification otp",
        text:`your OTP is ${otp}.verify your account using this otp. `
       }
       await transporter.sendMail(mailOption);
       res.json({success:true,message:"otp sent successfully."});

    }catch(err){
        return res.json({success:false,message:err.message});
    }
}

export const verifyEmail = async(req,res)=>{
    const {userId,otp} = req.body;

    if(!userId || !otp){
        return res.json({success:false,message:"Missing Details"});
    }
    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:"user not found"});
        }
        if(user.verifyOtp === '' || user.verifyOtp !==otp){
            return res.json({success:false,message:"Invalid Otp"});
        }
        if(user.verifyOtpExpiresAt < Date.now()){
            return res.json({success:false,message:"OTP expried"});
        }
        user.isAccountVerified = true;
        user.verifyOtp='';
        user.verifyOtpExpiresAt=0;
        await user.save();
        return res.json({success:true,message:'Email verified'});

    }catch(error){
        return res.json({success:false,message:error.message});
    }
}

export const isAuthenticated = async(req,res)=>{
    try{
        return res.json({success:true,message:"it is Authenticated"});
    }catch(error){
        return res.json({success:false,message:error.message});
    }
}

export const sendResetOtp = async(req,res)=>{
    const{email}=req.body;

    if(!email){
        return res.json({success:false,message:'email is required'});
    }

    try{
        const user = await userModel.findOne({email:email});
        if(!user){
            return res.json({success:false,message:'user not found'});
        }
       const otp = String(Math.floor(Math.random()* 900000));
       user.resetOtp = otp;
       user.resetOtpExpriesAt = Date.now() + 24*60*60*1000

       await user.save();
       const mailOption = {
        from:process.env.SENDER_EMAIL,
        to:user.email,
        subject:"Password Reset otp",
        text:`your OTP is ${otp}.verify your account using this otp. `
       }

       await transporter.sendMail(mailOption);
       res.json({success:true,message:"otp sent successfully."});


    }catch(error){
        return res.json({success:false,message:error.message});
    }
}

export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"all fields are mandatody"});
    }
    try{
        const user = await userModel.findOne({email:email});
        if(!user){
            return res.json({success:false,message:'user not found'});
        }
        if(user.resetOtp === "" || user.resetOtp!=otp){
            return res.json({success:false,message:"Invalid OTP"});
        }
        if(user.resetOtpExpriesAt<Date.now()){
            return res.json({success:false,message:"OTP expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpriesAt= 0;
        await user.save();
        res.json({success:true,message:"new password has been Set."});

    }catch(error){
        return res.json({success:false,message:error.message});
    }

}