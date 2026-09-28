import express from "express";
import {
    getNews
} from "../controllers/newsController";

const router = express.Router();

router.get("/category/:category", getNews);

export default router;