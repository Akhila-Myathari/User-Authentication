import mongoose from 'mongoose';

const dbConnect = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_STRING);
        console.log(`connected to ${conn.connection.host}`)
    }catch(err){
        console.log("mongodb connection err",err);
    }
}
export default dbConnect;