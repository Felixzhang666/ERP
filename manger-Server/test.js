const log4js = require("log4js");
const logger = log4js.getLogger("globe-test.js");
log4js.configure({
  appenders: {
    out: { type: "file", filename: "test.log" },
  },
  categories: {
    default: {
      appenders: ["out"],
      level: "error",
    },
  },
});
logger.level = "debug";
logger.debug("some message"); // level 9
 