const env = import.meta.env.MODE;
const envConfig = {
  development: {
    baseApi: "/api",
    mockApi: "https://www.fastmock.site/mock/2f9116f11df05ae4df79f50a3c9ae3e4/api",
  },
  prod: {
    baseApi: "",
    mockApi: "",
  },
  test: {
    baseApi: "",
    mockApi: "",
  },
};
export default {
  env,
  mock: false,
  nameSpace:"manager",
  ...envConfig[env],
};
