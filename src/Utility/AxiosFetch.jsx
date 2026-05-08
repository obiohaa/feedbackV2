import axios from "axios";
const origin = import.meta.env.VITE_ORIGIN;

const AxiosFetch = axios.create({
  baseURL: origin,
  withCredentials: "true",
  headers: {
    "Content-Type": "application/json",
  },
});

// export default axiosFetch;
export { AxiosFetch };
