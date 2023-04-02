import { createStore } from "vuex";
import mutations from "./mutations";
import storage from "../utils/storage";
const state = {
  userInfo: storage.getItem("userInfo")|| "",
  marks: storage.getItem("marks") || [],
};

export default createStore({
  state,
  mutations,
});
