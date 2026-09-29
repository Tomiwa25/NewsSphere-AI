
export const processArticle = (article:any) => {
    return {
        title:article.title,
        description:article.description || "",
        image: article.image || "",
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt
    }; 
};

