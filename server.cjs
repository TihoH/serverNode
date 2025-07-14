require("dotenv").config();

const PORT = process.env.PORT || 3700;
const fs = require("fs");
const path = require("path");
const http = require("http");

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
      console.log(req.url);
      let body = "";
      req.on("data", (chunk) => {
        console.log("Получен POST запрос /api/newUser");
        body += chunk;
      });

      req.on("end", () => {
        const fileData = path.join(__dirname, "data.json");
        
        let newUser;

        console.log(body)

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
            users = [];
          }

          const maxId =
            users.length > 0 ? Math.max(...users.map((u) => u.id || 0)) : 0;
          const newId = maxId + 1;
          users.push({ ...newUser, id: newId });

          fs.writeFile(fileData, JSON.stringify(users, null, 2), (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Ошибка записи файла" }));
              return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Пользователь добавлен" }));
            return;
          });
          return;
        });
      });
    }
  })
  .listen(PORT);
