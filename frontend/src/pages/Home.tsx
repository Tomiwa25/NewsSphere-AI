import NewsCard from "../components/NewsCard";

function Home() {
    const articles=[];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">NewsSphere AI</h1>
            <div className="grid md;grid-cols-3 gap-5 mt-6">
                {
                articles.map((article, index) => (
                    <NewsCard key={index} article={article} />
                ))}
            </div>
        </div>
    )
}

export default Home;