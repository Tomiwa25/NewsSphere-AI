import axios from "axios";
const newsAPI = axios.create({
    baseURL: "https://gnews.io/api/v4",
    timeout:10000
});

export default newsAPI;