import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            require:true
        },
        email:{
            type:String,
            require:true,
            unique:true
        },
        password:{
            type:String,
            require:true
        },
        verifyOtp:{
            type:String,
            default:''
        },
        verifyOtpExpiresAt:{
            type:Number,
            default:0
        },
        isAccountVerified:{
            type:Boolean,
            default:false
        },
        resetOtp:{
            type:String,
            default:''
        },
        resetOtpExpriesAt:{
            type:Number,
            default:0
        }

    },
{timestamps:true}
)
const userModel = mongoose.model('AuthUser',userSchema);
export default userModel;