const fs = require("fs");
const path = require("path");

function deleteUser(req, res) {
  const idDeleteItem = Number(req.url.split("/").pop());
  const filePath = path.join(__dirname, "data.json");

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Ошибка чтения файла" }));
      return;
    }

    let users;

    try {
      users = JSON.parse(data);
    } catch (error) {
      users = [];
    }

    const filtersUsers = users.filter((item) => item.id != idDeleteItem);

    fs.writeFile(filePath, JSON.stringify(filtersUsers, null, 2), (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Ошибка записи файла" }));
        return;
      }
       res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `Пользователь с id ${idDeleteItem} удалён` }));
    });
  });
}

module.exports = { deleteUser };
