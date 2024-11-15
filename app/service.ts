import axios from "axios";

const baseURL = process.env.NASA_API_URL;

const instance = axios.create({
    baseURL: baseURL,
    params: {
        api_key: process.env.NASA_API_KEY
    }
});

export default instance;