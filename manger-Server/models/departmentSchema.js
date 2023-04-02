const mongoose = require("mongoose");
const deptSchema = mongoose.Schema({
  userId:String,
  userName:String,
  deptName:String,
  userEmail:String,
  parentId:[mongoose.Types.ObjectId],
  createTime: {
    type: Date,
    default: new Date(),
  },
  updateTime: {
    type: Date,
    default: new Date(),
  },
});
// relationship bind collection ODM Design
module.exports = mongoose.model("department", deptSchema, "department");
