const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const encoder = bodyParser.urlencoded();
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auth",
});

db.connect((error) => {
  if (error) {
    throw error;
  } else {
    console.log("Connection to databse successfull");
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/login", encoder, (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  const sql = `SELECT * from auth WHERE id = "${id}"`;
  db.query(sql, (err, data) => {
    if (data.length > 0) {
      for (let count = 0; count < data.length; count++) {
        if (data[count].password === password) {
          if (data[0].id === "admin") {
            res.redirect("/admin");
          } else {
            res.redirect("/customer");
          }
        } else {
          res.send("ERROR IMNORRECT PASWORD");
        }
      }
    } else {
      res.send("ERROR");
    }
  });
});

app.get("/admin", (req, res) => {
  const sql = `SELECT * FROM customer `;

  db.query(sql, (err, data) => {
    if (err) {
      res.send("ERROR");
    } else {
      Object.keys(data).forEach(function (key) {
        var row = data[key];
        console.log(row.quantity);

        const totalQuantity = row.quantity + row.quantity;
        const totalWeight = row.weight + row.weight;
        const boxCount = row.box_count + row.box_count;
        res.render("admin", {
          cus1quantity: row.quantity,
          cus2quantity: row.quantity,
          sumQuantity: totalQuantity,
          cus1weight: row.weight,
          cus2weight: row.weight,
          sumWeight: totalWeight,
          cus1box_count: row.box_count,
          cus2box_count: row.box_count,
          sumQuan: boxCount,
        });
      });
    }
  });
});

app.get("/customer", (req, res) => {
  res.sendFile(__dirname + "/customer.html");
});

app.post("/customers", encoder, (req, res) => {
  const sql =
    "INSERT INTO customer (`order_date`, `company`, `owner`, `item`, `quantity`, `weight`, `request_for_shipment`, `tracking_id`, `shipment_size`, `box_count`, `specification`, `checklist_quantity`) VALUES (?)";
  const data = [
    req.body.order_date,
    req.body.company,
    req.body.owner,
    req.body.item,
    req.body.quantity,
    req.body.weight,
    req.body.request_for_shipment,
    req.body.tracking_id,
    req.body.shipment_size,
    req.body.box_count,
    req.body.specification,
    req.body.checklist_quantity,
  ];

  db.query(sql, [data], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(5000, () => {
  console.log("The server is running at port 5000");
});
