import axios from "axios";
import jwt_decode from "jwt-decode";
import md5 from "md5";
import { store } from "../redux/store";
import { loginSuccess, logoutSuccess } from "./userSlice";

const axiosJWT = axios.create();

const apiKey = "X5BM3w8N7MKozC0B85o4KMlzLZKhV00y";
const getRandomNonce = (num) => {
  return Math.floor(
    (Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1)
  );
};

const genSign = (params) => {
  const stime = Date.now();
  const nonce = getRandomNonce(20).toString();
  params.stime = stime;
  params.nonce = nonce;

  params.apiKey = apiKey;
  params.v = "v1";
  const sortKey = [];

  for (const key in params) {
    if (key !== "sign") {
      sortKey.push(key);
    }
  }

  sortKey.sort();
  let paramsHolder = "";

  sortKey.forEach((key) => {
    paramsHolder += key + params[key];
  });
  params.sign = md5(paramsHolder).toString();
  return "?" + new URLSearchParams(params).toString();
};

export const genURL = (params, query = {}) => {
  // return `https://backend-kfnn.onrender.com${params}${genSign(query)}`;
  return `${params}${genSign(query)}`;
};

const refreshToken = async () => {
  try {
    const res = await axios.post(`${genURL("/v1/auth/refreshToken")}`);
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

axiosJWT.interceptors.request.use(
  async (config) => {
    const user = store.getState().user.currentUser;
    let date = new Date();
    const decodeDToken = jwt_decode(user?.accessToken);
    if (decodeDToken.exp < date.getTime() / 1000) {
      try {
        const data = await refreshToken();
        if (data?.code === 403 || data?.code === 401) {
          store.dispatch(logoutSuccess());
        } else {
          const refreshUser = {
            ...user,
            accessToken: data.accessToken,
          };
          store.dispatch(loginSuccess(refreshUser));
          config.headers["token"] = "Bearer " + data.accessToken;
          return config;
        }
      } catch (error) {
        console.log(error);
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axiosJWT;
