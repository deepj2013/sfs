
import mongoose from "mongoose";

// Admin Schema Starts From Here
const AdminSchema = new mongoose.Schema({
    
    name: String,
    email: {
        type: String,
        unique: true,
        dropDups: true
    },
    mobile: {
        type:Number,
        unique: true,
        dropDups:true
    },
    password: String,
    centerName:String,
    cscCode:String,
    State:String,
    address:String,
    panNumber:String,
    adhar:String,
    AccountNo:String,
    ifscCode:String,
    bankName:String,
    upiId:String,
}, { timestamps: true });

const Admin = mongoose.model('admins', AdminSchema)

export default Admin