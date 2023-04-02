const router = require("koa-router")();
const Department = require("../models/departmentSchema");
const util = require("../utils");

router.prefix("/dept");

router.get("/list", async (ctx) => {
  const { deptName } = ctx.request.query;
  let params = {};
  if (deptName) params.deptName = deptName;
  let deptList = await Department.find(params);
  const result = treeDept(deptList, null, []);

  ctx.body = util.success(result);
});

function treeDept(deptList, id, list) {
  //data object
  for (let i = 0; i < deptList.length; i++) {
    const item = deptList[i];
    if (String(item.parentId.slice().pop()) == String(id)) {
      // copy arr
      list.push(item._doc);
    }
  }
  list.map((item) => {
    item.children = [];
    treeDept(deptList, item._id, item.children);
  });

  return list;
}
router.post("/operate", async (ctx) => {
  const { _id, action, ...params } = ctx.request.body;
  if (action === "add") {
    const res = await Department.create(params);
    ctx.body = util.success(res, "Create Successfully");
  }

  if (action === "edit") {
    const res = await Department.findByIdAndUpdate(_id, params);
    ctx.body = util.success(res, "Edit Successfully");
  }

  if (action === "delete") {
    const res = await Department.findByIdAndRemove(_id);
    Department.deleteMany({ parentId: { $all: [_id] } }); // find all parentId = id delete child
    ctx.body = util.success(res, "Delete Successfully");
  }
});

module.exports = router;
