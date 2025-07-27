import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL as string);

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true  }
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

export const ContentModel = model("Content", ContentSchema);