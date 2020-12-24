module.exports = {
  HTML: function (title, list, body, control) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>SOM Accessories - ${title}</title>
          <link rel="stylesheet" type="text/css" href="main.css">
        </head>
        <body>
          <h1><a href="/">SOM Accessories</a></h1>
          <div id="grid">
            ${list}
            ${control}
            ${body}
          </div>
        </body>
      </html>
        `;
  },
  list: function (filelists) {
    let list = "<ul>";
    for (file of filelists) {
      list = list + `<li><a href='/page/${file}'>${file}</a></li>`;
    }
    list = list + "</ul>";
    return list;
  },
};
