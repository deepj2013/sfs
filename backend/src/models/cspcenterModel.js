
import mongoose from "mongoose";

// csp Schema Starts From Here
const cspSchema = new mongoose.Schema({
    cspCode:{ type: String, index: true , unique: true},
    name: String,
    email: {
        type: String,
        unique: true,
        index: true ,
        dropDups: true
    },
    mobile: {
        type:Number,
        index: true ,
        unique: true,
        dropDups:true
    },
    status: Number, // 0 - intial , 1 - active, 2 - suspended , 3 - closed
    password: String,
    fathername: String,
    zipCode:Number,
 // personal detail  
    Dob: Number,
    gender: String,
    centerName:String,
    Qualification: String,
    socialCateogry: String,
   //Addres detail
    address:String,
    city:String,
    districtCode:Number,
    district:String,
    stateCode:Number,
    state:String,
    contrycode:Number,
    contry:String,
  //Financial Document 
    panNumber:String,
    adhar:String,
    gst: String,
    accountNo:String,
    ifscCode:String,
    bankName:String,
    upiId:String,
    activateDate: Number
}, { timestamps: true });

const cspcenter = mongoose.model('cspcenter', cspSchema)

export default cspcenter;