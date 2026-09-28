import newsAPI from "../utils/apiClient";

export const getTopNews =async(category:string) => {
    const response = await newsAPI.get("/top-headlines", {
        params: {
            category,
            apiKey: process.env.NEWS_API_KEY
        }
    });
    return response.data.articles;
};