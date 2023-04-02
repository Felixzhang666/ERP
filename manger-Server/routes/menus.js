const router = require("koa-router")();
//const { permissionMenu, permissionList } = require("../../manager-fe/src/api");
const Menu = require("../models/menuSchema");
const Role = require("../models/roleSchema");
const util = require("../utils");
const jwt = require("jsonwebtoken");

router.prefix("/menu");

router.get("/list", async (ctx) => {
  const { menuName, menuState } = ctx.request.query;
  let params = {};
  if (menuName) params.menuName = menuName;
  if (menuState) params.menuState = menuState;
  let menuList = await Menu.find(params);
  const result = treeMenu(menuList, null, []);

  ctx.body = util.success(result);
});
// 根据权限动态菜单, with token
router.get("/permission/list", async (ctx)=>{
   let authorization = ctx.request.headers.authorization;
   if(authorization){

  //  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYzOTFjMjM0NGVkMTNjNDg0YzQ0MjA5OCIsInVzZXJOYW1lIjoiYWRtaW4iLCJyb2xlTGlzdCI6WyI2NDAzNGEwNzkzODk2ODQ3NDMzOWM5ZjMiXX0sImlhdCI6MTY4MDIwOTkzNSwiZXhwIjoxNjgwMjEzNTM1fQ.BMuYdxT3U32ivFPl7KGBG2gi1GOw8Dxjq66YAZRgyeI
  const  token = authorization.split(' ')[1];
  //console.log(token);
  const userInfo = jwt.verify(token, "mashibing");
  const menuList =await getMenuList(userInfo.data.roleList);
  const marks = getButtonList(JSON.parse(JSON.stringify(menuList)));
  
  ctx.body = util.success({menuList, marks});
   }
})
function  getButtonList(source){
    const result = [];
    const deep = (data)=>{
      while(data.length){
       const item = data.pop();
       if(item.children.length > 0 && item.menuType === 1){
        deep(item.children);
       }
       if(item.children.length === 0 && item.menuType === 2){
        result.push(item.menuCode);
       }
      }
    }
    deep(source);
    return result;
}
async function getMenuList(roles){
  let menuList = [];
  let permissionList = [];
  const roleList = await Role.find({_id: {$in: roles}});
  //console.log(roleList);
  roleList.map(role =>{
    let {checkedKeys, halfCheckedKeys} = role.permissionList;
    // qu chong
    permissionList = permissionList.concat([...checkedKeys, ...halfCheckedKeys])
    
  });
  permissionList = [...new Set(permissionList)];
  menuList = await Menu.find({_id:{$in:permissionList}});
  return treeMenu(menuList, null, []);
}


function treeMenu(menuList, id, list) {
  //data object
  for (let i = 0; i < menuList.length; i++) {
    const item = menuList[i];
    if (String(item.parentId.slice().pop()) == String(id)) {
      // copy arr
      list.push(item._doc);
    }
  }

  list.map(item =>{
    item.children = [];
    treeMenu(menuList, item._id, item.children);
  })
  return list;
}
router.post("/operate", async (ctx, next) => {
  const { _id, action, ...params } = ctx.request.body;
  if (action === "add") {
    const res = await Menu.create(params);
    ctx.body = util.success(res, "Create Successfully");
  }

  if (action === "edit") {
    const res = await Menu.findByIdAndUpdate(_id, params);
    ctx.body = util.success(res, "Edit Successfully");
  }

  if (action === "delete") {
    const res = await Menu.findByIdAndRemove(_id);
    Menu.deleteMany({ parentId: { $all: [_id] } }); // find all parentId = id delete child
    ctx.body = util.success(res, "Delete Successfully");
  }
});

module.exports = router;
