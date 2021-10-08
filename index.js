const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

let message = "";

const book = [];

app.set("view engine", "ejs");

app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {});
});

app.get("/detalhes/:id", (req, res) => {
    const id = req.params.id;
    const bookDaGalera = book[id];
    res.render("detalhes", {
      bookDaGalera,
    });
});

app.get("/sobre", (req, res) => {
  res.render("sobre");
});

app.get("/membros", (req, res) => {
  setTimeout(() => {
    message = "";
  }, 1000);

  res.render("membros", {
    message,
  });
});

app.post("/new", (req, res) => {
  const pokemon = req.body;
  book.push(bookDaGalera);
  message = "Informações adiconadas";
  res.redirect("/mebros");
});


app.listen(port, () =>
console.log(`Servidor rodando em http://localhost:${port}`)
);

