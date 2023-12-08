import mongoose from "mongoose";

// User Schema Starts From Here
const UserSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    email: {
        type: String,
        unique: true,
        dropDups: true
    },
    password: String,
    adhar:String,
    panCard: String,
    accountNumber: String,        
    customerId: String,
    referredBy: String,    
    address: String,
    state: String,
    district: String,
    dob:Number,   
    fatherName: String,
    profileImage: String,
    occupation: String,
    qualification: String,
    cscCode: String,
    region: String,
    status: Number, // 0- sleep, 1-active, 2-block
}, { timestamps: true });

const User = mongoose.model('users', UserSchema)

export default User