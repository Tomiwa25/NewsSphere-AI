import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export function useNews(category:string) {
    return useQuery({
        queryKey:[
            "news", category
        ],
        queryFn:async()=>{
            const response = await API.get(`/news/category/${category}`);
            return response.data;
        }       
    });
}