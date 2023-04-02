const mongoose = require("mongoose");
const menuSchema = mongoose.Schema({
  menuType:Number, //
  menuState:Number,
  menuCode:String,
  menuName:String,
  path:String,
  icon:String,
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
module.exports = mongoose.model("Menu", menuSchema, "menus");
