const express = require("express");
const router = express.Router();
const template = require("../lib/template.js");

router.get("/", (req, res) => {
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
    `<a href='/product/add'>Add Product</a>`
  );
  res.send(HTML);
});

module.exports = router;
