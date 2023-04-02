import storage from "../utils/storage";

export default{
    saveUserInfo(state, userInfo){
        state.saveUserInfo = userInfo;
        storage.setItem("userInfo", userInfo);
    },
    saveUserMarks(state, marks){
        state.marks = marks;
        storage.setItem("marks", marks);
    },
};