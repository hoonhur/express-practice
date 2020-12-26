const express = require("express");
const app = express();
const fs = require("fs");
const template = require("./lib/template.js");
const path = require("path");
const bodyParser = require("body-parser");
const sanitizeHtml = require("sanitize-html");
const compression = require("compression");

app.use(express.static("public"));
// parse application/x-www-form-urlencoded
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

app.get("/", (req, res) => {
  let title = "Welcome";
  let description = "SOM Accessory is...";
  let list = template.list(req.list);
  let HTML = template.HTML(
    title,
    list,
    `<div id="article">
        <h2>${title}</h2>
        <p>${description}</p>
        <img src="/images/pompoms.jpg" style="width: 300px">
      </div>`,
    `<a href='/add'>Add Product</a>`
  );
  res.send(HTML);
});

app.get("/page/:pageId", (req, res) => {
  let filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    let title = filteredId;
    let sanitizedTitle = sanitizeHtml(title);
    let sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ["h1"],
    });
    let list = template.list(req.list);
    let HTML = template.HTML(
      sanitizedTitle,
      list,
      `<div id="article">
          <h2>${sanitizedTitle}</h2>
          <p>${sanitizedDescription}</p>
        </div>`,
      `<a href='/add'>Add Product</a>
        <a href='/update/${sanitizedTitle}'>Update</a>
        <form action="/delete" method="post" onsubmit="alert('Product will be deleted')">
          <input type='hidden' name="id" value='${sanitizedTitle}'>
          <input type='submit' value='Delete'>
        </form>`
    );
    res.send(HTML);
  });
});

app.get("/add", (req, res) => {
  let title = "Add Product";
  let list = template.list(req.list);
  let HTML = template.HTML(
    title,
    list,
    `<form action="/add" method="post">
        <p><input type="text" name="product" placeholder='product' /></p>
        <p><textarea name="description" placeholder='description'></textarea></p>
        <p><input type="submit" /></p>
      </form>`,
    ``
  );
  res.send(HTML);
});

app.post("/add", (req, res) => {
  let post = req.body;
  let product = post.product;
  let description = post.description;
  fs.writeFile(`data/${product}`, description, "utf8", (err) => {
    if (err) throw err;
    res.redirect(`/page/${product}`);
  });
});

app.get("/update/:pageId", (req, res) => {
  let filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    let title = filteredId;
    let list = template.list(req.list);
    let HTML = template.HTML(
      title,
      list,
      `<form action="/update" method="post">
          <input type='hidden' name='id' value='${title}'>
          <p><input type="text" name="product" placeholder='product' value='${title}'/></p>
          <p><textarea name="description" placeholder='description'>${description}</textarea></p>
          <p><input type="submit" /></p>
        </form>`,
      `<a href='/add'>Add Product</a> <a href='/update/page/${title}'>Update</a>`
    );
    res.send(HTML);
  });
});

app.post("/update", (req, res) => {
  let post = req.body;
  let id = post.id;
  let product = post.product;
  let description = post.description;
  fs.rename(`data/${id}`, `data/${product}`, (err) => {
    if (err) throw err;
    fs.writeFile(`data/${product}`, description, "utf8", (err) => {
      if (err) throw err;
      res.redirect(`/page/${product}`);
    });
  });
});

app.post("/delete", (req, res) => {
  let post = req.body;
  let id = post.id;
  let filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, (err) => {
    if (err) throw err;
    res.redirect(`/`);
  });
});

app.listen(3000, () => console.log("example app listening on port 3000"));
