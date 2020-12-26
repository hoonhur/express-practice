const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const productRouter = require("./routes/product");
const indexRouter = require("./routes/index");

app.use(express.static("public"));

// parse application/x-www-form-urlencoded`;
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
// app.use(bodyParser.json())

app.use(compression());

// using get instead of use since post does not need filelist
app.get("*", function (req, res, next) {
  fs.readdir("./data", (err, filelists) => {
    req.list = filelists;
    next();
  });
});

app.use("/", indexRouter);
app.use("/product", productRouter);

app.use((req, res, next) => {
  res.status(404).send(`Sorry can't find that!`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(505).send("Something broke!");
});

app.listen(3000, () => console.log("example app listening on port 3000"));
