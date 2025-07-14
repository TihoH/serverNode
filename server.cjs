require("dotenv").config();

const PORT = process.env.PORT || 3700;
const fs = require("fs");
const path = require("path");
const http = require("http");
const { newUser } = require("./newUser.module");

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

     if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    if (req.url === "/api/getData" && req.method === "GET") {
      fs.readFile(path.join(__dirname, "/data.json"), (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "Ошибка сервера при обработке запроса" })
          );
          return;
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        }
        return;
      });
    }
    if (req.url === "/api/newUser" && req.method === "POST") {

      newUser( req ,res)
      return
    }
  })
  .listen(PORT);
