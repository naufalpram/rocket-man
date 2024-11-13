import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_NASA_API_URL;

const instance = axios.create({
    baseURL: baseURL,
    params: {
        api_key: process.env.NEXT_PUBLIC_NASA_API_KEY
    }
});

export default instance;