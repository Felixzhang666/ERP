import axios from "axios";
import config from "../config";
import { ElMessage } from "element-plus";
import router from "../router";
import storage from "./storage";

const NETWORK_ERROR = "Network request error, wait for a few minutes";

const instance = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
});

//request interceptors
instance.interceptors.request.use(function (config) {
  // before request's operations
  const headers = config.headers;
  if (storage.getItem("userInfo")) {
    const { token } = storage.getItem("userInfo").data || { token: "" };
    if (!headers.Authorization) headers.Authorization = "Bearer " + token; //jwt json web token
  } else {
    
  } 

  return config;
});

//reative

instance.interceptors.response.use(function (response) {
  //2xx will triger responser, what should response data do?
  const { code, msg } = response.data; // code = status code API

  if (code === 200) {
    response.data;
  } else if (code === 50001) {
    ElMessage.error(msg);
    setTimeout(() => {
      router.push("/login");
    }, 3000);
    return Promise.reject(msg);
  } else {
    ElMessage.error(msg || NETWORK_ERROR);
  }
  return response;
});

function request(options) {
  options.method = options.method || "get";
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }

  //options.mock //user config priority
 let isMock = config.mock // globe config cover
if(toString.call(options.mock) != '[object Undefined]') {
  isMock = options.mock;
}

  if (config.env === "prod") {
    instance.defaults.baseURL = config.baseApi;
  } else {
    instance.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }
  return instance(options);
}

["get", "post", "put", "delete"].forEach((item) => {
  request[item] = function (url, data, mock) {
    if(data == undefined) {
      data =  {};
    }
    if(typeof data == "boolean") {
      mock  =  data;
      data = {};
;    }
    
    //get
    return request({
      url,
      data,
      mock,
      method: item,
    });
  };
});
export default request;
