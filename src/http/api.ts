import axios from "axios";

const API_URL = `${process.env.REACT_APP_SERVER_API}/api/`

const api = axios.create({
    baseURL: API_URL
})

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;
function isIsoDateString(value: any): boolean {
    return value && typeof value === "string" && isoDateFormat.test(value);
}

export function handleDates(body: any) {
    if (body === null || body === undefined || typeof body !== "object")
        return body;

    for (const key of Object.keys(body)) {
        const value = body[key];
        if (isIsoDateString(value)) body[key] = new Date(value);
        else if (typeof value === "object") handleDates(value);
    }
}

api.interceptors.response.use(originalResponse => {
    handleDates(originalResponse.data);
    return originalResponse;
});

export default api;
