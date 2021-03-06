const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bluebird = require("bluebird");

const app = express();
const db = mysql.createConnection({
  // host: "192.168.27.186",
  host: "localhost",
  user: "opcp",
  password: "opcp2428",
  database: "pbook"
});
db.connect(error => {
  if (error) {
    return error;
  }
});
bluebird.promisifyAll(db);

const whitelist = ["http://localhost:3001", "http://localhost:3000", undefined];
const corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true); //允許
    } else {
      // callback(new Error('not found data'))
      callback(null, false); //不允許
    }
  }
};
app.use(cors(corsOptions));


app.get("/", (req, res) => {
  res.json({ success: true });
});

app.post("/categoryBar", (req, res) => {
  const sql = "SELECT * FROM `vb_categories` WHERE 1";
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get("/bookInfo/:page?", (req, res) => {
  let page = req.params.page || 1;
  let perPage = 10;
  let output = {};
  console.log(req.params.page);
  db.queryAsync("SELECT COUNT(1) total FROM `vb_books`")
    .then(results => {
      output.total = results[0].total;
      return db.queryAsync(
        `SELECT * FROM vb_books LIMIT ${(page - 1) * perPage},${perPage}`
      );
    })
    .then(results => {
      output.rows = results;
      res.json(output);
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
});

app.get("/list/:sid?", (req, res) => {
  let sid = req.params.sid;
  console.log(sid)
  const sql = `SELECT * FROM vb_books WHERE sid=${sid}`;
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.use((req, response) => {
  response.type("text/plain");
  response.status(404);
  response.send(`404 找不到頁面喔`);
});

app.listen(5555, () => {
  console.log("4000 連結成功");
});
