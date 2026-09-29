import { Article } from "../types/article";

interface Props{
    article:Article;
}

function  NewsCard({article}:Props){
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <img src={article.image} className="w-full h-48 object-cover" />

            <h2 className="font-bold text-xl mt-3">{ article.title }</h2>
            <p>{ article.description }</p>
        </div>
    )
}

export default NewsCard;