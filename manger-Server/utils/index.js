const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001,
  USER_ACCOUNT_ERROR: 20001,
  USER_LOGIN_ERROR: 30001,
  AUTH_ERROR: 40001,
  BUSINESS_ERROR: 50001, //业务请求失败
};

module.exports = {
  // 分页
  pager(pageNum = 1, pageSize = 10) {
    pageNum *= 1;
    pageSize *= 1;
    const skipIndex = (pageNum <= 0 ? 0 : pageNum - 1) * pageSize;
    return {
      page: {
        pageNum,
        pageSize,
      },
      skipIndex,
    };
  },

  success(data = "", msg = "", code = CODE.SUCCESS) {
    return {
      data,
      msg,
      code,
    };
  },

  fail(msg = "", code = CODE.USER_ACCOUNT_ERROR) {
    return {
      msg,
      code,
    };
  },

  formatDateToNumber(date) {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const dateString = formatter.format(date).replace(/\/|\s|:|\D/g, "");
    const dateNumber = parseInt(dateString, 10);
    return dateNumber;
  },

  generateRandomString() {
    let result = "";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkImnopqrstuvwxyz";
    const lettersLength = letters.length;
    for (let i = 0; i < 3; i++) {
      result += Math.floor(Math.random() * 10);
    }
    for (let i = 0; i < 2; i++) {
      result += letters.charAt(Math.floor(Math.random() * lettersLength));
    }
    return result;
  },
};
