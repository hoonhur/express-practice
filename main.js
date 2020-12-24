const express = require("express");
const app = express();
const fs = require("fs");
const template = require("./lib/template.js");

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

app.listen(3000, () => console.log("example app listening on port 3000"));

// let http = require("http");
// let fs = require("fs");
// let url = require("url");
// let qs = require("querystring");
// let path = require("path");
// let sanitizeHtml = require("sanitize-html");

// let template = require("./lib/template.js");

// let app = http.createServer((request, response) => {
//   let _url = request.url;
//   let queryData = url.parse(_url, true).query;
//   let pathname = url.parse(_url, true).pathname;
//   if (pathname === "/") {
//     if (queryData.id === undefined) {
// fs.readdir("./data", (err, filelists) => {
//   let title = "Welcome";
//   let description = "SOM Accessory is...";
//   let list = template.list(filelists);
//   let HTML = template.HTML(
//     title,
//     list,
//     `<div id="article">
//       <h2>${title}</h2>
//       <p>${description}</p>
//     </div>`,
//     `<a href='/add'>Add Product</a>`
//   );
//   response.writeHead(200);
//   response.end(HTML);
// });
//     } else {
//       fs.readdir("./data", (err, filelists) => {
//         let filteredId = path.parse(queryData.id).base;
//         fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
//           let title = queryData.id;
//           let sanitizedTitle = sanitizeHtml(title);
//           let sanitizedDescription = sanitizeHtml(description, {
//             allowedTags: ["h1"],
//           });
//           let list = template.list(filelists);
//           let HTML = template.HTML(
//             sanitizedTitle,
//             list,
//             `<div id="article">
//               <h2>${sanitizedTitle}</h2>
//               <p>${sanitizedDescription}</p>
//             </div>`,
//             `<a href='/add'>Add Product</a>
//             <a href='/update?id=${sanitizedTitle}'>Update</a>
//             <form action="delete_process" method="post" onsubmit="alert('Product will be deleted')">
//               <input type='hidden' name="id" value='${sanitizedTitle}'>
//               <input type='submit' value='Delete'>
//             </form>`
//           );
//           response.writeHead(200);
//           response.end(HTML);
//         });
//       });
//     }
//   } else if (pathname === "/add") {
//     fs.readdir("./data", (err, filelists) => {
//       let title = "Add Product";
//       let list = template.list(filelists);
//       let HTML = template.HTML(
//         title,
//         list,
//         `<form action="/add_process" method="post">
//           <p><input type="text" name="product" placeholder='product' /></p>
//           <p><textarea name="description" placeholder='description'></textarea></p>
//           <p><input type="submit" /></p>
//         </form>`,
//         ``
//       );
//       response.writeHead(200);
//       response.end(HTML);
//     });
//   } else if (pathname === "/add_process") {
//     let body = "";
//     request.on("data", (data) => {
//       body = body + data;
//       // too much POST data, kill the connection!
//       //1e6 === 1 * Math.pow(10,6) === 1 * 1000000 ~~~ 1MB
//       if (body.length > 1e6) request.connection.destroy();
//     });
//     request.on("end", () => {
//       let post = qs.parse(body);
//       let product = post.product;
//       let description = post.description;
//       fs.writeFile(`data/${product}`, description, "utf8", (err) => {
//         if (err) throw err;
//         response.writeHead(302, { Location: `/?id=${product}` });
//         response.end();
//       });
//     });
//   } else if (pathname === "/update") {
//     fs.readdir("./data", (err, filelists) => {
//       let filteredId = path.parse(queryData.id).base;
//       fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
//         let title = filteredId;
//         let list = template.list(filelists);
//         let HTML = template.HTML(
//           title,
//           list,
//           `<form action="/update_process" method="post">
//             <input type='hidden' name='id' value='${title}'>
//             <p><input type="text" name="product" placeholder='product' value='${title}'/></p>
//             <p><textarea name="description" placeholder='description'>${description}</textarea></p>
//             <p><input type="submit" /></p>
//           </form>`,
//           `<a href='/add'>Add Product</a> <a href='/update?id=${title}'>Update</a>`
//         );
//         response.writeHead(200);
//         response.end(HTML);
//       });
//     });
//   } else if (pathname === "/update_process") {
//     let body = "";
//     request.on("data", (data) => {
//       body = body + data;
//       // too much POST data, kill the connection!
//       //1e6 === 1 * Math.pow(10,6) === 1 * 1000000 ~~~ 1MB
//       if (body.length > 1e6) request.connection.destroy();
//     });
//     request.on("end", () => {
//       let post = qs.parse(body);
//       let id = post.id;
//       let product = post.product;
//       let description = post.description;
//       fs.rename(`data/${id}`, `data/${product}`, (err) => {
//         if (err) throw err;
//         fs.writeFile(`data/${product}`, description, "utf8", (err) => {
//           if (err) throw err;
//           response.writeHead(302, { Location: `/?id=${product}` });
//           response.end();
//         });
//       });
//     });
//   } else if (pathname === "/delete_process") {
//     let body = "";
//     request.on("data", (data) => {
//       body = body + data;
//       // too much POST data, kill the connection!
//       //1e6 === 1 * Math.pow(10,6) === 1 * 1000000 ~~~ 1MB
//       if (body.length > 1e6) request.connection.destroy();
//     });
//     request.on("end", () => {
//       let post = qs.parse(body);
//       let id = post.id;
//       let filteredId = path.parse(id).base;
//       fs.unlink(`data/${filteredId}`, (err) => {
//         if (err) throw err;
//         response.writeHead(302, { Location: `/` });
//         response.end();
//       });
//     });
//   } else {
//     response.writeHead(404);
//     response.end("Not found");
//   }
// });
// app.listen(3000);
