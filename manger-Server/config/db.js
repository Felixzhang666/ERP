const mongoose = require("mongoose");
const config = require("./index");
const log4js = require("../utils/log4");
mongoose.set ("strictQuery", false);

async function main() {
  await mongoose.connect(config.URL);
}

main()
.then(res=>{
    log4js.info('********Connect Sccuessfully******')
})
.catch((err) => log4js.log(err));
