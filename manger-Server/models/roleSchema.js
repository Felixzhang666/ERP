const mongoose = require("mongoose");
const roleSchema = mongoose.Schema({
  roleName:String,
  remark:String,
  permissionList:{
    checkedKeys:[],
    halfCheckedKeys:[]
  },
  createTime: {
    type: Date,
    default: new Date(),
  },
});
// relationship bind collection ODM Design
module.exports = mongoose.model("role", roleSchema, "roles");
