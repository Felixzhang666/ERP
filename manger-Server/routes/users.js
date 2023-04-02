const router = require("koa-router")();
const User = require("../models/userSchema");
const Counter = require("../models/countSchema");
const util = require("../utils");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

router.prefix("/user");
router.post("/login", async (ctx, next) => {
  const { userName, password } = ctx.request.body;
  console.log(userName);
  console.log(md5(password));
  const res = await User.findOne(
    {
      userName,
      password:md5(password),
    },
    "userName roleList userId deptId"
  );

  const data = res && res._doc; // == res
  const token = jwt.sign(
    {
      data: data,
    },
    "mashibing",
    { expiresIn: "1h" }
  );

  if (res) {
    data.token = token;
    ctx.body = util.success(data); // limit data
  } else {
    ctx.body = util.fail("Account or Password Error");
  }
});

router.get("/list", async (ctx) => {
  // console.log(1)
  const { userId, userName, state, pageNum, pageSize } = ctx.request.query;
  const { page, skipIndex } = util.pager(pageNum, pageSize);
  // fomulate params
  let params = {};
  if (userId) {
    params.userId = userId;
  }
  if (userName) {
    params.userName = userName;
  }
  if (state && state != "0") {
    params.state = state;
  }
  //console.log(params);
  // Search User List
  const res = User.find(params, { _id: 0, password: 0 });
  console.log(res._doc);
  const list = await res.skip(skipIndex).limit(page.pageSize);
  const total = await User.countDocuments(params);

  //console.log(list);
  //console.log(total);

  ctx.body = util.success({
    page: {
      ...page,
      total,
    },
    list,
  });
});

router.post("/delete", async (ctx) => {
  const { userIds } = ctx.request.body;
  console.log(userIds);
  //delelteMany search
  const res = await User.updateMany({ userId: { $in: userIds } }, { state: 2 });
  if (res.modifiedCount) {
    //ctx.body = util.success(res, `删除成功${res.modifiedCount}条数据` );
    ctx.body = util.success(
      res,
      `Delete ${res.modifiedCount} data successfully`
    );
    return;
  }
});

router.post("/operate", async (ctx) => {
  const {
    userId ,
    userName,
    userEmail,
    mobile,
    role,
    state,
    roleList,
    deptId,
    action,
  } = ctx.request.body;

  if (action == "add") {
    if (!userName || !userEmail || !deptId) {
      ctx.body = util.fail("UserName/Email/Department is empty.");
      return;
    }
    //  ascend
    const doc = await Counter.findOneAndUpdate(
      { _id: "productid" },
      { $inc: { sequence_value: 1 } },
      { new: true }
    );
    const res = await User.findOne({
      $or: [{ userName }, { userEmail }, { mobile }],
    });
    if(res){
      ctx.body = util.fail("UserName/Email/Department has been registed.")
    } else{
      const psd = mobile.substring(5,11);
      const user = new User({
        userId: doc.sequence_value,
        userName,
        userEmail,
        mobile,
        state,
        deptId,
        roleList, 
        role, // 1 admin 2 user
        password:md5(psd) //encry
      });
      user.save();
      ctx.body = util.success("User Create Successfully");
    }
  }
  
  if (action == "edit") {
    if (!deptId) {
      ctx.body = util.fail("Department is empty.");
      return;
    }
    const res = await User.findOneAndUpdate(
      { userId },
      { mobile, role, state, roleList, deptId }
    );
    if (res) {
      ctx.body = util.success(res.userName, "Modify Successfully");
      return;
    }
  }
});
module.exports = router;
