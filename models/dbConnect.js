const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const dbConnect = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
  }
);

dbConnect
  .authenticate()
  .then(() => {
    console.info("INFO - Database connected.");
  })
  .catch((err) => {
    console.error("ERROR - Unable to connect to the database:", err);
  });
// dbConnect.sync({ alter: true }).then(() => {
//   console.log(`Database & tables created!`);
// });
module.exports = dbConnect;
