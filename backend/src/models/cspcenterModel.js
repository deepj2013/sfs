import mongoose from "mongoose";

// csp Schema Starts From Here
const cspSchema = new mongoose.Schema(
  {
    cspCode: {
        type: String,
        index: true,
        unique: true,
        required: [true, 'cspCode is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        unique: true,
        index: true,
        dropDups: true,
        required: [true, 'Email is required'],
    },
    mobile: {
        type: Number,
        index: true,
        unique: true,
        dropDups: true,
        required: [true, 'Mobile number is required'],
    },
    status: {
        type: Number,
        required: [true, 'Status is required'], // 0 - initial, 1 - active, 2 - suspended, 3 - closed
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    fathername: {
        type: String,
        required: [true, 'Father\'s name is required'],
    },
    zipCode: {
        type: Number,
        required: [true, 'Zip code is required'],
    },
    dob: { type: Number, required: [true, 'dob is required']},
    // personal detail
    gender: { type: String, default: null },
    centerName: { type: String, default: null },
    Qualification: { type: String, default: null },
    socialCateogry: { type: String, default: null },
    // Address detail
    address: { type: String, default: null },
    city: { type: String, default: null },
    districtCode: { type: Number, default: null },
    district: { type: String, default: null },
    stateCode: { type: Number, default: null },
    state: { type: String, default: null },
    contrycode: { type: Number, default: null },
    contry: { type: String, default: null },
    // Financial Document
    panNumber: { type: String, default: null },
    adhar: { type: String, default: null },
    gst: { type: String, default: null },
    accountNo: { type: String, default: null },
    ifscCode: { type: String, default: null },
    bankName: { type: String, default: null },
    upiId: { type: String, default: null },
    activateDate: { type: Number, default: null },
    
  },
  { timestamps: true }
);

const cspcenter = mongoose.model("cspcenter", cspSchema);

export default cspcenter;
