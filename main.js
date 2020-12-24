const express = require("express");
const app = express();
const fs = require("fs");
const template = require("./lib/template.js");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const qs = require("querystring");

app.get("/", (req, res) => {
  fs.readdir("./data", (err, filelists) => {
    let title = "Welcome";
    let description = "SOM Accessory is...";
    let list = template.list(filelists);
    let HTML = template.HTML(
      title,
      list,
      `<div id="article">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>`,
      `<a href='/add'>Add Product</a>`
    );
    res.send(HTML);
  });
});

app.get("/page/:pageId", (req, res) => {
  fs.readdir("./data", (err, filelists) => {
    let filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
      let title = filteredId;
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ["h1"],
      });
      let list = template.list(filelists);
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
});

app.get("/add", (req, res) => {
  fs.readdir("./data", (err, filelists) => {
    let title = "Add Product";
    let list = template.list(filelists);
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
});

app.post("/add", (req, res) => {
  let body = "";
  req.on("data", (data) => {
    body = body + data;
    // too much POST data, kill the connection!
    //1e6 === 1 * Math.pow(10,6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6) req.connection.destroy();
  });
  req.on("end", () => {
    let post = qs.parse(body);
    let product = post.product;
    let description = post.description;
    fs.writeFile(`data/${product}`, description, "utf8", (err) => {
      if (err) throw err;
      res.redirect(`/page/${product}`);
    });
  });
});

app.get("/update/:pageId", (req, res) => {
  fs.readdir("./data", (err, filelists) => {
    let filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
      let title = filteredId;
      let list = template.list(filelists);
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
});

app.post("/update", (req, res) => {
  let body = "";
  req.on("data", (data) => {
    body = body + data;
    if (body.length > 1e6) req.connection.destroy();
  });
  req.on("end", () => {
    let post = qs.parse(body);
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
});

app.post("/delete", (req, res) => {
  let body = "";
  req.on("data", (data) => {
    body = body + data;
    if (body.length > 1e6) req.connection.destroy();
  });
  req.on("end", () => {
    let post = qs.parse(body);
    let id = post.id;
    let filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, (err) => {
      if (err) throw err;
      res.redirect(`/`);
    });
  });
});

app.listen(3000, () => console.log("example app listening on port 3000"));

// let http = require("http");
// let url = require("url");

// let app = http.createServer((request, response) => {
//   let _url = request.url;
//   let queryData = url.parse(_url, true).query;
//   let pathname = url.parse(_url, true).pathname;
//   if (pathname === "/") {
//     if (queryData.id === undefined) {
//     });
//     } else {
//     } else if (pathname === "/add") {
//   } else if (pathname === "/add_process") {
//   } else if (pathname === "/update") {
//   } else if (pathname === "/update_process") {
//   } else if (pathname === "/delete_process") {
//   } else {
//     response.writeHead(404);
//     response.end("Not found");
//   }
// });
// app.listen(3000);
