const net = require("net");
const fs = require("fs");
const path = require("path")

const PORT = 3000;
const ROUTES_DIR = path.join(__dirname, "routes");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    console.log("Request Received:");
    console.log(request);

    const [requestLine, ...headers] = request.split("\r\n");
    const [method, pathRequested] = requestLine.split(" ");

    console.log(`Method: ${method}, Path: ${path}`);

    if (method === "GET") {
      let filePath = pathRequested === "/" ? "/index.html" : `${pathRequested.replace(/\/$/, "")}.html`;
      filePath = path.join(ROUTES_DIR, filePath);

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          const body = "404 Not Found";
          const response = `HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: ${body.length}\r\n\r\n${body}`;
          socket.write(response);
        } else {
          fs.readFile(filePath, (err, data) => {
            if (err) {
              const body = "500 Internal Server Error";
              const response = `HTTP/1.1 500 Internal Server Error\r\nContent-Type: text/plain\r\nContent-Length: ${body.length}\r\n\r\n${body}`;
              socket.write(response);
            } else {
              const response = `HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: ${data.length}\r\n\r\n${data}`;
              socket.write(response);
            }
            socket.end();
          });
        }
      });
    } else {
      const body = "405 Method Not Allowed";
      const response = `HTTP/1.1 405 Method Not Allowed\r\nContent-Type: text/plain\r\nContent-Length: ${body.length}\r\n\r\n${body}`;
      socket.write(response);
      socket.end();
    }
  });
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
