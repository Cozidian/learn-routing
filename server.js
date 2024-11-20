const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ROUTES_DIR = path.join(__dirname, "routes");

const serveFile = (res, filePath, contentType) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Internal Server Error");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
};

const server = http.createServer((req, res) => {
  let requestedPath = req.url === "/" ? "/index" : req.url;

  let requestedPathWithEnding;
  if (requestedPath !== "/") {
    // Since its annoying to have to apply .html to the path
    // Also need to stipt ending / if there is any
    requestedPathWithEnding = requestedPath.replace(/\/$/, "") + ".html";
  }
  console.log(`requested path: ${requestedPathWithEnding}`)
  let filePath = path.join(ROUTES_DIR, requestedPathWithEnding);

  console.log(`incoming file path: ${filePath}`)

  if (!path.extname(filePath)) {
    filePath = path.join(filePath, "index.html");
  }

  const ext = path.extname(filePath);
  const contentType = ext === ".html" ? "text/html" : "text/plain";

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      serveFile(res, filePath, contentType);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
