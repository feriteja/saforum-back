const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;
const app = require("./app");

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
