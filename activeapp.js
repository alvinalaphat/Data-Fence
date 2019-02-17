var express = require("express");
var app = express();
var path = require("path");
var router = express.Router();

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/pages/index.html"));
});
router.get("/news.html");
app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at port 3000");
