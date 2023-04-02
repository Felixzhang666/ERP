const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  userId: Number,
  userName: String,
  userEmail: String,
  password:String,
  state: {
    type: Number,
    default: 1, //1 On the job 2 Leave one's job 3 Probation period
  },
  job: String,
  sex: String,
  mobile: String,
  role: {
    type: Number,
    default: 1, // 1 admin 2 user
  },
  roleList: [],
  deptId:[], 
  createTime: {
    type: Date,
    default: new Date(),
  },
  lastLoginTime: {
    type: Date,
    default: new Date(),
  },
});
// relationship bind collection ODM Design
module.exports = mongoose.model("User", userSchema, "users");
