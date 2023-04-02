const mongoose = require("mongoose");
const leaveSchema = mongoose.Schema({
  applicant: {
    userId: String,
    userName: String,
  },
  approveState: { type: Number, default: 1 },

  type: Number,
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  leaveTime: String,
  reasons: String,
  order: String,
  approvers: String,
  currentApprover: String,
  auditFlows: [
    {
      userId: String,
      userName: String,
      userEmail: String,
    },
  ],
  logs: [
    {
      userId: String,
      userName: String,
      createTime:String,
      remark: String,
      action: String,
    },

  ],
  createTime: { type: Date, default: Date.now },
});
// relationship bind collection ODM Design
module.exports = mongoose.model("leave", leaveSchema, "leave");
