const fs = require("fs");
const path = require("path");
const http = require("http");
const PORT = 3700;

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
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
        console.log(req.url)
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        const fileData = path.join(__dirname, "data.json");


        let newUser;

        try {
          newUser = JSON.parse(body);
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Некорректный JSON" }));
          return;
        }
        fs.readFile(fileData, "utf-8", (err, data) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end("Ошибка сервера");
            return;
          }
          let users;
          try {
            users = JSON.parse(data);
          } catch (error) {
            // res.writeHead(400, { "Content-Type": "application/json" });
            // res.end(JSON.stringify({ error: "Некорректный JSON" }));
            // return;
            users = [];
          }
          users.push(newUser);

          fs.writeFile(fileData, JSON.stringify(users, null, 2), (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Ошибка записи файла" }));
              return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Пользователь добавлен" }));
            return
          });
          return;
        });
      });
    }
  })
  .listen(PORT);
