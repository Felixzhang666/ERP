const router = require("koa-router")();

const Leave = require("../models/leaveSchema");
const Dept = require("../models/departmentSchema");
const util = require("../utils");
const jwt = require("jsonwebtoken");

router.prefix("/leave");

router.get("/list", async (ctx) => {
  const { approveState, pageNum, pageSize } = ctx.request.query;
  const { page, skipIndex } = util.pager(pageNum, pageSize);
  let authorization = ctx.request.headers.authorization;
  if (authorization) {
    //  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYzOTFjMjM0NGVkMTNjNDg0YzQ0MjA5OCIsInVzZXJOYW1lIjoiYWRtaW4iLCJyb2xlTGlzdCI6WyI2NDAzNGEwNzkzODk2ODQ3NDMzOWM5ZjMiXX0sImlhdCI6MTY4MDIwOTkzNSwiZXhwIjoxNjgwMjEzNTM1fQ.BMuYdxT3U32ivFPl7KGBG2gi1GOw8Dxjq66YAZRgyeI
    const token = authorization.split(" ")[1];
    // child doc check, connect by "."
    const { data } = jwt.verify(token, "mashibing");

    // ctx.body = util.success({ menuList, marks });
    let params = {
      "applicant.userId": data.userId,
    };
    if (approveState) params.approveState = approveState; // status code
    console.log(params);
    const docs = Leave.find(params);
    const list = await docs.skip(skipIndex).limit(page.pageSize);
    const total = await Leave.countDocuments(params);

    ctx.body = util.success({
      page: {
        ...page,
        total,
      },
      list,
    });
  }
});

router.post("/operate", async (ctx) => {
  const {_id, action, type, startDate, endDate, reasons, leaveTime } =
    ctx.request.body;
  // model object
  if(action === "create"){
    let params = {
        type,
        startDate,
        endDate,
        reasons,
        leaveTime,
      };
      // M- + time frame + randon Num
      let order = "M-";
      order += util.formatDateToNumber(new Date());
      order += util.generateRandomString();
      params.order = order;
      // applicant
    
      let authorization = ctx.request.headers.authorization;
      if (authorization) {
        const token = authorization.split(" ")[1];
        // child doc check, connect by "."
        var { data } = jwt.verify(token, "mashibing");
        params.applicant = {
          userId: data.userId,
          userName: data.userName,
        };
      }
      const id = data.deptId.pop();
      //console.log(id);
      const dept = await Dept.findById(id);
      //console.log(dept);
      if (dept.userName === data.userName) {
        const id = data.deptId.pop();
        dept = await Dept.findById(id);
      }
      // current apporoval
      params.currentApprover = dept.userName;
      //console.log(params);
      params.approveState = 3;
    
      // 直接上级
      const commanders = await Dept.find({
        deptName: { $in: ["行政部", "财务部"] },
      });
      let approvers = dept.userName;
      let auditFlows = [
        { userId: dept.userId, userName: dept.userName, userEmail: dept.userEmail },
      ];
      // flows
      commanders.map((item) => {
        auditFlows.push({
            userId: item.userId,
            userName:item.userName,
            userEmail:item.userEmail,
        })
        approvers += " , " + item.userName;
      });
      params.log = [];
      params.approvers = approvers;
      params.auditFlows = auditFlows;
    
    
      let res = await Leave.create(params);
      ctx.body = util.success(res, "申请提交成功了");
  }
  if(action === "delete") {
    console.log(_id);
    const doc = await Leave.findByIdAndUpdate(_id, {approveState:1});
    //let res = await Leave.create(params);
      ctx.body = util.success(doc, "Discard Success");
  }


  
});


module.exports = router;
