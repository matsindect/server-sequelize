const dotenv = require("dotenv");
const fs = require("fs");

//Specify the Amazon DocumentDB cert
// var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];
const server = require("./app");
// console.log(ca)
dotenv.config({ path: "./config.env" });

// START SERVER
const port = process.env.PORT || 3000;
const TapServer = server.listen(port, "0.0.0.0", () => {
  console.log(`Server now running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error name: ${err.name}, Error message is ${err.message}`);
  TapServer.close(() => {
    process.exit(1);
  });
});
