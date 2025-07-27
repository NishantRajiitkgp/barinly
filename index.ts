import mongoose  from "mongoose";
import express from "express";
import  jwt from "jsonwebtoken";
import {ContentModel, UserModel} from "./db";
import { usermiddleware } from "./middleware";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req,res)=>{
    const {username, password} = req.body;
    // console.log("Request: ", req.body);
    try {
        await UserModel.create({
            username,
            password
        })

        res.json({
            message: "User signed Up"
        })
    } catch(e){
        res.status(411).json({
            message: "user already exists"
        })
    }
})

app.post("/api/v1/signin",async (req,res)=>{
    const {username, password}= req.body;

    const existingUser =await UserModel.findOne({
        username,
        password
    })

    // console.log("Sign in request: ",username,password);

    if(existingUser){
        const token = jwt.sign({
            id: existingUser._id
        },JWT_SECRET)

        res.json({
            token
        })
    }else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
} )

app.post("/api/v1/content", usermiddleware,async (req,res)=>{
    const link  = req.body.link;
    const type = req.body.type;
    await ContentModel.create({  
        link,
        type,
        //@ts-ignore 
        userId: req.userId,
        tags:[]
    })

    res.json({
        message: "Content added"
    }) 
})

app.get("/api/v1/content",usermiddleware,async (req,res)=>{
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId","username")

    res.json({
        content
    })
})

app.delete("/api/v1/content", usermiddleware,async (req,res)=>{
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    })

    res.json({
        message: "Delete"
    })
})

app.listen(3000,()=>{
    console.log("The server is running in the port 3000");
})
