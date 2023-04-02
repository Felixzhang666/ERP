const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    _id:String,
    sequence_value:Number
});
// relationship bind collection ODM Design
module.exports = mongoose.model("Counter", userSchema, "counters");