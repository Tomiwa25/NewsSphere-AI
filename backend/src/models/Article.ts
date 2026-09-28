import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    description: {
        type:String,
    },
    password: {
        type:String,
        required:true
    },
    content: {
        type:String,
    },
    image: {
        type:String
    },
    source: {
        type:String
    },
    author: {
        type:String
    },
    category: {
        type:String
    },
    url: {
        type:String
    },
    publishedAt: {
        type:Date
    },
    sentiment: {
        type:String
    },
},
    {
        timestamps:true
    }
)

const article = mongoose.model("Article", articleSchema);

export default article;