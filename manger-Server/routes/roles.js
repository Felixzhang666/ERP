const router = require("koa-router")();
const Role = require("../models/roleSchema");
const util = require("../utils");

router.prefix("/roles");

router.get("/system", async (ctx)=>{
  const list = await Role.find({}, "_id, roleName");
  ctx.body = util.success(list);
});

//获取角色列表
router.get('/list', async(ctx)=>{
 const {roleName, pageNum, pageSize} = ctx.request.query;
 //分页 返回 skipIndex 数据的索引位置
 const {page, skipIndex} = util.pager(pageNum, pageSize);
 let params = {};
 //前端查询 过滤处理
 if(roleName)params.roleName = roleName;
 const doc = Role.find(params);
 const list = await doc.skip(skipIndex).limit(page.pageSize);
 const total = await Role.countDocuments(params);
 
 ctx.body = util.success({
    list,
    page:{
      ...page,
      total
    }
 })
})


router.post("/operate", async(ctx)=>{
  const {_id, roleName, remark, action} = ctx.request.body;
  if(action === "add"){
    const res = await Role.create({roleName, remark});
    ctx.body = util.success(res, "Add role success");
  }

  if(action === "edit"){
    const res = await Role.findByIdAndUpdate(_id, {roleName, remark});
    ctx.body = util.success(res, "Update role success");
  }

  if(action === "delete"){
    const res = await Role.findByIdAndRemove(_id);
    ctx.body = util.success(res, "Delete role success");
  }
})

router.post("/updata/permission", async(ctx)=>{
  const {_id, permissionList} = ctx.request.body;
  console.log(permissionList);
  let res = await Role.findByIdAndUpdate(_id, {permissionList});
  ctx.body = util.success(res, "Role Permission Modify Successfully");
})

module.exports = router;