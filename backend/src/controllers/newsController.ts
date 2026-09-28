import { Request, Response } from "express";
import { getTopNews } from "../services/newsService";

export const getNews = async( req:Request, res:Response) => {
    try{
        const category = Array.isArray(req.params.category)
            ? req.params.category[0]
            : req.params.category;

        const news = await getTopNews(category);
        res.json(news);
    } catch (error) {
        res.json({
            message: "Unable to fetch news"
        });
    }
};