const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const log4js = require("./utils/log4");

const router = require("koa-router")();
const index = require("./routes/index");
const users = require("./routes/users");
const menus = require("./routes/menus");
const roles = require("./routes/roles");
const dept = require("./routes/department");
const leave = require("./routes/leave");
const jwt = require("koa-jwt");
const util = require("./utils/index");
require("./config/db");

onerror(app);

app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "ejs",
  })
);

// logger
app.use(async (ctx, next) => {
  await next().catch((error) => {
    if (error.status == "401") {
      ctx.body = util.fail("No token or token is expired", 50001);
    }
  });
});

app.use(
  jwt({ secret: "mashibing" }).unless({
    path: ["/api/user/login"],
  })
);
// level 1 router
router.prefix("/api");

router.get("/notify/count", (ctx) => {
  ctx.body = "body";
});

router.use(users.routes(), users.allowedMethods());
router.use(menus.routes(), menus.allowedMethods());
router.use(roles.routes(), roles.allowedMethods());
router.use(dept.routes(), dept.allowedMethods());
router.use(leave.routes(), leave.allowedMethods());
// routes
app.use(router.routes(), users.allowedMethods());


// error-handling
app.on("error", (err, ctx) => {
  //BasicConfigurator.configure();
  console.error("server error", err, ctx);
  log4js.error(err);
});

module.exports = app;
