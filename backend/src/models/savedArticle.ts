import mongoose from "mongoose";

const savedArticleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"    
    },
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article"   
    }
}, 
{
    timestamps: true
});

const savedArticle = mongoose.model("savedArticle", savedArticleSchema);
export default savedArticle;