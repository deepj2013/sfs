import mongoose from "mongoose";

export const getObjectId = (id) => {
    return mongoose.Types.ObjectId(id);
}