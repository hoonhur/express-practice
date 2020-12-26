const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");
const template = require("../lib/template.js");

router.get("/add", (req, res) => {
  let title = "Add Product";
  let list = template.list(req.list);
  let HTML = template.HTML(
    title,
    list,
    `<form action="/product/add" method="post">
          <p><input type="text" name="product" placeholder='product' /></p>
          <p><textarea name="description" placeholder='description'></textarea></p>
          <p><input type="submit" /></p>
        </form>`,
    ``
  );
  res.send(HTML);
});

router.post("/add", (req, res) => {
  let post = req.body;
  let product = post.product;
  let description = post.description;
  fs.writeFile(`data/${product}`, description, "utf8", (err) => {
    if (err) throw err;
    res.redirect(`/product/${product}`);
  });
});

router.get("/update/:pageId", (req, res) => {
  let filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    let title = filteredId;
    let list = template.list(req.list);
    let HTML = template.HTML(
      title,
      list,
      `<form action="/product/update" method="post">
            <input type='hidden' name='id' value='${title}'>
            <p><input type="text" name="product" placeholder='product' value='${title}'/></p>
            <p><textarea name="description" placeholder='description'>${description}</textarea></p>
            <p><input type="submit" /></p>
          </form>`,
      `<a href='/product/add'>Add Product</a> <a href='/product/update/page/${title}'>Update</a>`
    );
    res.send(HTML);
  });
});

router.post("/update", (req, res) => {
  let post = req.body;
  let id = post.id;
  let product = post.product;
  let description = post.description;
  fs.rename(`data/${id}`, `data/${product}`, (err) => {
    if (err) throw err;
    fs.writeFile(`data/${product}`, description, "utf8", (err) => {
      if (err) throw err;
      res.redirect(`/product/${product}`);
    });
  });
});

router.post("/delete", (req, res) => {
  let post = req.body;
  let id = post.id;
  let filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, (err) => {
    if (err) throw err;
    res.redirect(`/`);
  });
});

router.get("/:pageId", (req, res, next) => {
  let filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    if (err) {
      next(err);
    } else {
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
        `<a href='/product/add'>Add Product</a>
            <a href='/product/update/${sanitizedTitle}'>Update</a>
            <form action="/product/delete" method="post" onsubmit="alert('Product will be deleted')">
              <input type='hidden' name="id" value='${sanitizedTitle}'>
              <input type='submit' value='Delete'>
            </form>`
      );
      res.send(HTML);
    }
  });
});

module.exports = router;
